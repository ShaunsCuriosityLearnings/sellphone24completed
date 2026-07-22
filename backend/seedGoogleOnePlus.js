import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

const googleOnePlusProducts = [
  // ------------------- GOOGLE PHONES -------------------
  {
    name: "Google Pixel 9 Pro XL (2024)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 2900,
    colors: ["Obsidian", "Porcelain", "Hazel", "Rose Quartz"],
    storages: [
      { size: "128GB / 16GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 300 },
      { size: "512GB / 16GB RAM", priceBoost: 700 },
      { size: "1TB / 16GB RAM", priceBoost: 1200 }
    ],
    shortDescription: "Sell your used Google Pixel 9 Pro XL for instant cash in Dubai & UAE. Features Google Tensor G4 processor, 16GB RAM, built-in Gemini Advanced AI, 6.8-inch Super Actua OLED display, and pro-grade 50MP triple camera with 30x Super Res Zoom."
  },
  {
    name: "Google Pixel 9 Pro (2024)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 2500,
    colors: ["Obsidian", "Porcelain", "Hazel", "Rose Quartz"],
    storages: [
      { size: "128GB / 16GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 250 },
      { size: "512GB / 16GB RAM", priceBoost: 600 }
    ],
    shortDescription: "Get the best trade-in value for Google Pixel 9 Pro in UAE. Powered by Google Tensor G4 with 16GB RAM, compact 6.3-inch Super Actua LTPO display, 50MP triple camera system, and 7 years of Pixel OS & security updates."
  },
  {
    name: "Google Pixel 9 (2024)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 1900,
    colors: ["Obsidian", "Porcelain", "Wintergreen", "Peony"],
    storages: [
      { size: "128GB / 12GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 250 }
    ],
    shortDescription: "Instant cash for Google Pixel 9 in Dubai. Packed with Tensor G4 chip, 12GB RAM, 6.3-inch 120Hz Actua OLED screen, upgraded 50MP main + 48MP ultrawide cameras, and advanced Gemini AI photography features."
  },
  {
    name: "Google Pixel 9 Pro Fold (2024)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 3800,
    colors: ["Obsidian", "Porcelain"],
    storages: [
      { size: "256GB / 16GB RAM", priceBoost: 0 },
      { size: "512GB / 16GB RAM", priceBoost: 500 }
    ],
    shortDescription: "Sell your Google Pixel 9 Pro Fold online in UAE. Ultra-thin foldable smartphone featuring a huge 8.0-inch Super Actua Flex inner display, 6.3-inch cover screen, Tensor G4, 16GB RAM, and IPX8 water resistance."
  },
  {
    name: "Google Pixel 8a (2024)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 1200,
    colors: ["Obsidian", "Porcelain", "Bay", "Aloe"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 180 }
    ],
    shortDescription: "Trade in Google Pixel 8a for cash in Abu Dhabi & Dubai. Powered by Google Tensor G3, 6.1-inch 120Hz Actua OLED screen, 64MP dual rear cameras with Best Take & Magic Eraser, and 7 years of security support."
  },
  {
    name: "Google Pixel 8 Pro (2023)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 1800,
    colors: ["Obsidian", "Porcelain", "Bay", "Mint"],
    storages: [
      { size: "128GB / 12GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 200 },
      { size: "512GB / 12GB RAM", priceBoost: 450 }
    ],
    shortDescription: "Sell Google Pixel 8 Pro with free doorstep pickup in Dubai. Features Tensor G3 chip, 6.7-inch Super Actua LTPO display, built-in Temperature Sensor, Audio Magic Eraser, and pro-level 50MP camera with 5x optical zoom."
  },
  {
    name: "Google Pixel 8 (2023)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 1350,
    colors: ["Obsidian", "Hazel", "Rose", "Mint"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 180 }
    ],
    shortDescription: "Get instant buyback quote for Google Pixel 8 in UAE. Compact flagship with Google Tensor G3, 6.2-inch 120Hz Actua display, 50MP camera with Macro Focus, and 4575mAh fast-charging battery."
  },
  {
    name: "Google Pixel Fold (2023)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 2400,
    colors: ["Obsidian", "Porcelain"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 12GB RAM", priceBoost: 400 }
    ],
    shortDescription: "Sell your Google Pixel Fold in Dubai. Google's first foldable phone with a 7.6-inch OLED inner display, Tensor G2 processor, 12GB RAM, multi-tasking Split Screen, and triple rear camera setup."
  },
  {
    name: "Google Pixel 7a (2023)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 850,
    colors: ["Charcoal", "Snow", "Sea", "Coral"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 }
    ],
    shortDescription: "Resale price valuation for Google Pixel 7a in UAE. Equipped with Tensor G2, 6.1-inch 90Hz OLED display, wireless charging support, 64MP dual camera system, and Titan M2 security coprocessor."
  },
  {
    name: "Google Pixel 7 Pro (2022)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 1200,
    colors: ["Obsidian", "Snow", "Hazel"],
    storages: [
      { size: "128GB / 12GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 150 },
      { size: "512GB / 12GB RAM", priceBoost: 350 }
    ],
    shortDescription: "Sell used Google Pixel 7 Pro for top cash in Dubai. Premium phone with 6.7-inch QHD+ 120Hz LTPO display, Tensor G2 chip, 50MP triple camera with 30x Super Res Zoom, and Macro Focus."
  },
  {
    name: "Google Pixel 7 (2022)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 950,
    colors: ["Obsidian", "Snow", "Lemongrass"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 150 }
    ],
    shortDescription: "Instant sell offer for Google Pixel 7 in UAE. Sleek matte aluminum enclosure, 6.3-inch 90Hz OLED screen, Tensor G2 chip, Real Tone photography, and Cinematic Blur video mode."
  },
  {
    name: "Google Pixel 6 Pro (2021)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 800,
    colors: ["Stormy Black", "Cloudy White", "Sorta Sunny"],
    storages: [
      { size: "128GB / 12GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 120 }
    ],
    shortDescription: "Sell Google Pixel 6 Pro in UAE. Powered by the first-gen Google Tensor chip, 6.7-inch QHD+ 120Hz LTPO display, 50MP main + 48MP telephoto camera, and 5003mAh long-lasting battery."
  },
  {
    name: "Google Pixel 6 (2021)",
    brandName: "Google",
    brandSlug: "google",
    category: "mobile",
    basePrice: 650,
    colors: ["Stormy Black", "Sorta Seafoam", "Kinda Coral"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 100 }
    ],
    shortDescription: "Trade in Google Pixel 6 for instant cash in Dubai. Features custom Google Tensor SoC, dual-tone Gorilla Glass Victus design, 6.4-inch 90Hz OLED screen, and Magic Eraser."
  },

  // ------------------- ONEPLUS PHONES -------------------
  {
    name: "OnePlus 12 (2024)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 2300,
    colors: ["Silky Black", "Flowy Emerald"],
    storages: [
      { size: "256GB / 12GB RAM", priceBoost: 0 },
      { size: "512GB / 16GB RAM", priceBoost: 350 },
      { size: "1TB / 16GB RAM", priceBoost: 700 }
    ],
    shortDescription: "Sell your used OnePlus 12 for instant cash in Dubai & UAE. Powered by Qualcomm Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera for Mobile, 6.82-inch 2K 120Hz ProXDR display, 5400mAh battery, and 100W SUPERVOOC charging."
  },
  {
    name: "OnePlus 12R (2024)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1450,
    colors: ["Cool Blue", "Iron Gray"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 250 }
    ],
    shortDescription: "Get best trade-in value for OnePlus 12R in UAE. Performance flagship featuring Snapdragon 8 Gen 2, 6.78-inch 1.5K 120Hz LTPO 4.0 AMOLED screen, massive 5500mAh battery, and 100W fast charging."
  },
  {
    name: "OnePlus Open (2023)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 3600,
    colors: ["Voyager Black", "Emerald Dusk"],
    storages: [
      { size: "512GB / 16GB RAM", priceBoost: 0 }
    ],
    shortDescription: "Sell your OnePlus Open foldable smartphone for top cash in Dubai. Features Snapdragon 8 Gen 2, 7.82-inch 2K 120Hz Flexi-fluid inner display, Hasselblad Triple Main Camera system, and lightweight titanium alloy hinge."
  },
  {
    name: "OnePlus 11 5G (2023)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1500,
    colors: ["Titan Black", "Eternal Green"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 250 }
    ],
    shortDescription: "Instant sell quote for OnePlus 11 5G in UAE. Powered by Snapdragon 8 Gen 2, 3rd Gen Hasselblad Camera, 6.7-inch 2K 120Hz Super Fluid AMOLED, Cryo-velocity cooling, and 100W SUPERVOOC."
  },
  {
    name: "OnePlus 11R 5G (2023)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1100,
    colors: ["Sonic Black", "Galactic Silver"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 200 }
    ],
    shortDescription: "Sell OnePlus 11R 5G for cash in Abu Dhabi & Dubai. Packed with Snapdragon 8+ Gen 1 processor, 6.74-inch 120Hz Super Fluid AMOLED, 50MP Sony IMX890 main camera with OIS, and 100W fast charging."
  },
  {
    name: "OnePlus 10 Pro 5G (2022)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1150,
    colors: ["Volcanic Black", "Emerald Forest"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 200 }
    ],
    shortDescription: "Trade in OnePlus 10 Pro 5G for instant cash in Dubai. Premium smartphone with Snapdragon 8 Gen 1, 2nd Gen Hasselblad Camera, 6.7-inch QHD+ 120Hz Fluid AMOLED LTPO, and 80W SUPERVOOC."
  },
  {
    name: "OnePlus 10T 5G (2022)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1000,
    colors: ["Moonstone Black", "Jade Green"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 200 }
    ],
    shortDescription: "Sell OnePlus 10T 5G in UAE with free pickup. Extreme speed flagship with Snapdragon 8+ Gen 1, 150W SUPERVOOC charging (1-100% in 19 mins), 6.7-inch 120Hz Fluid AMOLED display, and 3D Cooling System."
  },
  {
    name: "OnePlus 9 Pro 5G (2021)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 850,
    colors: ["Morning Mist", "Stellar Black", "Pine Green"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 150 }
    ],
    shortDescription: "Resale cash value for OnePlus 9 Pro 5G in Dubai. Features Hasselblad Camera for Mobile, Snapdragon 888 5G, 6.7-inch QHD+ 120Hz Smart LTPO Fluid Display 2.0, and 65T Warp Charge."
  },
  {
    name: "OnePlus 9 5G (2021)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 700,
    colors: ["Astral Black", "Winter Mist", "Arctic Sky"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 120 }
    ],
    shortDescription: "Sell OnePlus 9 5G online in UAE. Co-developed with Hasselblad, powered by Snapdragon 888, 6.55-inch 120Hz Fluid AMOLED screen, 50MP Ultra-Wide lens, and 65W Warp Charge."
  },
  {
    name: "OnePlus Nord 4 (2024)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 1150,
    colors: ["Obsidian Midnight", "Oasis Green", "Mercurial Silver"],
    storages: [
      { size: "256GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 12GB RAM", priceBoost: 120 },
      { size: "512GB / 16GB RAM", priceBoost: 280 }
    ],
    shortDescription: "Sell OnePlus Nord 4 in Dubai. Sleek metal unibody design, Snapdragon 7+ Gen 3, 6.74-inch 1.5K 120Hz AMOLED, 5500mAh battery with 100W SUPERVOOC, and AI Productivity Tools."
  },
  {
    name: "OnePlus Nord CE 4 (2024)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 800,
    colors: ["Dark Chrome", "Celadon Marble"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 8GB RAM", priceBoost: 120 }
    ],
    shortDescription: "Instant buyback valuation for OnePlus Nord CE 4 in UAE. Equipped with Snapdragon 7 Gen 3, 6.7-inch 120Hz FHD+ AMOLED display, 50MP Sony LYT-600 main camera with OIS, and 100W SUPERVOOC."
  },
  {
    name: "OnePlus Nord 3 5G (2023)",
    brandName: "OnePlus",
    brandSlug: "oneplus",
    category: "mobile",
    basePrice: 750,
    colors: ["Misty Green", "Tempest Gray"],
    storages: [
      { size: "128GB / 8GB RAM", priceBoost: 0 },
      { size: "256GB / 16GB RAM", priceBoost: 150 }
    ],
    shortDescription: "Trade in OnePlus Nord 3 5G for instant cash in UAE. Features MediaTek Dimensity 9000 flagship chip, 6.74-inch 120Hz Super Fluid AMOLED, 50MP Sony IMX890 camera, and 80W SUPERVOOC."
  }
];

