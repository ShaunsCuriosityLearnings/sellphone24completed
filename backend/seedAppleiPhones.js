import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

export const appleiPhones = [
  // --- iPhone 16 Series ---
  {
    name: "iPhone 16 Pro Max",
    category: "smartphones",
    basePrice: 3900,
    colors: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.9-inch Super Retina XDR, A18 Pro chip, Camera Control button, and 4K 120 fps Dolby Vision.",
    description: "The ultimate flagship iPhone featuring 6.9-inch Super Retina XDR display, grade-5 titanium design, breakthrough A18 Pro chip, revolutionary Camera Control button, 48MP Fusion camera system, and 4K 120 fps Dolby Vision recording.",
    images: { frontView: "/products/iphone 17 pro max 💖.jpg", sideView: "/products/iphone (1).jpg", backView: "/products/iphone (2).jpg" }
  },
  {
    name: "iPhone 16 Pro",
    category: "smartphones",
    basePrice: 3300,
    colors: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.3-inch Super Retina XDR, A18 Pro chip, Camera Control button, and 5x Telephoto camera.",
    description: "Pro performance in a 6.3-inch titanium design featuring A18 Pro chip, Camera Control button, 48MP Fusion camera, 5x Telephoto optical zoom, and studio-quality microphones.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 16 Plus",
    category: "smartphones",
    basePrice: 2800,
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.7-inch Super Retina XDR, A18 chip, Action button, and Camera Control.",
    description: "Big-screen power with 6.7-inch Super Retina XDR display, superfast A18 chip, customizable Action button, Camera Control, 48MP Fusion camera, and extended battery life.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone 16",
    category: "smartphones",
    basePrice: 2500,
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.1-inch Super Retina XDR, A18 chip, Camera Control, and 48MP Fusion camera.",
    description: "Versatile 6.1-inch iPhone powered by the A18 chip, featuring Camera Control, Action button, 48MP Fusion camera with 2x Telephoto, and vibrant color-infused back glass.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone 15 Series ---
  {
    name: "iPhone 15 Pro Max",
    category: "smartphones",
    basePrice: 3200,
    colors: ["Black Titanium", "Natural Titanium", "White Titanium", "Blue Titanium"],
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.7-inch Super Retina XDR, A17 Pro chip, Action button, 5x optical zoom camera.",
    description: "Forged in titanium with A17 Pro chip, customizable Action button, 5x Telephoto camera, USB-C 3 speed support, and lightweight durable design.",
    images: { frontView: "/products/iphone 17 pro max 💖.jpg", sideView: "/products/iphone (1).jpg", backView: "/products/iphone (2).jpg" }
  },
  {
    name: "iPhone 15 Pro",
    category: "smartphones",
    basePrice: 2800,
    colors: ["Black Titanium", "Natural Titanium", "White Titanium", "Blue Titanium"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.1-inch Titanium design, A17 Pro chip, customizable Action button, triple lens system.",
    description: "Strong and lightweight titanium design with A17 Pro chip, Action button, versatile 48MP camera system, and ProMotion 120Hz display.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 15 Plus",
    category: "smartphones",
    basePrice: 2200,
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.7-inch display with Dynamic Island, 48MP Main camera, and USB-C.",
    description: "Large 6.7-inch display featuring Dynamic Island, 48MP Main camera with 2x Telephoto, color-infused glass back, aluminum design, and USB-C connector.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone 15",
    category: "smartphones",
    basePrice: 2000,
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "Dynamic Island, 48MP Main camera, A16 Bionic chip, and USB-C integration.",
    description: "Featuring Dynamic Island, 48MP Main camera, color-infused back glass, aluminum enclosure, USB-C, and fast A16 Bionic processor.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone 14 Series ---
  {
    name: "iPhone 14 Pro Max",
    category: "smartphones",
    basePrice: 2380,
    colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.7-inch Always-On Super Retina XDR, Dynamic Island, 48MP camera, A16 Bionic.",
    description: "Pro flagship featuring Dynamic Island, 48MP camera with Quad-Pixel sensor, Always-On Super Retina XDR display with ProMotion, and Crash Detection.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 14 Pro",
    category: "smartphones",
    basePrice: 2000,
    colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.1-inch Always-On display, Dynamic Island, 48MP main camera, A16 Bionic chip.",
    description: "Pro features in a 6.1-inch size: Dynamic Island, 48MP main camera with Photonic Engine, A16 Bionic chip, and surgical-grade stainless steel frame.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 14 Plus",
    category: "smartphones",
    basePrice: 1650,
    colors: ["Midnight", "Purple", "Starlight", "(PRODUCT)RED", "Blue", "Yellow"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.7-inch Super Retina XDR display, dual-camera system, long battery life, A15 Bionic.",
    description: "Expansive 6.7-inch display with superfast A15 Bionic chip, dual camera system with Photonic Engine, Action mode video stabilization, and Crash Detection.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone 14",
    category: "smartphones",
    basePrice: 1460,
    colors: ["Midnight", "Purple", "Starlight", "(PRODUCT)RED", "Blue", "Yellow"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.1-inch Super Retina XDR display, Photonic Engine, Emergency SOS via satellite, A15 Bionic.",
    description: "Sleek 6.1-inch smartphone powered by A15 Bionic with 5-core GPU, Photonic Engine for low-light photos, Cinematic mode, and Crash Detection.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone SE Series ---
  {
    name: "iPhone SE (3rd Gen)",
    category: "smartphones",
    basePrice: 550,
    colors: ["Midnight", "Starlight", "(PRODUCT)RED"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "Compact 4.7-inch Retina HD display, A15 Bionic chip, Touch ID home button, 5G connectivity.",
    description: "Classic compact design with lightning-fast A15 Bionic performance, 5G speed, 12MP camera with Smart HDR 4, and familiar Touch ID home button.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" }
  },
  {
    name: "iPhone SE (2nd Gen)",
    category: "smartphones",
    basePrice: 300,
    colors: ["Black", "White", "(PRODUCT)RED"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "4.7-inch Retina HD display, A13 Bionic chip, Touch ID home button, glass and aluminum design.",
    description: "Compact 4.7-inch glass and aluminum design with A13 Bionic chip, Portrait mode camera, 4K video recording, and classic Touch ID.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" }
  },

  // --- iPhone 13 Series ---
  {
    name: "iPhone 13 Pro Max",
    category: "smartphones",
    basePrice: 1650,
    colors: ["Sierra Blue", "Silver", "Gold", "Graphite", "Alpine Green"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.7-inch Super Retina XDR with ProMotion, A15 Bionic, Pro camera system with 3x optical zoom.",
    description: "Pro flagship with 120Hz ProMotion Super Retina XDR display, triple 12MP camera system with macro capability, Cinematic mode, and all-day battery life.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 13 Pro",
    category: "smartphones",
    basePrice: 1400,
    colors: ["Sierra Blue", "Silver", "Gold", "Graphite", "Alpine Green"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 700 }
    ],
    shortDescription: "6.1-inch ProMotion 120Hz display, A15 Bionic chip, ProRes video recording, macro photography.",
    description: "6.1-inch ProMotion display with up to 120Hz adaptive refresh rates, A15 Bionic chip, Macro photography, and ProRes video recording.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 13",
    category: "smartphones",
    basePrice: 1100,
    colors: ["Pink", "Blue", "Midnight", "Starlight", "(PRODUCT)RED", "Green"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.1-inch Super Retina XDR display, diagonal dual-camera layout with Sensor-shift OIS, A15 Bionic.",
    description: "Advanced dual-camera system with sensor-shift optical image stabilization, brighter Super Retina XDR OLED display, A15 Bionic chip, and long battery life.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone 13 Mini",
    category: "smartphones",
    basePrice: 915,
    colors: ["Pink", "Blue", "Midnight", "Starlight", "(PRODUCT)RED", "Green"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "Compact 5.4-inch Super Retina XDR display, A15 Bionic chip, sensor-shift dual camera.",
    description: "Ultra-compact 5.4-inch size featuring the full power of A15 Bionic, Sensor-shift optical image stabilization, Ceramic Shield front cover, and 5G speed.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone 12 Series ---
  {
    name: "iPhone 12 Pro Max",
    category: "smartphones",
    basePrice: 1170,
    colors: ["Silver", "Graphite", "Gold", "Pacific Blue"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.7-inch Super Retina XDR OLED display, LiDAR scanner, 5x optical zoom range, A14 Bionic.",
    description: "Large 6.7-inch Super Retina XDR display with flat-edge design, A14 Bionic processor, LiDAR Scanner for Night mode portraits, and Pro camera system.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 12 Pro",
    category: "smartphones",
    basePrice: 1020,
    colors: ["Silver", "Graphite", "Gold", "Pacific Blue"],
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.1-inch OLED display, surgical stainless steel frame, LiDAR Scanner, triple 12MP cameras.",
    description: "Flat-edge design with surgical-grade stainless steel, A14 Bionic, Dolby Vision HDR recording, LiDAR Scanner, and MagSafe accessory compatibility.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 12",
    category: "smartphones",
    basePrice: 730,
    colors: ["Black", "White", "(PRODUCT)RED", "Green", "Blue", "Purple"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "6.1-inch Super Retina XDR OLED, A14 Bionic chip, MagSafe wireless charging, dual 12MP camera.",
    description: "Featuring a 6.1-inch Super Retina XDR OLED screen, A14 Bionic chip, Ceramic Shield front, Night mode on all cameras, and MagSafe wireless charging.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone 12 Mini",
    category: "smartphones",
    basePrice: 580,
    colors: ["Black", "White", "(PRODUCT)RED", "Green", "Blue", "Purple"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "Small 5.4-inch Super Retina XDR OLED, A14 Bionic chip, 5G capabilities, dual camera.",
    description: "Smallest, thinnest 5G phone in the world with 5.4-inch OLED display, A14 Bionic chip, MagSafe support, and Night mode dual camera.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone 11 Series ---
  {
    name: "iPhone 11 Pro Max",
    category: "smartphones",
    basePrice: 800,
    colors: ["Space Gray", "Silver", "Midnight Green", "Gold"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.5-inch Super Retina XDR OLED, triple 12MP Ultra Wide/Wide/Telephoto cameras, A13 Bionic.",
    description: "Pro flagship with 6.5-inch Super Retina XDR display, triple-camera system with Night mode and Deep Fusion, textured matte glass back, and long battery life.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 11 Pro",
    category: "smartphones",
    basePrice: 660,
    colors: ["Space Gray", "Silver", "Midnight Green", "Gold"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "5.8-inch Super Retina XDR OLED, triple camera system, A13 Bionic chip, textured matte glass.",
    description: "Compact 5.8-inch Pro model featuring Super Retina XDR display, A13 Bionic processor, triple 12MP cameras with 4K video recording, and water resistance.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone 11",
    category: "smartphones",
    basePrice: 480,
    colors: ["Black", "Green", "Yellow", "Purple", "White", "(PRODUCT)RED"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "6.1-inch Liquid Retina HD display, dual 12MP Ultra Wide and Wide cameras, A13 Bionic.",
    description: "All-day battery life, 6.1-inch Liquid Retina display, A13 Bionic chip, dual camera system with Night mode and 4K video recording up to 60 fps.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },

  // --- iPhone X Series ---
  {
    name: "iPhone XR",
    category: "smartphones",
    basePrice: 370,
    colors: ["Black", "White", "Blue", "Yellow", "Coral", "(PRODUCT)RED"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "128GB", priceBoost: 100 },
      { size: "256GB", priceBoost: 200 }
    ],
    shortDescription: "6.1-inch Liquid Retina HD LCD, A12 Bionic chip, Face ID, single 12MP Wide camera.",
    description: "Vibrant 6.1-inch Liquid Retina display with aerospace-grade aluminum band, A12 Bionic chip, Face ID, and advanced single-camera Portrait mode.",
    images: { frontView: "/products/iphone (6).jpg", sideView: "/products/iphone (7).jpg", backView: "/products/iphone (8).jpg" }
  },
  {
    name: "iPhone XS Max",
    category: "smartphones",
    basePrice: 510,
    colors: ["Gold", "Silver", "Space Gray"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "6.5-inch Super Retina OLED display, A12 Bionic, dual 12MP cameras with Smart HDR.",
    description: "Massive 6.5-inch Super Retina OLED screen, surgical-grade stainless steel frame, A12 Bionic chip with Neural Engine, dual camera with Depth Control.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  },
  {
    name: "iPhone XS",
    category: "smartphones",
    basePrice: 440,
    colors: ["Gold", "Silver", "Space Gray"],
    storages: [
      { size: "64GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 150 },
      { size: "512GB", priceBoost: 350 }
    ],
    shortDescription: "5.8-inch Super Retina OLED display, A12 Bionic chip, Face ID, stainless steel design.",
    description: "5.8-inch Super Retina OLED display with HDR, A12 Bionic processor, Face ID, dual 12MP cameras with portrait lighting, and stainless steel band.",
    images: { frontView: "/products/iphone (3).jpg", sideView: "/products/iphone (4).jpg", backView: "/products/iphone (5).jpg" }
  }
];

export async function seedAppleiPhones() {
  try {
    await connectDB();

    // 1. Ensure "smartphones" category exists
    let cat = await Category.findOne({ slug: "smartphones" });
    if (!cat) {
      cat = await Category.findOne({ slug: "mobile" });
    }
    if (!cat) {
      cat = await Category.create({
        name: "Smartphones",
        slug: "smartphones",
        description: "Sell your used mobile phone for instant cash. We buy Apple, Samsung, Google, OnePlus and more.",
        image: "/products/iphone 17 pro max 💖.jpg"
      });
    }

    // 2. Ensure "Apple" brand exists and is linked to category
    let appleBrand = await Brand.findOne({ name: { $regex: /^apple$/i } });
    if (!appleBrand) {
      appleBrand = await Brand.create({
        name: "Apple",
        slug: "apple",
        logo: "🍎",
        categories: [cat._id]
      });
      console.log("🏷️ Created 'Apple' brand.");
    } else {
      if (!appleBrand.categories.includes(cat._id)) {
        appleBrand.categories.push(cat._id);
        await appleBrand.save();
      }
    }

    // 3. Upsert (safe add/update) all 28 Apple iPhone models
    let count = 0;
    for (const item of appleiPhones) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: appleBrand._id,
            category: "smartphones",
            basePrice: item.basePrice,
            storages: item.storages,
            colors: item.colors,
            description: item.description,
            shortDescription: item.shortDescription,
            images: item.images
          }
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`✅ Successfully seeded/updated ${count} Apple iPhone models in database!`);
  } catch (error) {
    console.error(`❌ Seeding Apple iPhones failed: ${error.message}`);
    throw error;
  }
}

if (process.argv[1] && process.argv[1].includes("seedAppleiPhones.js")) {
  seedAppleiPhones()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
