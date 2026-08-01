import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Blog from "./models/Blog.js";
import connectDB from "./config/db.js";
import { appleiPhones } from "./seedAppleiPhones.js";

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
    description: "Get the best price for your used iPads, Samsung Galaxy Tabs, Surface Pro, Xiaomi & OnePlus tablets.",
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
    description: "Sell your used MacBooks, Dell XPS, Alienware, HP, Asus, Lenovo, Razer & Acer laptops for instant cash.",
    image: "/products/apple logo.jpg",
  },
  {
    name: "Games",
    slug: "games",
    description: "Sell your gaming consoles, VR headsets & handhelds. PS5 Pro, PS5, Xbox, Switch OLED, Steam Deck, ROG Ally & Quest 3.",
    image: "/products/samsung logo.jpg",
  },
  {
    name: "TVs",
    slug: "tvs",
    description: "Sell your Smart TVs, OLED, QLED & 4K TVs. Samsung, LG, Sony, TCL (2022-2026). Free doorstep pickup.",
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
  { name: "Apple", slug: "apple", logo: "🍎", categoriesSlugs: ["smartphones", "tablets", "smartwatches", "laptops"] },
  { name: "Samsung", slug: "samsung", logo: "📱", categoriesSlugs: ["smartphones", "tablets", "smartwatches", "tvs"] },
  { name: "Google", slug: "google", logo: "🔎", categoriesSlugs: ["smartphones"] },
  { name: "OnePlus", slug: "oneplus", logo: "➕", categoriesSlugs: ["smartphones", "tablets"] },
  { name: "Dell", slug: "dell", logo: "💻", categoriesSlugs: ["laptops"] },
  { name: "HP", slug: "hp", logo: "💻", categoriesSlugs: ["laptops"] },
  { name: "Asus", slug: "asus", logo: "⚡", categoriesSlugs: ["laptops", "games"] },
  { name: "Lenovo", slug: "lenovo", logo: "💻", categoriesSlugs: ["laptops", "tablets", "games"] },
  { name: "Sony", slug: "sony", logo: "🎮", categoriesSlugs: ["games", "tvs"] },
  { name: "Microsoft", slug: "microsoft", logo: "🟩", categoriesSlugs: ["laptops", "tablets", "games"] },
  { name: "Nintendo", slug: "nintendo", logo: "🔴", categoriesSlugs: ["games"] },
  { name: "LG", slug: "lg", logo: "📺", categoriesSlugs: ["tvs"] },
  { name: "TCL", slug: "tcl", logo: "📺", categoriesSlugs: ["tvs"] },
  { name: "Xiaomi", slug: "xiaomi", logo: "📱", categoriesSlugs: ["tablets"] },
  { name: "Valve", slug: "valve", logo: "🎮", categoriesSlugs: ["games"] },
  { name: "MSI", slug: "msi", logo: "🐉", categoriesSlugs: ["games", "laptops"] },
  { name: "Razer", slug: "razer", logo: "🐍", categoriesSlugs: ["laptops"] },
  { name: "Acer", slug: "acer", logo: "💻", categoriesSlugs: ["laptops"] },
  { name: "Meta", slug: "meta", logo: "🥽", categoriesSlugs: ["games"] },
];

const storagePriceBoosts = {
  "16GB": 0,
  "32GB": 0,
  "64GB": 0,
  "128GB": 0,
  "256GB": 150,
  "512GB": 350,
  "1TB": 700,
  "2TB": 1500,
  "16GB RAM / 512GB SSD": 0,
  "16GB RAM / 1TB SSD": 300,
  "32GB RAM / 1TB SSD": 850,
  "64GB RAM / 2TB SSD": 2000,
};

