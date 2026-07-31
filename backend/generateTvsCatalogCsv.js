import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tvsProducts = [
  // --- SAMSUNG ---
  {
    id: "TV-001",
    name: "Samsung Neo QLED 75\" 8K Smart TV (QN900C)",
    brand: "Samsung",
    category: "TVs",
    basePrice: 5800,
    storages: "75-Inch 8K Quantum Mini-LED (+AED 0)",
    colors: "Infinity One Design / Titan Black",
    shortDescription: "Flagship 75-inch 8K Quantum Mini-LED Smart TV with Neural Quantum Processor 8K.",
    description: "Experience hyper-real 8K resolution with Quantum Matrix Technology Pro, Dolby Atmos sound, and ultra-slim Infinity Screen design.",
    frontViewImage: "/products/tv-samsung-qn900c-front.webp",
    sideViewImage: "/products/tv-samsung-qn900c-side.webp",
    backViewImage: "/products/tv-samsung-qn900c-back.webp",
  },
  {
    id: "TV-002",
    name: "Samsung Neo QLED 65\" 4K Smart TV (QN90C)",
    brand: "Samsung",
    category: "TVs",
    basePrice: 2900,
    storages: "65-Inch 4K Mini-LED (+AED 0) | 75-Inch (+AED 800)",
    colors: "Titan Black",
    shortDescription: "65-inch 4K Quantum Mini-LED Smart TV with Anti-Reflection & Gaming Hub.",
    description: "Quantum Matrix Technology with Mini LEDs, Neural Quantum Processor 4K, Motion Xcelerator Turbo+ 120Hz, and Anti-Glare screen.",
    frontViewImage: "/products/tv-samsung-qn90c-front.webp",
    sideViewImage: "/products/tv-samsung-qn90c-side.webp",
    backViewImage: "/products/tv-samsung-qn90c-back.webp",
  },
  {
    id: "TV-003",
    name: "Samsung OLED 55\" 4K Smart TV (S95C / S90C)",
    brand: "Samsung",
    category: "TVs",
    basePrice: 3200,
    storages: "55-Inch 4K Quantum OLED (+AED 0) | 65-Inch (+AED 700)",
    colors: "Graphite Black",
    shortDescription: "55-inch Quantum Dot OLED 4K TV with 144Hz gaming & Pantone Validation.",
    description: "Combining pure blacks of OLED with vibrant QD color. Features Neural Quantum Processor 4K, 144Hz refresh rate, and LaserSlim design.",
    frontViewImage: "/products/tv-samsung-s95c-front.webp",
    sideViewImage: "/products/tv-samsung-s95c-side.webp",
    backViewImage: "/products/tv-samsung-s95c-back.webp",
  },
  {
    id: "TV-004",
    name: "Samsung The Frame 55\" QLED 4K TV",
    brand: "Samsung",
    category: "TVs",
    basePrice: 2100,
    storages: "55-Inch Matte QLED (+AED 0) | 65-Inch (+AED 500)",
    colors: "Walnut, Teak, White, Sand Gold",
    shortDescription: "Art Mode 55-inch QLED 4K TV with anti-reflective Matte Display.",
    description: "Transforms into a museum-quality artwork display when off. Matte Display minimizes reflections and customizable bezel frames suit your decor.",
    frontViewImage: "/products/tv-samsung-frame-front.webp",
    sideViewImage: "/products/tv-samsung-frame-side.webp",
    backViewImage: "/products/tv-samsung-frame-back.webp",
  },

  // --- LG ---
  {
    id: "TV-005",
    name: "LG G3 OLED evo 65\" 4K Smart TV (Gallery Edition)",
    brand: "LG",
    category: "TVs",
    basePrice: 4200,
    storages: "65-Inch Brightness Booster Max OLED (+AED 0)",
    colors: "Dark Silver",
    shortDescription: "Flagship 65-inch OLED evo TV with Brightness Booster Max & zero-gap wall mount.",
    description: "Self-lit OLED pixels boosted by Brightness Booster Max technology up to 70% brighter. α9 AI Processor Gen6, 4K 120Hz G-Sync gaming, and flush Gallery Design.",
    frontViewImage: "/products/tv-lg-g3-front.webp",
    sideViewImage: "/products/tv-lg-g3-side.webp",
    backViewImage: "/products/tv-lg-g3-back.webp",
  },
  {
    id: "TV-006",
    name: "LG C3 OLED 55\" 4K Smart TV",
    brand: "LG",
    category: "TVs",
    basePrice: 3100,
    storages: "55-Inch OLED 4K (+AED 0) | 65-Inch (+AED 750)",
    colors: "Dark Titan",
    shortDescription: "Industry-favorite 55-inch OLED 4K TV with α9 AI Processor & 120Hz gaming.",
    description: "Self-lit OLED pixels for perfect black and infinite contrast. α9 AI Processor Gen6, Dolby Vision / Atmos, 0.1ms response time, and 4 HDMI 2.1 ports.",
    frontViewImage: "/products/tv-lg-c3-front.webp",
    sideViewImage: "/products/tv-lg-c3-side.webp",
    backViewImage: "/products/tv-lg-c3-back.webp",
  },
  {
    id: "TV-007",
    name: "LG QNED 65\" 4K Mini LED Smart TV (QNED90)",
    brand: "LG",
    category: "TVs",
    basePrice: 2400,
    storages: "65-Inch Quantum Dot NanoCell Mini-LED (+AED 0)",
    colors: "Black",
    shortDescription: "Quantum Dot + NanoCell 65-inch Mini LED Smart TV with Precision Dimming.",
    description: "Combines Quantum Dot and NanoCell technologies with thousands of Mini LED backlight zones for vivid colors and deep black levels.",
    frontViewImage: "/products/tv-lg-qned-front.webp",
    sideViewImage: "/products/tv-lg-qned-side.webp",
    backViewImage: "/products/tv-lg-qned-back.webp",
  },

  // --- SONY ---
  {
    id: "TV-008",
    name: "Sony BRAVIA XR A95L 65\" QD-OLED 4K TV",
    brand: "Sony",
    category: "TVs",
    basePrice: 5100,
    storages: "65-Inch QD-OLED 4K (+AED 0)",
    colors: "Black Titanium",
    shortDescription: "Sony's flagship 65-inch QD-OLED TV with Cognitive Processor XR.",
    description: "Unmatched color brightness and contrast powered by QD-OLED technology and Cognitive Processor XR. Perfect for PS5 with Auto HDR Tone Mapping.",
    frontViewImage: "/products/tv-sony-a95l-front.webp",
    sideViewImage: "/products/tv-sony-a95l-side.webp",
    backViewImage: "/products/tv-sony-a95l-back.webp",
  },
  {
    id: "TV-009",
    name: "Sony BRAVIA XR A80L 55\" OLED 4K TV",
    brand: "Sony",
    category: "TVs",
    basePrice: 3300,
    storages: "55-Inch OLED 4K (+AED 0) | 65-Inch (+AED 700)",
    colors: "Black",
    shortDescription: "55-inch OLED 4K TV with Acoustic Surface Audio+ & Cognitive Processor XR.",
    description: "Pure OLED blacks and immersive sound emitting directly from the screen surface with Acoustic Surface Audio+ technology.",
    frontViewImage: "/products/tv-sony-a80l-front.webp",
    sideViewImage: "/products/tv-sony-a80l-side.webp",
    backViewImage: "/products/tv-sony-a80l-back.webp",
  },
  {
    id: "TV-010",
    name: "Sony BRAVIA X90L 65\" Full Array LED 4K TV",
    brand: "Sony",
    category: "TVs",
    basePrice: 2600,
    storages: "65-Inch Full Array LED 4K (+AED 0) | 75-Inch (+AED 900)",
    colors: "Black",
    shortDescription: "65-inch Full Array LED 4K TV with Cognitive Processor XR & HDMI 2.1.",
    description: "Full Array LED contrast with XR Contrast Booster and cognitive intelligence processor for ultra-realistic gaming and cinematic visuals.",
    frontViewImage: "/products/tv-sony-x90l-front.webp",
    sideViewImage: "/products/tv-sony-x90l-side.webp",
    backViewImage: "/products/tv-sony-x90l-back.webp",
  },

  // --- TCL & HISENSE ---
  {
    id: "TV-011",
    name: "TCL QM8 65\" QLED Mini-LED 4K TV",
    brand: "TCL",
    category: "TVs",
    basePrice: 1900,
    storages: "65-Inch Mini-LED 4K (+AED 0)",
    colors: "Dark Metal",
    shortDescription: "65-inch QLED Mini-LED 4K TV with 2000+ nits peak brightness & 144Hz VRR.",
    description: "ULTRA Mini-LED backlight system with up to 2300 local dimming zones, 144Hz Game Accelerator, Google TV, and Dolby Vision IQ.",
    frontViewImage: "/products/tv-tcl-qm8-front.webp",
    sideViewImage: "/products/tv-tcl-qm8-side.webp",
    backViewImage: "/products/tv-tcl-qm8-back.webp",
  },
  {
    id: "TV-012",
    name: "Hisense U8K 65\" Mini-LED ULED 4K TV",
    brand: "Hisense",
    category: "TVs",
    basePrice: 1750,
    storages: "65-Inch Mini-LED ULED 4K (+AED 0)",
    colors: "Black",
    shortDescription: "65-inch ULED Mini-LED 4K TV with Quantum Dot color & 144Hz Game Mode Pro.",
    description: "ULED technology with Mini-LED backlighting, 1500 nits peak brightness, Dolby Atmos sound, and full HDMI 2.1 144Hz support.",
    frontViewImage: "/products/tv-hisense-u8k-front.webp",
    sideViewImage: "/products/tv-hisense-u8k-side.webp",
    backViewImage: "/products/tv-hisense-u8k-back.webp",
  },
];

const headers = [
  "Product ID",
  "Product Name",
  "Brand",
  "Category",
  "Base Price (AED)",
  "Screen Size / Panel Variants & Boosts",
  "Available Color / Bezel Finishes",
  "Short Description",
  "Full Description",
  "Front View Image Path",
  "Side View Image Path",
  "Back View Image Path"
];

const csvRows = [
  headers.join(","),
  ...tvsProducts.map((p) =>
    [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      `"${p.basePrice}"`,
      `"${p.storages}"`,
      `"${p.colors}"`,
      `"${p.shortDescription.replace(/"/g, '""')}"`,
      `"${p.description.replace(/"/g, '""')}"`,
      `"${p.frontViewImage}"`,
      `"${p.sideViewImage}"`,
      `"${p.backViewImage}"`
    ].join(",")
  )
];

const csvContent = csvRows.join("\n");
const outputPath = path.join(__dirname, "../smart_tvs_catalog.csv");

fs.writeFileSync(outputPath, csvContent);
console.log(`✅ Smart TVs CSV Catalog File successfully created at:\n${outputPath}`);
