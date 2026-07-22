import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

const appleWatches = [
  {
    name: "Apple Watch Ultra 2 (2023)",
    category: "smartwatches",
    basePrice: 2200,
    colors: ["Titanium (Natural)"],
    storages: [
      { size: "49mm Titanium Case (GPS + Cellular)", priceBoost: 0 }
    ],
    shortDescription: "49mm Titanium case, 3000 nits display, S9 SiP, Double Tap gesture, Precision Dual-Frequency GPS, 36hr battery."
  },
  {
    name: "Apple Watch Ultra (2022)",
    category: "smartwatches",
    basePrice: 1700,
    colors: ["Titanium (Natural)"],
    storages: [
      { size: "49mm Titanium Case (GPS + Cellular)", priceBoost: 0 }
    ],
    shortDescription: "49mm Titanium case, 2000 nits display, Action Button, 100m water resistance, 36hr battery."
  },
  {
    name: "Apple Watch Series 9 (2023)",
    category: "smartwatches",
    basePrice: 1100,
    colors: ["Midnight", "Starlight", "Silver", "Pink", "(PRODUCT)RED", "Graphite", "Gold"],
    storages: [
      { size: "41mm Aluminum (GPS)", priceBoost: 0 },
      { size: "41mm Aluminum (GPS + Cellular)", priceBoost: 100 },
      { size: "45mm Aluminum (GPS)", priceBoost: 120 },
      { size: "45mm Aluminum (GPS + Cellular)", priceBoost: 220 },
      { size: "41mm Stainless Steel (Cellular)", priceBoost: 350 },
      { size: "45mm Stainless Steel (Cellular)", priceBoost: 450 }
    ],
    shortDescription: "S9 SiP, Double Tap gesture, 2000 nits Always-On Retina display, Blood Oxygen & ECG apps."
  },
  {
    name: "Apple Watch Series 8 (2022)",
    category: "smartwatches",
    basePrice: 850,
    colors: ["Midnight", "Starlight", "Silver", "(PRODUCT)RED", "Graphite", "Gold"],
    storages: [
      { size: "41mm Aluminum (GPS)", priceBoost: 0 },
      { size: "41mm Aluminum (GPS + Cellular)", priceBoost: 80 },
      { size: "45mm Aluminum (GPS)", priceBoost: 100 },
      { size: "45mm Aluminum (GPS + Cellular)", priceBoost: 180 },
      { size: "41mm Stainless Steel (Cellular)", priceBoost: 280 },
      { size: "45mm Stainless Steel (Cellular)", priceBoost: 380 }
    ],
    shortDescription: "Temperature sensing for cycle tracking, Crash Detection, Always-On Retina display, IP6X dust resistant."
  },
  {
    name: "Apple Watch Series 7 (2021)",
    category: "smartwatches",
    basePrice: 650,
    colors: ["Midnight", "Starlight", "Green", "Blue", "(PRODUCT)RED", "Graphite", "Gold"],
    storages: [
      { size: "41mm Aluminum (GPS)", priceBoost: 0 },
      { size: "41mm Aluminum (GPS + Cellular)", priceBoost: 60 },
      { size: "45mm Aluminum (GPS)", priceBoost: 80 },
      { size: "45mm Aluminum (GPS + Cellular)", priceBoost: 150 },
      { size: "45mm Stainless Steel (Cellular)", priceBoost: 280 }
    ],
    shortDescription: "Nearly 20% larger screen area than Series 6, faster charging, crack-resistant front crystal."
  },
  {
    name: "Apple Watch Series 6 (2020)",
    category: "smartwatches",
    basePrice: 500,
    colors: ["Space Gray", "Silver", "Gold", "Blue", "(PRODUCT)RED", "Graphite"],
    storages: [
      { size: "40mm Aluminum (GPS)", priceBoost: 0 },
      { size: "40mm Aluminum (GPS + Cellular)", priceBoost: 50 },
      { size: "44mm Aluminum (GPS)", priceBoost: 70 },
      { size: "44mm Aluminum (GPS + Cellular)", priceBoost: 120 }
    ],
    shortDescription: "Blood Oxygen sensor & app, S6 System in Package, Always-On Altimeter."
  },
  {
    name: "Apple Watch Series 5 (2019)",
    category: "smartwatches",
    basePrice: 380,
    colors: ["Space Gray", "Silver", "Gold"],
    storages: [
      { size: "40mm Aluminum (GPS)", priceBoost: 0 },
      { size: "40mm Aluminum (GPS + Cellular)", priceBoost: 40 },
      { size: "44mm Aluminum (GPS)", priceBoost: 60 },
      { size: "44mm Aluminum (GPS + Cellular)", priceBoost: 100 }
    ],
    shortDescription: "First Always-On Retina display, Built-in Compass, International Emergency Calling."
  },
  {
    name: "Apple Watch SE 2nd Gen (2022)",
    category: "smartwatches",
    basePrice: 550,
    colors: ["Midnight", "Starlight", "Silver"],
    storages: [
      { size: "40mm Aluminum (GPS)", priceBoost: 0 },
      { size: "40mm Aluminum (GPS + Cellular)", priceBoost: 60 },
      { size: "44mm Aluminum (GPS)", priceBoost: 80 },
      { size: "44mm Aluminum (GPS + Cellular)", priceBoost: 140 }
    ],
    shortDescription: "S8 SiP (same chip as Series 8), Crash Detection, redesign nylon composite back case."
  },
  {
    name: "Apple Watch SE 1st Gen (2020)",
    category: "smartwatches",
    basePrice: 350,
    colors: ["Space Gray", "Silver", "Gold"],
    storages: [
      { size: "40mm Aluminum (GPS)", priceBoost: 0 },
      { size: "40mm Aluminum (GPS + Cellular)", priceBoost: 40 },
      { size: "44mm Aluminum (GPS)", priceBoost: 60 },
      { size: "44mm Aluminum (GPS + Cellular)", priceBoost: 90 }
    ],
    shortDescription: "Essential features at a great value, S5 dual-core processor, Retina display, Fall Detection."
  }
];