const otherProductsData = [
  // --- NON-IPHONE SMARTPHONES ---
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
  {
    name: "Pixel 8 Pro",
    brandName: "Google",
    category: "smartphones",
    basePrice: 1900,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Obsidian", "Porcelain", "Bay Blue"],
    description: "Tensor G3 chip, advanced AI photo/video features, and thermometer sensor.",
    shortDescription: "Advanced Google AI, Tensor G3 chip, and best-in-class camera.",
    images: { frontView: "/products/logo of google.jpg", sideView: "/products/logo of google.jpg", backView: "/products/logo of google.jpg" },
  },
  {
    name: "OnePlus 12",
    brandName: "OnePlus",
    category: "smartphones",
    basePrice: 1800,
    storages: ["256GB", "512GB"],
    colors: ["Silky Black", "Flowy Emerald"],
    description: "Snapdragon 8 Gen 3, 120Hz 2K display, and 100W SuperVOOC charging.",
    shortDescription: "Snapdragon 8 Gen 3, 100W super charging, fluid display.",
    images: { frontView: "/products/oneplus (1).jpg", sideView: "/products/oneplus (2).jpg", backView: "/products/oneplus (3).jpg" },
  },

  // --- LAPTOPS ---
  {
    name: "MacBook Pro 16 M3 Max",
    brandName: "Apple",
    category: "laptops",
    basePrice: 6500,
    storages: ["36GB RAM / 1TB SSD", "48GB RAM / 1TB SSD", "128GB RAM / 2TB SSD"],
    colors: ["Space Black", "Silver"],
    description: "16.2-inch Liquid Retina XDR display with M3 Max chip, 128GB unified memory support, and 22-hour battery life.",
    shortDescription: "Extreme Pro performance with M3 Max chip & Liquid Retina XDR.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "MacBook Pro 14 M3 Pro",
    brandName: "Apple",
    category: "laptops",
    basePrice: 4800,
    storages: ["18GB RAM / 512GB SSD", "18GB RAM / 1TB SSD", "36GB RAM / 1TB SSD"],
    colors: ["Space Black", "Silver"],
    description: "14.2-inch Liquid Retina XDR display with M3 Pro chip, MagSafe 3, and HDMI 2.1.",
    shortDescription: "Pro power in a portable 14.2-inch size with M3 Pro chip.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "MacBook Air 15 M3",
    brandName: "Apple",
    category: "laptops",
    basePrice: 3400,
    storages: ["8GB RAM / 256GB SSD", "16GB RAM / 512GB SSD", "24GB RAM / 1TB SSD"],
    colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
    description: "15.3-inch Liquid Retina display with M3 chip, fanless silent operation, and MagSafe 3.",
    shortDescription: "Ultra-thin 15.3-inch Liquid Retina laptop with M3 chip.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Dell XPS 16 9640 OLED",
    brandName: "Dell",
    category: "laptops",
    basePrice: 5200,
    storages: ["16GB RAM / 512GB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Platinum", "Graphite"],
    description: "16.3-inch 4K+ OLED touch screen with Intel Core Ultra 7/9 and RTX 4070 GPU.",
    shortDescription: "16.3-inch 4K+ OLED Touch ultrabook with Intel Core Ultra 7.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Dell Alienware m16 R2",
    brandName: "Dell",
    category: "laptops",
    basePrice: 4600,
    storages: ["16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Dark Metallic Moon"],
    description: "Intel Core Ultra 7/9 gaming laptop with 240Hz QHD+ display and RTX 4070 graphics.",
    shortDescription: "Alienware m16 R2 with Stealth Mode & Cryo-tech cooling.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "HP Spectre x360 14",
    brandName: "HP",
    category: "laptops",
    basePrice: 3400,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD"],
    colors: ["Nightfall Black", "Slate Blue"],
    description: "Premium 2-in-1 14-inch 2.8K 120Hz OLED convertible with Intel Core Ultra 7.",
    shortDescription: "Ultra-portable 2-in-1 OLED touchscreen laptop with Intel Core Ultra.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "HP OMEN 16 Gaming Laptop",
    brandName: "HP",
    category: "laptops",
    basePrice: 3600,
    storages: ["16GB RAM / 512GB SSD", "16GB RAM / 1TB SSD"],
    colors: ["Shadow Black"],
    description: "14th Gen Intel Core i7-14700HX with RTX 4070 and Tempest Cooling.",
    shortDescription: "RTX 4070 gaming laptop with 165Hz QHD display & Tempest cooling.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    brandName: "Lenovo",
    category: "laptops",
    basePrice: 4500,
    storages: ["16GB RAM / 512GB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Eclipse Black Carbon"],
    description: "Ultralight carbon-fiber business laptop with 2.8K OLED screen & Intel Core Ultra.",
    shortDescription: "Ultralight carbon-fiber business laptop with legendary keyboard.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Lenovo Legion Pro 7i",
    brandName: "Lenovo",
    category: "laptops",
    basePrice: 5800,
    storages: ["32GB RAM / 1TB SSD"],
    colors: ["Eclipse Gray"],
    description: "Intel i9-14900HX, RTX 4080/4090 graphics, and 240Hz WQXGA panel.",
    shortDescription: "AI-tuned gaming powerhouse with i9-14900HX & RTX 4080.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Asus ROG Zephyrus G16 OLED",
    brandName: "Asus",
    category: "laptops",
    basePrice: 5100,
    storages: ["16GB RAM / 1TB SSD", "32GB RAM / 1TB SSD"],
    colors: ["Eclipse Gray", "Platinum White"],
    description: "0.59-inch ultra-slim CNC gaming laptop with 2.5K 240Hz ROG Nebula OLED display.",
    shortDescription: "Ultra-slim ROG Nebula OLED gaming laptop with RTX 4070.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Razer Blade 16",
    brandName: "Razer",
    category: "laptops",
    basePrice: 6200,
    storages: ["32GB RAM / 1TB SSD"],
    colors: ["Anodized Black"],
    description: "World's first 240Hz 16-inch OLED display with Intel i9-14900HX and RTX 4080/4090.",
    shortDescription: "CNC aluminum gaming ultrabook with 240Hz OLED display.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },

  // --- TABLETS ---
  {
    name: "iPad Pro 13 M4",
    brandName: "Apple",
    category: "tablets",
    basePrice: 3800,
    storages: ["256GB", "512GB", "1TB", "2TB"],
    colors: ["Space Black", "Silver"],
    description: "Ultra-thin 5.1mm iPad Pro with M4 chip and Ultra Retina XDR Tandem OLED.",
    shortDescription: "Thinnest iPad Pro with M4 chip & Ultra Retina XDR Tandem OLED.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "iPad Pro 11 M4",
    brandName: "Apple",
    category: "tablets",
    basePrice: 3100,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Space Black", "Silver"],
    description: "Compact 11-inch Ultra Retina XDR OLED tablet powered by M4 chip.",
    shortDescription: "11-inch Ultra Retina XDR OLED tablet with M4 chip.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "iPad Air 13 M2",
    brandName: "Apple",
    category: "tablets",
    basePrice: 2700,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Space Gray", "Starlight", "Purple", "Blue"],
    description: "Redesigned 13-inch Liquid Retina display with superfast M2 chip.",
    shortDescription: "First-ever 13-inch iPad Air powered by the Apple M2 chip.",
    images: { frontView: "/products/iphone (9).jpg", sideView: "/products/iphone (9).jpg", backView: "/products/iphone (9).jpg" },
  },
  {
    name: "Galaxy Tab S9 Ultra",
    brandName: "Samsung",
    category: "tablets",
    basePrice: 2600,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Graphite", "Beige"],
    description: "Massive 14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, and S Pen.",
    shortDescription: "Massive 14.6-inch AMOLED tablet with S Pen & IP68 rating.",
    images: { frontView: "/products/samsung (13).jpg", sideView: "/products/samsung (13).jpg", backView: "/products/samsung (13).jpg" },
  },
  {
    name: "Microsoft Surface Pro 10",
    brandName: "Microsoft",
    category: "tablets",
    basePrice: 3600,
    storages: ["256GB", "512GB", "1TB"],
    colors: ["Platinum", "Black"],
    description: "Commercial 2-in-1 Windows 11 tablet with Intel Core Ultra & anti-reflective screen.",
    shortDescription: "Commercial 2-in-1 AI Windows tablet with Intel Core Ultra.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Xiaomi Pad 6 Pro",
    brandName: "Xiaomi",
    category: "tablets",
    basePrice: 1300,
    storages: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Gold", "Mountain Blue"],
    description: "11-inch 2.8K 144Hz display with Snapdragon 8+ Gen 1 and 67W charging.",
    shortDescription: "11-inch 2.8K 144Hz screen tablet with Snapdragon 8+ Gen 1.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "OnePlus Pad 2",
    brandName: "OnePlus",
    category: "tablets",
    basePrice: 1850,
    storages: ["256GB"],
    colors: ["Nimbus Gray"],
    description: "12.1-inch 3K 144Hz ReadFit screen with Snapdragon 8 Gen 3.",
    shortDescription: "12.1-inch 3K 144Hz display flagship tablet with Snapdragon 8 Gen 3.",
    images: { frontView: "/products/oneplus (1).jpg", sideView: "/products/oneplus (2).jpg", backView: "/products/oneplus (3).jpg" },
  },

  // --- GAMES & CONSOLES ---
  {
    name: "PlayStation 5 Pro",
    brandName: "Sony",
    category: "games",
    basePrice: 2600,
    storages: ["2TB"],
    colors: ["White / Black"],
    description: "Upgraded GPU, Advanced Ray Tracing, PSSR AI Upscaling, and 2TB high-speed SSD.",
    shortDescription: "Ultimate 4K 60FPS console with PSSR AI Upscaling & 2TB SSD.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "PlayStation 5 Slim (Disc Edition)",
    brandName: "Sony",
    category: "games",
    basePrice: 1550,
    storages: ["1TB"],
    colors: ["White"],
    description: "Slim PS5 console with Ultra HD Blu-ray Disc Drive, 1TB SSD & 4K 120Hz.",
    shortDescription: "Compact PS5 console with Ultra HD Blu-ray Drive & 1TB SSD.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "PlayStation 5 Slim (Digital Edition)",
    brandName: "Sony",
    category: "games",
    basePrice: 1350,
    storages: ["1TB"],
    colors: ["White"],
    description: "All-digital PS5 Slim console with ultra-high speed 1TB SSD storage.",
    shortDescription: "All-digital PS5 Slim console with 1TB SSD storage.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Xbox Series X",
    brandName: "Microsoft",
    category: "games",
    basePrice: 1450,
    storages: ["1TB", "2TB"],
    colors: ["Robot White", "Galaxy Black"],
    description: "12 Teraflops of raw GPU power, 4K 120Hz gaming, and Quick Resume.",
    shortDescription: "12 Teraflops 4K gaming console with Quick Resume & Velocity SSD.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Xbox Series S",
    brandName: "Microsoft",
    category: "games",
    basePrice: 750,
    storages: ["512GB", "1TB"],
    colors: ["Robot White", "Carbon Black"],
    description: "All-digital next-gen gaming console with Xbox Velocity Architecture.",
    shortDescription: "All-digital 1440p next-gen Xbox in a compact size.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Nintendo Switch OLED",
    brandName: "Nintendo",
    category: "games",
    basePrice: 850,
    storages: ["64GB"],
    colors: ["White", "Neon Red/Blue", "Mario Red"],
    description: "7-inch OLED screen, wide adjustable stand, and LAN dock.",
    shortDescription: "Vibrant 7-inch OLED screen handheld & TV console.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Steam Deck OLED",
    brandName: "Valve",
    category: "games",
    basePrice: 1700,
    storages: ["512GB", "1TB"],
    colors: ["Black"],
    description: "7.4-inch 90Hz HDR OLED handheld gaming PC with custom AMD APU.",
    shortDescription: "7.4-inch 90Hz HDR OLED handheld gaming PC by Valve.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Asus ROG Ally X",
    brandName: "Asus",
    category: "games",
    basePrice: 2200,
    storages: ["1TB"],
    colors: ["Black"],
    description: "Windows 11 gaming handheld with AMD Ryzen Z1 Extreme & 80Wh battery.",
    shortDescription: "Windows 11 gaming handheld PC with AMD Z1 Extreme.",
    images: { frontView: "/products/apple logo.jpg", sideView: "/products/apple logo.jpg", backView: "/products/apple logo.jpg" },
  },
  {
    name: "Meta Quest 3 VR Headset",
    brandName: "Meta",
    category: "games",
    basePrice: 1400,
    storages: ["128GB", "512GB"],
    colors: ["White"],
    description: "Breakthrough mixed reality VR headset with Snapdragon XR2 Gen 2.",
    shortDescription: "Mixed reality VR headset with 4K+ Infinite Display.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },

  // --- SMART TVs ---
  {
    name: "Samsung OLED S95D 4K Smart TV",
    brandName: "Samsung",
    category: "tvs",
    basePrice: 4200,
    storages: ["55 Inch", "65 Inch", "77 Inch"],
    colors: ["Titan Black"],
    description: "OLED Glare-Free 4K Smart TV with NQ4 AI Gen2 Processor & 144Hz.",
    shortDescription: "Glare-Free OLED 4K Smart TV with 144Hz Motion Xcelerator.",
    images: { frontView: "/products/samsung (1).jpg", sideView: "/products/samsung (1).jpg", backView: "/products/samsung (1).jpg" },
  },
  {
    name: "Samsung Neo QLED 4K QN90D",
    brandName: "Samsung",
    category: "tvs",
    basePrice: 3500,
    storages: ["55 Inch", "65 Inch", "75 Inch", "85 Inch"],
    colors: ["Titan Black"],
    description: "Quantum Mini LED 4K TV with NQ4 AI Gen2 Processor & Dolby Atmos.",
    shortDescription: "Quantum Mini LED 4K Smart TV with Neo Quantum HDR+.",
    images: { frontView: "/products/samsung (1).jpg", sideView: "/products/samsung (1).jpg", backView: "/products/samsung (1).jpg" },
  },
  {
    name: "LG OLED evo C4 4K Smart TV",
    brandName: "LG",
    category: "tvs",
    basePrice: 3800,
    storages: ["42 Inch", "48 Inch", "55 Inch", "65 Inch", "77 Inch"],
    colors: ["Dark Titan"],
    description: "α9 AI Processor Gen7, Brightness Booster, 100% color fidelity, and 144Hz.",
    shortDescription: "2024 OLED evo TV with α9 AI Processor Gen7 & 144Hz gaming.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "LG OLED evo G4 Gallery Edition",
    brandName: "LG",
    category: "tvs",
    basePrice: 5100,
    storages: ["55 Inch", "65 Inch", "77 Inch", "83 Inch"],
    colors: ["Light Steel Silver"],
    description: "α11 AI Processor 4K with Micro Lens Array (MLA) Brightness Booster Max.",
    shortDescription: "Flagship OLED evo TV with MLA Brightness Booster Max.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Sony BRAVIA 8 OLED 4K Smart TV",
    brandName: "Sony",
    category: "tvs",
    basePrice: 4400,
    storages: ["55 Inch", "65 Inch", "77 Inch"],
    colors: ["Black"],
    description: "XR Processor with Scene Recognition, Acoustic Surface Audio+, and PS5 optimization.",
    shortDescription: "2024 BRAVIA OLED with XR Processor & Acoustic Surface Audio+.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "Sony BRAVIA 9 Mini LED 4K TV",
    brandName: "Sony",
    category: "tvs",
    basePrice: 5500,
    storages: ["65 Inch", "75 Inch", "85 Inch"],
    colors: ["Black"],
    description: "Sony's brightest 4K TV with XR Backlight Master Drive and Beam Tweeter audio.",
    shortDescription: "Brightest 4K Mini LED TV with XR Backlight Master Drive.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "TCL QM8 QD-Mini LED 4K TV",
    brandName: "TCL",
    category: "tvs",
    basePrice: 3200,
    storages: ["65 Inch", "75 Inch", "85 Inch", "98 Inch"],
    colors: ["Black Metallic"],
    description: "5000+ Nits Peak Brightness, 5000+ local dimming zones, 144Hz VRR & Onkyo 2.1.2 sound.",
    shortDescription: "5000 Nits Peak Brightness QD-Mini LED 4K TV with 144Hz VRR.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
  {
    name: "TCL C845 Mini LED 4K TV",
    brandName: "TCL",
    category: "tvs",
    basePrice: 2400,
    storages: ["55 Inch", "65 Inch", "75 Inch", "85 Inch"],
    colors: ["Titanium"],
    description: "Mini LED technology with Quantum Dot color, 2000 nits HDR brightness, and 144Hz VRR.",
    shortDescription: "2000 Nits Mini LED 4K TV with Quantum Dot & 144Hz VRR.",
    images: { frontView: "/products/samsung logo.jpg", sideView: "/products/samsung logo.jpg", backView: "/products/samsung logo.jpg" },
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Safe Upsert Categories
    const categorySlugToId = {};
    for (const cat of categoriesData) {
      const updatedCat = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true }
      );
      categorySlugToId[cat.slug] = updatedCat._id;
    }
    console.log(`✅ Safe upserted ${categoriesData.length} categories.`);

    // 2. Safe Upsert Brands
    const brandNameToId = {};
    for (const brand of brandsData) {
      const categoryIds = brand.categoriesSlugs.map((slug) => categorySlugToId[slug]).filter(Boolean);
      const updatedBrand = await Brand.findOneAndUpdate(
        { slug: brand.slug },
        {
          $set: {
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
            categories: categoryIds
          }
        },
        { upsert: true, new: true }
      );
      brandNameToId[brand.name] = updatedBrand._id;
    }
    console.log(`✅ Safe upserted ${brandsData.length} brands.`);

    // 3. Upsert Apple iPhones (all 28 models)
    const appleBrandId = brandNameToId["Apple"];
    let iphoneCount = 0;
    if (appleBrandId) {
      for (const ip of appleiPhones) {
        await Product.findOneAndUpdate(
          { name: ip.name },
          {
            $set: {
              name: ip.name,
              brand: appleBrandId,
              category: "smartphones",
              basePrice: ip.basePrice,
              storages: ip.storages,
              colors: ip.colors,
              description: ip.description,
              shortDescription: ip.shortDescription,
              images: ip.images
            }
          },
          { upsert: true, new: true }
        );
        iphoneCount++;
      }
      console.log(`📱 Safe upserted ${iphoneCount} Apple iPhone models.`);
    }

    // 4. Upsert Other Catalog Products
    let otherCount = 0;
    for (const p of otherProductsData) {
      const bId = brandNameToId[p.brandName];
      if (!bId) continue;

      const storagesMapped = p.storages.map((sz) => ({
        size: sz,
        priceBoost: storagePriceBoosts[sz] !== undefined ? storagePriceBoosts[sz] : 0,
      }));

      await Product.findOneAndUpdate(
        { name: p.name },
        {
          $set: {
            name: p.name,
            brand: bId,
            category: p.category,
            basePrice: p.basePrice,
            storages: storagesMapped,
            colors: p.colors,
            description: p.description,
            shortDescription: p.shortDescription,
            images: p.images,
          }
        },
        { upsert: true, new: true }
      );
      otherCount++;
    }
    console.log(`📦 Safe upserted ${otherCount} other catalog products.`);
    console.log(`🎉 Total safe seeding completed! Database populated safely.`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
