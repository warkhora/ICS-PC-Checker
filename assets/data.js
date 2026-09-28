/* ============================================================================
   PCFORGE — shared hardware & game database
   Real components only. Single source of truth for every page.
   ---------------------------------------------------------------------------
   GPU  .index    raster performance, GeForce RTX 4070 = 100 (1440p-relative)
   GPU  .rtFac    ray-tracing loss multiplier (<1 = better RT hw)
   GPU  .vram     VRAM in GB
   CPU  .gaming   gaming throughput, Ryzen 7 9800X3D = 100
   CPU  .mt       multi-thread throughput, Ryzen 9 9950X = 100
   GAME .base     native FPS at 1440p / Ultra / no RT on an index-100 GPU
   GAME .cpuCap   FPS ceiling for an index-100 CPU (CPU-bound limit)
   GAME .vram     VRAM used at 1440p / Ultra, in GB
   GAME .rtVram   extra GB consumed at RT "High"
   GAME .load     cold boot-to-gameplay seconds on an NVMe Gen4 drive
   GAME .shader   first-run shader compilation seconds on a mid-range CPU
   ========================================================================== */

const SITE = {
  name: "PCFORGE",
  initials: "PF",
  tagline: "Performance & Hardware Lab",
  version: "v4.0"
};

const PAGES = [
  { file: "index.html",          label: "Compare",        desc: "CPU & GPU spec sheets",        nav: true },
  { file: "fps.html",            label: "FPS Estimator",  desc: "Frame rate + VRAM model",      nav: true },
  { file: "optimizer.html",      label: "Settings Optimizer", desc: "Best settings for a target FPS", nav: false },
  { file: "canyourunit.html",    label: "Can You Run It", desc: "System requirement check",     nav: true },
  { file: "bottleneck.html",     label: "Bottleneck",     desc: "Where your PC is limited",     nav: false },
  { file: "upgrade.html",        label: "Upgrade Advisor",desc: "Best upgrade for your money",  nav: false },
  { file: "compatibility.html",  label: "Compatibility",  desc: "Socket, RAM, case & PSU fit",  nav: false },
  { file: "build.html",          label: "Build a PC",     desc: "Budget-based system builder",  nav: true },
  { file: "thermals.html",       label: "Thermals",       desc: "Temps, throttling & noise",    nav: true },
  { file: "consumption.html",    label: "Power Draw",     desc: "Watts, PSU sizing & cost",     nav: true },
  { file: "storage.html",        label: "Storage",        desc: "Load times & streaming",       nav: true },
  { file: "pclifetime.html",     label: "PC Lifespan",    desc: "How long it stays relevant",   nav: true }
];