async function seedGoogleOnePlus() {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB database.");

    // 1. Ensure "Mobile" category exists
    let mobileCategory = await Category.findOne({ slug: "mobile" });
    if (!mobileCategory) {
      mobileCategory = await Category.findOne({ slug: "smartphones" });
    }
    if (!mobileCategory) {
      mobileCategory = await Category.create({
        name: "Mobile",
        slug: "mobile",
        description: "Sell your used mobile phones for top value instantly in UAE.",
        image: "/products/apple logo.jpg"
      });
      console.log("📁 Created 'Mobile' category.");
    }

    // Map brand names to documents
    const brandDocs = {};

    for (const bInfo of [
      { name: "Google", slug: "google" },
      { name: "OnePlus", slug: "oneplus" }
    ]) {
      let brandDoc = await Brand.findOne({ name: { $regex: new RegExp(`^${bInfo.name}$`, "i") } });
      if (!brandDoc) {
        brandDoc = await Brand.create({
          name: bInfo.name,
          slug: bInfo.slug,
          logo: "/products/apple logo.jpg",
          categories: [mobileCategory._id]
        });
        console.log(`🏷️ Created '${bInfo.name}' brand.`);
      } else {
        if (!brandDoc.categories.includes(mobileCategory._id)) {
          brandDoc.categories.push(mobileCategory._id);
          await brandDoc.save();
          console.log(`🔗 Linked '${mobileCategory.name}' category to ${bInfo.name} brand.`);
        }
      }
      brandDocs[bInfo.slug] = brandDoc;
    }

    // 3. Upsert (safe add/update) all Google & OnePlus products
    let count = 0;
    for (const item of googleOnePlusProducts) {
      const bDoc = brandDocs[item.brandSlug];
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: bDoc._id,
            category: item.category,
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

    console.log(`✅ Successfully seeded/updated ${count} Google Pixel and OnePlus models under their respective brands!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedGoogleOnePlus();
