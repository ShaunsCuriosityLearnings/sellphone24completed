import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Blog from "./models/Blog.js";
import connectDB from "./config/db.js";

const categoriesData = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Sell your used mobile phone for instant cash. We buy Apple, Samsung, Google, OnePlus and more.",
    image: "/products/iphone 17 pro max 💖.jpg",
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Get the best price for your used iPads, Samsung Galaxy Tabs, and Surface Pro tablets.",
    image: "/products/samsung (13).jpg",
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    description: "Turn your old smartwatches into cash. We accept Apple Watch, Galaxy Watch, and others.",
    image: "/products/apple logo.jpg",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Sell your used MacBooks, HP, Asus, and Lenovo laptops for top cash value instantly.",
    image: "/products/apple logo.jpg",
  },
  {
    name: "Games",
    slug: "games",
    description: "Sell your used gaming consoles and handhelds. PlayStation, Xbox, Nintendo Switch & ROG Ally.",
    image: "/products/samsung logo.jpg",
  },
  {
    name: "TVs",
    slug: "tvs",
    description: "Sell your Smart TVs, OLED, QLED & 4K TVs. Free doorstep pickup & instant payment.",
    image: "/products/samsung (1).jpg",
  },
  {
    name: "Any Device",
    slug: "any-device",
    description: "Have something else? Tell us about your device and get a custom quote.",
    image: "/products/samsung logo.jpg",
  },
];

const brandsData = [
  {
    name: "Apple",
    slug: "apple",
    logo: "🍎",
    categoriesSlugs: ["smartphones", "tablets", "smartwatches", "laptops"],
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "📱",
    categoriesSlugs: ["smartphones", "tablets", "smartwatches", "tvs"],
  },
  {
    name: "Google",
    slug: "google",
    logo: "🔎",
    categoriesSlugs: ["smartphones"],
  },
  {
    name: "OnePlus",
    slug: "oneplus",
    logo: "➕",
    categoriesSlugs: ["smartphones"],
  },
  {
    name: "HP",
    slug: "hp",
    logo: "💻",
    categoriesSlugs: ["laptops"],
  },
  {
    name: "Asus",
    slug: "asus",
    logo: "⚡",
    categoriesSlugs: ["laptops", "games"],
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    logo: "💻",
    categoriesSlugs: ["laptops"],
  },
  {
    name: "Sony",
    slug: "sony",
    logo: "🎮",
    categoriesSlugs: ["games", "tvs"],
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    logo: "🟩",
    categoriesSlugs: ["laptops", "tablets", "games"],
  },
  {
    name: "Nintendo",
    slug: "nintendo",
    logo: "🔴",
    categoriesSlugs: ["games"],
  },
  {
    name: "LG",
    slug: "lg",
    logo: "📺",
    categoriesSlugs: ["tvs"],
  },
];

const storagePriceBoosts = {
  "16GB": 0,
  "64GB": 0,
  "128GB": 0,
  "256GB": 150,
  "512GB": 350,
  "1TB": 700,
  "8GB RAM / 256GB SSD": 0,
  "16GB RAM / 512GB SSD": 300,
  "16GB RAM / 1TB SSD": 550,
  "32GB RAM / 1TB SSD": 850,
};