async function seedAppleWatches() {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB database.");

    // 1. Ensure "Smartwatches" category exists
    let watchCategory = await Category.findOne({ slug: "smartwatches" });
    if (!watchCategory) {
      watchCategory = await Category.create({
        name: "Smartwatches",
        slug: "smartwatches",
        description: "Turn your old smartwatches into cash. We accept Apple Watch, Galaxy Watch, and others.",
        image: "/products/apple logo.jpg"
      });
      console.log("📁 Created 'Smartwatches' category.");
    }

    // 2. Ensure "Apple" brand exists and is linked to "Smartwatches" category
    let appleBrand = await Brand.findOne({ name: { $regex: /^apple$/i } });
    if (!appleBrand) {
      appleBrand = await Brand.create({
        name: "Apple",
        slug: "apple",
        logo: "/products/apple logo.jpg",
        categories: [watchCategory._id]
      });
      console.log("🏷️ Created 'Apple' brand.");
    } else {
      if (!appleBrand.categories.includes(watchCategory._id)) {
        appleBrand.categories.push(watchCategory._id);
        await appleBrand.save();
        console.log("🔗 Linked 'Smartwatches' category to Apple brand.");
      }
    }

    // 3. Upsert (safe add/update) all Apple Watch models
    let count = 0;
    for (const item of appleWatches) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: appleBrand._id,
            category: "smartwatches",
            basePrice: item.basePrice,
            storages: item.storages,
            colors: item.colors,
            shortDescription: item.shortDescription,
            images: {
              frontView: "/products/apple logo.jpg"
            }
          }
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`✅ Successfully seeded/updated ${count} Apple Watch models under Apple brand and Smartwatches category!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedAppleWatches();
