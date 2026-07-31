import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import products data from seed script
const productsData = [
  // --- SMARTPHONES ---
  { id: "P101", name: "iPhone 15 Pro Max", brand: "Apple", category: "Smartphones", basePrice: 3200, specs: "256GB / 512GB / 1TB", colors: "Black Titanium, Natural Titanium, White Titanium", imagePlaceholder: "/products/iphone 17 pro max 💖.jpg" },
  { id: "P102", name: "iPhone 15 Pro", brand: "Apple", category: "Smartphones", basePrice: 2800, specs: "128GB / 256GB / 512GB / 1TB", colors: "Black Titanium, Natural Titanium, White Titanium", imagePlaceholder: "/products/iphone (3).jpg" },
  { id: "P103", name: "iPhone 15", brand: "Apple", category: "Smartphones", basePrice: 2000, specs: "128GB / 256GB / 512GB", colors: "Black, Blue, Green, Yellow, Pink", imagePlaceholder: "/products/iphone (6).jpg" },
  { id: "P104", name: "Galaxy S24 Ultra", brand: "Samsung", category: "Smartphones", basePrice: 3000, specs: "256GB / 512GB / 1TB", colors: "Titanium Black, Titanium Gray, Titanium Violet", imagePlaceholder: "/products/samsung (1).jpg" },
  { id: "P105", name: "Galaxy S24+", brand: "Samsung", category: "Smartphones", basePrice: 2200, specs: "256GB / 512GB", colors: "Onyx Black, Marble Gray, Cobalt Violet", imagePlaceholder: "/products/samsung (4).jpg" },

  // --- LAPTOPS (HP, ASUS, LENOVO, APPLE) ---
  { id: "P201", name: "HP Spectre x360 14", brand: "HP", category: "Laptops", basePrice: 3200, specs: "16GB RAM / 512GB SSD | 16GB / 1TB SSD", colors: "Nightfall Black, Slate Blue", imagePlaceholder: "/products/hp-spectre.webp" },
  { id: "P202", name: "HP OMEN 16 Gaming Laptop", brand: "HP", category: "Laptops", basePrice: 3500, specs: "16GB RAM / 512GB SSD | 32GB / 1TB SSD", colors: "Shadow Black", imagePlaceholder: "/products/hp-omen16.webp" },
  { id: "P203", name: "Lenovo ThinkPad X1 Carbon Gen 11", brand: "Lenovo", category: "Laptops", basePrice: 3800, specs: "16GB RAM / 512GB SSD | 32GB / 1TB SSD", colors: "Deep Black Carbon", imagePlaceholder: "/products/lenovo-thinkpad.webp" },
  { id: "P204", name: "Lenovo Legion Pro 5", brand: "Lenovo", category: "Laptops", basePrice: 3400, specs: "16GB RAM / 512GB SSD | 16GB / 1TB SSD", colors: "Onyx Grey", imagePlaceholder: "/products/lenovo-legion.webp" },
  { id: "P205", name: "Asus ROG Zephyrus G14", brand: "Asus", category: "Laptops", basePrice: 3900, specs: "16GB RAM / 1TB SSD | 32GB / 1TB SSD", colors: "Eclipse Gray, Moonlight White", imagePlaceholder: "/products/asus-zephyrus.webp" },
  { id: "P206", name: "Asus Zenbook 14 OLED", brand: "Asus", category: "Laptops", basePrice: 2700, specs: "16GB RAM / 512GB SSD | 16GB / 1TB SSD", colors: "Ponder Blue, Foggy Silver", imagePlaceholder: "/products/asus-zenbook.webp" },

  // --- TABLETS (iPADS, GALAXY TABS, SURFACE PRO) ---
  { id: "P301", name: "iPad Pro 13 (M4 Chip)", brand: "Apple", category: "Tablets", basePrice: 3800, specs: "256GB / 512GB / 1TB", colors: "Space Black, Silver", imagePlaceholder: "/products/ipad-pro-m4.webp" },
  { id: "P302", name: "iPad Air 11 (M2 Chip)", brand: "Apple", category: "Tablets", basePrice: 2100, specs: "128GB / 256GB / 512GB", colors: "Space Gray, Starlight, Purple", imagePlaceholder: "/products/ipad-air-m2.webp" },
  { id: "P303", name: "iPad Mini 6", brand: "Apple", category: "Tablets", basePrice: 1500, specs: "64GB / 256GB", colors: "Space Gray, Pink, Purple", imagePlaceholder: "/products/ipad-mini-6.webp" },
  { id: "P304", name: "Galaxy Tab S9 Ultra", brand: "Samsung", category: "Tablets", basePrice: 2200, specs: "256GB / 512GB / 1TB", colors: "Graphite, Beige", imagePlaceholder: "/products/samsung-tab-s9.webp" },
  { id: "P305", name: "Microsoft Surface Pro 9", brand: "Microsoft", category: "Tablets", basePrice: 2800, specs: "256GB / 512GB / 1TB", colors: "Platinum, Sapphire, Forest", imagePlaceholder: "/products/surface-pro-9.webp" },

  // --- GAMES & CONSOLES ---
  { id: "P401", name: "PlayStation 5 Slim", brand: "Sony", category: "Games", basePrice: 1400, specs: "1TB SSD", colors: "White / Black", imagePlaceholder: "/products/ps5-slim.webp" },
  { id: "P402", name: "Xbox Series X", brand: "Microsoft", category: "Games", basePrice: 1300, specs: "1TB SSD", colors: "Matte Black", imagePlaceholder: "/products/xbox-series-x.webp" },
  { id: "P403", name: "Nintendo Switch OLED", brand: "Nintendo", category: "Games", basePrice: 850, specs: "64GB", colors: "White, Neon Red/Blue", imagePlaceholder: "/products/nintendo-switch-oled.webp" },
  { id: "P404", name: "Asus ROG Ally X", brand: "Asus", category: "Games", basePrice: 2200, specs: "1TB SSD", colors: "Black", imagePlaceholder: "/products/asus-rog-ally-x.webp" },

  // --- SMART TVs ---
  { id: "P501", name: "Samsung Neo QLED 65\" 4K TV", brand: "Samsung", category: "TVs", basePrice: 2900, specs: "65-Inch 4K Mini LED", colors: "Titan Black", imagePlaceholder: "/products/samsung-neo-qled.webp" },
  { id: "P502", name: "LG C3 OLED 55\" 4K TV", brand: "LG", category: "TVs", basePrice: 3100, specs: "55-Inch OLED 4K 120Hz", colors: "Dark Titan", imagePlaceholder: "/products/lg-c3-oled.webp" },
  { id: "P503", name: "Sony BRAVIA XR 65\" OLED TV", brand: "Sony", category: "TVs", basePrice: 3300, specs: "65-Inch Cognitive OLED", colors: "Black", imagePlaceholder: "/products/sony-bravia-xr.webp" },
];

const headers = ["Product ID", "Product Name", "Brand", "Category", "Base Price (AED)", "Variants & Specs", "Available Colors", "Image Placeholder"];

const csvRows = [
  headers.join(","),
  ...productsData.map(p => 
    `"${p.id}","${p.name}","${p.brand}","${p.category}","${p.basePrice}","${p.specs}","${p.colors}","${p.imagePlaceholder}"`
  )
];

const csvContent = csvRows.join("\n");
const outputPath = path.join(__dirname, "../products_catalog_expansion.csv");

fs.writeFileSync(outputPath, csvContent);
console.log(`✅ CSV Catalog File generated successfully at: ${outputPath}`);
