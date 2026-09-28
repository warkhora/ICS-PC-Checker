/* ============================================================================
   PCFORGE — performance engine + UI runtime
   ---------------------------------------------------------------------------
   THE FPS MODEL
   -------------
   1. GPU ceiling   game.base × (gpu.index/100)^exp × resolution × quality
   2. Ray tracing   reduces the GPU ceiling; path tracing uses its own curve
   3. CPU ceiling   game.cpuCap × (cpu.gaming/100)
   4. Combination   soft-min of the two ceilings (real engines overlap)
   5. Upscaling     DLSS / FSR / XeSS raise the GPU ceiling
   6. Frame gen     multiplies the presented frame rate, adds latency
   7. Memory        system RAM starvation, then VRAM overflow (the big one)
   ========================================================================== */

const VRAM_DESKTOP_OVERHEAD = 0.4; // GB reserved by the desktop compositor
const VRAM_PENALTY_SLOPE = 2.08;   // FPS lost per unit of overflow ratio
const VRAM_PENALTY_FLOOR = 0.40;   // never fall below 40% from spill alone
const GPU_SCALE_EXP = { "1080p": 0.92, "1440p": 0.96, "3440x1440": 0.98, "4K": 1.0, "8K": 1.0 };

/* ---------------------------------------------------------------- utilities */
function isRT(gpu) { return !gpu.noRT; }
function gameSupportsRT(game) { return (game.rtScale || 0) > 0; }
function gameSupportsPT(game) { return !!game.pt; }
function gameIsAlwaysPT(game) { return !!game.alwaysPT; }

/* Hard compatibility blocks: some titles simply will not start. */
function canRunGame(gpu, game) {
  if (game.requiresRT && !isRT(gpu))
    return { ok: false, reason: `${game.name} requires ray-tracing hardware. The ${gpu.name} has no RT cores, so it cannot run this title at all.` };
  if (game.minGen && !game.minGen.includes(gpu.gen))
    return { ok: false, reason: `${game.name} requires mesh shaders (${game.engine}). The ${gpu.name} (${gpu.arch}) predates them and cannot launch the game.` };
  if (gpu.integrated)
    return { ok: false, reason: `${gpu.name} is an integrated SoC GPU and is not covered by this desktop gaming model.` };
  return { ok: true };
}

/* ------------------------------------------------- 1. GPU-limited framerate */
function gpuCeiling(gpu, game, res, quality) {
  const exp = GPU_SCALE_EXP[res] ?? 0.96;
  return game.base
       * Math.pow(gpu.index / 100, exp)
       * (RESOLUTIONS[res]?.fps ?? 1)
       * (QUALITY[quality]?.fps ?? 1);
}

/* ------------------------------------------------- 2. Ray tracing / PT loss */
function rtMultiplier(gpu, game, rtLevel) {
  if (rtLevel === "off") return 1;
  if (!gameSupportsRT(game) || !isRT(gpu)) return 1;

  if (rtLevel === "pt" && game.pt) {
    if (game.alwaysPT) return 1;              // base FPS is already path traced
    const arch = PT_ARCH[gpu.gen] ?? 0.7;
    return clamp(game.pt.eff * arch, 0.06, 1);
  }

  const tier = RT_LEVELS[rtLevel];
  if (!tier) return 1;
  const loss = (1 - tier.base) * game.rtScale * gpu.rtFac;
  return clamp(1 - loss, 0.12, 1);
}

/* ------------------------------------------------- 3. CPU-limited framerate */
function cpuCeiling(cpu, game, res) {
  // CPU cost per frame barely changes with resolution; 4K shifts a little work
  // back onto the GPU which lets the CPU breathe.
  const relief = res === "4K" ? 1.05 : res === "8K" ? 1.08 : res === "1080p" ? 0.97 : 1;
  return game.cpuCap * Math.pow(cpu.gaming / 100, 0.9) * relief;
}

/* ------------------------------------------- 4. Combine (soft minimum) */
function combine(gpuFps, cpuFps) {
  const lo = Math.min(gpuFps, cpuFps);
  const hi = Math.max(gpuFps, cpuFps);
  if (hi <= 0) return 0;
  const ratio = lo / hi;                    // 1 = perfectly balanced
  return lo * (0.96 + 0.04 * ratio);
}

function bottleneckOf(gpuFps, cpuFps) {
  const lo = Math.min(gpuFps, cpuFps);
  const hi = Math.max(gpuFps, cpuFps);
  const ratio = lo / hi;
  if (ratio > 0.90) return { kind: "balanced", pct: Math.round((1 - ratio) * 100) };
  if (gpuFps < cpuFps) return { kind: "gpu", pct: Math.round((1 - ratio) * 100) };
  return { kind: "cpu", pct: Math.round((1 - ratio) * 100) };
}

