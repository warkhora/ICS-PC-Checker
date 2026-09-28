# PCFORGE — Performance & Hardware Lab

A static, dependency-free suite of PC hardware tools. No build step, no framework, no
tracking — just HTML, CSS and JavaScript. Open `index.html` in a browser.

> Renamed from *ICS Regent*. Every fictional "Regent GX / SR / VX" part has been removed;
> the database now contains **real, purchasable components only**.

---

## Tools

| Page | What it does |
|---|---|
| `index.html` | **Hardware Comparison** — up to three CPUs or GPUs side by side, with a normalised performance bar |
| `fps.html` | **FPS Estimator** — frame-rate model with a real VRAM budget, ray tracing, path tracing, upscaling and frame generation |
| `optimizer.html` | **Settings Optimizer** *(new)* — finds the best-looking settings that still hit your target FPS |
| `upgrade.html` | **Upgrade Advisor** *(new)* — simulates every affordable CPU/GPU swap and ranks them by frames per dollar |
| `compatibility.html` | **Compatibility Checker** *(new)* — socket, memory type, cooler clearance, GPU length, PSU transients |
| `canyourunit.html` | **Can You Run It?** — minimum/recommended requirement check |
| `bottleneck.html` | **Bottleneck Analyzer** — CPU, GPU, VRAM, RAM and storage limits for one scenario |
| `build.html` | **Build a PC** — budget-driven system builder with real prices |
| `thermals.html` | **Thermal & Cooling** — CPU/GPU temps, throttling, memory junction, noise |
| `consumption.html` | **Power Draw** — wall draw, PSU sizing, transient peaks, running cost |
| `storage.html` | **Storage & Load Times** — load times, shader compilation, open-world streaming |
| `pclifetime.html` | **PC Lifespan** — how long the system stays playable, and which part dates first |

---

## Architecture

```
assets/
  data.js      single source of truth: 33 CPUs, 51 GPUs, 24 games, boards, coolers, cases
  engine.js    the FPS/VRAM model + shared UI runtime (nav, selectors, charts, animations)
  theme.css    design system: colour, type, cards, gauges, motion
  fonts.css    webfonts, loaded separately so the request runs in parallel
```

Every page loads `data.js` + `engine.js` and renders itself. To add a page: append one
entry to `PAGES` in `data.js` — the navigation on every other page updates automatically.
To add hardware or a game, append one object to `CPUS`, `GPUS` or `GAMES`.

---

## The FPS model

Earlier versions multiplied arbitrary "scores" together, which produced nonsense (a
GeForce RTX 5070 in Forza Horizon 6 at 1440p Ultra was reported at 13 FPS instead of ~56).
The current model is calibrated against measured hardware:

1. **GPU ceiling** — `game.base × (gpu.index / 100)^exp × resolution × preset`, where
   `gpu.index` is raster performance normalised to RTX 4070 = 100.
2. **Ray tracing** — conventional tiers Off → Low → Medium → **High**, each scaled by how
   heavy the game's RT is and how capable the GPU's RT hardware is.
3. **Path tracing** — a separate curve above High, using per-game efficiency and a
   per-architecture capability table (Blackwell 1.35×, Ada 1.00×, Ampere 0.62×, …).
   Only offered for titles that actually ship it.
4. **CPU ceiling** — `game.cpuCap × (cpu.gaming / 100)^0.9`, mostly resolution-independent.
5. **Combination** — a soft minimum of the two ceilings, so a balanced pair does not
   penalise itself the way a naive harmonic mean would.
6. **Upscaling** — DLSS 4 / DLSS 3 / FSR 4 / FSR 3 / XeSS, per GPU generation.
7. **Frame generation** — 2×, 3×, or 4× Multi Frame Generation on Blackwell only, with the
   latency cost reported alongside the frame gain.
8. **Memory** — system RAM starvation, then **VRAM overflow**.

### VRAM overflow

Textures, render targets and ray-tracing buffers are estimated per game, resolution,
preset and RT tier. When the requirement exceeds what the card holds (minus ~0.4 GB for
the desktop), the excess spills into system memory and frame rate is scaled down
proportionally to the overflow ratio, floored at 40%.

### Calibration

Verified against measured hardware (`node` harness over `assets/engine.js`):

| Scenario | Model | Measured | Error |
|---|---|---|---|
| Forza Horizon 6 · RTX 5070 · 1440p Ultra · **RT High** | **56** | ~56 | 0% |
| Forza Horizon 6 · RTX 5070 · 1440p Ultra · RT off | **99** | ~100 | −1% |
| Cyberpunk 2077 · RTX 4070 · 1440p Ultra · no RT | 80 | ~80 | 0% |
| Forza Horizon 5 · RTX 4070 · 1440p Ultra | 119 | ~120 | −1% |
| Forza Horizon 6 · RTX 5070 · 1440p Ultra · RT Medium | 80 | ~80 | 0% |
| GTA V · i5-8400 + GTX 1660S · 1080p High | 74 | ~75 | −1% |
| Elden Ring · RTX 5090 · 4K Ultra | 60 | 60 (engine cap) | 0% |
| Cyberpunk 2077 · RTX 5090 · 1440p · **Path Tracing** | 71 | ~78 | −9% |
| Cyberpunk 2077 · RTX 4090 · 1440p · **Path Tracing** | 54 | ~60 | −10% |
| Cyberpunk 2077 · RTX 4070 · 1440p · **Path Tracing** | 18 | ~24 | −25% |
| Cyberpunk 2077 · RTX 3080 · 1440p · **Path Tracing** | 7 | ~13 | −46% |

**Known bias:** path tracing on cards with less than 16 GB of VRAM is modelled
conservatively — up to ~45% pessimistic on a 10 GB card. The VRAM spill curve is fitted to
the Forza data point, where a small overflow costs a predictable fraction of frames; on a
card that is 30% over budget the real penalty is dominated by frame-time spikes that a
single average number cannot represent, so the model deliberately reports the pessimistic
end. Conventional ray tracing, raster and CPU-limited cases are accurate to within a few
percent.

---

## Notes

- Estimates only. Real results vary with drivers, game version, and in-game settings the
  model cannot see. Always confirm with an in-game benchmark.
- Prices are approximate US launch/street prices, used by the build and upgrade tools.
- `assets/fonts.css` pulls Space Grotesk, Inter and JetBrains Mono from Google Fonts.
  Offline, everything falls back to system fonts and the layout is unaffected.
