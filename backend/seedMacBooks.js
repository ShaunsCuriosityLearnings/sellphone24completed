import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

const macbookModels = [
  {
    name: 'MacBook Air 13" M3 (2024)',
    basePrice: 3200,
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 300 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 550 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 850 },
      { size: "24GB RAM / 1TB SSD", priceBoost: 1200 }
    ],
    shortDescription: "Apple M3 chip with 8-core CPU, 8-core or 10-core GPU, 13.6\" Liquid Retina display."
  },
  {
    name: 'MacBook Air 15" M3 (2024)',
    basePrice: 3800,
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 600 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 900 },
      { size: "24GB RAM / 2TB SSD", priceBoost: 1600 }
    ],
    shortDescription: "Apple M3 chip, 15.3\" Liquid Retina display, 10-core GPU, 6-speaker sound system."
  },
  {
    name: 'MacBook Air 13" M2 (2022)',
    basePrice: 2400,
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 250 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 450 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 750 },
      { size: "24GB RAM / 1TB SSD", priceBoost: 1050 }
    ],
    shortDescription: "Apple M2 chip with 8-core CPU, 8/10-core GPU, 13.6\" Liquid Retina display, MagSafe 3."
  },
  {
    name: 'MacBook Air 15" M2 (2023)',
    basePrice: 2900,
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 500 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 800 },
      { size: "24GB RAM / 1TB SSD", priceBoost: 1100 }
    ],
    shortDescription: "Apple M2 chip, 15.3\" Liquid Retina display, 10-core GPU, fanless design."
  },
  {
    name: 'MacBook Air 13" M1 (2020)',
    basePrice: 1600,
    colors: ["Space Gray", "Silver", "Gold"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 200 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 350 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 600 }
    ],
    shortDescription: "Apple M1 chip with 8-core CPU, 7/8-core GPU, 13.3\" Retina display, fanless design."
  },
  {
    name: 'MacBook Pro 14" M3 (2023)',
    basePrice: 4200,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 400 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 750 },
      { size: "24GB RAM / 1TB SSD", priceBoost: 1100 }
    ],
    shortDescription: "Apple M3 chip with 8-core CPU, 10-core GPU, 14.2\" Liquid Retina XDR 120Hz display."
  },
  {
    name: 'MacBook Pro 14" M3 Pro / Max (2023)',
    basePrice: 5200,
    colors: ["Space Black", "Silver"],
    storages: [
      { size: "18GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "18GB RAM / 1TB SSD", priceBoost: 500 },
      { size: "36GB RAM / 1TB SSD", priceBoost: 1100 },
      { size: "48GB RAM / 1TB SSD", priceBoost: 1600 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 2400 },
      { size: "128GB RAM / 4TB SSD", priceBoost: 4200 }
    ],
    shortDescription: "Apple M3 Pro/Max chip, 14.2\" Liquid Retina XDR display, HDMI, SDXC, MagSafe 3."
  },
  {
    name: 'MacBook Pro 16" M3 Pro / Max (2023)',
    basePrice: 6400,
    colors: ["Space Black", "Silver"],
    storages: [
      { size: "18GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "36GB RAM / 512GB SSD", priceBoost: 700 },
      { size: "36GB RAM / 1TB SSD", priceBoost: 1100 },
      { size: "48GB RAM / 1TB SSD", priceBoost: 1700 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 2600 },
      { size: "128GB RAM / 4TB SSD", priceBoost: 4500 }
    ],
    shortDescription: "Apple M3 Pro/Max chip, 16.2\" Liquid Retina XDR display, up to 40-core GPU."
  },
  {
    name: 'MacBook Pro 14" M2 Pro / Max (2023)',
    basePrice: 4100,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 450 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 950 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 2000 },
      { size: "96GB RAM / 4TB SSD", priceBoost: 3600 }
    ],
    shortDescription: "Apple M2 Pro/Max chip, 14.2\" Liquid Retina XDR display, 10/12-core CPU, up to 38-core GPU."
  },
  {
    name: 'MacBook Pro 16" M2 Pro / Max (2023)',
    basePrice: 5100,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "32GB RAM / 512GB SSD", priceBoost: 600 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 1000 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 2200 },
      { size: "96GB RAM / 4TB SSD", priceBoost: 3800 }
    ],
    shortDescription: "Apple M2 Pro/Max chip, 16.2\" Liquid Retina XDR display, HDMI 2.1, Wi-Fi 6E."
  },
  {
    name: 'MacBook Pro 14" M1 Pro / Max (2021)',
    basePrice: 3200,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 400 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 800 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 1700 }
    ],
    shortDescription: "Apple M1 Pro/Max chip, 14.2\" ProMotion 120Hz Liquid Retina XDR display, MagSafe 3."
  },
  {
    name: 'MacBook Pro 16" M1 Pro / Max (2021)',
    basePrice: 4000,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "32GB RAM / 512GB SSD", priceBoost: 500 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 850 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 1900 }
    ],
    shortDescription: "Apple M1 Pro/Max chip, 16.2\" ProMotion Liquid Retina XDR display, 10-core CPU."
  },
  {
    name: 'MacBook Pro 13" M2 (2022)',
    basePrice: 2200,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 250 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 450 },
      { size: "24GB RAM / 1TB SSD", priceBoost: 900 }
    ],
    shortDescription: "Apple M2 chip with Touch Bar, 13.3\" Retina display, active cooling fan."
  },
  {
    name: 'MacBook Pro 13" M1 (2020)',
    basePrice: 1700,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 200 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 350 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 600 }
    ],
    shortDescription: "Apple M1 chip with Touch Bar, 13.3\" Retina display, active cooling fan."
  },
  {
    name: 'MacBook Pro 16" Intel i7 / i9 (2019)',
    basePrice: 1400,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 200 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 450 },
      { size: "64GB RAM / 2TB SSD", priceBoost: 800 }
    ],
    shortDescription: "Intel Core i7/i9 processor, AMD Radeon Pro GPU, 16.0\" Retina display."
  },
  {
    name: 'MacBook Air 13" Intel i3 / i5 / i7 (2020)',
    basePrice: 1100,
    colors: ["Space Gray", "Silver", "Gold"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "8GB RAM / 512GB SSD", priceBoost: 150 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 300 }
    ],
    shortDescription: "10th Gen Intel Core i3/i5/i7 processor, Magic Keyboard, 13.3\" Retina display."
  },
  {
    name: 'MacBook Pro 13" Intel i5 / i7 (2020 - 4 Ports)',
    basePrice: 1250,
    colors: ["Space Gray", "Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 250 },
      { size: "32GB RAM / 2TB SSD", priceBoost: 600 }
    ],
    shortDescription: "10th Gen Intel Core i5/i7 processor, 4 Thunderbolt 3 ports, Touch Bar, Magic Keyboard."
  }
];