/* ------------------------------------------------- 5. Upscaling & frame gen */
function upscalerMultiplier(gpu, mode) {
  const table = UPSCALER_PRESETS[gpu.upscaler] || UPSCALER_PRESETS.none;
  return table[mode] ?? 1;
}

function upscalerName(gpu) { return (UPSCALER_PRESETS[gpu.upscaler] || UPSCALER_PRESETS.none).name; }

function availableFgModes(gpu) {
  if (!gpu.fg) return ["off"];
  return gpu.fg >= 4 ? ["off", "x2", "x3", "x4"] : ["off", "x2"];
}

/* ------------------------------------------------- 6. VRAM model            */
function vramRequired(game, res, quality, rtLevel, upscalerMode) {
  const q = QUALITY[quality] || QUALITY.ultra;
  const base = game.vram * (RESOLUTIONS[res]?.vram ?? 1) * q.vram;

  let rt = 0;
  if (game.alwaysPT) {
    rt = game.rtVram * RT_LEVELS.high.vramScale;
  } else if (rtLevel !== "off" && gameSupportsRT(game)) {
    const tier = RT_LEVELS[rtLevel] || RT_LEVELS.off;
    rt = game.rtVram * tier.vramScale;
  }

  /* Upscaling shrinks the render target and the RT buffers, but texture
     memory — usually the bulk of the budget — stays resident at full size. */
  const up = upscalerMultiplier({ upscaler: "dlss4" }, upscalerMode || "off");
  const relief = (upscalerMode && upscalerMode !== "off")
    ? clamp(1 - (up - 1) * 0.06, 0.80, 1)
    : 1;
  const texturePart = base * 0.75;
  const transientPart = (base * 0.25 + rt) * relief;
  return texturePart + transientPart;
}

function vramReport(gpu, game, res, quality, rtLevel, upscalerMode) {
  const required = vramRequired(game, res, quality, rtLevel, upscalerMode);
  const usable = gpu.vram - VRAM_DESKTOP_OVERHEAD;
  const overflow = Math.max(0, required - usable);
  const ratio = required > 0 ? overflow / required : 0;
  const penalty = overflow > 0 ? Math.max(VRAM_PENALTY_FLOOR, 1 - VRAM_PENALTY_SLOPE * ratio) : 1;
  const fill = clamp(required / gpu.vram, 0, 2);
  let state = "ok";
  if (overflow > 0) state = "over";
  else if (fill > 0.92) state = "tight";
  return { required, usable, overflow, ratio, penalty, fill, state, total: gpu.vram };
}

/* ------------------------------------------------- 7. System RAM            */
function ramReport(ramGb, ramSpeedKey, game) {
  const speed = RAM_SPEEDS[ramSpeedKey] || RAM_SPEEDS["ddr5-6000"];
  const rec = game.recRam;
  const min = game.minRam;
  let penalty = 1, state = "ok", note = "";

  if (ramGb < min) {
    penalty = clamp(0.45 + 0.35 * (ramGb / min), 0.35, 0.85);
    state = "critical";
    note = `Below the ${min} GB minimum — the OS is paging to disk constantly.`;
  } else if (ramGb < rec) {
    penalty = clamp(0.88 + 0.12 * ((ramGb - min) / Math.max(1, rec - min)), 0.88, 1);
    state = "tight";
    note = `Meets the minimum but not the recommended ${rec} GB — expect 1% low dips.`;
  } else {
    note = `Comfortable — ${ramGb} GB leaves room for background apps.`;
  }
  return { penalty: penalty * speed.mul, speedPenalty: speed.mul, state, note, speedLabel: speed.label, type: speed.type };
}

/* ============================================================================
   MAIN ESTIMATOR
   ========================================================================== */
