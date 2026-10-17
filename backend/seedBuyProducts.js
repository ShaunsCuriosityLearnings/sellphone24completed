import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectToMongoDB, disconnectFromMongoDB } from "./config/db.js";
import BuyProduct from "./models/BuyProduct.js";

const initialBuyProducts = [
  {
    title: "iPhone 16 Pro Max",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    category: "smartphones",
    price: 3699,
    originalPrice: 4799,
    condition: "Pristine (Like New)",
    batteryHealth: "99% (Original OEM)",
    warranty: "12 Months Comprehensive Store Warranty",
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 450 },
      { size: "1TB", priceBoost: 850 },
    ],
    selectedStorage: "256GB",
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium", "White Titanium"],
    images: {
      frontView: "/products/iphone-pro-max.jpg",
      sideView: "/products/iphone (1).jpg",
      backView: "/products/iphone (2).jpg",
    },
    description: "Flawless condition Apple flagship with Camera Control, A18 Pro silicon, Grade 5 Titanium frame, and zero scratches or blemishes.",
    features: [
      "100% Original Display & TrueTone Active",
      "99% Battery Health Verified",
      "Factory Unlocked for All Global SIMs",
      "Includes Fast Charger & 1-Year Warranty",
    ],
    stock: 4,
    status: "published",
    slug: "buy-iphone-16-pro-max",
    seoMetadata: {
      metaTitle: "Buy Certified iPhone 16 Pro Max in Dubai | 12M Warranty - SellPhone24",
      metaDescription: "Buy pristine pre-owned Apple iPhone 16 Pro Max in UAE. 32-point inspection, free express delivery, 12 months store warranty.",
      keywords: ["buy iphone 16 pro max dubai", "refurbished iphone 16 pro max uae", "used iphone dubai"],
    },
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 38,
  },
  {
    title: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    category: "smartphones",
    price: 3249,
    originalPrice: 4499,
    condition: "Pristine (Like New)",
    batteryHealth: "98% (Optimal Cycle)",
    warranty: "12 Months Comprehensive Store Warranty",
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 750 },
    ],
    selectedStorage: "512GB",
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet"],
    images: {
      frontView: "/products/samsung (1).jpg",
      sideView: "/products/samsung (2).jpg",
      backView: "/products/samsung (3).jpg",
    },
    description: "Supercharged Galaxy AI flagship with built-in S-Pen, 200MP Quad Telephoto camera, and flat Titanium frame in pristine condition.",
    features: [
      "Galaxy AI Features Fully Enabled",
      "Embedded S-Pen Tested & Calibrated",
      "TRA / TDRA Approved for UAE Networks",
      "Includes SuperFast 45W Cable & Box",
    ],
    stock: 3,
    status: "published",
    slug: "buy-samsung-galaxy-s24-ultra",
    seoMetadata: {
      metaTitle: "Buy Pre-Owned Samsung Galaxy S24 Ultra 5G Dubai | SellPhone24",
      metaDescription: "Purchase certified pre-owned Samsung S24 Ultra with Galaxy AI, 12-month warranty, and free cash on delivery in UAE.",
      keywords: ["buy s24 ultra dubai", "used samsung galaxy s24 uae", "refurbished s24 ultra"],
    },
    isAvailable: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    title: "iPhone 15 Pro",
    brand: "Apple",
    model: "iPhone 15 Pro",
    category: "smartphones",
    price: 2699,
    originalPrice: 3899,
    condition: "Grade A (Excellent)",
    batteryHealth: "94% (Original Battery)",
    warranty: "6 Months Store Warranty",
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 250 },
      { size: "512GB", priceBoost: 500 },
    ],
    selectedStorage: "128GB",
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium"],
    images: {
      frontView: "/products/iphone (4).jpg",
      sideView: "/products/iphone (5).jpg",
      backView: "/products/iphone (6).jpg",
    },
    description: "Compact titanium powerhouse with A17 Pro chip, Action Button, and USB-C speed. Thoroughly tested with 32-point inspection.",
    features: [
      "Grade A Condition with minimal micro-signs",
      "FaceID & LiDAR Scanner Passed 100%",
      "Original Apple Parts Certified",
      "3-Day Free Exchange Policy",
    ],
    stock: 5,
    status: "published",
    slug: "buy-iphone-15-pro",
    seoMetadata: {
      metaTitle: "Buy iPhone 15 Pro in Dubai - Grade A Certified Refurbished",
      metaDescription: "Buy Grade A refurbished iPhone 15 Pro with warranty in Dubai. Same day delivery across UAE.",
      keywords: ["buy iphone 15 pro dubai", "cheap iphone 15 pro uae"],
    },
    isAvailable: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 52,
  },
  {
    title: "Google Pixel 8 Pro",
    brand: "Google",
    model: "Pixel 8 Pro",
    category: "smartphones",
    price: 1999,
    originalPrice: 3399,
    condition: "Grade A (Excellent)",
    batteryHealth: "96% (Health Check Passed)",
    warranty: "6 Months Store Warranty",
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 220 },
      { size: "512GB", priceBoost: 450 },
    ],
    selectedStorage: "128GB",
    colors: ["Bay Blue", "Obsidian Black", "Porcelain"],
    images: {
      frontView: "/products/iphone (7).jpg",
      sideView: "/products/iphone (8).jpg",
      backView: "/products/iphone (9).jpg",
    },
    description: "Pure Google Android experience with Tensor G3, best-in-class computational photography, and Super Actua display.",
    features: [
      "7 Years of Google Android OS Updates",
      "Magic Editor & Audio Magic Eraser",
      "Carrier Unlocked Worldwide",
      "Clean IMEI & UAE TDRA Certified",
    ],
    stock: 2,
    status: "published",
    slug: "buy-google-pixel-8-pro",
    seoMetadata: {
      metaTitle: "Buy Google Pixel 8 Pro in Dubai | Best Price UAE",
      metaDescription: "Get certified pre-owned Google Pixel 8 Pro with pure Android AI camera features in Dubai.",
      keywords: ["buy pixel 8 pro dubai", "used google pixel uae"],
    },
    isAvailable: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 17,
  },
  {
    title: "OnePlus 12 5G",
    brand: "OnePlus",
    model: "OnePlus 12",
    category: "smartphones",
    price: 2199,
    originalPrice: 3199,
    condition: "Pristine (Like New)",
    batteryHealth: "100% (Battery Health Perfect)",
    warranty: "12 Months Comprehensive Store Warranty",
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 300 },
    ],
    selectedStorage: "512GB",
    colors: ["Silky Black", "Emerald Green"],
    images: {
      frontView: "/products/oneplus (1).jpg",
      sideView: "/products/oneplus (2).jpg",
      backView: "/products/oneplus (3).jpg",
    },
    description: "Snapdragon 8 Gen 3 flagship with Hasselblad 4th Gen camera system and 100W SUPERVOOC charging capability.",
    features: [
      "100W Fast Charging Support",
      "Hasselblad Camera Co-Engineered",
      "Like New, Pristine Condition",
      "Includes Original Adapter",
    ],
    stock: 3,
    status: "published",
    slug: "buy-oneplus-12",
    seoMetadata: {
      metaTitle: "Buy OnePlus 12 5G in Dubai | 12M Warranty",
      metaDescription: "Buy certified OnePlus 12 5G with Hasselblad optics and 100W charging in UAE.",
      keywords: ["buy oneplus 12 dubai", "oneplus 12 pre-owned"],
    },
    isAvailable: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 21,
  },
  {
    title: "iPhone 14 Pro Max",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    category: "smartphones",
    price: 2299,
    originalPrice: 3499,
    condition: "Grade B (Good Value)",
    batteryHealth: "91% (Standard Life)",
    warranty: "6 Months Store Warranty",
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 220 },
      { size: "512GB", priceBoost: 480 },
    ],
    selectedStorage: "256GB",
    colors: ["Deep Purple", "Space Black", "Gold", "Silver"],
    images: {
      frontView: "/products/iphone (10).jpg",
      sideView: "/products/iphone (11).jpg",
      backView: "/products/iphone (12).jpg",
    },
    description: "Dynamic Island pioneer with 48MP main sensor and ProMotion 120Hz display. Best value for high-tier performance.",
    features: [
      "Grade B with minor surface signs, 100% functional",
      "Dynamic Island & Always-On Display",
      "Fully inspected & disinfected",
      "Cash on Delivery across UAE",
    ],
    stock: 4,
    status: "published",
    slug: "buy-iphone-14-pro-max",
    seoMetadata: {
      metaTitle: "Buy iPhone 14 Pro Max Dubai - Grade B Value Refurbished",
      metaDescription: "Shop affordable pre-owned iPhone 14 Pro Max with 6M warranty in Dubai, UAE.",
      keywords: ["cheap iphone 14 pro max dubai", "used iphone 14 pro max"],
    },
    isAvailable: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 44,
  }
];

export async function seedBuyProducts() {
  console.log("🌱 Starting Buy Products database seeding...");
  try {
    await connectToMongoDB();

    for (const item of initialBuyProducts) {
      const existing = await BuyProduct.findOne({
        $or: [{ slug: item.slug }, { title: item.title }]
      });

      if (existing) {
        console.log(`ℹ️ Buy product already exists: "${item.title}". Updating status & details...`);
        await BuyProduct.findByIdAndUpdate(existing._id, item, { new: true });
      } else {
        await BuyProduct.create(item);
        console.log(`✅ Inserted Buy product: "${item.title}"`);
      }
    }

    const totalCount = await BuyProduct.countDocuments();
    console.log(`\n🎉 Buy Products seeding completed successfully! Total Buy Products in DB: ${totalCount}`);
  } catch (error) {
    console.error("❌ Error seeding Buy Products:", error.message);
  } finally {
    await disconnectFromMongoDB();
  }
}

// Allow direct CLI invocation: `node seedBuyProducts.js`
if (process.argv[1]?.endsWith("seedBuyProducts.js")) {
  seedBuyProducts().then(() => process.exit(0)).catch(() => process.exit(1));
}
