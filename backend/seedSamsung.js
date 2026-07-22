import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

const samsungProducts = [
  // 1. Galaxy S-Series (Flagships)
  {
    name: "Samsung Galaxy S24 Ultra (2024)",
    category: "mobile",
    basePrice: 3400,
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 350 },
      { size: "1TB / 12GB RAM", priceBoost: 750 }
    ],
    shortDescription: "Snapdragon 8 Gen 3 for Galaxy, 200MP camera, 6.8\" QHD+ Dynamic AMOLED 2X, S Pen."
  },
  {
    name: "Samsung Galaxy S24+ (2024)",
    category: "mobile",
    basePrice: 2500,
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 300 }
    ],
    shortDescription: "6.7\" QHD+ Dynamic AMOLED 2X display, 4900mAh battery, Galaxy AI features."
  },
  {
    name: "Samsung Galaxy S24 (2024)",
    category: "mobile",
    basePrice: 1900,
    colors: ["Onyx Black", "Marble Gray", "Cobalt Violet", "Amber Yellow"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 200 },
      { size: "512GB / 8GB RAM", priceBoost: 400 }
    ],
    shortDescription: "6.2\" FHD+ Dynamic AMOLED 2X display, 4000mAh battery, Galaxy AI features."
  },
  {
    name: "Samsung Galaxy S23 Ultra (2023)",
    category: "mobile",
    basePrice: 2500,
    colors: ["Phantom Black", "Green", "Lavender", "Cream"],
    storages: [
      { size: "256GB / 8GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 300 },
      { size: "1TB / 12GB RAM", priceBoost: 650 }
    ],
    shortDescription: "Snapdragon 8 Gen 2 for Galaxy, 200MP camera, 100x Space Zoom, S Pen."
  },
  {
    name: "Samsung Galaxy S23+ (2023)",
    category: "mobile",
    basePrice: 1800,
    colors: ["Phantom Black", "Cream", "Green", "Lavender"],
    storages: [
      { size: "256GB / 8GB RAM", priceBoost: 0 },
      { size: "512GB / 8GB RAM", priceBoost: 250 }
    ],
    shortDescription: "6.6\" Dynamic AMOLED 2X, 4700mAh battery, 50MP triple camera system."
  },
  {
    name: "Samsung Galaxy S23 (2023)",
    category: "mobile",
    basePrice: 1400,
    colors: ["Phantom Black", "Cream", "Green", "Lavender"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 150 },
      { size: "512GB / 8GB RAM", priceBoost: 300 }
    ],
    shortDescription: "Compact 6.1\" Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor."
  },
  {
    name: "Samsung Galaxy S22 Ultra (2022)",
    category: "mobile",
    basePrice: 1750,
    colors: ["Phantom Black", "Phantom White", "Burgundy", "Green"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 200 },
      { size: "512GB / 12GB RAM", priceBoost: 400 },
      { size: "1TB / 12GB RAM", priceBoost: 700 }
    ],
    shortDescription: "Built-in S Pen, 108MP main camera, 6.8\" 120Hz AMOLED display."
  },
  {
    name: "Samsung Galaxy S22+ (2022)",
    category: "mobile",
    basePrice: 1250,
    colors: ["Phantom Black", "Phantom White", "Green", "Pink Gold"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 150 }
    ],
    shortDescription: "6.6\" Dynamic AMOLED 2X, Armor Aluminum frame, 4500mAh battery."
  },
  {
    name: "Samsung Galaxy S22 (2022)",
    category: "mobile",
    basePrice: 950,
    colors: ["Phantom Black", "Phantom White", "Green", "Pink Gold"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 120 }
    ],
    shortDescription: "6.1\" Dynamic AMOLED 2X, Nightography 50MP camera."
  },
  {
    name: "Samsung Galaxy S21 FE 5G (2022)",
    category: "mobile",
    basePrice: 750,
    colors: ["Olive", "Lavender", "White", "Graphite"],
    storages: [
      { size: "128GB / 6GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 100 }
    ],
    shortDescription: "Fan Edition flagship with 6.4\" 120Hz AMOLED, 32MP selfie camera."
  },

  // 2. Galaxy Foldables (Z Series)
  {
    name: "Samsung Galaxy Z Fold 6 (2024)",
    category: "mobile",
    basePrice: 4200,
    colors: ["Silver Shadow", "Pink", "Navy"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 450 },
      { size: "1TB / 12GB RAM", priceBoost: 900 }
    ],
    shortDescription: "Dual AMOLED 120Hz displays, 7.6\" Main display, Snapdragon 8 Gen 3, S Pen support."
  },
  {
    name: "Samsung Galaxy Z Flip 6 (2024)",
    category: "mobile",
    basePrice: 2700,
    colors: ["Silver Shadow", "Yellow", "Blue", "Mint"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 350 }
    ],
    shortDescription: "3.4\" Flex Window cover screen, 50MP camera, FlexCam AI zoom."
  },
  {
    name: "Samsung Galaxy Z Fold 5 (2023)",
    category: "mobile",
    basePrice: 3100,
    colors: ["Icy Blue", "Phantom Black", "Cream"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 350 },
      { size: "1TB / 12GB RAM", priceBoost: 750 }
    ],
    shortDescription: "Zero-gap Flex Hinge, 7.6\" Dynamic AMOLED 2X, Snapdragon 8 Gen 2."
  },
  {
    name: "Samsung Galaxy Z Flip 5 (2023)",
    category: "mobile",
    basePrice: 1800,
    colors: ["Mint", "Graphite", "Cream", "Lavender"],
    storages: [
      { size: "256GB / 8GB RAM", priceBoost: 0 },
      { size: "512GB / 8GB RAM", priceBoost: 250 }
    ],
    shortDescription: "Large Flex Window, hands-free Flex Mode selfies, IPX8 water resistance."
  },
  {
    name: "Samsung Galaxy Z Fold 4 (2022)",
    category: "mobile",
    basePrice: 2200,
    colors: ["Graygreen", "Phantom Black", "Beige"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 250 },
      { size: "1TB / 12GB RAM", priceBoost: 550 }
    ],
    shortDescription: "50MP camera system, Under Display Camera, Taskbar multi-tasking."
  },

  // 3. Galaxy A-Series
  {
    name: "Samsung Galaxy A55 5G (2024)",
    category: "mobile",
    basePrice: 950,
    colors: ["Awesome Iceblue", "Awesome Lilac", "Awesome Lemon", "Awesome Navy"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 120 },
      { size: "256GB / 12GB RAM", priceBoost: 220 }
    ],
    shortDescription: "Metal frame, 50MP OIS camera, 6.6\" Super AMOLED 120Hz display."
  },
  {
    name: "Samsung Galaxy A35 5G (2024)",
    category: "mobile",
    basePrice: 720,
    colors: ["Awesome Iceblue", "Awesome Lilac", "Awesome Lemon", "Awesome Navy"],
    storages: [
      { size: "128GB / 6GB RAM", priceBoost: 0 },
      { size: "128GB / 8GB RAM", priceBoost: 80 },
      { size: "256GB / 8GB RAM", priceBoost: 150 }
    ],
    shortDescription: "Glass back, 50MP main camera, 5000mAh battery, IP67 rating."
  },
  {
    name: "Samsung Galaxy A54 5G (2023)",
    category: "mobile",
    basePrice: 750,
    colors: ["Awesome Lime", "Awesome Graphite", "Awesome Violet", "Awesome White"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 100 }
    ],
    shortDescription: "Premium glass back design, Nightography camera, 6.4\" 120Hz Super AMOLED."
  },

  // 4. Galaxy Tablets
  {
    name: "Samsung Galaxy Tab S9 Ultra (2023)",
    category: "tablets",
    basePrice: 2900,
    colors: ["Beige", "Graphite"],
    storages: [
      { size: "256GB / 12GB RAM (Wi-Fi)", priceBoost: 0 },
      { size: "512GB / 12GB RAM (5G)", priceBoost: 400 },
      { size: "1TB / 16GB RAM (5G)", priceBoost: 900 }
    ],
    shortDescription: "Massive 14.6\" Dynamic AMOLED 2X, S Pen included, IP68 water resistance."
  },
  {
    name: "Samsung Galaxy Tab S9+ (2023)",
    category: "tablets",
    basePrice: 2300,
    colors: ["Beige", "Graphite"],
    storages: [
      { size: "256GB / 12GB RAM (Wi-Fi)", priceBoost: 0 },
      { size: "512GB / 12GB RAM (5G)", priceBoost: 350 }
    ],
    shortDescription: "12.4\" Dynamic AMOLED 2X, Snapdragon 8 Gen 2 for Galaxy."
  },
  {
    name: "Samsung Galaxy Tab S9 (2023)",
    category: "tablets",
    basePrice: 1800,
    colors: ["Beige", "Graphite"],
    storages: [
      { size: "128GB / 8GB RAM (Wi-Fi)", priceBoost: 0 },
      { size: "256GB / 12GB RAM (5G)", priceBoost: 300 }
    ],
    shortDescription: "11.0\" Dynamic AMOLED 2X, 8400mAh battery, S Pen in box."
  },
  {
    name: "Samsung Galaxy Tab S9 FE / FE+ (2023)",
    category: "tablets",
    basePrice: 1200,
    colors: ["Mint", "Silver", "Gray", "Lavender"],
    storages: [
      { size: "128GB / 6GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 200 }
    ],
    shortDescription: "10.9\" / 12.4\" display, S Pen inbox, IP68 water resistance."
  },

  // 5. Galaxy Smartwatches
  {
    name: "Samsung Galaxy Watch 6 Classic (2023)",
    category: "smartwatches",
    basePrice: 650,
    colors: ["Black", "Silver"],
    storages: [
      { size: "43mm (Bluetooth)", priceBoost: 0 },
      { size: "43mm (LTE)", priceBoost: 100 },
      { size: "47mm (Bluetooth)", priceBoost: 120 },
      { size: "47mm (LTE)", priceBoost: 220 }
    ],
    shortDescription: "Rotating physical bezel, Sapphire Crystal glass, Advanced Sleep Tracking."
  },
  {
    name: "Samsung Galaxy Watch 6 (2023)",
    category: "smartwatches",
    basePrice: 500,
    colors: ["Graphite", "Silver", "Gold"],
    storages: [
      { size: "40mm (Bluetooth)", priceBoost: 0 },
      { size: "40mm (LTE)", priceBoost: 80 },
      { size: "44mm (Bluetooth)", priceBoost: 100 },
      { size: "44mm (LTE)", priceBoost: 180 }
    ],
    shortDescription: "20% larger display, slimmer bezel, One-Click band system."
  },
  {
    name: "Samsung Galaxy Watch 5 Pro (2022)",
    category: "smartwatches",
    basePrice: 550,
    colors: ["Black Titanium", "Gray Titanium"],
    storages: [
      { size: "45mm (Bluetooth)", priceBoost: 0 },
      { size: "45mm (LTE)", priceBoost: 120 }
    ],
    shortDescription: "Titanium case, D-Buckle Sport Band, 590mAh battery, Route GPX navigation."
  },

  // 6. Galaxy Laptops
  {
    name: "Samsung Galaxy Book 4 Ultra (2024)",
    category: "laptops",
    basePrice: 5800,
    colors: ["Moonstone Gray"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 4050", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4070", priceBoost: 1200 }
    ],
    shortDescription: "Intel Core Ultra 7/9 processor, NVIDIA RTX 40-series GPU, 16\" 3K AMOLED Touch."
  },
  {
    name: "Samsung Galaxy Book 4 Pro 16\" / 14\" (2024)",
    category: "laptops",
    basePrice: 4100,
    colors: ["Moonstone Gray", "Platinum Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 450 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 900 }
    ],
    shortDescription: "Intel Core Ultra 7 processor, Dynamic AMOLED 2X Touchscreen, Vision Booster."
  }
];