function estimate(cfg) {
  const cpu   = typeof cfg.cpu === "string" ? cpuById(cfg.cpu) : cfg.cpu;
  const gpu   = typeof cfg.gpu === "string" ? gpuById(cfg.gpu) : cfg.gpu;
  const game  = typeof cfg.game === "string" ? gameById(cfg.game) : cfg.game;
  const res   = cfg.resolution || "1440p";
  const quality = cfg.quality || "ultra";
  let rtLevel = cfg.rt || "off";

  // Guard: never silently report RT on a game/GPU that cannot do it.
  const rtSupported = gameSupportsRT(game) && isRT(gpu);
  const ptSupported = gameSupportsPT(game) && isRT(gpu);
  if (!rtSupported) rtLevel = "off";
  if (rtLevel === "pt" && !ptSupported) rtLevel = "high";

  const block = canRunGame(gpu, game);
  if (!block.ok) return { blocked: true, reason: block.reason, cpu, gpu, game, res, quality };

  const upMode = cfg.upscaler || "off";
  const fgMode = availableFgModes(gpu).includes(cfg.fg) ? cfg.fg : "off";

  // --- native (pre-upscale) ceilings ------------------------------------
  let gpuFps = Math.min(gpuCeiling(gpu, game, res, quality), 1500);
  const rtMul = rtMultiplier(gpu, game, rtLevel);
  gpuFps *= rtMul;

  // --- upscaling raises the GPU-side ceiling ----------------------------
  const upMul = upscalerMultiplier(gpu, upMode);
  gpuFps *= upMul;

  // --- CPU ceiling (upscaling also relieves the CPU slightly? no: same) --
  let cpuFps = cpuCeiling(cpu, game, res);

  // --- combine ----------------------------------------------------------
  let fps = combine(gpuFps, cpuFps);

  // --- frame generation --------------------------------------------------
  const fg = FG_MODES[fgMode] || FG_MODES.off;
  const preFgFps = fps;
  if (fg.mul !== 1 && preFgFps >= 20) fps *= fg.mul;

  // --- memory ------------------------------------------------------------
  const ram = ramReport(cfg.ramGb ?? 16, cfg.ramSpeed || "ddr5-6000", game);
  const vram = vramReport(gpu, game, res, quality, rtLevel, upMode);
  fps *= ram.penalty * vram.penalty;

  // --- engine cap --------------------------------------------------------
  const capped = game.cap !== null && game.cap !== undefined && fps > game.cap;
  const rawFps = fps;
  if (capped) fps = game.cap;

  fps = clamp(fps, 1, 3000);
  const rounded = Math.round(fps);

  return {
    cpu, gpu, game, res, quality, rtLevel, upMode, fgMode,
    fps: rounded,
    rawFps,
    preFgFps: Math.round(preFgFps),
    gpuFps, cpuFps,
    rtMul, upMul,
    capped, cap: game.cap,
    vram, ram,
    fg,
    latencyMs: fg.latency,
    bottleneck: bottleneckOf(gpuFps, cpuFps),
    experience: experienceLabel(rounded, game),
    verdict: verdict(rounded, game, vram, ram)
  };
}

/* --------------------------------------------------- presentation helpers */
function fpsClass(fps) {
  if (fps < 30) return { cls: "c-red", glow: "glow-red", tone: "red" };
  if (fps < 60) return { cls: "c-orange", glow: "glow-orange", tone: "orange" };
  if (fps < 120) return { cls: "c-gold", glow: "glow-gold", tone: "gold" };
  if (fps < 200) return { cls: "c-green", glow: "glow-green", tone: "green" };
  return { cls: "c-cyan", glow: "glow-cyan", tone: "cyan" };
}

function experienceLabel(fps, game) {
  if (game && game.cap && fps >= game.cap - 1) return "Engine-capped — you are at the frame-rate limit";
  if (fps < 24) return "Slideshow — not playable";
  if (fps < 40) return "Playable but stuttery";
  if (fps < 60) return "Console-like, playable";
  if (fps < 90) return "Smooth for 60 Hz displays";
  if (fps < 144) return "Fills a 120 Hz display";
  if (fps < 240) return "Fills a 144 Hz display";
  return "Esports territory";
}

function verdict(fps, game, vram, ram) {
  if (ram.state === "critical") return "Not enough system RAM to run this comfortably";
  if (fps < 30) return "Not playable at these settings";
  if (vram.state === "over") return "Playable, but VRAM is spilling into system memory";
  if (vram.state === "tight") return "Playable — VRAM is nearly saturated";
  if (fps < 60) return "Playable, not smooth";
  return "Comfortable";
}

