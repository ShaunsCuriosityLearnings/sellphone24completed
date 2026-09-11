import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectToMongoDB } from "./config/db.js";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";

const DEFAULT_IMAGE_MAP = {
  iphone18promax: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro-max.png",
  iphone18pro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro.png",
  iphone18slim: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-plus.png",
  iphone18: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16.png",
  iphone18fold: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro-max.png",
  iphonese4: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-se-3rd-gen.png",
  s26ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-s24-ultra.png",
  s25ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-s24-ultra.png",
  zfold7: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  zflip7: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-flip-6.png",
  macbookm5max: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-pro-16.png",
  macbookm4air: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-air-15.png",
  macstudiom4: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-pro-16.png",
  msititan: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/dell-alienware-m16.png",
  huaweimatext: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  honormagicv3: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  xiaomi15ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/oneplus-12.png",
  vivox200pro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/pixel-8-pro.png",
  visionpro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  garminfenix8: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  garminmarq: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  huaweiwatchgold: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-watch-6-classic.png",
  switch2: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/nintendo-switch-oled.png",
  airpodsmax2: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png"
};

const NEW_BRANDS = [
  { name: "Huawei", slug: "huawei", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/huawei-logo.png" },
  { name: "Honor", slug: "honor", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/honor-logo.png" },
  { name: "Vivo", slug: "vivo", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/vivo-logo.png" },
  { name: "MSI", slug: "msi", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/msi-logo.png" },
  { name: "Garmin", slug: "garmin", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/garmin-logo.png" },
  { name: "GPD", slug: "gpd", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/gpd-logo.png" },
  { name: "Focal", slug: "focal", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/focal-logo.png" },
  { name: "Bose", slug: "bose", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/bose-logo.png" }
];

const NEW_HIGH_VALUE_PRODUCTS = [
  // APPLE IPHONE 18 & 17 LINEUP
  {
    name: "iPhone 18 Pro Max",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 4800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 900 },
      { size: "2TB", priceBoost: 1500 }
    ],
    colors: ["Space Black Titanium", "Natural Titanium", "Desert Titanium", "Deep Red Titanium"],
    description: "Sell your pre-owned iPhone 18 Pro Max for top instant cash value in Dubai & UAE. Free doorstep pickup.",
    shortDescription: "Next-gen flagship iPhone 18 Pro Max with 2TB options.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18promax },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Pro",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 4100,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 300 },
      { size: "512GB", priceBoost: 700 },
      { size: "1TB", priceBoost: 1200 }
    ],
    colors: ["Space Black Titanium", "Natural Titanium", "Desert Titanium"],
    description: "Instant cash trade-in quote for iPhone 18 Pro across Dubai, Abu Dhabi & Sharjah.",
    shortDescription: "Pro-level iPhone 18 Pro with A20 Bionic performance.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18pro },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Slim / Air",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 3400,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 300 },
      { size: "512GB", priceBoost: 650 }
    ],
    colors: ["Space White", "Sky Blue", "Graphite"],
    description: "Sell your ultra-thin iPhone 18 Slim for instant cash payout.",
    shortDescription: "Ultra-thin design iPhone 18 Air flagship.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18slim },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 2900,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 250 },
      { size: "512GB", priceBoost: 550 }
    ],
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    description: "Get highest market quote for used iPhone 18 in Dubai.",
    shortDescription: "Base model iPhone 18 with OLED Display.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Fold",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 5200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1100 }
    ],
    colors: ["Space Black", "Titanium Silver"],
    description: "Trade in your luxury Apple iPhone 18 Foldable for instant doorstep cash payout.",
    shortDescription: "Apple's first foldable smartphone.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18fold },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone SE (4th Gen OLED)",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 1300,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 200 }
    ],
    colors: ["Midnight", "Starlight", "RED"],
    description: "Sell your iPhone SE 4th Gen OLED in Dubai.",
    shortDescription: "Budget OLED iPhone SE 4 with Action Button.",
    images: { frontView: DEFAULT_IMAGE_MAP.iphonese4 },
    isPopular: false,
    isLivePrice: true
  },

  // SAMSUNG GALAXY NEXT-GEN
  {
    name: "Samsung Galaxy S26 Ultra",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 4200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 450 },
      { size: "1TB", priceBoost: 950 }
    ],
    colors: ["Titanium Black", "Titanium Violet", "Titanium Yellow"],
    description: "Sell your Samsung Galaxy S26 Ultra in UAE for instant cash.",
    shortDescription: "2026 Galaxy S26 Ultra with Snapdragon 8 Gen 5.",
    images: { frontView: DEFAULT_IMAGE_MAP.s26ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 3500,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 850 }
    ],
    colors: ["Titanium Gray", "Titanium Black"],
    description: "Sell Galaxy S25 Ultra for top price in Dubai.",
    shortDescription: "Galaxy S25 Ultra flagship smartphone.",
    images: { frontView: DEFAULT_IMAGE_MAP.s25ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Samsung Galaxy Z Fold 7",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 4400,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1000 }
    ],
    colors: ["Crafted Black", "Navy", "Silver Shadow"],
    description: "Sell pre-owned Samsung Galaxy Z Fold 7 for doorstep cash payout.",
    shortDescription: "Ultra slim Z Fold 7 foldable phone.",
    images: { frontView: DEFAULT_IMAGE_MAP.zfold7 },
    isPopular: true,
    isLivePrice: true
  },

  // ULTRA LUXURY FOLDABLES & CAMERAS
  {
    name: "Huawei Mate XT Ultimate (Tri-Fold)",
    brandSlug: "huawei",
    category: "smartphones",
    basePrice: 7200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 800 },
      { size: "1TB", priceBoost: 1600 }
    ],
    colors: ["Ruihong Red", "Dark Black"],
    description: "Sell your Huawei Mate XT Tri-Fold for highest cash offer in Dubai & Abu Dhabi.",
    shortDescription: "World's first triple-folding luxury smartphone.",
    images: { frontView: DEFAULT_IMAGE_MAP.huaweimatext },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Honor Magic V3",
    brandSlug: "honor",
    category: "smartphones",
    basePrice: 3800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1000 }
    ],
    colors: ["Redwood Brown", "Velvet Black", "Green"],
    description: "Sell Honor Magic V3 thin foldable phone in Dubai.",
    shortDescription: "World's thinnest dual-screen foldable phone.",
    images: { frontView: DEFAULT_IMAGE_MAP.honormagicv3 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Xiaomi 15 Ultra",
    brandSlug: "xiaomi",
    category: "smartphones",
    basePrice: 2900,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 850 }
    ],
    colors: ["Black Vegan Leather", "White Ceramic"],
    description: "Trade in Xiaomi 15 Ultra Leica camera phone for instant cash.",
    shortDescription: "Quad-camera Leica 200MP ultra smartphone.",
    images: { frontView: DEFAULT_IMAGE_MAP.xiaomi15ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Vivo X200 Pro",
    brandSlug: "vivo",
    category: "smartphones",
    basePrice: 2750,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 750 }
    ],
    colors: ["Titanium Gray", "Ocean Blue"],
    description: "Sell Vivo X200 Pro Zeiss camera phone in UAE.",
    shortDescription: "Zeiss APO telephoto camera monster.",
    images: { frontView: DEFAULT_IMAGE_MAP.vivox200pro },
    isPopular: false,
    isLivePrice: true
  },

  // MACBOOKS & WORKSTATIONS
  {
    name: "MacBook Pro 16\" M5 Max (2026)",
    brandSlug: "apple",
    category: "laptops",
    basePrice: 8500,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 1000 },
      { size: "4TB", priceBoost: 2500 }
    ],
    colors: ["Space Black", "Silver"],
    description: "Sell your MacBook Pro 16 M5 Max workstation in Dubai.",
    shortDescription: "Ultimate M5 Max Apple Silicon workstation.",
    images: { frontView: DEFAULT_IMAGE_MAP.macbookm5max },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "MacStudio M4 Ultra",
    brandSlug: "apple",
    category: "laptops",
    basePrice: 9200,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 1200 },
      { size: "4TB", priceBoost: 2800 }
    ],
    colors: ["Silver"],
    description: "Sell Mac Studio M4 Ultra desktop workstation in UAE.",
    shortDescription: "M4 Ultra Mac Studio high performance desktop.",
    images: { frontView: DEFAULT_IMAGE_MAP.macstudiom4 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "MSI Titan 18 HX",
    brandSlug: "msi",
    category: "laptops",
    basePrice: 8200,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 900 },
      { size: "4TB", priceBoost: 2200 }
    ],
    colors: ["Core Black"],
    description: "Sell your MSI Titan 18 HX 4K gaming laptop in Dubai.",
    shortDescription: "18-inch 4K Mini-LED RTX 4090/5090 gaming workstation.",
    images: { frontView: DEFAULT_IMAGE_MAP.msititan },
    isPopular: true,
    isLivePrice: true
  },

  // SPATIAL & SMARTWATCHES
  {
    name: "Apple Vision Pro",
    brandSlug: "apple",
    category: "smartwatches",
    basePrice: 7800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 600 },
      { size: "1TB", priceBoost: 1200 }
    ],
    colors: ["Solo Knit / Dual Loop"],
    description: "Sell your Apple Vision Pro spatial computer headset in Dubai for instant cash.",
    shortDescription: "Apple Spatial Computing VR/AR Headset.",
    images: { frontView: DEFAULT_IMAGE_MAP.visionpro },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Garmin Fenix 8 (51mm AMOLED Sapphire)",
    brandSlug: "garmin",
    category: "smartwatches",
    basePrice: 2200,
    storages: [
      { size: "Standard 32GB", priceBoost: 0 }
    ],
    colors: ["DLC Titanium / Orange", "Black Titanium"],
    description: "Sell Garmin Fenix 8 multi-sport GPS watch in UAE.",
    shortDescription: "Diver-rated 51mm AMOLED Sapphire GPS watch.",
    images: { frontView: DEFAULT_IMAGE_MAP.garminfenix8 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Garmin Marq Gen 2 Commander",
    brandSlug: "garmin",
    category: "smartwatches",
    basePrice: 3600,
    storages: [
      { size: "Titanium 32GB", priceBoost: 0 }
    ],
    colors: ["Grade-5 Titanium"],
    description: "Trade in luxury Garmin Marq Gen 2 watch in Dubai.",
    shortDescription: "Grade-5 Titanium luxury GPS watch.",
    images: { frontView: DEFAULT_IMAGE_MAP.garminmarq },
    isPopular: false,
    isLivePrice: true
  },
  {
    name: "Huawei Watch Ultimate (18K Gold Edition)",
    brandSlug: "huawei",
    category: "smartwatches",
    basePrice: 6500,
    storages: [
      { size: "Standard", priceBoost: 0 }
    ],
    colors: ["18K Solid Gold / Ceramic Black"],
    description: "Sell 18K Gold Huawei Watch Ultimate in Dubai.",
    shortDescription: "Luxury 18K solid gold inlay smartwatch.",
    images: { frontView: DEFAULT_IMAGE_MAP.huaweiwatchgold },
    isPopular: true,
    isLivePrice: true
  },

  // GAMING HANDHELDS & AUDIO
  {
    name: "Nintendo Switch 2",
    brandSlug: "nintendo",
    category: "games",
    basePrice: 1150,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 250 }
    ],
    colors: ["Neon Red/Blue", "Matte Black"],
    description: "Sell Nintendo Switch 2 next-gen console in UAE.",
    shortDescription: "Next-gen Nvidia DLSS handheld console.",
    images: { frontView: DEFAULT_IMAGE_MAP.switch2 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Apple AirPods Max 2 (USB-C)",
    brandSlug: "apple",
    category: "smartwatches",
    basePrice: 1250,
    storages: [
      { size: "Standard", priceBoost: 0 }
    ],
    colors: ["Midnight", "Starlight", "Blue", "Purple", "Orange"],
    description: "Sell AirPods Max 2 USB-C in Dubai for instant cash.",
    shortDescription: "USB-C Lossless ANC headphones.",
    images: { frontView: DEFAULT_IMAGE_MAP.airpodsmax2 },
    isPopular: true,
    isLivePrice: true
  }
];

