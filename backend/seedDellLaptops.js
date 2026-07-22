import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

const dellLaptops = [
  // 1. Dell XPS Series
  {
    name: "Dell XPS 16 9640 (2024)",
    category: "laptops",
    basePrice: 4800,
    colors: ["Platinum", "Graphite"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 4050", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4060", priceBoost: 800 },
      { size: "64GB RAM / 2TB SSD / RTX 4070", priceBoost: 1800 }
    ],
    shortDescription: "Intel Core Ultra 7/9, 16.3\" 4K+ OLED Touchscreen, CNC Machined Aluminum, RTX 40-series GPU."
  },
  {
    name: "Dell XPS 14 9440 (2024)",
    category: "laptops",
    basePrice: 3900,
    colors: ["Platinum", "Graphite"],
    storages: [
      { size: "16GB RAM / 512GB SSD / Intel Arc", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4050", priceBoost: 700 },
      { size: "64GB RAM / 2TB SSD / RTX 4050", priceBoost: 1400 }
    ],
    shortDescription: "Intel Core Ultra 7, 14.5\" 3.2K OLED Touch, Seamless Glass Touchpad, Gorilla Glass Victus."
  },
  {
    name: "Dell XPS 15 9530 (2023)",
    category: "laptops",
    basePrice: 3400,
    colors: ["Platinum Silver", "Carbon Fiber Black"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 4050", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4060", priceBoost: 600 },
      { size: "64GB RAM / 2TB SSD / RTX 4070", priceBoost: 1300 }
    ],
    shortDescription: "13th Gen Intel Core i7/i9, 15.6\" 3.5K OLED Touch, Quad Speaker System, Carbon Fiber Palm Rest."
  },
  {
    name: "Dell XPS 17 9730 (2023)",
    category: "laptops",
    basePrice: 4100,
    colors: ["Platinum Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 4060", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4070", priceBoost: 750 },
      { size: "64GB RAM / 2TB SSD / RTX 4080", priceBoost: 1700 }
    ],
    shortDescription: "13th Gen Intel Core i7/i9, 17.0\" 4K UHD+ Touch, Vapor Chamber Cooling, 4x Thunderbolt 4."
  },
  {
    name: "Dell XPS 13 Plus 9320 (2022-2023)",
    category: "laptops",
    basePrice: 2800,
    colors: ["Platinum", "Graphite"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 500 },
      { size: "32GB RAM / 2TB SSD", priceBoost: 900 }
    ],
    shortDescription: "12th/13th Gen Intel Core i7, Capacitive Touch Function Row, Zero-Lattice Keyboard, 3.5K OLED."
  },
  {
    name: "Dell XPS 15 9500 / 9510 / 9520 (2020-2022)",
    category: "laptops",
    basePrice: 2200,
    colors: ["Platinum Silver", "Frost White"],
    storages: [
      { size: "16GB RAM / 512GB SSD / GTX 1650 Ti", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD / RTX 3050 Ti", priceBoost: 400 },
      { size: "32GB RAM / 1TB SSD / RTX 3050 Ti", priceBoost: 750 }
    ],
    shortDescription: "10th-12th Gen Intel Core i7/i9, 15.6\" 4K UHD+ Touch display, Waves MaxxAudio Pro."
  },
  {
    name: "Dell XPS 13 9300 / 9310 (2020-2021)",
    category: "laptops",
    basePrice: 1600,
    colors: ["Platinum Silver", "Arctic White"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 300 },
      { size: "16GB RAM / 1TB SSD", priceBoost: 500 }
    ],
    shortDescription: "10th/11th Gen Intel Core i5/i7, 13.4\" 4K UHD+ InfinityEdge Display, Thunderbolt 4."
  },
  {
    name: "Dell XPS 15 9560 / 9570 / 7590 (2017-2019)",
    category: "laptops",
    basePrice: 1400,
    colors: ["Silver", "Black Carbon"],
    storages: [
      { size: "16GB RAM / 512GB SSD / GTX 1050 Ti", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / GTX 1650", priceBoost: 350 }
    ],
    shortDescription: "7th-9th Gen Intel Core i7/i9, 15.6\" 4K OLED/4K Touch Display, NVIDIA GTX Graphics."
  },
  {
    name: "Dell XPS 13 9343 / 9350 / 9360 / 9370 (2015-2018)",
    category: "laptops",
    basePrice: 950,
    colors: ["Silver", "Rose Gold"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 200 }
    ],
    shortDescription: "5th-8th Gen Intel Core i5/i7, 13.3\" QHD+ InfinityEdge Touch screen, Machined Aluminum."
  },
  {
    name: "Dell XPS 15 L501X / L502X / 9530 (2010-2014)",
    category: "laptops",
    basePrice: 550,
    colors: ["Anodized Aluminum Silver"],
    storages: [
      { size: "8GB RAM / 500GB HDD", priceBoost: 0 },
      { size: "16GB RAM / 256GB SSD", priceBoost: 150 }
    ],
    shortDescription: "Intel 1st-4th Gen Core i5/i7, JBL Speakers with Subwoofer, NVIDIA GeForce GT Graphics."
  },

  // 2. Alienware Gaming Series
  {
    name: "Dell Alienware m16 / m18 R2 (2024)",
    category: "laptops",
    basePrice: 5200,
    colors: ["Dark Metallic Moon"],
    storages: [
      { size: "16GB RAM / 1TB SSD / RTX 4070", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4080", priceBoost: 1100 },
      { size: "64GB RAM / 2TB SSD / RTX 4090", priceBoost: 2400 }
    ],
    shortDescription: "14th Gen Intel Core i9-14900HX, 240Hz QHD+ Display, Element 31 Thermal Interface, CherryMX Mechanical Keyboard."
  },
  {
    name: "Dell Alienware x16 / x14 R2 (2023)",
    category: "laptops",
    basePrice: 4200,
    colors: ["Lunar Light"],
    storages: [
      { size: "16GB RAM / 1TB SSD / RTX 4060", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4070", priceBoost: 800 },
      { size: "32GB RAM / 2TB SSD / RTX 4080", priceBoost: 1600 }
    ],
    shortDescription: "Ultra-thin gaming laptop, 13th Gen Intel Core i7/i9, Legend 3.0 design, AlienFX RGB Lighting."
  },
  {
    name: "Dell Alienware m15 R6 / R7 (2021-2022)",
    category: "laptops",
    basePrice: 2800,
    colors: ["Dark Side of the Moon", "Lunar Light"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 3060", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD / RTX 3070 Ti", priceBoost: 500 },
      { size: "32GB RAM / 1TB SSD / RTX 3080", priceBoost: 1000 }
    ],
    shortDescription: "11th/12th Gen Intel Core i7/i9, 15.6\" 240Hz/360Hz Gaming Display, Cryo-Tech Cooling."
  },
  {
    name: "Dell Alienware 17 R4 / R5 (2016-2018)",
    category: "laptops",
    basePrice: 1600,
    colors: ["Epic Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD / GTX 1070", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / GTX 1080", priceBoost: 400 }
    ],
    shortDescription: "7th/8th Gen Intel Core i7/i9, Tobii Eye Tracking, 17.3\" QHD 120Hz, NVIDIA GTX 10-series."
  },
  {
    name: "Dell Alienware M17x R3 / R4 / 18 (2011-2015)",
    category: "laptops",
    basePrice: 850,
    colors: ["Stealth Black", "Nebula Red"],
    storages: [
      { size: "12GB RAM / 750GB HDD / GTX 675M", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD / GTX 880M SLI", priceBoost: 300 }
    ],
    shortDescription: "Intel 2nd-4th Gen Core i7, Dual SLI Graphics, 17.3\" / 18.4\" Full HD display, Anodized Aluminum chassis."
  },

  // 3. Latitude Business Series
  {
    name: "Dell Latitude 7440 / 7430 (2022-2023)",
    category: "laptops",
    basePrice: 2400,
    colors: ["Titan Gray", "Aluminum Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 450 }
    ],
    shortDescription: "12th/13th Gen Intel Core i5/i7 vPro, 14.0\" FHD+ 16:10 display, Magnesium/Aluminum Chassis, Wi-Fi 6E."
  },
  {
    name: "Dell Latitude 5440 / 5430 (2022-2023)",
    category: "laptops",
    basePrice: 1800,
    colors: ["Gray"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 250 },
      { size: "32GB RAM / 1TB SSD", priceBoost: 500 }
    ],
    shortDescription: "12th/13th Gen Intel Core i5/i7, 14.0\" Full HD, Bio-based materials, ExpressCharge."
  },
  {
    name: "Dell Latitude 7400 / 7490 / 7480 (2017-2019)",
    category: "laptops",
    basePrice: 1100,
    colors: ["Black Carbon Fiber"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 200 }
    ],
    shortDescription: "7th/8th Gen Intel Core i5/i7, 14.0\" FHD Anti-Glare display, SmartCard Reader, Military-Grade Durability."
  },
  {
    name: "Dell Latitude E7470 / E7450 / E7440 (2014-2016)",
    category: "laptops",
    basePrice: 650,
    colors: ["Black"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 150 }
    ],
    shortDescription: "4th-6th Gen Intel Core i5/i7, Tri-metal alloy chassis, 14.0\" Full HD, Docking connector."
  },
  {
    name: "Dell Latitude E6430 / E6420 / E6410 (2010-2013)",
    category: "laptops",
    basePrice: 400,
    colors: ["Brushed Aluminum Gray"],
    storages: [
      { size: "4GB RAM / 320GB HDD", priceBoost: 0 },
      { size: "8GB RAM / 256GB SSD", priceBoost: 120 }
    ],
    shortDescription: "Intel 1st-3rd Gen Core i5/i7, Tri-Metal Casing, DVD-RW drive, Spill-Resistant Keyboard."
  },

  // 4. Inspiron & G-Series Gaming
  {
    name: "Dell G15 5530 / G16 7630 Gaming (2023-2024)",
    category: "laptops",
    basePrice: 2900,
    colors: ["Dark Shadow Gray", "Quantum White"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 4050", priceBoost: 0 },
      { size: "16GB RAM / 1TB SSD / RTX 4060", priceBoost: 450 },
      { size: "32GB RAM / 1TB SSD / RTX 4070", priceBoost: 950 }
    ],
    shortDescription: "13th Gen Intel Core i7/i9, 15.6\"/16.0\" 165Hz/240Hz Display, Alienware-inspired Cooling."
  },
  {
    name: "Dell Inspiron 16 Plus 7630 / 7620 (2022-2023)",
    category: "laptops",
    basePrice: 2200,
    colors: ["Dark Green", "Ice Blue"],
    storages: [
      { size: "16GB RAM / 512GB SSD / RTX 3050", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX 4060", priceBoost: 600 }
    ],
    shortDescription: "12th/13th Gen Intel Core i7 H-Series, 16.0\" 2.5K/3K 120Hz display, Quad Speakers."
  },
  {
    name: "Dell Inspiron 15 3511 / 5510 / 5502 (2020-2022)",
    category: "laptops",
    basePrice: 1200,
    colors: ["Carbon Black", "Platinum Silver"],
    storages: [
      { size: "8GB RAM / 256GB SSD", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD", priceBoost: 200 }
    ],
    shortDescription: "11th/12th Gen Intel Core i5/i7, 15.6\" FHD Anti-Glare display, Lift Hinge design."
  },
  {
    name: "Dell Inspiron 15 7000 Gaming 7567 / 7577 (2016-2018)",
    category: "laptops",
    basePrice: 950,
    colors: ["Matte Black", "Beijing Red"],
    storages: [
      { size: "8GB RAM / 128GB SSD + 1TB HDD / GTX 1050", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD / GTX 1060 Max-Q", priceBoost: 250 }
    ],
    shortDescription: "7th/8th Gen Intel Core i5/i7, Dual Fan Thermal Cooling, Red Backlit Keyboard, NVIDIA GTX graphics."
  },
  {
    name: "Dell Inspiron 15R 5520 / N5110 / N5010 (2010-2013)",
    category: "laptops",
    basePrice: 350,
    colors: ["Switch Changeable Lids (Black, Red, Blue)"],
    storages: [
      { size: "4GB RAM / 500GB HDD", priceBoost: 0 },
      { size: "8GB RAM / 246GB SSD", priceBoost: 100 }
    ],
    shortDescription: "Intel 1st-3rd Gen Core i3/i5/i7, 15.6\" HD TruLife display, SWITCH by Design Studio interchangeable covers."
  },

  // 5. Precision Workstations
  {
    name: "Dell Precision 5680 / 5570 Mobile Workstation (2022-2023)",
    category: "laptops",
    basePrice: 4200,
    colors: ["Titan Gray"],
    storages: [
      { size: "32GB RAM / 512GB SSD / RTX A2000", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / RTX A3500", priceBoost: 800 },
      { size: "64GB RAM / 2TB SSD / RTX 5000 Ada", priceBoost: 2100 }
    ],
    shortDescription: "ISV Certified Professional Workstation, 13th Gen Intel Core i7/i9, 16.0\" 4K OLED Touch, NVIDIA RTX Ada Graphics."
  },
  {
    name: "Dell Precision 7550 / 7530 Workstation (2018-2020)",
    category: "laptops",
    basePrice: 2100,
    colors: ["Aluminum Silver"],
    storages: [
      { size: "16GB RAM / 512GB SSD / Quadro T2000", priceBoost: 0 },
      { size: "32GB RAM / 1TB SSD / Quadro RTX 4000", priceBoost: 650 },
      { size: "64GB RAM / 2TB SSD / Quadro RTX 5000", priceBoost: 1300 }
    ],
    shortDescription: "8th-10th Gen Intel Core i7/i9 / Xeon, Up to 128GB RAM support, 15.6\" 4K Adobe RGB Display."
  },
  {
    name: "Dell Precision M4800 / M4600 Workstation (2011-2014)",
    category: "laptops",
    basePrice: 750,
    colors: ["Coventry Brown Metallic"],
    storages: [
      { size: "8GB RAM / 500GB HDD / Quadro K1100M", priceBoost: 0 },
      { size: "16GB RAM / 512GB SSD / Quadro K2100M", priceBoost: 200 }
    ],
    shortDescription: "Intel 2nd-4th Gen Core i7 / Extreme, 15.6\" QHD+ 3200x1800 UltraSharp display, Magnesium Alloy chassis."
  }
];

async function seedDellLaptops() {
  try {
    await connectDB();
    console.log("🔌 Connected to MongoDB database.");

    // 1. Ensure "Laptops" category exists
    let laptopCategory = await Category.findOne({ slug: "laptops" });
    if (!laptopCategory) {
      laptopCategory = await Category.create({
        name: "Laptops",
        slug: "laptops",
        description: "Sell your used laptops for top value instantly in UAE.",
        image: "/products/apple logo.jpg"
      });
      console.log("📁 Created 'Laptops' category.");
    }

    // 2. Ensure "Dell" brand exists and is linked to "Laptops" category
    let dellBrand = await Brand.findOne({ name: { $regex: /^dell$/i } });
    if (!dellBrand) {
      dellBrand = await Brand.create({
        name: "Dell",
        slug: "dell",
        logo: "/products/apple logo.jpg",
        categories: [laptopCategory._id]
      });
      console.log("🏷️ Created 'Dell' brand.");
    } else {
      if (!dellBrand.categories.includes(laptopCategory._id)) {
        dellBrand.categories.push(laptopCategory._id);
        await dellBrand.save();
        console.log("🔗 Linked 'Laptops' category to Dell brand.");
      }
    }

    // 3. Upsert (safe add/update) all Dell laptop models
    let count = 0;
    for (const item of dellLaptops) {
      await Product.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            name: item.name,
            brand: dellBrand._id,
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

    console.log(`✅ Successfully seeded/updated ${count} Dell laptop models under Dell brand and Laptops category!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedDellLaptops();