/* ------------------------------------------------- tuning suggestions */
function buildTips(r) {
  const tips = [];
  const push = (t) => { if (!tips.includes(t)) tips.push(t); };

  if (r.fps >= 120 && r.vram.state === "ok") return tips;

  if (r.vram.state === "over") {
    push(`<b>VRAM overflow is your biggest problem.</b> ${r.gpu.name} has ${r.gpu.vram} GB but this scene wants ≈${r.vram.required.toFixed(1)} GB. Spilling into system RAM costs you ≈${Math.round((1 - r.vram.penalty) * 100)}% of your frames.`);
    if (r.res !== "1080p") push(`Drop to 1080p — memory use falls to ≈${vramRequired(r.game, "1080p", r.quality, r.rtLevel, r.upMode).toFixed(1)} GB.`);
    if (r.quality !== "medium") push(`Drop the preset to Medium — textures are the main VRAM consumer.`);
    if (r.rtLevel !== "off") push(`Turn ray tracing down or off — RT buffers alone use ≈${(r.game.rtVram * (RT_LEVELS[r.rtLevel]?.vramScale ?? 1)).toFixed(1)} GB here.`);
    push("Close browser tabs, overlays and recording software; they all sit in VRAM.");
  } else if (r.vram.state === "tight") {
    push("VRAM is above 92% — you are one texture away from stuttering. Lower texture quality one step for a safety margin.");
  }

  if (r.bottleneck.kind === "cpu" && r.bottleneck.pct > 15) {
    push(`You are <b>CPU-limited</b> (≈${r.bottleneck.pct}%). A faster GPU will not help; a stronger CPU would.`);
    if (r.res === "1080p") push("Raising the resolution moves work onto the GPU and can actually feel smoother.");
  }
  if (r.bottleneck.kind === "gpu" && r.bottleneck.pct > 25) {
    push(`You are <b>GPU-limited</b> (≈${r.bottleneck.pct}%) — this is normal and expected at ${r.res}.`);
  }

  if (r.upMode === "off" && r.gpu.upscaler !== "none") {
    push(`Enable ${upscalerName(r.gpu)} Quality — roughly +${Math.round((upscalerMultiplier(r.gpu, "quality") - 1) * 100)}% frames for a small sharpness trade.`);
  } else if (r.upMode === "quality" && r.fps < 60) {
    push(`Try ${upscalerName(r.gpu)} Balanced or Performance for a bigger uplift.`);
  }

  const fgModes = availableFgModes(r.gpu);
  if (fgModes.includes("x2") && r.fgMode === "off" && r.preFgFps >= 45 && r.fps < 120) {
    push(`Frame generation is available on this card — it multiplies the frame count, at the cost of ≈${FG_MODES.x2.latency} ms of latency.`);
  }
  if (r.fgMode !== "off" && r.preFgFps < 45) {
    push("Frame generation on a sub-45 FPS base feels laggy — raise the base frame rate first.");
  }

  if (r.rtLevel === "pt" && r.fps < 60) {
    push("Path tracing is extremely demanding. Drop to conventional RT High for most of the visual gain at a fraction of the cost.");
  } else if (r.rtLevel === "high" && r.fps < 60) {
    push("Lower ray tracing to Medium — reflections survive, the frame rate recovers.");
  }

  if (r.ram.state === "tight") push(r.ram.note);
  if (r.ram.state === "critical") push(r.ram.note);

  if (r.cap) push(`${r.game.name} is locked to ${r.cap} FPS — extra performance buys stability, not frames.`);

  return tips;
}

/* ============================================================================
   UI RUNTIME — nav, selectors, animations
   ========================================================================== */
function mountNav() {
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const main = PAGES.filter(p => p.nav);
  const more = PAGES.filter(p => !p.nav);

  const nav = document.createElement("nav");
  nav.className = "pf-nav";
  nav.innerHTML = `
    <a class="pf-brand" href="index.html" aria-label="${SITE.name} home">
      <span class="pf-brand-mark">${SITE.initials}</span>
      <span class="pf-brand-name">PC<span>FORGE</span></span>
    </a>
    <button class="pf-burger" aria-label="Toggle navigation">☰</button>
    <div class="pf-nav-links">
      ${main.map(p => `<a class="pf-nav-link${p.file === here ? " active" : ""}" href="${p.file}">${p.label}</a>`).join("")}
      <span class="pf-nav-spacer"></span>
      <div class="pf-more">
        <span class="pf-more-btn" role="button" tabindex="0">More tools ▾</span>
        <div class="pf-more-menu">
          ${more.map(p => `<a href="${p.file}">${p.label}<small>${p.desc}</small></a>`).join("")}
        </div>
      </div>
    </div>`;
  document.body.prepend(nav);

  const burger = nav.querySelector(".pf-burger");
  const links = nav.querySelector(".pf-nav-links");
  burger.addEventListener("click", () => links.classList.toggle("open"));

  const btn = nav.querySelector(".pf-more-btn");
  const menu = nav.querySelector(".pf-more-menu");
  btn.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".pf-more")) menu.classList.remove("open"); });

  const footer = document.createElement("div");
  footer.className = "pf-footer";
  footer.innerHTML = `${SITE.name} ${SITE.version} · ${SITE.tagline} · estimates only, always verify with an in-game benchmark`;
  document.body.appendChild(footer);
}