/* ============================== CPUs ===================================== */
const CPUS = [
  // --- AMD Ryzen 9000 / 7000 / 5000 ---
  { id: "9800x3d", name: "AMD Ryzen 7 9800X3D", brand: "AMD", family: "Ryzen 9000X3D", segment: "High-end gaming", cores: 8, threads: 16, base: "4.7 GHz", boost: "5.2 GHz", cache: "104 MB (96 MB 3D V-Cache)", arch: "Zen 5", socket: "AM5", tdp: 120, ppt: 162, gaming: 100, mt: 62, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 479, released: 2024 },
  { id: "9950x3d", name: "AMD Ryzen 9 9950X3D", brand: "AMD", family: "Ryzen 9000X3D", segment: "Flagship gaming + creation", cores: 16, threads: 32, base: "4.3 GHz", boost: "5.7 GHz", cache: "144 MB (128 MB 3D V-Cache)", arch: "Zen 5", socket: "AM5", tdp: 170, ppt: 230, gaming: 96, mt: 101, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 699, released: 2025 },
  { id: "9900x3d", name: "AMD Ryzen 9 9900X3D", brand: "AMD", family: "Ryzen 9000X3D", segment: "Gaming + creation", cores: 12, threads: 24, base: "4.4 GHz", boost: "5.5 GHz", cache: "140 MB (128 MB 3D V-Cache)", arch: "Zen 5", socket: "AM5", tdp: 120, ppt: 162, gaming: 94, mt: 84, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 599, released: 2025 },
  { id: "9950x",   name: "AMD Ryzen 9 9950X",   brand: "AMD", family: "Ryzen 9000", segment: "Flagship productivity", cores: 16, threads: 32, base: "4.3 GHz", boost: "5.7 GHz", cache: "80 MB", arch: "Zen 5", socket: "AM5", tdp: 170, ppt: 230, gaming: 79, mt: 100, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 599, released: 2024 },
  { id: "9900x",   name: "AMD Ryzen 9 9900X",   brand: "AMD", family: "Ryzen 9000", segment: "Enthusiast", cores: 12, threads: 24, base: "4.4 GHz", boost: "5.6 GHz", cache: "76 MB", arch: "Zen 5", socket: "AM5", tdp: 120, ppt: 162, gaming: 76, mt: 82, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 429, released: 2024 },
  { id: "9700x",   name: "AMD Ryzen 7 9700X",   brand: "AMD", family: "Ryzen 9000", segment: "Mainstream enthusiast", cores: 8, threads: 16, base: "3.8 GHz", boost: "5.5 GHz", cache: "40 MB", arch: "Zen 5", socket: "AM5", tdp: 65, ppt: 88, gaming: 73, mt: 60, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 329, released: 2024 },
  { id: "9600x",   name: "AMD Ryzen 5 9600X",   brand: "AMD", family: "Ryzen 9000", segment: "Value gaming", cores: 6, threads: 12, base: "3.9 GHz", boost: "5.4 GHz", cache: "38 MB", arch: "Zen 5", socket: "AM5", tdp: 65, ppt: 88, gaming: 71, mt: 45, npu: "—", mem: "DDR5-5600", pcie: "PCIe 5.0 ×24", price: 219, released: 2024 },
  { id: "7800x3d", name: "AMD Ryzen 7 7800X3D", brand: "AMD", family: "Ryzen 7000X3D", segment: "High-end gaming", cores: 8, threads: 16, base: "4.2 GHz", boost: "5.0 GHz", cache: "104 MB (96 MB 3D V-Cache)", arch: "Zen 4", socket: "AM5", tdp: 120, ppt: 162, gaming: 88, mt: 58, npu: "—", mem: "DDR5-5200", pcie: "PCIe 5.0 ×24", price: 349, released: 2023 },
  { id: "7700x",   name: "AMD Ryzen 7 7700X",   brand: "AMD", family: "Ryzen 7000", segment: "Mainstream", cores: 8, threads: 16, base: "4.5 GHz", boost: "5.4 GHz", cache: "40 MB", arch: "Zen 4", socket: "AM5", tdp: 105, ppt: 142, gaming: 66, mt: 55, npu: "—", mem: "DDR5-5200", pcie: "PCIe 5.0 ×24", price: 249, released: 2022 },
  { id: "7600x",   name: "AMD Ryzen 5 7600X",   brand: "AMD", family: "Ryzen 7000", segment: "Value gaming", cores: 6, threads: 12, base: "4.7 GHz", boost: "5.3 GHz", cache: "38 MB", arch: "Zen 4", socket: "AM5", tdp: 105, ppt: 142, gaming: 65, mt: 43, npu: "—", mem: "DDR5-5200", pcie: "PCIe 5.0 ×24", price: 199, released: 2022 },
  { id: "7500f",   name: "AMD Ryzen 5 7500F",   brand: "AMD", family: "Ryzen 7000", segment: "Budget gaming", cores: 6, threads: 12, base: "3.7 GHz", boost: "5.0 GHz", cache: "38 MB", arch: "Zen 4", socket: "AM5", tdp: 65, ppt: 88, gaming: 63, mt: 41, npu: "—", mem: "DDR5-5200", pcie: "PCIe 5.0 ×24", price: 159, released: 2023 },
  { id: "5800x3d", name: "AMD Ryzen 7 5800X3D", brand: "AMD", family: "Ryzen 5000X3D", segment: "AM4 gaming legend", cores: 8, threads: 16, base: "3.4 GHz", boost: "4.5 GHz", cache: "100 MB (96 MB 3D V-Cache)", arch: "Zen 3", socket: "AM4", tdp: 105, ppt: 142, gaming: 64, mt: 42, npu: "—", mem: "DDR4-3200", pcie: "PCIe 4.0 ×24", price: 279, released: 2022 },
  { id: "5700x3d", name: "AMD Ryzen 7 5700X3D", brand: "AMD", family: "Ryzen 5000X3D", segment: "AM4 value gaming", cores: 8, threads: 16, base: "3.0 GHz", boost: "4.1 GHz", cache: "100 MB (96 MB 3D V-Cache)", arch: "Zen 3", socket: "AM4", tdp: 105, ppt: 142, gaming: 60, mt: 40, npu: "—", mem: "DDR4-3200", pcie: "PCIe 4.0 ×24", price: 199, released: 2024 },
  { id: "5600x",   name: "AMD Ryzen 5 5600X",   brand: "AMD", family: "Ryzen 5000", segment: "Budget", cores: 6, threads: 12, base: "3.7 GHz", boost: "4.6 GHz", cache: "35 MB", arch: "Zen 3", socket: "AM4", tdp: 65, ppt: 88, gaming: 47, mt: 33, npu: "—", mem: "DDR4-3200", pcie: "PCIe 4.0 ×24", price: 129, released: 2020 },
  { id: "r5-3600", name: "AMD Ryzen 5 3600",    brand: "AMD", family: "Ryzen 3000", segment: "Legacy budget", cores: 6, threads: 12, base: "3.6 GHz", boost: "4.2 GHz", cache: "35 MB", arch: "Zen 2", socket: "AM4", tdp: 65, ppt: 88, gaming: 40, mt: 28, npu: "—", mem: "DDR4-3200", pcie: "PCIe 4.0 ×24", price: 99, released: 2019 },
  { id: "9995wx",  name: "AMD Threadripper PRO 9995WX", brand: "AMD", family: "Threadripper PRO 9000", segment: "Workstation flagship", cores: 96, threads: 192, base: "2.5 GHz", boost: "5.3 GHz", cache: "480 MB", arch: "Zen 5", socket: "sTR5", tdp: 350, ppt: 400, gaming: 68, mt: 175, npu: "—", mem: "DDR5-6400 RDIMM (8-ch)", pcie: "PCIe 5.0 ×128", price: 8999, released: 2025 },
  { id: "9955wx",  name: "AMD Threadripper PRO 9955WX", brand: "AMD", family: "Threadripper PRO 9000", segment: "Workstation", cores: 16, threads: 32, base: "4.0 GHz", boost: "5.4 GHz", cache: "192 MB", arch: "Zen 5", socket: "sTR5", tdp: 350, ppt: 400, gaming: 66, mt: 150, npu: "—", mem: "DDR5-6400 RDIMM (8-ch)", pcie: "PCIe 5.0 ×128", price: 1649, released: 2025 },

  // --- Intel Arrow Lake / Raptor Lake / older ---
  { id: "285k",   name: "Intel Core Ultra 9 285K", brand: "Intel", family: "Core Ultra 200S", segment: "Flagship", cores: 24, threads: 24, base: "3.7 GHz P / 3.2 GHz E", boost: "5.7 GHz", cache: "76 MB", arch: "Arrow Lake-S", socket: "LGA 1851", tdp: 125, ppt: 250, gaming: 86, mt: 105, npu: "13 TOPS", mem: "DDR5-6400", pcie: "PCIe 5.0 ×20", price: 589, released: 2024, coolerNeeded: true },
  { id: "265k",   name: "Intel Core Ultra 7 265K", brand: "Intel", family: "Core Ultra 200S", segment: "High-end", cores: 20, threads: 20, base: "3.9 GHz P / 3.3 GHz E", boost: "5.5 GHz", cache: "66 MB", arch: "Arrow Lake-S", socket: "LGA 1851", tdp: 125, ppt: 250, gaming: 80, mt: 88, npu: "13 TOPS", mem: "DDR5-6400", pcie: "PCIe 5.0 ×20", price: 399, released: 2024, coolerNeeded: true },
  { id: "245k",   name: "Intel Core Ultra 5 245K", brand: "Intel", family: "Core Ultra 200S", segment: "Mainstream", cores: 14, threads: 14, base: "4.2 GHz P / 3.6 GHz E", boost: "5.2 GHz", cache: "50 MB", arch: "Arrow Lake-S", socket: "LGA 1851", tdp: 125, ppt: 159, gaming: 74, mt: 68, npu: "13 TOPS", mem: "DDR5-6400", pcie: "PCIe 5.0 ×20", price: 309, released: 2024, coolerNeeded: true },
  { id: "14900k", name: "Intel Core i9-14900K", brand: "Intel", family: "Core 14th Gen", segment: "Flagship", cores: 24, threads: 32, base: "3.2 GHz P / 2.4 GHz E", boost: "6.0 GHz", cache: "68 MB", arch: "Raptor Lake Refresh", socket: "LGA 1700", tdp: 125, ppt: 253, gaming: 90, mt: 102, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 499, released: 2023, coolerNeeded: true },
  { id: "14700k", name: "Intel Core i7-14700K", brand: "Intel", family: "Core 14th Gen", segment: "High-end", cores: 20, threads: 28, base: "3.4 GHz P / 2.5 GHz E", boost: "5.6 GHz", cache: "61 MB", arch: "Raptor Lake Refresh", socket: "LGA 1700", tdp: 125, ppt: 253, gaming: 85, mt: 85, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 384, released: 2023, coolerNeeded: true },
  { id: "14600k", name: "Intel Core i5-14600K", brand: "Intel", family: "Core 14th Gen", segment: "Mainstream", cores: 14, threads: 20, base: "3.5 GHz P / 2.6 GHz E", boost: "5.3 GHz", cache: "44 MB", arch: "Raptor Lake Refresh", socket: "LGA 1700", tdp: 125, ppt: 181, gaming: 80, mt: 66, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 294, released: 2023, coolerNeeded: true },
  { id: "14400f", name: "Intel Core i5-14400F", brand: "Intel", family: "Core 14th Gen", segment: "Budget gaming", cores: 10, threads: 16, base: "2.5 GHz P / 1.8 GHz E", boost: "4.7 GHz", cache: "29.5 MB", arch: "Raptor Lake Refresh", socket: "LGA 1700", tdp: 65, ppt: 148, gaming: 70, mt: 52, npu: "—", mem: "DDR5-4800 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 199, released: 2024 },
  { id: "13900k", name: "Intel Core i9-13900K", brand: "Intel", family: "Core 13th Gen", segment: "Flagship", cores: 24, threads: 32, base: "3.0 GHz P / 2.2 GHz E", boost: "5.8 GHz", cache: "68 MB", arch: "Raptor Lake", socket: "LGA 1700", tdp: 125, ppt: 253, gaming: 87, mt: 96, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 449, released: 2022, coolerNeeded: true },
  { id: "13700k", name: "Intel Core i7-13700K", brand: "Intel", family: "Core 13th Gen", segment: "High-end", cores: 16, threads: 24, base: "3.4 GHz P / 2.5 GHz E", boost: "5.4 GHz", cache: "54 MB", arch: "Raptor Lake", socket: "LGA 1700", tdp: 125, ppt: 253, gaming: 82, mt: 80, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 349, released: 2022, coolerNeeded: true },
  { id: "13600k", name: "Intel Core i5-13600K", brand: "Intel", family: "Core 13th Gen", segment: "Mainstream", cores: 14, threads: 20, base: "3.5 GHz P / 2.6 GHz E", boost: "5.1 GHz", cache: "44 MB", arch: "Raptor Lake", socket: "LGA 1700", tdp: 125, ppt: 181, gaming: 77, mt: 62, npu: "—", mem: "DDR5-5600 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 259, released: 2022, coolerNeeded: true },
  { id: "12400f", name: "Intel Core i5-12400F", brand: "Intel", family: "Core 12th Gen", segment: "Budget gaming", cores: 6, threads: 12, base: "2.5 GHz", boost: "4.4 GHz", cache: "25.5 MB", arch: "Alder Lake", socket: "LGA 1700", tdp: 65, ppt: 117, gaming: 58, mt: 40, npu: "—", mem: "DDR5-4800 / DDR4-3200", pcie: "PCIe 5.0 ×20", price: 129, released: 2022 },
  { id: "9900k",  name: "Intel Core i9-9900K",  brand: "Intel", family: "Core 9th Gen", segment: "Legacy flagship", cores: 8, threads: 16, base: "3.6 GHz", boost: "5.0 GHz", cache: "18 MB", arch: "Coffee Lake Refresh", socket: "LGA 1151", tdp: 95, ppt: 210, gaming: 44, mt: 45, npu: "—", mem: "DDR4-2666", pcie: "PCIe 3.0 ×16", price: 199, released: 2018, coolerNeeded: true },
  { id: "i5-8400",name: "Intel Core i5-8400",   brand: "Intel", family: "Core 8th Gen", segment: "Legacy mainstream", cores: 6, threads: 6, base: "2.8 GHz", boost: "4.0 GHz", cache: "9 MB", arch: "Coffee Lake", socket: "LGA 1151", tdp: 65, ppt: 90, gaming: 33, mt: 28, npu: "—", mem: "DDR4-2666", pcie: "PCIe 3.0 ×16", price: 99, released: 2017 },

  // --- Apple (comparison only) ---
  { id: "m5",     name: "Apple M5",     brand: "Apple", family: "Apple M Series", segment: "Notebook SoC", cores: 10, threads: 10, base: "—", boost: "4.61 GHz", cache: "28 MB", arch: "Apple M5 (3 nm)", socket: "SoC (soldered)", tdp: 30, ppt: 35, gaming: 52, mt: 42, npu: "16-core Neural Engine (~38 TOPS)", mem: "Unified LPDDR5X", pcie: "Integrated / Thunderbolt 4", price: 0, released: 2025, integrated: true },
  { id: "m5pro",  name: "Apple M5 Pro", brand: "Apple", family: "Apple M Series", segment: "Pro notebook SoC", cores: 15, threads: 15, base: "—", boost: "4.5 GHz", cache: "Unified", arch: "Apple M5 Pro", socket: "SoC (soldered)", tdp: 50, ppt: 60, gaming: 60, mt: 78, npu: "16-core Neural Engine", mem: "Unified LPDDR5X", pcie: "Thunderbolt 5", price: 0, released: 2025, integrated: true },
  { id: "m5max",  name: "Apple M5 Max", brand: "Apple", family: "Apple M Series", segment: "Max notebook SoC", cores: 16, threads: 16, base: "—", boost: "4.6 GHz", cache: "Unified", arch: "Apple M5 Max", socket: "SoC (soldered)", tdp: 80, ppt: 95, gaming: 66, mt: 96, npu: "16-core Neural Engine", mem: "Unified LPDDR5X", pcie: "Thunderbolt 5", price: 0, released: 2025, integrated: true }
];

/* ============================== GPUs ===================================== */
/* upscaler: dlss4 | dlss3 | fsr4 | fsr3 | xess2 | xess1 | none
   fg: 0 = none, 2 = 2× frame generation, 4 = up to 4× multi frame generation */
const GPUS = [
  // ---- NVIDIA RTX 50 (Blackwell) ----
  { id: "rtx5090", name: "NVIDIA GeForce RTX 5090", brand: "NVIDIA", family: "RTX 50 Series", segment: "Ultra enthusiast", index: 235, vram: 32, vramType: "GDDR7", bus: "512-bit", bw: 1792, tdp: 575, cores: "21760 CUDA", boost: "2.41 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×16", upscaler: "dlss4", fg: 4, length: 304, price: 1999, released: 2025, perf: "Fastest gaming GPU ever made" },
  { id: "rtx5080", name: "NVIDIA GeForce RTX 5080", brand: "NVIDIA", family: "RTX 50 Series", segment: "High-end", index: 165, vram: 16, vramType: "GDDR7", bus: "256-bit", bw: 960, tdp: 360, cores: "10752 CUDA", boost: "2.62 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×16", upscaler: "dlss4", fg: 4, length: 304, price: 999, released: 2025, perf: "Excellent 4K card with huge RT uplift" },
  { id: "rtx5070ti", name: "NVIDIA GeForce RTX 5070 Ti", brand: "NVIDIA", family: "RTX 50 Series", segment: "Upper midrange", index: 145, vram: 16, vramType: "GDDR7", bus: "256-bit", bw: 896, tdp: 300, cores: "8960 CUDA", boost: "2.45 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×16", upscaler: "dlss4", fg: 4, length: 300, price: 749, released: 2025, perf: "The sensible 1440p/4K Blackwell card" },
  { id: "rtx5070", name: "NVIDIA GeForce RTX 5070", brand: "NVIDIA", family: "RTX 50 Series", segment: "1440p high-end", index: 118, vram: 12, vramType: "GDDR7", bus: "192-bit", bw: 672, tdp: 250, cores: "6144 CUDA", boost: "2.51 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×16", upscaler: "dlss4", fg: 4, length: 242, price: 549, released: 2025, perf: "Great 1440p card — 12 GB is its only limit" },
  { id: "rtx5060ti16", name: "NVIDIA GeForce RTX 5060 Ti 16GB", brand: "NVIDIA", family: "RTX 50 Series", segment: "Midrange", index: 102, vram: 16, vramType: "GDDR7", bus: "128-bit", bw: 448, tdp: 180, cores: "4608 CUDA", boost: "2.57 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×8", upscaler: "dlss4", fg: 4, length: 241, price: 429, released: 2025, perf: "16 GB makes it far more future-proof than the 8 GB twin" },
  { id: "rtx5060ti8", name: "NVIDIA GeForce RTX 5060 Ti 8GB", brand: "NVIDIA", family: "RTX 50 Series", segment: "Midrange", index: 98, vram: 8, vramType: "GDDR7", bus: "128-bit", bw: 448, tdp: 180, cores: "4608 CUDA", boost: "2.57 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×8", upscaler: "dlss4", fg: 4, length: 241, price: 379, released: 2025, perf: "Same silicon, half the VRAM — overflows in 2025 titles" },
  { id: "rtx5060", name: "NVIDIA GeForce RTX 5060", brand: "NVIDIA", family: "RTX 50 Series", segment: "Midrange", index: 82, vram: 8, vramType: "GDDR7", bus: "128-bit", bw: 320, tdp: 145, cores: "3840 CUDA", boost: "2.50 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×8", upscaler: "dlss4", fg: 4, length: 241, price: 299, released: 2025, perf: "Efficient 1080p card" },
  { id: "rtx5050", name: "NVIDIA GeForce RTX 5050", brand: "NVIDIA", family: "RTX 50 Series", segment: "Entry level", index: 68, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 320, tdp: 130, cores: "2560 CUDA", boost: "2.57 GHz", arch: "Blackwell", gen: "rtx50", rtFac: 0.72, pcie: "PCIe 5.0 ×8", upscaler: "dlss4", fg: 4, length: 211, price: 249, released: 2025, perf: "Solid 1080p entry card" },

  // ---- NVIDIA RTX 40 (Ada) ----
  { id: "rtx4090", name: "NVIDIA GeForce RTX 4090", brand: "NVIDIA", family: "RTX 40 Series", segment: "Ultra enthusiast", index: 205, vram: 24, vramType: "GDDR6X", bus: "384-bit", bw: 1008, tdp: 450, cores: "16384 CUDA", boost: "2.52 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 304, price: 1599, released: 2022, perf: "Last-gen halo card, still a monster" },
  { id: "rtx4080s", name: "NVIDIA GeForce RTX 4080 SUPER", brand: "NVIDIA", family: "RTX 40 Series", segment: "High-end", index: 152, vram: 16, vramType: "GDDR6X", bus: "256-bit", bw: 736, tdp: 320, cores: "10240 CUDA", boost: "2.55 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 304, price: 999, released: 2024, perf: "Strong 4K performer" },
  { id: "rtx4080", name: "NVIDIA GeForce RTX 4080", brand: "NVIDIA", family: "RTX 40 Series", segment: "High-end", index: 147, vram: 16, vramType: "GDDR6X", bus: "256-bit", bw: 717, tdp: 320, cores: "9728 CUDA", boost: "2.51 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 304, price: 1199, released: 2022, perf: "Excellent 4K card" },
  { id: "rtx4070tis", name: "NVIDIA GeForce RTX 4070 Ti SUPER", brand: "NVIDIA", family: "RTX 40 Series", segment: "Upper midrange", index: 138, vram: 16, vramType: "GDDR6X", bus: "256-bit", bw: 672, tdp: 285, cores: "8448 CUDA", boost: "2.61 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 285, price: 799, released: 2024, perf: "16 GB and near-4080 raster" },
  { id: "rtx4070ti", name: "NVIDIA GeForce RTX 4070 Ti", brand: "NVIDIA", family: "RTX 40 Series", segment: "Upper midrange", index: 132, vram: 12, vramType: "GDDR6X", bus: "192-bit", bw: 504, tdp: 285, cores: "7680 CUDA", boost: "2.61 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 285, price: 799, released: 2023, perf: "Fast, but the 12 GB / 192-bit combo ages badly" },
  { id: "rtx4070s", name: "NVIDIA GeForce RTX 4070 SUPER", brand: "NVIDIA", family: "RTX 40 Series", segment: "Midrange", index: 120, vram: 12, vramType: "GDDR6X", bus: "192-bit", bw: 504, tdp: 220, cores: "7168 CUDA", boost: "2.48 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 267, price: 599, released: 2024, perf: "Best-value Ada card" },
  { id: "rtx4070", name: "NVIDIA GeForce RTX 4070", brand: "NVIDIA", family: "RTX 40 Series", segment: "Midrange", index: 100, vram: 12, vramType: "GDDR6X", bus: "192-bit", bw: 504, tdp: 200, cores: "5888 CUDA", boost: "2.48 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 2, length: 244, price: 549, released: 2023, perf: "The reference point for this database (index 100)" },
  { id: "rtx4060ti16", name: "NVIDIA GeForce RTX 4060 Ti 16GB", brand: "NVIDIA", family: "RTX 40 Series", segment: "Midrange", index: 86, vram: 16, vramType: "GDDR6", bus: "128-bit", bw: 288, tdp: 165, cores: "4352 CUDA", boost: "2.54 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×8", upscaler: "dlss3", fg: 2, length: 240, price: 499, released: 2023, perf: "More VRAM, same narrow bus" },
  { id: "rtx4060ti8", name: "NVIDIA GeForce RTX 4060 Ti 8GB", brand: "NVIDIA", family: "RTX 40 Series", segment: "Midrange", index: 84, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 288, tdp: 160, cores: "4352 CUDA", boost: "2.54 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×8", upscaler: "dlss3", fg: 2, length: 240, price: 399, released: 2023, perf: "Great efficiency, tight on memory" },
  { id: "rtx4060", name: "NVIDIA GeForce RTX 4060", brand: "NVIDIA", family: "RTX 40 Series", segment: "Mainstream", index: 74, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 272, tdp: 115, cores: "3072 CUDA", boost: "2.46 GHz", arch: "Ada Lovelace", gen: "rtx40", rtFac: 0.85, pcie: "PCIe 4.0 ×8", upscaler: "dlss3", fg: 2, length: 240, price: 299, released: 2023, perf: "The default 1080p recommendation" },

  // ---- NVIDIA RTX 30 (Ampere) ----
  { id: "rtx3090ti", name: "NVIDIA GeForce RTX 3090 Ti", brand: "NVIDIA", family: "RTX 30 Series", segment: "Ultra enthusiast", index: 118, vram: 24, vramType: "GDDR6X", bus: "384-bit", bw: 1008, tdp: 450, cores: "10752 CUDA", boost: "1.86 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 336, price: 1999, released: 2022, perf: "24 GB monster that drinks power" },
  { id: "rtx3090", name: "NVIDIA GeForce RTX 3090", brand: "NVIDIA", family: "RTX 30 Series", segment: "Enthusiast", index: 112, vram: 24, vramType: "GDDR6X", bus: "384-bit", bw: 936, tdp: 350, cores: "10496 CUDA", boost: "1.70 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 313, price: 1499, released: 2020, perf: "Still loved for 24 GB of VRAM" },
  { id: "rtx3080ti", name: "NVIDIA GeForce RTX 3080 Ti", brand: "NVIDIA", family: "RTX 30 Series", segment: "High-end", index: 108, vram: 12, vramType: "GDDR6X", bus: "384-bit", bw: 912, tdp: 350, cores: "10240 CUDA", boost: "1.67 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 285, price: 1199, released: 2021, perf: "Near-3090 raster at lower cost" },
  { id: "rtx3080_12", name: "NVIDIA GeForce RTX 3080 12GB", brand: "NVIDIA", family: "RTX 30 Series", segment: "High-end", index: 104, vram: 12, vramType: "GDDR6X", bus: "384-bit", bw: 912, tdp: 350, cores: "8960 CUDA", boost: "1.71 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 285, price: 699, released: 2022, perf: "The quiet refresh nobody could buy" },
  { id: "rtx3080", name: "NVIDIA GeForce RTX 3080 10GB", brand: "NVIDIA", family: "RTX 30 Series", segment: "High-end", index: 100, vram: 10, vramType: "GDDR6X", bus: "320-bit", bw: 760, tdp: 320, cores: "8704 CUDA", boost: "1.71 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 285, price: 699, released: 2020, perf: "Legendary value — VRAM is now the wall" },
  { id: "rtx3070ti", name: "NVIDIA GeForce RTX 3070 Ti", brand: "NVIDIA", family: "RTX 30 Series", segment: "Upper midrange", index: 84, vram: 8, vramType: "GDDR6X", bus: "256-bit", bw: 608, tdp: 290, cores: "6144 CUDA", boost: "1.77 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 267, price: 599, released: 2021, perf: "8 GB hurts in modern titles" },
  { id: "rtx3070", name: "NVIDIA GeForce RTX 3070", brand: "NVIDIA", family: "RTX 30 Series", segment: "Upper midrange", index: 82, vram: 8, vramType: "GDDR6", bus: "256-bit", bw: 448, tdp: 220, cores: "5888 CUDA", boost: "1.73 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 242, price: 499, released: 2020, perf: "Great 1440p card in 2021, tight in 2025" },
  { id: "rtx3060ti", name: "NVIDIA GeForce RTX 3060 Ti", brand: "NVIDIA", family: "RTX 30 Series", segment: "Midrange", index: 76, vram: 8, vramType: "GDDR6", bus: "256-bit", bw: 448, tdp: 200, cores: "4864 CUDA", boost: "1.67 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 242, price: 399, released: 2020, perf: "The people's 1440p card" },
  { id: "rtx3060_12", name: "NVIDIA GeForce RTX 3060 12GB", brand: "NVIDIA", family: "RTX 30 Series", segment: "Midrange", index: 58, vram: 12, vramType: "GDDR6", bus: "192-bit", bw: 360, tdp: 170, cores: "3584 CUDA", boost: "1.78 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×16", upscaler: "dlss3", fg: 0, length: 242, price: 329, released: 2021, perf: "Slow, but 12 GB keeps it alive" },
  { id: "rtx3050", name: "NVIDIA GeForce RTX 3050 8GB", brand: "NVIDIA", family: "RTX 30 Series", segment: "Entry level", index: 40, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 224, tdp: 130, cores: "2560 CUDA", boost: "1.78 GHz", arch: "Ampere", gen: "rtx30", rtFac: 1.10, pcie: "PCIe 4.0 ×8", upscaler: "dlss3", fg: 0, length: 242, price: 249, released: 2022, perf: "Entry 1080p" },

  // ---- NVIDIA RTX 20 / GTX 16 ----
  { id: "rtx2080ti", name: "NVIDIA GeForce RTX 2080 Ti", brand: "NVIDIA", family: "RTX 20 Series", segment: "Legacy flagship", index: 78, vram: 11, vramType: "GDDR6", bus: "352-bit", bw: 616, tdp: 250, cores: "4352 CUDA", boost: "1.63 GHz", arch: "Turing", gen: "rtx20", rtFac: 1.40, pcie: "PCIe 3.0 ×16", upscaler: "dlss3", fg: 0, length: 267, price: 1199, released: 2018, perf: "Turing still punches above its weight" },
  { id: "rtx2060", name: "NVIDIA GeForce RTX 2060 6GB", brand: "NVIDIA", family: "RTX 20 Series", segment: "Legacy midrange", index: 45, vram: 6, vramType: "GDDR6", bus: "192-bit", bw: 336, tdp: 160, cores: "1920 CUDA", boost: "1.68 GHz", arch: "Turing", gen: "rtx20", rtFac: 1.40, pcie: "PCIe 3.0 ×16", upscaler: "dlss3", fg: 0, length: 229, price: 349, released: 2019, perf: "6 GB is a hard ceiling today" },
  { id: "gtx1660s", name: "NVIDIA GeForce GTX 1660 SUPER", brand: "NVIDIA", family: "GTX 16 Series", segment: "Legacy budget", index: 40, vram: 6, vramType: "GDDR6", bus: "192-bit", bw: 336, tdp: 125, cores: "1408 CUDA", boost: "1.79 GHz", arch: "Turing (no RT)", gen: "gtx", rtFac: 3.0, pcie: "PCIe 3.0 ×16", upscaler: "fsr3", fg: 0, length: 229, price: 229, released: 2019, perf: "No RT cores — raster only", noRT: true },

  // ---- AMD RX 9000 (RDNA 4) ----
  { id: "rx9070xt", name: "AMD Radeon RX 9070 XT", brand: "AMD", family: "RX 9000 Series", segment: "Enthusiast", index: 140, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 640, tdp: 304, cores: "64 CU", boost: "2.97 GHz", arch: "RDNA 4", gen: "rdna4", rtFac: 0.95, pcie: "PCIe 5.0 ×16", upscaler: "fsr4", fg: 2, length: 267, price: 599, released: 2025, perf: "Massive RT uplift over RDNA 3" },
  { id: "rx9070", name: "AMD Radeon RX 9070", brand: "AMD", family: "RX 9000 Series", segment: "High-end", index: 125, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 640, tdp: 220, cores: "56 CU", boost: "2.52 GHz", arch: "RDNA 4", gen: "rdna4", rtFac: 0.95, pcie: "PCIe 5.0 ×16", upscaler: "fsr4", fg: 2, length: 267, price: 549, released: 2025, perf: "Excellent 1440p value with 16 GB" },
  { id: "rx9060xt16", name: "AMD Radeon RX 9060 XT 16GB", brand: "AMD", family: "RX 9000 Series", segment: "Upper midrange", index: 97, vram: 16, vramType: "GDDR6", bus: "128-bit", bw: 320, tdp: 182, cores: "32 CU", boost: "3.13 GHz", arch: "RDNA 4", gen: "rdna4", rtFac: 0.95, pcie: "PCIe 5.0 ×16", upscaler: "fsr4", fg: 2, length: 267, price: 349, released: 2025, perf: "The VRAM-per-dollar champion" },
  { id: "rx9060xt8", name: "AMD Radeon RX 9060 XT 8GB", brand: "AMD", family: "RX 9000 Series", segment: "Upper midrange", index: 92, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 320, tdp: 150, cores: "32 CU", boost: "3.13 GHz", arch: "RDNA 4", gen: "rdna4", rtFac: 0.95, pcie: "PCIe 5.0 ×16", upscaler: "fsr4", fg: 2, length: 267, price: 299, released: 2025, perf: "Same chip, half the memory" },

  // ---- AMD RX 7000 (RDNA 3) ----
  { id: "rx7900xtx", name: "AMD Radeon RX 7900 XTX", brand: "AMD", family: "RX 7000 Series", segment: "Ultra enthusiast", index: 158, vram: 24, vramType: "GDDR6", bus: "384-bit", bw: 960, tdp: 355, cores: "96 CU", boost: "2.5 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 287, price: 949, released: 2022, perf: "Top-tier raster, weaker RT" },
  { id: "rx7900xt", name: "AMD Radeon RX 7900 XT", brand: "AMD", family: "RX 7000 Series", segment: "Enthusiast", index: 143, vram: 20, vramType: "GDDR6", bus: "320-bit", bw: 800, tdp: 315, cores: "84 CU", boost: "2.4 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 276, price: 799, released: 2022, perf: "20 GB of raster brute force" },
  { id: "rx7900gre", name: "AMD Radeon RX 7900 GRE", brand: "AMD", family: "RX 7000 Series", segment: "High-end", index: 126, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 576, tdp: 260, cores: "80 CU", boost: "2.24 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 276, price: 549, released: 2024, perf: "Underrated 1440p/4K option" },
  { id: "rx7800xt", name: "AMD Radeon RX 7800 XT", brand: "AMD", family: "RX 7000 Series", segment: "High-end", index: 118, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 624, tdp: 263, cores: "60 CU", boost: "2.43 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 499, released: 2023, perf: "The 1440p sweet spot" },
  { id: "rx7700xt", name: "AMD Radeon RX 7700 XT", brand: "AMD", family: "RX 7000 Series", segment: "Upper midrange", index: 100, vram: 12, vramType: "GDDR6", bus: "192-bit", bw: 432, tdp: 245, cores: "54 CU", boost: "2.54 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 419, released: 2023, perf: "Strong 1440p raster" },
  { id: "rx7600", name: "AMD Radeon RX 7600", brand: "AMD", family: "RX 7000 Series", segment: "Mainstream", index: 78, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 288, tdp: 165, cores: "32 CU", boost: "2.66 GHz", arch: "RDNA 3", gen: "rdna3", rtFac: 1.20, pcie: "PCIe 4.0 ×8", upscaler: "fsr3", fg: 2, length: 204, price: 269, released: 2023, perf: "1080p value pick" },

  // ---- AMD RX 6000 (RDNA 2) ----
  { id: "rx6950xt", name: "AMD Radeon RX 6950 XT", brand: "AMD", family: "RX 6000 Series", segment: "High-end", index: 118, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 576, tdp: 335, cores: "80 CU", boost: "2.31 GHz", arch: "RDNA 2", gen: "rdna2", rtFac: 1.55, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 1099, released: 2022, perf: "Raster beast, RT afterthought" },
  { id: "rx6800xt", name: "AMD Radeon RX 6800 XT", brand: "AMD", family: "RX 6000 Series", segment: "High-end", index: 106, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 512, tdp: 300, cores: "72 CU", boost: "2.25 GHz", arch: "RDNA 2", gen: "rdna2", rtFac: 1.55, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 649, released: 2020, perf: "Still a great 1440p raster card" },
  { id: "rx6750xt", name: "AMD Radeon RX 6750 XT", brand: "AMD", family: "RX 6000 Series", segment: "Midrange", index: 80, vram: 12, vramType: "GDDR6", bus: "192-bit", bw: 432, tdp: 250, cores: "40 CU", boost: "2.6 GHz", arch: "RDNA 2", gen: "rdna2", rtFac: 1.55, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 419, released: 2022, perf: "12 GB for cheap" },
  { id: "rx6700xt", name: "AMD Radeon RX 6700 XT", brand: "AMD", family: "RX 6000 Series", segment: "Midrange", index: 76, vram: 12, vramType: "GDDR6", bus: "192-bit", bw: 384, tdp: 230, cores: "40 CU", boost: "2.58 GHz", arch: "RDNA 2", gen: "rdna2", rtFac: 1.55, pcie: "PCIe 4.0 ×16", upscaler: "fsr3", fg: 2, length: 267, price: 479, released: 2021, perf: "The 1440p value classic" },
  { id: "rx6600", name: "AMD Radeon RX 6600", brand: "AMD", family: "RX 6000 Series", segment: "Mainstream", index: 52, vram: 8, vramType: "GDDR6", bus: "128-bit", bw: 224, tdp: 132, cores: "28 CU", boost: "2.49 GHz", arch: "RDNA 2", gen: "rdna2", rtFac: 1.55, pcie: "PCIe 4.0 ×8", upscaler: "fsr3", fg: 2, length: 190, price: 329, released: 2021, perf: "Cheap and very efficient 1080p" },

  // ---- Intel Arc ----
  { id: "b580", name: "Intel Arc B580", brand: "Intel", family: "Arc B-Series", segment: "Mainstream", index: 88, vram: 12, vramType: "GDDR6", bus: "192-bit", bw: 456, tdp: 190, cores: "20 Xe cores", boost: "2.67 GHz", arch: "Battlemage", gen: "arcB", rtFac: 1.05, pcie: "PCIe 4.0 ×8", upscaler: "xess2", fg: 2, length: 272, price: 249, released: 2024, perf: "Best price-to-VRAM card on the market" },
  { id: "b570", name: "Intel Arc B570", brand: "Intel", family: "Arc B-Series", segment: "Mainstream", index: 78, vram: 10, vramType: "GDDR6", bus: "160-bit", bw: 380, tdp: 150, cores: "18 Xe cores", boost: "2.5 GHz", arch: "Battlemage", gen: "arcB", rtFac: 1.05, pcie: "PCIe 4.0 ×8", upscaler: "xess2", fg: 2, length: 272, price: 219, released: 2025, perf: "10 GB at a budget price" },
  { id: "a770", name: "Intel Arc A770 16GB", brand: "Intel", family: "Arc A-Series", segment: "Upper midrange", index: 82, vram: 16, vramType: "GDDR6", bus: "256-bit", bw: 560, tdp: 225, cores: "32 Xe cores", boost: "2.4 GHz", arch: "Alchemist", gen: "arcA", rtFac: 1.25, pcie: "PCIe 4.0 ×16", upscaler: "xess1", fg: 2, length: 279, price: 349, released: 2022, perf: "Big VRAM, driver-dependent" },
  { id: "a750", name: "Intel Arc A750", brand: "Intel", family: "Arc A-Series", segment: "Midrange", index: 74, vram: 8, vramType: "GDDR6", bus: "256-bit", bw: 512, tdp: 225, cores: "28 Xe cores", boost: "2.4 GHz", arch: "Alchemist", gen: "arcA", rtFac: 1.25, pcie: "PCIe 4.0 ×16", upscaler: "xess1", fg: 2, length: 279, price: 249, released: 2022, perf: "Solid when drivers cooperate" },
  { id: "a380", name: "Intel Arc A380", brand: "Intel", family: "Arc A-Series", segment: "Entry level", index: 30, vram: 6, vramType: "GDDR6", bus: "96-bit", bw: 186, tdp: 75, cores: "8 Xe cores", boost: "2.45 GHz", arch: "Alchemist", gen: "arcA", rtFac: 1.25, pcie: "PCIe 4.0 ×8", upscaler: "xess1", fg: 2, length: 222, price: 139, released: 2022, perf: "Low-power entry card" }
];

/* ============================== GAMES ==================================== */
/* base   : native FPS at 1440p Ultra, no RT, on an index-100 GPU (RTX 4070)
   cpuCap : FPS ceiling for a gaming-index-100 CPU (Ryzen 7 9800X3D)
   vram   : GB used at 1440p Ultra
   rtVram : extra GB at RT "High"      rtScale: how heavy the RT effects are
   pt     : path tracing support (null = not supported)                      */
const GAMES = [
  { id: "cs2", name: "Counter-Strike 2", year: 2023, engine: "Source 2", base: 340, cpuCap: 420, vram: 5.2, rtVram: 0, rtScale: 0, pt: null, sizeGB: 85, minRam: 8, recRam: 16, storage: "ssd", genre: "Competitive FPS", minCpu: 35, recCpu: 55, minGpu: 22, recGpu: 45, cap: null, notes: "Extremely CPU-bound at 1080p — a fast CPU matters more than the GPU.", load: 22, shader: 0 },
  { id: "valorant", name: "Valorant", year: 2020, engine: "Unreal Engine 4", base: 480, cpuCap: 700, vram: 3.4, rtVram: 0, rtScale: 0, pt: null, sizeGB: 45, minRam: 4, recRam: 8, storage: "ssd", genre: "Competitive FPS", minCpu: 28, recCpu: 40, minGpu: 16, recGpu: 30, cap: null, notes: "Runs on almost anything; CPU and refresh rate decide the experience.", load: 18, shader: 0 },
  { id: "overwatch2", name: "Overwatch 2", year: 2022, engine: "Custom", base: 250, cpuCap: 380, vram: 4.8, rtVram: 0, rtScale: 0, pt: null, sizeGB: 60, minRam: 6, recRam: 16, storage: "ssd", genre: "Hero shooter", minCpu: 32, recCpu: 50, minGpu: 24, recGpu: 45, cap: null, notes: "Scales very well across hardware tiers.", load: 25, shader: 15 },
  { id: "apex", name: "Apex Legends", year: 2019, engine: "Source", base: 165, cpuCap: 300, vram: 6.5, rtVram: 0, rtScale: 0, pt: null, sizeGB: 80, minRam: 6, recRam: 12, storage: "ssd", genre: "Battle royale", minCpu: 40, recCpu: 58, minGpu: 30, recGpu: 55, cap: 300, notes: "Engine-capped at 300 FPS.", load: 40, shader: 0 },
  { id: "fortnite", name: "Fortnite", year: 2017, engine: "Unreal Engine 5", base: 108, cpuCap: 240, vram: 7.5, rtVram: 2.6, rtScale: 0.7, pt: null, sizeGB: 100, minRam: 8, recRam: 16, storage: "ssd", genre: "Battle royale", minCpu: 35, recCpu: 55, minGpu: 25, recGpu: 55, cap: null, notes: "Nanite/Lumen modes are far heavier than the classic renderer.", load: 45, shader: 60 },
  { id: "gtav", name: "GTA V", year: 2015, engine: "RAGE", base: 172, cpuCap: 220, vram: 3.6, rtVram: 0, rtScale: 0, pt: null, sizeGB: 110, minRam: 8, recRam: 16, storage: "hdd", genre: "Open world", minCpu: 26, recCpu: 40, minGpu: 16, recGpu: 35, cap: null, notes: "A decade old and still light — CPU-limited on modern rigs.", load: 42, shader: 0 },
  { id: "rdr2", name: "Red Dead Redemption 2", year: 2019, engine: "RAGE", base: 96, cpuCap: 150, vram: 8.4, rtVram: 0, rtScale: 0, pt: null, sizeGB: 150, minRam: 12, recRam: 16, storage: "ssd", genre: "Open world", minCpu: 38, recCpu: 58, minGpu: 35, recGpu: 60, cap: null, notes: "Vulkan runs faster than DX12 on most systems.", load: 55, shader: 0 },
  { id: "eldenring", name: "Elden Ring", year: 2022, engine: "Custom", base: 92, cpuCap: 120, vram: 7.8, rtVram: 0, rtScale: 0, pt: null, sizeGB: 80, minRam: 12, recRam: 16, storage: "ssd", genre: "Action RPG", minCpu: 40, recCpu: 60, minGpu: 35, recGpu: 60, cap: 60, notes: "Hard-locked to 60 FPS on PC — extra GPU power buys headroom, not frames.", load: 32, shader: 0 },
  { id: "bg3", name: "Baldur's Gate 3", year: 2023, engine: "Divinity 4.0", base: 78, cpuCap: 130, vram: 8.8, rtVram: 0, rtScale: 0, pt: null, sizeGB: 150, minRam: 8, recRam: 16, storage: "ssd", genre: "CRPG", minCpu: 38, recCpu: 60, minGpu: 30, recGpu: 55, cap: null, notes: "Act 3 crowds are brutally CPU-heavy.", load: 60, shader: 120 },
  { id: "rust", name: "Rust", year: 2018, engine: "Unity", base: 94, cpuCap: 140, vram: 11.0, rtVram: 0, rtScale: 0, pt: null, sizeGB: 40, minRam: 10, recRam: 16, storage: "ssd", genre: "Survival", minCpu: 40, recCpu: 62, minGpu: 35, recGpu: 60, cap: null, notes: "Very memory hungry — 16 GB is the practical minimum.", load: 90, shader: 180 },
  { id: "helldivers2", name: "Helldivers 2", year: 2024, engine: "Stingray", base: 96, cpuCap: 170, vram: 9.2, rtVram: 0, rtScale: 0, pt: null, sizeGB: 150, minRam: 8, recRam: 16, storage: "ssd", genre: "Co-op shooter", minCpu: 40, recCpu: 62, minGpu: 38, recGpu: 62, cap: null, notes: "Big battles turn it into a CPU test.", load: 40, shader: 90 },
  { id: "cod", name: "Call of Duty: Black Ops 6", year: 2024, engine: "IW 9.0", base: 138, cpuCap: 260, vram: 9.8, rtVram: 3.0, rtScale: 0.8, pt: null, sizeGB: 200, minRam: 8, recRam: 16, storage: "ssd", genre: "FPS", minCpu: 42, recCpu: 65, minGpu: 40, recGpu: 70, cap: null, notes: "Enormous install, aggressive shader pre-caching on first boot.", load: 55, shader: 300 },
  { id: "starfield", name: "Starfield", year: 2023, engine: "Creation Engine 2", base: 70, cpuCap: 150, vram: 10.2, rtVram: 0, rtScale: 0, pt: null, sizeGB: 140, minRam: 16, recRam: 32, storage: "ssd", genre: "RPG", minCpu: 45, recCpu: 70, minGpu: 45, recGpu: 75, cap: null, notes: "Cities hammer the CPU; planets are GPU-bound.", load: 45, shader: 90 },
  { id: "fh5", name: "Forza Horizon 5", year: 2021, engine: "ForzaTech", base: 121, cpuCap: 230, vram: 8.6, rtVram: 3.2, rtScale: 0.9, pt: null, sizeGB: 160, minRam: 8, recRam: 16, storage: "ssd", genre: "Racing", minCpu: 35, recCpu: 55, minGpu: 30, recGpu: 55, cap: null, notes: "One of the best-optimised engines in gaming; built-in benchmark.", load: 38, shader: 45 },
  { id: "fh6", name: "Forza Horizon 6", year: 2025, engine: "ForzaTech (next)", base: 86, cpuCap: 210, vram: 9.5, rtVram: 3.5, rtScale: 0.95, pt: null, sizeGB: 180, minRam: 16, recRam: 32, storage: "ssd", genre: "Racing", minCpu: 45, recCpu: 65, minGpu: 45, recGpu: 75, cap: null, notes: "Heavier than FH5 — 12 GB cards overflow the VRAM budget at 1440p Ultra with RT on.", load: 42, shader: 60 },
  { id: "cyberpunk", name: "Cyberpunk 2077", year: 2020, engine: "REDengine 4", base: 82, cpuCap: 180, vram: 9.5, rtVram: 3.2, rtScale: 1.35, pt: { eff: 0.34, name: "Ray Tracing: Overdrive" }, sizeGB: 105, minRam: 12, recRam: 16, storage: "ssd", genre: "Action RPG", minCpu: 45, recCpu: 70, minGpu: 40, recGpu: 70, cap: null, notes: "The reference title for path tracing and ray reconstruction.", load: 35, shader: 150 },
  { id: "alanwake2", name: "Alan Wake 2", year: 2023, engine: "Northlight", base: 56, cpuCap: 160, vram: 11.2, rtVram: 4.0, rtScale: 1.2, pt: { eff: 0.40, name: "Full Path Tracing" }, sizeGB: 100, minRam: 16, recRam: 16, storage: "ssd", genre: "Survival horror", minCpu: 45, recCpu: 68, minGpu: 45, recGpu: 80, cap: null, notes: "Mesh shaders required — pre-Turing GPUs cannot run it.", minGen: ["rtx20","rtx30","rtx40","rtx50","rdna3","rdna4","arcA","arcB"], load: 40, shader: 110 },
  { id: "wukong", name: "Black Myth: Wukong", year: 2024, engine: "Unreal Engine 5", base: 46, cpuCap: 130, vram: 11.5, rtVram: 4.4, rtScale: 1.25, pt: { eff: 0.36, name: "Full Ray Tracing" }, sizeGB: 130, minRam: 16, recRam: 32, storage: "ssd", genre: "Action RPG", minCpu: 48, recCpu: 72, minGpu: 48, recGpu: 85, cap: null, notes: "Brutal on GPU memory; needs upscaling to be playable at 4K.", load: 50, shader: 240 },
  { id: "indianajones", name: "Indiana Jones and the Great Circle", year: 2024, engine: "id Tech 7", base: 74, cpuCap: 150, vram: 11.0, rtVram: 3.8, rtScale: 1.15, pt: { eff: 0.42, name: "Full Ray Tracing" }, sizeGB: 120, minRam: 16, recRam: 32, storage: "ssd", genre: "Action adventure", minCpu: 45, recCpu: 68, minGpu: 42, recGpu: 72, cap: null, notes: "CPU-heavy indoors, GPU-heavy outdoors.", load: 38, shader: 130 },
  { id: "msfs2024", name: "Microsoft Flight Simulator 2024", year: 2024, engine: "Asobo", base: 41, cpuCap: 90, vram: 12.0, rtVram: 0, rtScale: 0, pt: null, sizeGB: 60, minRam: 16, recRam: 32, storage: "ssd", genre: "Simulation", minCpu: 55, recCpu: 85, minGpu: 45, recGpu: 85, cap: null, notes: "One of the most CPU-limited games ever released.", load: 70, shader: 90 },
  { id: "gtavi", name: "GTA VI", year: 2026, engine: "RAGE 9", base: 46, cpuCap: 120, vram: 12.5, rtVram: 4.0, rtScale: 1.2, pt: null, sizeGB: 200, minRam: 16, recRam: 32, storage: "ssd", genre: "Open world", minCpu: 55, recCpu: 80, minGpu: 55, recGpu: 100, cap: null, notes: "Estimated — not yet benchmarked on retail hardware.", load: 60, shader: 180 },
  { id: "witcher4", name: "The Witcher 4", year: 2027, engine: "Unreal Engine 5", base: 58, cpuCap: 140, vram: 12.0, rtVram: 4.0, rtScale: 1.2, pt: { eff: 0.40, name: "Full Path Tracing (expected)" }, sizeGB: 150, minRam: 16, recRam: 32, storage: "ssd", genre: "RPG", minCpu: 50, recCpu: 75, minGpu: 50, recGpu: 90, cap: null, notes: "Speculative — based on CDPR's stated UE5 targets.", load: 55, shader: 180 },
  { id: "minecraftrtx", name: "Minecraft (RTX / Bedrock)", year: 2020, engine: "RenderDragon", base: 34, cpuCap: 90, vram: 6.0, rtVram: 2.0, rtScale: 1.0, pt: { eff: 1.0, name: "Always path traced" }, sizeGB: 5, minRam: 8, recRam: 16, storage: "ssd", genre: "Sandbox", minCpu: 35, recCpu: 55, minGpu: 35, recGpu: 60, cap: null, notes: "Path traced by design — every pixel is ray traced, RTX hardware required.", alwaysPT: true, requiresRT: true, load: 20, shader: 0 },
  { id: "ark", name: "ARK: Survival Ascended", year: 2023, engine: "Unreal Engine 5", base: 36, cpuCap: 110, vram: 12.5, rtVram: 3.6, rtScale: 1.1, pt: null, sizeGB: 100, minRam: 16, recRam: 32, storage: "ssd", genre: "Survival", minCpu: 45, recCpu: 68, minGpu: 45, recGpu: 80, cap: null, notes: "Notoriously heavy; Lumen lighting scales poorly with VRAM.", load: 85, shader: 200 }
];

/* ============================ CONSTANTS ================================== */
const RESOLUTIONS = {
  "1080p": { pixels: 2.07, fps: 1.45, vram: 0.72, label: "1080p (Full HD)" },
  "1440p": { pixels: 3.69, fps: 1.00, vram: 1.00, label: "1440p (QHD)" },
  "3440x1440": { pixels: 4.92, fps: 0.78, vram: 1.28, label: "3440×1440 (Ultrawide)" },
  "4K": { pixels: 8.29, fps: 0.55, vram: 1.50, label: "4K (UHD)" },
  "8K": { pixels: 33.2, fps: 0.28, vram: 2.20, label: "8K (extreme)" }
};

const QUALITY = {
  low:    { fps: 1.52, vram: 0.62, label: "Low" },
  medium: { fps: 1.30, vram: 0.78, label: "Medium" },
  high:   { fps: 1.14, vram: 0.90, label: "High" },
  ultra:  { fps: 1.00, vram: 1.00, label: "Ultra" }
};

/* Ray tracing tiers. "high" is the top conventional tier; "pt" is path tracing. */
const RT_LEVELS = {
  off:    { label: "Off",           base: 1.00, vramScale: 0.00 },
  low:    { label: "Low",           base: 0.88, vramScale: 0.35 },
  medium: { label: "Medium",        base: 0.80, vramScale: 0.70 },
  high:   { label: "High",          base: 0.61, vramScale: 1.00 },
  pt:     { label: "Path Tracing",  base: 0.00, vramScale: 1.30 }
};

/* Path-tracing capability by architecture generation (1.0 = Ada Lovelace).
   Newer RT + tensor hardware handles full path tracing far better. */
const PT_ARCH = {
  rtx50: 1.15, rtx40: 1.00, rtx30: 0.62, rtx20: 0.45, gtx: 0.15,
  rdna4: 0.85, rdna3: 0.70, rdna2: 0.45, arcB: 0.80, arcA: 0.70
};

const UPSCALER_PRESETS = {
  dlss4: { off: 1.00, quality: 1.40, balanced: 1.70, performance: 2.20, ultra: 3.10, name: "DLSS 4" },
  dlss3: { off: 1.00, quality: 1.35, balanced: 1.55, performance: 1.95, ultra: 2.70, name: "DLSS 3" },
  fsr4:  { off: 1.00, quality: 1.35, balanced: 1.55, performance: 1.90, ultra: 2.50, name: "FSR 4" },
  fsr3:  { off: 1.00, quality: 1.30, balanced: 1.50, performance: 1.85, ultra: 2.40, name: "FSR 3" },
  xess2: { off: 1.00, quality: 1.35, balanced: 1.55, performance: 1.90, ultra: 2.45, name: "XeSS 2" },
  xess1: { off: 1.00, quality: 1.28, balanced: 1.45, performance: 1.75, ultra: 2.20, name: "XeSS" },
  none:  { off: 1.00, quality: 1.00, balanced: 1.00, performance: 1.00, ultra: 1.00, name: "None" }
};

/* Frame generation modes: multiplier + added input latency in ms */
const FG_MODES = {
  off: { label: "Off", mul: 1.00, latency: 0 },
  x2:  { label: "On (2× frames)", mul: 1.75, latency: 12 },
  x3:  { label: "3× frames", mul: 2.40, latency: 24 },
  x4:  { label: "4× frames (Multi FG)", mul: 3.00, latency: 34 }
};

const RAM_SPEEDS = {
  "ddr4-2400": { label: "DDR4-2400", mul: 0.90, type: "DDR4" },
  "ddr4-2666": { label: "DDR4-2666", mul: 0.92, type: "DDR4" },
  "ddr4-3000": { label: "DDR4-3000", mul: 0.95, type: "DDR4" },
  "ddr4-3200": { label: "DDR4-3200", mul: 0.96, type: "DDR4" },
  "ddr4-3600": { label: "DDR4-3600", mul: 0.97, type: "DDR4" },
  "ddr5-4800": { label: "DDR5-4800", mul: 0.95, type: "DDR5" },
  "ddr5-5200": { label: "DDR5-5200", mul: 0.97, type: "DDR5" },
  "ddr5-5600": { label: "DDR5-5600", mul: 0.99, type: "DDR5" },
  "ddr5-6000": { label: "DDR5-6000 CL30", mul: 1.00, type: "DDR5" },
  "ddr5-6400": { label: "DDR5-6400", mul: 1.01, type: "DDR5" },
  "ddr5-7200": { label: "DDR5-7200", mul: 1.02, type: "DDR5" },
  "ddr5-8000": { label: "DDR5-8000", mul: 1.03, type: "DDR5" },
  "ddr5-8800": { label: "DDR5-8800", mul: 1.04, type: "DDR5" },
  "lpddr5x":   { label: "LPDDR5X (integrated)", mul: 0.98, type: "LPDDR5X" }
};

const RAM_AMOUNTS = [8, 12, 16, 24, 32, 48, 64, 96, 128];

const STORAGE_TYPES = {
  hdd:   { label: "HDD (5400–7200 rpm)", mbps: 150,   random: 1,   loadMul: 1.00, stream: 0.10 },
  sata:  { label: "SATA SSD",            mbps: 550,   random: 40,  loadMul: 0.44, stream: 0.35 },
  nvme3: { label: "NVMe Gen3",           mbps: 3500,  random: 250, loadMul: 0.30, stream: 0.60 },
  nvme4: { label: "NVMe Gen4",           mbps: 7000,  random: 600, loadMul: 0.22, stream: 0.85 },
  nvme5: { label: "NVMe Gen5",           mbps: 12000, random: 1000,loadMul: 0.18, stream: 1.00 }
};

/* Motherboards for the compatibility checker */
const MOTHERBOARDS = [
  { name: "ASUS ROG Crosshair X870E",  socket: "AM5",     ram: "DDR5", ramMax: "DDR5-8400", m2: 4, pcie: "5.0", form: "ATX",    price: 699, chipset: "X870E" },
  { name: "MSI MAG B650 Tomahawk",     socket: "AM5",     ram: "DDR5", ramMax: "DDR5-7200", m2: 3, pcie: "4.0", form: "ATX",    price: 219, chipset: "B650" },
  { name: "Gigabyte B650M DS3H",       socket: "AM5",     ram: "DDR5", ramMax: "DDR5-6400", m2: 2, pcie: "4.0", form: "mATX",   price: 139, chipset: "B650M" },
  { name: "ASRock B550M Pro4",         socket: "AM4",     ram: "DDR4", ramMax: "DDR4-4733", m2: 2, pcie: "4.0", form: "mATX",   price: 109, chipset: "B550M" },
  { name: "MSI MAG Z890 Tomahawk",     socket: "LGA 1851",ram: "DDR5", ramMax: "DDR5-8800", m2: 4, pcie: "5.0", form: "ATX",    price: 329, chipset: "Z890" },
  { name: "MSI PRO Z790-P WiFi",       socket: "LGA 1700",ram: "DDR5", ramMax: "DDR5-7200", m2: 4, pcie: "5.0", form: "ATX",    price: 199, chipset: "Z790" },
  { name: "Gigabyte B760M DS3H DDR4",  socket: "LGA 1700",ram: "DDR4", ramMax: "DDR4-5333", m2: 2, pcie: "4.0", form: "mATX",   price: 119, chipset: "B760M" },
  { name: "ASUS ROG Strix Z490-E",     socket: "LGA 1200",ram: "DDR4", ramMax: "DDR4-4600", m2: 2, pcie: "3.0", form: "ATX",    price: 259, chipset: "Z490" },
  { name: "ASRock WRX90 WS EVO",       socket: "sTR5",    ram: "DDR5", ramMax: "DDR5-7600 RDIMM", m2: 7, pcie: "5.0", form: "E-ATX", price: 899, chipset: "WRX90" }
];

const COOLERS = [
  { name: "Stock / bundled cooler",     tdp: 65,  height: 60,  noise: 42, price: 0,    type: "air" },
  { name: "120 mm tower air cooler",    tdp: 180, height: 155, noise: 32, price: 40,   type: "air" },
  { name: "Dual-tower air cooler",      tdp: 260, height: 165, noise: 29, price: 99,   type: "air" },
  { name: "240 mm AIO",                 tdp: 280, height: 55,  noise: 30, price: 120,  type: "aio", rad: 240 },
  { name: "360 mm AIO",                 tdp: 350, height: 55,  noise: 28, price: 180,  type: "aio", rad: 360 },
  { name: "420 mm AIO",                 tdp: 420, height: 55,  noise: 27, price: 250,  type: "aio", rad: 420 }
];

const CASES = [
  { name: "Compact mATX case",        form: ["mATX"], gpuMax: 300, coolerMax: 160, radMax: 240, psu: "ATX",    airflow: "weak",     price: 69 },
  { name: "Standard ATX tower",       form: ["ATX", "mATX"], gpuMax: 340, coolerMax: 165, radMax: 360, psu: "ATX", airflow: "balanced", price: 99 },
  { name: "High-airflow mesh ATX",    form: ["ATX", "mATX"], gpuMax: 400, coolerMax: 180, radMax: 420, psu: "ATX", airflow: "high", price: 149 },
  { name: "Full tower workstation",   form: ["E-ATX", "ATX", "mATX"], gpuMax: 460, coolerMax: 200, radMax: 480, psu: "ATX", airflow: "high", price: 249 }
];

const PSUS = [550, 650, 750, 850, 1000, 1200, 1600];

/* ============================ LOOKUP HELPERS ============================= */
function cpuById(id)   { return CPUS.find(c => c.id === id) || CPUS[0]; }
function gpuById(id)   { return GPUS.find(g => g.id === id) || GPUS[0]; }
function gameById(id)  { return GAMES.find(g => g.id === id) || GAMES[0]; }
function cpuByName(n)  { return CPUS.find(c => c.name === n); }
function gpuByName(n)  { return GPUS.find(g => g.name === n); }
function gameByName(n) { return GAMES.find(g => g.name === n); }

function fmt(n, d = 0) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