async function seedHighValueModels() {
  try {
    console.log("⚡ Connecting to MongoDB for SellPhoneCash...");
    await connectToMongoDB();

    const initialProductCount = await Product.countDocuments();
    const initialBrandCount = await Brand.countDocuments();
    console.log(`📊 Initial State: ${initialBrandCount} Brands, ${initialProductCount} Products.`);

    // 1. CREATE AUTOMATIC BACKUP BEFORE SEEDING
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    
    const productsBackup = await Product.find({}).lean();
    const brandsBackup = await Brand.find({}).lean();
    const categoriesBackup = await Category.find({}).lean();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `pre-seed-2026-high-value-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify({ products: productsBackup, brands: brandsBackup, categories: categoriesBackup }, null, 2));
    console.log(`🔒 Automatic Pre-seed Backup created at: ${backupPath}`);

    // 2. UPSERT NEW BRANDS
    console.log("\n🏷️ Processing Brands...");
    const brandMap = {};
    const existingBrands = await Brand.find({});
    existingBrands.forEach(b => { brandMap[b.slug] = b._id; });

    for (const bData of NEW_BRANDS) {
      const brand = await Brand.findOneAndUpdate(
        { slug: bData.slug },
        { name: bData.name, slug: bData.slug, logo: bData.logo },
        { upsert: true, new: true }
      );
      brandMap[bData.slug] = brand._id;
      console.log(`  ✅ Brand Upserted: ${bData.name} (${bData.slug})`);
    }

    // 3. UPSERT NEW HIGH VALUE PRODUCTS
    console.log("\n📦 Processing 2026 High-Value Products...");
    let addedCount = 0;
    let updatedCount = 0;

    for (const pData of NEW_HIGH_VALUE_PRODUCTS) {
      const brandId = brandMap[pData.brandSlug];
      if (!brandId) {
        console.warn(`⚠️ Warning: Brand slug ${pData.brandSlug} not found. Skipping ${pData.name}.`);
        continue;
      }

      const productPayload = {
        name: pData.name,
        brand: brandId,
        category: pData.category,
        basePrice: pData.basePrice,
        storages: pData.storages,
        colors: pData.colors,
        description: pData.description,
        shortDescription: pData.shortDescription,
        images: pData.images,
        isPopular: pData.isPopular,
        isLivePrice: pData.isLivePrice
      };

      const existing = await Product.findOne({ name: pData.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, productPayload);
        updatedCount++;
        console.log(`  🔄 Product Updated: ${pData.name}`);
      } else {
        await Product.create(productPayload);
        addedCount++;
        console.log(`  ✨ Product Created: ${pData.name}`);
      }
    }

    const finalProductCount = await Product.countDocuments();
    const finalBrandCount = await Brand.countDocuments();

    console.log("\n==========================================");
    console.log(`🎉 SEEDING COMPLETE FOR SELLPHONECASH!`);
    console.log(`📈 Brands: ${initialBrandCount} -> ${finalBrandCount}`);
    console.log(`📦 Products: ${initialProductCount} -> ${finalProductCount} (Added: ${addedCount}, Updated: ${updatedCount})`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedHighValueModels();