async function seedSamsung() {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB database.");

    // 1. Ensure categories exist
    const catSlugs = ["mobile", "tablets", "smartwatches", "laptops"];
    const categoryMap = {};

    for (const slug of catSlugs) {
      let cat = await Category.findOne({ slug });
      if (!cat) {
        cat = await Category.create({
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          description: `Sell your used ${slug} for top value instantly in UAE.`,
          image: "/products/samsung logo.jpg"
        });
      }
      categoryMap[slug] = cat;
    }

    // 2. Ensure "Samsung" brand exists and linked to categories
    let samsungBrand = await Brand.findOne({ name: { $regex: /^samsung$/i } });
    const categoryIds = Object.values(categoryMap).map(c => c._id);

    if (!samsungBrand) {
      samsungBrand = await Brand.create({
        name: "Samsung",
        slug: "samsung",
        logo: "/products/samsung logo.jpg",
        categories: categoryIds
      });
      console.log("🏷️ Created 'Samsung' brand.");
    } else {
      categoryIds.forEach(id => {
        if (!samsungBrand.categories.includes(id)) {
          samsungBrand.categories.push(id);
        }
      });
      await samsungBrand.save();
      console.log("🔗 Linked all device categories to Samsung brand.");
    }

    // 3. Upsert (safe add/update) all Samsung products
    let count = 0;
    for (const item of samsungProducts) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: samsungBrand._id,
            category: item.category,
            basePrice: item.basePrice,
            storages: item.storages,
            colors: item.colors,
            shortDescription: item.shortDescription,
            images: {
              frontView: "/products/samsung logo.jpg"
            }
          }
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`✅ Successfully seeded/updated ${count} Samsung products in live database!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedSamsung();