async function seedMacBooks() {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB database.");

    // 1. Ensure "Laptops" category exists
    let laptopCategory = await Category.findOne({ slug: "laptops" });
    if (!laptopCategory) {
      laptopCategory = await Category.create({
        name: "Laptops",
        slug: "laptops",
        description: "Sell your used MacBooks and Windows laptops for top value instantly.",
        image: "/products/apple logo.jpg"
      });
      console.log("📁 Created 'Laptops' category.");
    }

    // 2. Ensure "Apple" brand exists and is linked to "Laptops"
    let appleBrand = await Brand.findOne({ name: { $regex: /^apple$/i } });
    if (!appleBrand) {
      appleBrand = await Brand.create({
        name: "Apple",
        slug: "apple",
        logo: "/products/apple logo.jpg",
        categories: [laptopCategory._id]
      });
      console.log("🏷️ Created 'Apple' brand.");
    } else {
      // Auto-link category to brand
      if (!appleBrand.categories.includes(laptopCategory._id)) {
        appleBrand.categories.push(laptopCategory._id);
        await appleBrand.save();
        console.log("🔗 Linked 'Laptops' category to Apple brand.");
      }
    }

    // 3. Upsert (safe add/update) all 17 MacBook models
    let count = 0;
    for (const item of macbookModels) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: appleBrand._id,
            category: "laptops",
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

    console.log(`✅ Successfully seeded/updated ${count} Apple MacBook models in live database!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedMacBooks();
