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
    description: "Sell your used mobile phone for instant cash. We buy Apple, Samsung, Google, and more.",
    image: "/products/iphone 17 pro max 💖.jpg",
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Get the best price for your used iPads and Android tablets. Free pickup in UAE.",
    image: "/products/samsung (13).jpg",
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    description: "Turn your old smartwatches into cash. We accept Apple Watch, Galaxy Watch, and others.",
    image: "/products/apple logo.jpg",
  },
];

const brandsData = [
  {
    name: "Apple",
    slug: "apple",
    logo: "🍎",
    categoriesSlugs: ["smartphones", "tablets", "smartwatches"],
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "📱",
    categoriesSlugs: ["smartphones", "tablets", "smartwatches"],
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
];

const storagePriceBoosts = {
  "16GB": 0,
  "64GB": 0,
  "128GB": 0,
  "256GB": 150,
  "512GB": 350,
  "1TB": 700,
};

const productsData = [
  {
    name: "iPhone 15 Pro Max",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 3200,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Black Titanium", "Natural Titanium", "White Titanium", "Blue Titanium"],
    description: "The ultimate iPhone featuring a strong and lightweight titanium design, new Action button, powerful camera upgrades, and A17 Pro chip for next-level mobile gaming performance.",
    shortDescription: "Sleek titanium iPhone with A17 Pro chip & triple-lens camera.",
    images: {
      frontView: "/products/iphone 17 pro max 💖.jpg",
      sideView: "/products/iphone (1).jpg",
      backView: "/products/iphone (2).jpg",
    },
  },
  {
    name: "iPhone 15 Pro",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 2800,
    storages: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Black Titanium", "Natural Titanium", "White Titanium"],
    description: "Pro performance in a compact 6.1-inch titanium body. Equipped with the A17 Pro chip, customizable Action button, and a versatile 48MP camera system.",
    shortDescription: "Titanium design, A17 Pro chip, customizable Action button.",
    images: {
      frontView: "/products/iphone (3).jpg",
      sideView: "/products/iphone (4).jpg",
      backView: "/products/iphone (5).jpg",
    },
  },
  {
    name: "iPhone 15",
    brandName: "Apple",
    category: "smartphones",
    basePrice: 2000,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    description: "Featuring the Dynamic Island, 48MP main camera, and USB-C, all in a durable color-infused glass and aluminum design.",
    shortDescription: "Dynamic Island, 48MP Main camera, and USB-C integration.",
    images: {
      frontView: "/products/iphone (6).jpg",
      sideView: "/products/iphone (7).jpg",
      backView: "/products/iphone (8).jpg",
    },
  },
  {
    name: "Galaxy S24 Ultra",
    brandName: "Samsung",
    category: "smartphones",
    basePrice: 3000,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
    description: "Samsung's premier AI smartphone. Built with a titanium frame, embedded S Pen, quad camera system with 200MP sensor, and smart Galaxy AI features like Live Translate.",
    shortDescription: "Premium titanium smartphone with 200MP camera & Galaxy AI.",
    images: {
      frontView: "/products/samsung (1).jpg",
      sideView: "/products/samsung (2).jpg",
      backView: "/products/samsung (3).jpg",
    },
  },
  {
    name: "Galaxy S24+",
    brandName: "Samsung",
    category: "smartphones",
    basePrice: 2200,
    storages: ["256GB", "512GB"],
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet"],
    description: "A gorgeous, large-screen flagship with intelligent Galaxy AI tools, a brilliant QHD+ display, and a highly efficient battery system for all-day usage.",
    shortDescription: "Beautiful QHD+ display, Galaxy AI tools, and sleek design.",
    images: {
      frontView: "/products/samsung (4).jpg",
      sideView: "/products/samsung (5).jpg",
      backView: "/products/samsung (6).jpg",
    },
  },
  {
    name: "Pixel 8 Pro",
    brandName: "Google",
    category: "smartphones",
    basePrice: 1900,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Obsidian", "Porcelain", "Bay Blue"],
    description: "The all-pro phone engineered by Google. It has the Tensor G3 chip, advanced AI-based photo/video features (Magic Eraser, Best Take), and a thermometer sensor.",
    shortDescription: "Advanced Google AI, Tensor G3 chip, and best-in-class camera.",
    images: {
      frontView: "/products/logo of google.jpg",
      sideView: "/products/logo of google.jpg",
      backView: "/products/logo of google.jpg",
    },
  },
  {
    name: "OnePlus 12",
    brandName: "OnePlus",
    category: "smartphones",
    basePrice: 1800,
    storages: ["256GB", "512GB"],
    colors: ["Silky Black", "Flowy Emerald"],
    description: "Redefined flagship performance featuring the Snapdragon 8 Gen 3, a highly responsive 120Hz 2K display, and hyper-fast 100W SuperVOOC wired charging.",
    shortDescription: "Snapdragon 8 Gen 3, 100W super charging, fluid display.",
    images: {
      frontView: "/products/oneplus (1).jpg",
      sideView: "/products/oneplus (2).jpg",
      backView: "/products/oneplus (3).jpg",
    },
  },
  {
    name: "iPad Pro 12.9 M2",
    brandName: "Apple",
    category: "tablets",
    basePrice: 2600,
    storages: ["128GB", "256GB", "512GB", "1TB"],
    colors: ["Space Gray", "Silver"],
    description: "Astonishing performance and a breathtaking Liquid Retina XDR display. Powered by the groundbreaking M2 chip, suitable for designers, video editors, and power users.",
    shortDescription: "Ultra-fast iPad Pro featuring the Apple M2 chip & Liquid Retina XDR.",
    images: {
      frontView: "/products/iphone (9).jpg",
      sideView: "/products/iphone (9).jpg",
      backView: "/products/iphone (9).jpg",
    },
  },
  {
    name: "Galaxy Tab S9 Ultra",
    brandName: "Samsung",
    category: "tablets",
    basePrice: 2200,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Graphite", "Beige"],
    description: "Samsung's largest, most powerful Android tablet. It features a stunning 14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, and an included ultra-low latency S Pen.",
    shortDescription: "Massive 14.6-inch AMOLED tablet with S Pen & IP68 rating.",
    images: {
      frontView: "/products/samsung (13).jpg",
      sideView: "/products/samsung (13).jpg",
      backView: "/products/samsung (13).jpg",
    },
  },
  {
    name: "Apple Watch Series 9",
    brandName: "Apple",
    category: "watches",
    basePrice: 900,
    storages: ["64GB"],
    colors: ["Midnight", "Starlight", "Silver", "Red"],
    description: "Smarter, brighter, and faster. Features the S9 SiP chip, double tap gesture, on-device Siri, and temperature sensing for deep health insights.",
    shortDescription: "S9 SiP chip, innovative Double Tap gesture, advanced health tracking.",
    images: {
      frontView: "/products/apple logo.jpg",
      sideView: "/products/apple logo.jpg",
      backView: "/products/apple logo.jpg",
    },
  },
  {
    name: "Galaxy Watch 6 Classic",
    brandName: "Samsung",
    category: "watches",
    basePrice: 700,
    storages: ["16GB"],
    colors: ["Black", "Silver"],
    description: "The return of the iconic rotating bezel. Tracks sleep stages, body composition (BIA), heart rate, and workouts with a premium stainless steel chassis.",
    shortDescription: "Classic rotating bezel, comprehensive health tracking, stainless steel design.",
    images: {
      frontView: "/products/samsung logo.jpg",
      sideView: "/products/samsung logo.jpg",
      backView: "/products/samsung logo.jpg",
    },
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
    console.log(`✅ Seeded ${insertedProducts.length} products.`);

    const blogsData = [
      {
        title: "How to Safely Erase Your Phone Before Selling",
        slug: "safely-erase-phone-before-selling",
        desc: "A complete step-by-step guide to backing up your data, signing out of accounts (iCloud/Google), and doing a secure factory reset.",
        content: `<p class="mb-4">Selling your old phone is a great way to make some extra cash and reduce electronic waste. However, before you hand over your device, ensuring that your personal data is completely and securely erased is crucial. You don't want your photos, messages, bank details, or passwords falling into the wrong hands.</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Step 1: Backup Your Device</h2><p class="mb-4">Before wiping anything, make sure you have a complete backup of your device. For iPhone users, go to <strong>Settings &gt; [Your Name] &gt; iCloud &gt; iCloud Backup</strong> and tap <i>Back Up Now</i>. Android users can back up by going to <strong>Settings &gt; System &gt; Backup</strong>.</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Step 2: Sign Out of Accounts</h2><p class="mb-4">This is the most critical step. If you don't sign out, the next owner will be locked out of the device due to Activation Lock (iPhone) or Factory Reset Protection (Android).</p><ul class="list-disc pl-6 mb-4 space-y-2"><li><strong>Apple iOS:</strong> Go to Settings, tap your name at the top, scroll down, and tap <i>Sign Out</i>. You'll need to enter your Apple ID password to confirm.</li><li><strong>Android:</strong> Go to Settings &gt; Passwords &amp; Accounts (or Users &amp; Accounts), tap on your Google account, and select <i>Remove Account</i>.</li></ul><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Step 3: Unpair Accessories</h2><p class="mb-4">Make sure to unpair your Apple Watch, Galaxy Watch, Bluetooth headphones, and other smart accessories from the phone settings.</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Step 4: Perform a Factory Reset</h2><p class="mb-4">Once everything is backed up and accounts are signed out, you can perform the wipe:</p><ul class="list-disc pl-6 mb-4 space-y-2"><li><strong>iPhone:</strong> Go to Settings &gt; General &gt; Transfer or Reset iPhone &gt; <i>Erase All Content and Settings</i>.</li><li><strong>Android:</strong> Go to Settings &gt; System &gt; Reset options &gt; <i>Erase all data (factory reset)</i>.</li></ul><p class="mt-8 font-semibold text-emerald-700">Once your phone displays the initial "Hello" setup screen, it is safe to package it up and sell it to SellYourPhone24!</p>`,
        img: "/products/iphone (1).jpg",
        category: "Buying Guides",
        author: "Admin Tech Team",
        views: 1240,
        likes: 85,
      },
      {
        title: "E-Waste in the UAE: Why Recycling Your Tech Matters",
        slug: "e-waste-uae-recycling-tech-matters",
        desc: "Discover the growing electronic waste problem in Dubai and Abu Dhabi, and how selling your used electronics contributes to a circular economy.",
        content: `<p class="mb-4">The United Arab Emirates is home to some of the highest smartphone penetration rates in the world, with residents upgrading their devices every 18 to 24 months. While this keeps us at the cutting edge of technology, it creates a massive environmental challenge: electronic waste (e-waste).</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">The Scale of the Problem</h2><p class="mb-4">According to recent environmental studies, the average resident in the UAE generates around 17.2 kilograms of e-waste per year. When old phones, laptops, and tablets are thrown into regular landfills, toxic chemicals like lead, mercury, and cadmium leak into the soil and water supply, posing severe health hazards.</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">What is the Circular Economy?</h2><p class="mb-4">A circular economy aims to eliminate waste through the continual use, refurbishment, and recycling of resources. When you sell your phone to a platform like <strong>SellYourPhone24</strong>, we inspect the device and direct it to one of two paths:</p><ol class="list-decimal pl-6 mb-4 space-y-2"><li><strong>Refurbishment:</strong> If the device is in repairable condition, we fix it up, replace degraded batteries, and sell it to someone looking for a affordable pre-owned device, extending its life cycle.</li><li><strong>Responsible Material Recovery:</strong> If the device is broken beyond repair, we dismantle it in partnership with certified recycling plants to salvage precious metals like gold, copper, and cobalt.</li></ol><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">How You Benefit</h2><p class="mb-4">By selling your device, you get instant cash value out of an unused item sitting in your drawer, clear out clutter, and protect the UAE's beautiful natural ecosystems. It is a win-win for your wallet and the planet.</p>`,
        img: "/products/samsung (13).jpg",
        category: "Recycling Tips",
        author: "Eco Advisor",
        views: 890,
        likes: 42,
      },
      {
        title: "iPhone 15 Pro Max vs Galaxy S24 Ultra: Resale Value Analysis",
        slug: "iphone-15-pro-max-vs-galaxy-s24-ultra-resale-value",
        desc: "Thinking of upgrading? We analyze depreciation rates for Apple and Samsung flagships in the Dubai secondhand market to see which holds value best.",
        content: `<p class="mb-4">Choosing between Apple and Samsung flagships is often a matter of software preference. But if you are someone who upgrades every year, understanding the <strong>resale value</strong> of these devices in the secondhand market can save you thousands of dirhams.</p><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Depreciation Curve: Apple vs. Android</h2><p class="mb-4">It is a well-established trend in the smartphone industry that iPhones retain their value significantly better than Android devices, including Samsung's premium flagships. Let's look at the numbers for the iPhone 15 Pro Max and Galaxy S24 Ultra in the Dubai market.</p><table class="w-full text-left border-collapse border border-gray-200 my-6"><thead><tr class="bg-gray-100"><th class="p-3 border border-gray-200">Device</th><th class="p-3 border border-gray-200">Retail Price (Launch)</th><th class="p-3 border border-gray-200">Resale Value (After 6 Mos)</th><th class="p-3 border border-gray-200">Value Retained</th></tr></thead><tbody><tr><td class="p-3 border border-gray-200">iPhone 15 Pro Max (256GB)</td><td class="p-3 border border-gray-200">AED 5,099</td><td class="p-3 border border-gray-200">AED 3,800</td><td class="p-3 border border-gray-200 font-semibold text-emerald-600">~74%</td></tr><tr><td class="p-3 border border-gray-200">Galaxy S24 Ultra (256GB)</td><td class="p-3 border border-gray-200">AED 5,099</td><td class="p-3 border border-gray-200">AED 3,300</td><td class="p-3 border border-gray-200 font-semibold text-amber-600">~64%</td></tr></tbody></table><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Why Apple Holds Value Better</h2><p class="mb-4">Several factors contribute to the iPhone's superior value retention:</p><ul class="list-disc pl-6 mb-4 space-y-2"><li><strong>Software Longevity:</strong> Apple supports iPhones with iOS updates for 5-7 years, keeping older devices relevant for longer.</li><li><strong>Global Demand:</strong> There is a massive global market for refurbished iPhones, keeping secondhand prices stable.</li><li><strong>Fewer Launch Discounts:</strong> Samsung frequently runs trade-in promotions and early-bird discount campaigns, which pushes down the initial street price and secondary value faster.</li></ul><h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">Maximizing Your Trade-in Price</h2><p class="mb-4">Regardless of which device you own, keeping it in a protective case with a glass screen protector will prevent micro-scratches and keep it in "Flawless" or "Good" condition. This difference can easily mean an extra AED 300 to 500 when you sell it on SellYourPhone24.</p>`,
        img: "/products/samsung (1).jpg",
        category: "Price Analysis",
        author: "Market Analyst",
        views: 2450,
        likes: 198,
      }
    ];

    // 5. Seed Blogs
    await Blog.deleteMany();
    console.log("🧹 Blogs cleared");
    const insertedBlogs = await Blog.insertMany(blogsData);
    console.log(`✅ Seeded ${insertedBlogs.length} blog posts.`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