const productsData = [
  // --- SMARTPHONES ---
  {
    name: "iPhone 15 Pro Max",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 3200,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Black Titanium", "Natural Titanium", "White Titanium", "Blue Titanium"],
    description: "The ultimate iPhone featuring titanium design, Action button, powerful camera upgrades, and A17 Pro chip.",
    shortDescription: "Sleek titanium iPhone with A17 Pro chip & triple-lens camera.",
    images: { frontView: "/products/iphone 17 pro max 💖.jpg", sideView: "/products/iphone (1).jpg", backView: "/products/iphone (2).jpg" },
  },
  {
    name: "iPhone 15 Pro",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 2800,
    storages: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Black Titanium", "Natural Titanium", "White Titanium"],
    description: "Pro performance in a compact 6.1-inch titanium body with A17 Pro chip.",
    shortDescription: "Titanium design, A17 Pro chip, customizable Action button.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" },
  },
  {
    name: "iPhone 15",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 2000,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    description: "Dynamic Island, 48MP main camera, and USB-C integration.",
    shortDescription: "Dynamic Island, 48MP Main camera, and USB-C integration.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" },
  },
  {
    name: "Galaxy S24 Ultra",
    brandName: "Samsung",
    category: "smartphones",
    basePrice: 3000,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet"],
    description: "Premier AI smartphone with titanium frame, embedded S Pen, and 200MP camera.",
    shortDescription: "Premium titanium smartphone with 200MP camera & Galaxy AI.",
    images: { frontView: "/products/samsung (1).jpg", sideView: "/products/samsung (2).jpg", backView: "/products/samsung (3).jpg" },
  },
  {
    name: "Galaxy S24+",
    brandName: "Samsung",
    category: "smartphones",
    basePrice: 2200,
    storages: ["256GB", "512GB"],
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet"],
    description: "Large-screen flagship with intelligent Galaxy AI tools and QHD+ display.",
    shortDescription: "Beautiful QHD+ display, Galaxy AI tools, and sleek design.",
    images: { frontView: "/products/samsung (4).jpg", sideView: "/products/samsung (5).jpg", backView: "/products/samsung (6).jpg" },
  },

  // --- LAPTOPS (HP, ASUS, LENOVO, APPLE) ---
  {
    name: "HP Spectre x360 14",
    brandName: "HP",
    category: "laptops",
    basePrice: 3200,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Nightfall Black", "Slate Blue"],
    description: "Premium 2-in-1 convertible laptop featuring OLED touchscreen, Intel Core Ultra 7 processor, and sleek aluminum chassis.",
    shortDescription: "Ultra-portable 2-in-1 OLED touchscreen laptop with Intel Core Ultra.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "HP OMEN 16 Gaming Laptop",
    brandName: "HP",
    category: "laptops",
    basePrice: 3500,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Shadow Black"],
    description: "High-performance gaming laptop equipped with NVIDIA RTX 4070, 165Hz QHD display, and Tempest Cooling.",
    shortDescription: "RTX 4070 gaming laptop with 165Hz QHD display & Tempest cooling.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brandName: "Lenovo",
    category: "laptops",
    basePrice: 3800,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Deep Black Carbon"],
    description: "The gold standard business laptop. Ultralight carbon fiber weave, legendary keyboard, and Intel vPro security.",
    shortDescription: "Ultralight carbon-fiber business laptop with legendary keyboard.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Lenovo Legion Pro 5",
    brandName: "Lenovo",
    category: "laptops",
    basePrice: 3400,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD"],
    colors: ["Onyx Grey"],
    description: "AI-tuned gaming powerhouse with AMD Ryzen 7, RTX 4060 graphics, and 240Hz gaming panel.",
    shortDescription: "AI-tuned gaming notebook with Ryzen 7 & RTX 4060.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Asus ROG Zephyrus G14",
    brandName: "Asus",
    category: "laptops",
    basePrice: 3900,
    storages: ["16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Eclipse Gray", "Moonlight White"],
    description: "Ultra-slim 14-inch ROG Nebula OLED gaming laptop with AMD Ryzen 9 processor & RTX 4070 graphics.",
    shortDescription: "Ultra-slim ROG Nebula OLED gaming laptop with RTX 4070.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Asus Zenbook 14 OLED",
    brandName: "Asus",
    category: "laptops",
    basePrice: 2700,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD"],
    colors: ["Ponder Blue", "Foggy Silver"],
    description: "Elegant and lightweight laptop with a 2.8K 120Hz OLED display, long battery life, and Harman Kardon audio.",
    shortDescription: "Lightweight 2.8K 120Hz OLED ultrabook with long battery life.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },

  // --- TABLETS (iPADS, GALAXY TABS, SURFACE PRO) ---
  {
    name: "iPad Pro 13 M4",
    brandName: "Apple",
    category: "tablets",
    basePrice: 3800,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Space Black", "Silver"],
    description: "Impossibly thin design featuring the breakthrough M4 chip, Ultra Retina XDR Tandem OLED display, and Apple Pencil Pro support.",
    shortDescription: "Thinnest iPad Pro with M4 chip & Ultra Retina XDR Tandem OLED.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "iPad Air 11 M2",
    brandName: "Apple",
    category: "tablets",
    basePrice: 2100,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Space Gray", "Starlight", "Purple", "Blue"],
    description: "Freshly redesigned with the superfast M2 chip, Liquid Retina display, and landscape front camera.",
    shortDescription: "Powerful iPad Air powered by M2 chip & Liquid Retina display.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "iPad Mini 6",
    brandName: "Apple",
    category: "tablets",
    basePrice: 1500,
    storages: ["64GB", "256GB"],
    colors: ["Space Gray", "Pink", "Purple", "Starlight"],
    description: "Mega power in a mini 8.3-inch Liquid Retina size. Features A15 Bionic chip and 5G connectivity.",
    shortDescription: "Compact 8.3-inch iPad with A15 Bionic chip & Apple Pencil 2 support.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "Galaxy Tab S9 Ultra",
    brandName: "Samsung",
    category: "tablets",
    basePrice: 2200,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Graphite", "Beige"],
    description: "Massive 14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, and ultra-low latency S Pen included.",
    shortDescription: "Massive 14.6-inch AMOLED tablet with S Pen & IP68 rating.",
    images: { frontView: "/products/samsung (13).jpg", sideView: "/products/samsung (13).jpg", backView: "/products/samsung (13).jpg" },
  },
  {
    name: "Microsoft Surface Pro 9",
    brandName: "Microsoft",
    category: "tablets",
    basePrice: 2800,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Platinum", "Sapphire", "Forest", "Graphite"],
    description: "The 2-in-1 tablet versatility you want with the laptop performance you need. 13-inch PixelSense 120Hz display.",
    shortDescription: "2-in-1 Windows tablet with 120Hz PixelSense display & kickstand.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },

  // --- GAMES & CONSOLES ---
  {
    name: "PlayStation 5 Slim",
    brandName: "Sony",
    category: "games",
    basePrice: 1400,
    storages: ["1TB"],
    colors: ["White / Black"],
    description: "Next-gen gaming power in a slimmer form factor. Includes 1TB SSD, DualSense wireless controller, and 4K 120Hz HDR support.",
    shortDescription: "Compact PS5 console with 1TB SSD & DualSense wireless controller.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Xbox Series X",
    brandName: "Microsoft",
    category: "games",
    basePrice: 1300,
    storages: ["1TB"],
    colors: ["Matte Black"],
    description: "The fastest, most powerful Xbox console ever with 12 teraflops of graphic processing power & Quick Resume.",
    shortDescription: "12 Teraflops 4K gaming console with Quick Resume & 1TB velocity SSD.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Nintendo Switch OLED",
    brandName: "Nintendo",
    category: "games",
    basePrice: 850,
    storages: ["64GB"],
    colors: ["White", "Neon Red/Blue"],
    description: "Vibrant 7-inch OLED screen, wide adjustable stand, wired LAN dock, and 64GB internal storage.",
    shortDescription: "Vibrant 7-inch OLED screen handheld gaming console.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Asus ROG Ally X",
    brandName: "Asus",
    category: "games",
    basePrice: 2200,
    storages: ["1TB"],
    colors: ["Black"],
    description: "Upgraded Windows 11 handheld gaming PC with AMD Z1 Extreme, 24GB LPDDR5X RAM, and massive 80Wh battery.",
    shortDescription: "Windows 11 gaming handheld PC with AMD Z1 Extreme & 80Wh battery.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },

  // --- SMART TVs ---
  {
    name: "Samsung Neo QLED 65 Inch 4K TV",
    brandName: "Samsung",
    category: "tvs",
    basePrice: 2900,
    storages: ["Standard"],
    colors: ["Titan Black"],
    description: "Quantum Matrix Technology with Mini LEDs, Neural Quantum Processor 4K, and Anti-Glare screen.",
    shortDescription: "Quantum Mini LED 4K Smart TV with Dolby Atmos & Gaming Hub.",
    images: { frontView: "/products/samsung (1).jpg", sideView: "/products/samsung (1).jpg", backView: "/products/samsung (1).jpg" },
  },
  {
    name: "LG C3 OLED 55 Inch 4K TV",
    brandName: "LG",
    category: "tvs",
    basePrice: 3100,
    storages: ["Standard"],
    colors: ["Dark Titan"],
    description: "Self-lit OLED pixels for perfect black and infinite contrast. Powered by α9 AI Processor Gen6 with 120Hz G-Sync gaming.",
    shortDescription: "Self-lit OLED 4K TV with α9 AI Processor & 120Hz gaming mode.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Sony BRAVIA XR 65 Inch OLED TV",
    brandName: "Sony",
    category: "tvs",
    basePrice: 3300,
    storages: ["Standard"],
    colors: ["Black"],
    description: "Cognitive Processor XR delivers realistic color and contrast. Perfect for PlayStation 5 with Auto HDR Tone Mapping.",
    shortDescription: "Cognitive Processor XR OLED 4K TV optimized for PS5.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Clear existing database
    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();
    console.log("🧹 Database cleared (Categories, Brands, & Products deleted)");

    // 2. Insert Categories
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Seeded ${insertedCategories.length} categories.`);

    // Map Category slugs to ObjectIds
    const categorySlugToId = {};
    insertedCategories.forEach((cat) => {
      categorySlugToId[cat.slug] = cat._id;
    });

    // 3. Format & Insert Brands
    const formattedBrands = brandsData.map((brand) => {
      const categoryIds = brand.categoriesSlugs.map((slug) => categorySlugToId[slug]).filter(Boolean);
      return {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        categories: categoryIds,
      };
    });

    const insertedBrands = await Brand.insertMany(formattedBrands);
    console.log(`✅ Seeded ${insertedBrands.length} brands.`);

    // Map Brand names to ObjectIds
    const brandNameToId = {};
    insertedBrands.forEach((br) => {
      brandNameToId[br.name] = br._id;
    });

    // 4. Format & Insert Products
    const formattedProducts = productsData.map((product) => {
      const storagesMapped = product.storages.map((sz) => ({
        size: sz,
        priceBoost: storagePriceBoosts[sz] !== undefined ? storagePriceBoosts[sz] : 0,
      }));

      const brandId = brandNameToId[product.brandName];
      if (!brandId) {
        throw new Error(`Brand ID not found for brand name: ${product.brandName}`);
      }

      return {
        name: product.name,
        brand: brandId,
        category: product.category,
        basePrice: product.basePrice,
        storages: storagesMapped,
        colors: product.colors,
        description: product.description,
        shortDescription: product.shortDescription,
        images: product.images,
      };
    });

    const insertedProducts = await Product.insertMany(formattedProducts);
    console.log(`✅ Seeded ${insertedProducts.length} products across Smartphones, Laptops, Tablets, Games, and TVs!`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
