import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tabletsProducts = [
  // ==========================================
  // 1. APPLE IPADS
  // ==========================================
  {
    id: "TAB-101",
    name: "iPad Pro 13 (M4 Chip, 2024)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 3800,
    specs: "256GB Wi-Fi (+AED 0) | 512GB Wi-Fi (+AED 700) | 1TB Cellular Nano-Texture (+AED 2100) | 2TB Cellular (+AED 3600)",
    colors: "Space Black, Silver",
    shortDescription: "Ultra-thin 5.1mm iPad Pro with Apple M4 chip & Ultra Retina XDR Tandem OLED.",
    description: "Apple's thinnest product ever. Features groundbreaking Tandem OLED Ultra Retina XDR display, M4 chip with 10-core CPU & 10-core GPU, hardware-accelerated ray tracing, and Apple Pencil Pro support.",
    frontViewImage: "/products/ipad-pro13-m4-front.webp",
    sideViewImage: "/products/ipad-pro13-m4-side.webp",
    backViewImage: "/products/ipad-pro13-m4-back.webp",
  },
  {
    id: "TAB-102",
    name: "iPad Pro 11 (M4 Chip, 2024)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 3100,
    specs: "256GB Wi-Fi (+AED 0) | 512GB Wi-Fi (+AED 600) | 1TB Cellular (+AED 1800)",
    colors: "Space Black, Silver",
    shortDescription: "Compact 11-inch Ultra Retina XDR OLED tablet with M4 chip.",
    description: "Pro performance in an 11-inch size. Ultra Retina XDR Tandem OLED, M4 chip, landscape 12MP Center Stage camera, Thunderbolt 4 port, and Apple Pencil Pro compatibility.",
    frontViewImage: "/products/ipad-pro11-m4-front.webp",
    sideViewImage: "/products/ipad-pro11-m4-side.webp",
    backViewImage: "/products/ipad-pro11-m4-back.webp",
  },
  {
    id: "TAB-103",
    name: "iPad Air 13 (M2 Chip, 2024)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 2700,
    specs: "128GB Wi-Fi (+AED 0) | 256GB Wi-Fi (+AED 450) | 512GB Cellular (+AED 1100)",
    colors: "Space Gray, Starlight, Purple, Blue",
    shortDescription: "Redesigned 13-inch iPad Air with superfast M2 chip & Liquid Retina display.",
    description: "First-ever 13-inch iPad Air. Features M2 chip, Liquid Retina display, landscape front camera, Touch ID power button, and Apple Pencil Pro support.",
    frontViewImage: "/products/ipad-air13-m2-front.webp",
    sideViewImage: "/products/ipad-air13-m2-side.webp",
    backViewImage: "/products/ipad-air13-m2-back.webp",
  },
  {
    id: "TAB-104",
    name: "iPad Air 11 (M2 Chip, 2024)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 2100,
    specs: "128GB Wi-Fi (+AED 0) | 256GB Wi-Fi (+AED 400) | 512GB Cellular (+AED 950)",
    colors: "Space Gray, Starlight, Purple, Blue",
    shortDescription: "11-inch Liquid Retina iPad Air powered by the Apple M2 chip.",
    description: "Supercharged by the M2 chip with 8-core CPU and 10-core GPU. Fast Wi-Fi 6E, landscape 12MP Ultra Wide camera, USB-C port, and all-day battery life.",
    frontViewImage: "/products/ipad-air11-m2-front.webp",
    sideViewImage: "/products/ipad-air11-m2-side.webp",
    backViewImage: "/products/ipad-air11-m2-back.webp",
  },
  {
    id: "TAB-105",
    name: "iPad 10th Gen 10.9 (2022/2024)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 1200,
    specs: "64GB Wi-Fi (+AED 0) | 256GB Wi-Fi (+AED 450) | 256GB Cellular (+AED 750)",
    colors: "Blue, Pink, Yellow, Silver",
    shortDescription: "All-screen 10.9-inch Liquid Retina iPad with A14 Bionic chip & USB-C.",
    description: "Colorful all-screen design with 10.9-inch Liquid Retina display, A14 Bionic chip, landscape 12MP Ultra Wide camera, USB-C port, and Magic Keyboard Folio support.",
    frontViewImage: "/products/ipad-10th-front.webp",
    sideViewImage: "/products/ipad-10th-side.webp",
    backViewImage: "/products/ipad-10th-back.webp",
  },
  {
    id: "TAB-106",
    name: "iPad Mini 6",
    brand: "Apple",
    category: "Tablets",
    basePrice: 1450,
    specs: "64GB Wi-Fi (+AED 0) | 256GB Wi-Fi (+AED 450) | 256GB Cellular (+AED 750)",
    colors: "Space Gray, Pink, Purple, Starlight",
    shortDescription: "Compact 8.3-inch Liquid Retina iPad with A15 Bionic chip & 5G.",
    description: "Mega power in a mini size. 8.3-inch Liquid Retina display, A15 Bionic chip with Neural Engine, Touch ID, USB-C, 5G Cellular connectivity, and Apple Pencil 2 magnetic attachment.",
    frontViewImage: "/products/ipad-mini6-front.webp",
    sideViewImage: "/products/ipad-mini6-side.webp",
    backViewImage: "/products/ipad-mini6-back.webp",
  },
  {
    id: "TAB-107",
    name: "iPad Pro 12.9 M2 (2022)",
    brand: "Apple",
    category: "Tablets",
    basePrice: 2600,
    specs: "128GB Wi-Fi (+AED 0) | 256GB Wi-Fi (+AED 400) | 512GB Cellular (+AED 900) | 1TB Cellular (+AED 1600)",
    colors: "Space Gray, Silver",
    shortDescription: "Liquid Retina XDR Mini LED iPad Pro powered by the M2 chip.",
    description: "12.9-inch Liquid Retina XDR display with Mini LED backlighting, M2 chip, Apple Pencil hover experience, ProRes video capture, and Thunderbolt 4 connector.",
    frontViewImage: "/products/ipad-pro129-m2-front.webp",
    sideViewImage: "/products/ipad-pro129-m2-side.webp",
    backViewImage: "/products/ipad-pro129-m2-back.webp",
  },

  // ==========================================
  // 2. SAMSUNG GALAXY TABS
  // ==========================================
  {
    id: "TAB-201",
    name: "Galaxy Tab S9 Ultra",
    brand: "Samsung",
    category: "Tablets",
    basePrice: 2600,
    specs: "256GB Wi-Fi (+AED 0) | 512GB 5G (+AED 700) | 1TB 5G (+AED 1600)",
    colors: "Graphite, Beige",
    shortDescription: "Massive 14.6-inch Dynamic AMOLED 2X Android tablet with S Pen & IP68 rating.",
    description: "Samsung's ultimate flagship tablet. 14.6-inch Dynamic AMOLED 2X 120Hz display, Snapdragon 8 Gen 2 for Galaxy, IP68 water/dust resistance, included low-latency S Pen, and quad AKG speakers.",
    frontViewImage: "/products/tab-s9-ultra-front.webp",
    sideViewImage: "/products/tab-s9-ultra-side.webp",
    backViewImage: "/products/tab-s9-ultra-back.webp",
  },
  {
    id: "TAB-202",
    name: "Galaxy Tab S9+",
    brand: "Samsung",
    category: "Tablets",
    basePrice: 2100,
    specs: "256GB Wi-Fi (+AED 0) | 512GB 5G (+AED 550)",
    colors: "Graphite, Beige",
    shortDescription: "12.4-inch Dynamic AMOLED 2X tablet with Snapdragon 8 Gen 2 & S Pen.",
    description: "Vibrant 12.4-inch 120Hz Dynamic AMOLED 2X screen, Snapdragon 8 Gen 2 processor, IP68 rated body and S Pen, dual rear cameras, and Samsung DeX desktop mode.",
    frontViewImage: "/products/tab-s9plus-front.webp",
    sideViewImage: "/products/tab-s9plus-side.webp",
    backViewImage: "/products/tab-s9plus-back.webp",
  },
  {
    id: "TAB-203",
    name: "Galaxy Tab S9 FE+",
    brand: "Samsung",
    category: "Tablets",
    basePrice: 1350,
    specs: "128GB Wi-Fi (+AED 0) | 256GB 5G (+AED 400)",
    colors: "Gray, Silver, Mint, Lavender",
    shortDescription: "Large 12.4-inch 90Hz display tablet with IP68 S Pen & 10090mAh battery.",
    description: "Feature-packed Fan Edition tablet. 12.4-inch 90Hz display, IP68 water-resistant S Pen included, Exynos 1380 processor, 10,090 mAh battery with 45W fast charging.",
    frontViewImage: "/products/tab-s9fe-front.webp",
    sideViewImage: "/products/tab-s9fe-side.webp",
    backViewImage: "/products/tab-s9fe-back.webp",
  },
  {
    id: "TAB-204",
    name: "Galaxy Tab S8 Ultra (2022)",
    brand: "Samsung",
    category: "Tablets",
    basePrice: 1900,
    specs: "128GB Wi-Fi (+AED 0) | 256GB 5G (+AED 450) | 512GB 5G (+AED 900)",
    colors: "Graphite",
    shortDescription: "2022 flagship 14.6-inch Super AMOLED tablet with dual front cameras.",
    description: "14.6-inch Super AMOLED 120Hz screen, Armor Aluminum frame, Snapdragon 8 Gen 1 chip, ultra-wide 12MP dual front cameras, and Bluetooth S Pen.",
    frontViewImage: "/products/tab-s8ultra-front.webp",
    sideViewImage: "/products/tab-s8ultra-side.webp",
    backViewImage: "/products/tab-s8ultra-back.webp",
  },

  // ==========================================
  // 3. MICROSOFT SURFACE
  // ==========================================
  {
    id: "TAB-301",
    name: "Microsoft Surface Pro 10 (2024)",
    brand: "Microsoft",
    category: "Tablets",
    basePrice: 3600,
    specs: "256GB SSD / 16GB RAM (+AED 0) | 512GB SSD / 16GB RAM (+AED 700) | 1TB SSD / 32GB RAM (+AED 1800)",
    colors: "Platinum, Black",
    shortDescription: "Commercial 2-in-1 Windows 11 tablet with Intel Core Ultra & anti-reflective screen.",
    description: "Built for AI business productivity. 13-inch PixelSense Flow 120Hz anti-reflective display, Intel Core Ultra 5/7 with AI NPU, Ultrawide QHD front camera with Studio Effects, and Surface Slim Pen 2 storage.",
    frontViewImage: "/products/surface-pro10-front.webp",
    sideViewImage: "/products/surface-pro10-side.webp",
    backViewImage: "/products/surface-pro10-back.webp",
  },
  {
    id: "TAB-302",
    name: "Microsoft Surface Pro 9 (2022/2023)",
    brand: "Microsoft",
    category: "Tablets",
    basePrice: 2700,
    specs: "256GB SSD / 8GB RAM (+AED 0) | 256GB SSD / 16GB RAM (+AED 450) | 512GB SSD / 16GB RAM (+AED 950)",
    colors: "Platinum, Sapphire, Forest, Graphite",
    shortDescription: "13-inch 120Hz PixelSense 2-in-1 Windows tablet with 12th Gen Intel Core i5/i7.",
    description: "Iconic 2-in-1 design with built-in kickstand. 13-inch PixelSense 120Hz touchscreen, 12th Gen Intel Core i5/i7 processor, dual Thunderbolt 4 ports, and optional 5G SQ3 configuration.",
    frontViewImage: "/products/surface-pro9-front.webp",
    sideViewImage: "/products/surface-pro9-side.webp",
    backViewImage: "/products/surface-pro9-back.webp",
  },

  // ==========================================
  // 4. XIAOMI, ONEPLUS & LENOVO
  // ==========================================
  {
    id: "TAB-401",
    name: "Xiaomi Pad 6 Pro",
    brand: "Xiaomi",
    category: "Tablets",
    basePrice: 1300,
    specs: "128GB (+AED 0) | 256GB (+AED 250) | 512GB (+AED 500)",
    colors: "Black, Gold, Mountain Blue",
    shortDescription: "11-inch 144Hz 2.8K display tablet with Snapdragon 8+ Gen 1.",
    description: "High-performance Android tablet featuring Snapdragon 8+ Gen 1, 11-inch 2.8K 144Hz screen, 67W fast charging, Quad speaker Dolby Atmos, and metal unibody design.",
    frontViewImage: "/products/xiaomi-pad6pro-front.webp",
    sideViewImage: "/products/xiaomi-pad6pro-side.webp",
    backViewImage: "/products/xiaomi-pad6pro-back.webp",
  },
  {
    id: "TAB-402",
    name: "OnePlus Pad 2 (2024)",
    brand: "OnePlus",
    category: "Tablets",
    basePrice: 1850,
    specs: "256GB / 12GB RAM (+AED 0)",
    colors: "Nimbus Gray",
    shortDescription: "12.1-inch 3K 144Hz display flagship tablet with Snapdragon 8 Gen 3.",
    description: "Unrivaled performance with Snapdragon 8 Gen 3, 12.1-inch 3K 144Hz ReadFit 7:5 ratio screen, 6-speaker Omnibearing sound system, 67W SUPERVOOC charging, and Stylo 2 support.",
    frontViewImage: "/products/oneplus-pad2-front.webp",
    sideViewImage: "/products/oneplus-pad2-side.webp",
    backViewImage: "/products/oneplus-pad2-back.webp",
  },
  {
    id: "TAB-403",
    name: "Lenovo Tab Extreme 14.5",
    brand: "Lenovo",
    category: "Tablets",
    basePrice: 2800,
    specs: "256GB / 12GB RAM (+AED 0)",
    colors: "Storm Grey",
    shortDescription: "Massive 14.5-inch 3K 120Hz OLED tablet with 8 JBL speakers & Precision Pen 3.",
    description: "Lenovo's ultimate media & productivity tablet. 14.5-inch 3K 120Hz OLED display, Dimensity 9000 octa-core chip, 8 JBL speakers with Dolby Atmos, dual Type-C DP ports, and dual-hinge keyboard stand.",
    frontViewImage: "/products/lenovo-tab-extreme-front.webp",
    sideViewImage: "/products/lenovo-tab-extreme-side.webp",
    backViewImage: "/products/lenovo-tab-extreme-back.webp",
  },
];

const headers = [
  "Product ID",
  "Product Name",
  "Brand",
  "Category",
  "Base Price (AED)",
  "Storage & Connectivity Variants & Boosts",
  "Available Colors",
  "Short Description",
  "Full Description",
  "Front View Image Path",
  "Side View Image Path",
  "Back View Image Path"
];

const csvRows = [
  headers.join(","),
  ...tabletsProducts.map((p) =>
    [
      `"${p.id}"`,
      `"${p.name}"`,
      `"${p.brand}"`,
      `"${p.category}"`,
      `"${p.basePrice}"`,
      `"${p.specs}"`,
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
const outputPath = path.join(__dirname, "../tablets_catalog.csv");

fs.writeFileSync(outputPath, csvContent);
console.log(`✅ Tablets CSV Catalog File successfully created at:\n${outputPath}`);