/* Fill a <select> from an array. `groups` buckets entries by a key. */
function fillSelect(sel, items, opts = {}) {
  if (!sel) return;
  sel.innerHTML = "";
  if (opts.placeholder) {
    const o = document.createElement("option");
    o.value = ""; o.textContent = opts.placeholder;
    sel.appendChild(o);
  }
  if (opts.groupKey) {
    const groups = new Map();
    items.forEach(it => {
      const g = it[opts.groupKey] || "Other";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(it);
    });
    [...groups.entries()].forEach(([label, list]) => {
      const og = document.createElement("optgroup");
      og.label = label;
      list.forEach(it => {
        const o = document.createElement("option");
        o.value = it.id;
        o.textContent = opts.labelFn ? opts.labelFn(it) : it.name;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  } else {
    items.forEach(it => {
      const o = document.createElement("option");
      o.value = it.id;
      o.textContent = opts.labelFn ? opts.labelFn(it) : it.name;
      sel.appendChild(o);
    });
  }
  if (opts.value) sel.value = opts.value;
}

function fillEnumSelect(sel, map, value) {
  if (!sel) return;
  sel.innerHTML = "";
  Object.entries(map).forEach(([k, v]) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = typeof v === "string" ? v : (v.label || v.name);
    sel.appendChild(o);
  });
  if (value) sel.value = value;
}

function val(id) { const el = document.getElementById(id); return el ? el.value : ""; }
function num(id, dflt = 0) { const v = parseFloat(val(id)); return isNaN(v) ? dflt : v; }
function on(id, ev, fn) { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); }

/* Reveal-on-scroll */
function mountReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add("in"), i * 55);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  els.forEach(e => io.observe(e));
}

/* Animated counter */
function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" &&
         window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateNumber(el, to, opts = {}) {
  if (!el) return;
  const dur = opts.duration ?? 850;
  const dec = opts.decimals ?? 0;
  const suffix = opts.suffix ?? "";
  const prefix = opts.prefix ?? "";
  const from = opts.from ?? 0;
  if (prefersReducedMotion()) {
    el.textContent = prefix + fmt(to, dec) + suffix;
    return;
  }
  const t0 = performance.now();
  const step = (t) => {
    const p = clamp((t - t0) / dur, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmt(from + (to - from) * eased, dec) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setBar(el, pct) {
  if (!el) return;
  requestAnimationFrame(() => { el.style.width = clamp(pct, 0, 100) + "%"; });
}

function toast(msg) {
  let t = document.querySelector(".pf-toast");
  if (!t) { t = document.createElement("div"); t.className = "pf-toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2600);
}

/* Render the VRAM gauge into a container */
function renderVramGauge(host, v, gpu) {
  if (!host) return;
  const pct = clamp(v.required / v.total * 100, 0, 100);
  const spillPct = v.overflow > 0 ? clamp(v.overflow / v.total * 100, 0, 100) : 0;
  const state = v.state === "over" ? "over" : v.state === "tight" ? "warn" : "";
  host.innerHTML = `
    <div class="pf-gauge ${state}">
      <i style="width:0"></i>
      <span class="spill" style="width:0"></span>
      <b>${v.required.toFixed(1)} GB used / ${v.total} GB${v.overflow > 0 ? `  ·  ${v.overflow.toFixed(1)} GB spilling` : ""}</b>
    </div>`;
  requestAnimationFrame(() => {
    host.querySelector("i").style.width = pct + "%";
    if (spillPct) host.querySelector(".spill").style.width = spillPct + "%";
  });
}

/* Small SVG sparkline for FPS-across-settings comparisons */
function sparkline(values, labels, highlightIdx = -1) {
  const max = Math.max(...values, 1);
  return `<div class="pf-chart">${values.map((v, i) => `
    <div class="col">
      <div class="bar${i === highlightIdx ? " hl" : ""}" data-h="${Math.max(3, v / max * 100)}"><b>${fmt(Math.round(v))}</b></div>
      <div class="cap">${labels[i]}</div>
    </div>`).join("")}</div>`;
}

function mountCharts(root = document) {
  root.querySelectorAll(".pf-chart .bar").forEach((bar, i) => {
    setTimeout(() => { bar.style.height = bar.dataset.h + "%"; }, 80 + i * 70);
  });
}

/* Boot */
document.addEventListener("DOMContentLoaded", () => {
  mountNav();
  mountReveal();
});
