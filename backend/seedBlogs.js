import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Blog from "./models/Blog.js";
import { connectToMongoDB } from "./config/db.js";

const sampleBlogs = [
  {
    title: "iPhone 18 Pro Resale Value in Dubai 2026: Market Analysis & Trade-In Guide",
    slug: "iphone-18-pro-resale-value-dubai-guide-2026",
    desc: "Unlocking the resale value of Apple's flagship iPhone 18 Pro in Dubai & UAE. Explore 2026 depreciation curves, storage valuation tiers, battery health impacts, and how to lock in maximum instant cash payout.",
    content: `The launch of the iPhone 18 Pro has created a new question for iPhone owners across Dubai and the UAE:

How much will the iPhone 18 Pro be worth when I sell it?

Apple's latest Pro iPhone officially starts at AED 5,099 in the UAE, while the iPhone 18 Pro Max starts at AED 5,499. The new Pro models are available in 256GB, 512GB, 1TB and 2TB storage configurations. Pre-orders opened on September 12, with availability beginning September 18, 2026.

Because the iPhone 18 Pro is a brand-new premium device, its resale value should initially remain relatively strong. However, the amount you can receive when selling your iPhone 18 Pro in Dubai will depend on several factors, including storage capacity, condition, battery health, market demand, warranty, accessories and how long you have owned the device.

---

## iPhone 18 Pro UAE Official Price Matrix

Before estimating resale value, it is important to understand the official retail price baseline:

| Model & Storage Tier | UAE Starting Price | Color Options |
| :--- | :--- | :--- |
| iPhone 18 Pro 256GB | From AED 5,099 | Black, Silver, Glacier, Burgundy |
| iPhone 18 Pro 512GB | From AED 5,949 | Black, Silver, Glacier, Burgundy |
| iPhone 18 Pro 1TB | From AED 7,649 | Black, Silver, Glacier, Burgundy |
| iPhone 18 Pro 2TB | From AED 10,199 | Black, Silver, Glacier, Burgundy |

Apple has introduced the iPhone 18 Pro in Black, Silver, Glacier and the new Burgundy finish.

The iPhone 18 Pro also introduces significant hardware changes, including Apple's A20 Pro chip, a new 48MP Fusion Main camera with variable aperture, improved battery performance and a smaller Dynamic Island.

---

## Retail Price vs. Instant Cash Resale Value

There is an important difference between retail price and cash resale value.

If Apple sells an iPhone 18 Pro for AED 5,099, that does not mean a buyer, reseller or phone-buying company will pay AED 5,099 for a used device.

A resale business needs room for:

* Testing and inspection
* Refurbishment and sanitization
* Warranty risk
* Operational costs
* Market price changes
* Resale margin

### Estimated iPhone 18 Pro Resale Condition Ranges

| Condition | Possible Resale Position | Estimated Valuation % |
| :--- | :--- | :--- |
| Brand New / Sealed Box | Highest resale value | 85% to 92% |
| Like New (Flawless) | Very high | 75% to 85% |
| Excellent Condition | High | 65% to 75% |
| Good Condition | Moderate-high | 55% to 65% |
| Visible Scratches | Lower | 45% to 55% |
| Cracked Screen | Significantly lower | 30% to 40% |

---

## Why the iPhone 18 Pro Holds Value Well

### 1. Strong Apple Demand in Dubai

Apple has a particularly strong position in the UAE's premium smartphone market.

The iPhone 18 Pro is positioned as Apple's flagship professional smartphone, meaning there is likely to be continued demand from customers looking for a premium iPhone without purchasing it brand new.

### 2. Premium Hardware Specifications

The iPhone 18 Pro introduces Apple's A20 Pro processor, an upgraded camera system and improved battery performance. Its main camera now includes a variable-aperture system, giving users additional control over photography.

---

## Critical Factors Affecting iPhone 18 Pro Resale Value

### 1. Battery Health Percentage

Battery health has a direct impact on the value of a used iPhone:
* 90% to 100% Battery Health: Receives top-tier buyout offers.
* Below 80% Battery Health: Can receive an offer roughly 15% to 20% lower due to battery replacement costs.

Tip: Check Settings -> Battery -> Battery Health & Charging before requesting a valuation.

### 2. Physical Condition and Screen Repairs

Devices with original Apple components command higher offers. Third-party replacement screens or visible scratches reduce resale offers.

---

## Selling for Cash vs. Apple Trade-In

* Apple Trade In: Generally provides credit toward another Apple purchase.
* SellPhoneCash: Provides direct cash buyout with free doorstep pickup across Dubai, Abu Dhabi, and Sharjah within 3 hours.

---

## Get Your iPhone 18 Pro Cash Valuation

Find out how much your iPhone is worth today and arrange a convenient sale from your location in Dubai.

[Get Instant Device Valuation](/services/smartphones/apple)`,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
    category: "Price Analysis",
    author: "Shantanukumar K.",
    views: 1420,
    likes: 89,
  },
  {
    title: "UAE Used iPhone Resale Price Index 2026: When Is the Best Time to Sell?",
    slug: "uae-used-iphone-resale-price-index-2026",
    desc: "Detailed market analysis on depreciation curves for iPhone 15 Pro, iPhone 14 Pro, and how to maximize your trade-in cash value before new models drop in Dubai.",
    content: `Selling your used iPhone in Dubai or Abu Dhabi at the right moment can mean the difference between getting top-tier resale value or losing 20 to 30 percent to market depreciation.

### Understanding the 2026 Depreciation Curve
Smartphones depreciate non-linearly. High-end flagships like the iPhone 15 Pro Max retain up to 65 percent of their initial value during year one, but experience sudden valuation dips 4 to 6 weeks before annual release cycles.

### Key Factors Driving UAE Resale Prices
1. Battery Health: Devices maintaining over 85 percent battery health command higher buyout prices.
2. Storage Tier: 256GB and 512GB models hold a higher percentage of their initial premium compared to base 128GB units.
3. Physical Condition: Minor cosmetic micro-scratches are normal, but pristine screens with zero OLED burn-in qualify for our Flawless tier.

### Pro Tip for Maximum Cash Payout
Lock in your valuation with SellPhoneCash early. We guarantee your price quote for 7 full days, protecting you against unexpected market shifts.`,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
    category: "Price Analysis",
    author: "Shantanukumar K.",
    views: 1280,
    likes: 74,
  },
  {
    title: "Complete Data Erasure & Sanitization Guide Before Handing Over Your Device",
    slug: "complete-data-erasure-sanitization-guide",
    desc: "Step-by-step instructions for backing up photos, unlinking iCloud and Google accounts, and performing DOD-standard factory resets on iOS and Android.",
    content: `Your privacy and personal data security are paramount when selling or recycling a used smartphone or laptop. Before handing over any device to a trade-in service, follow this safety checklist.

### 1. Perform a Full Cloud Backup
Ensure all photos, WhatsApp messages, contacts, and personal documents are safely synced to iCloud or Google Drive.

### 2. Sign Out of Ecosystem Accounts
* iOS: Go to Settings -> Tap your Apple ID -> Sign Out of iCloud and Find My iPhone.
* Android: Go to Settings -> Accounts -> Remove all Google accounts and Device Protection locks.

### 3. Factory Reset & Encryption Wiping
Modern iOS and Android devices encrypt all user data by default. Executing a factory reset securely overwrites the cryptographic key, making recovery impossible.

At SellPhoneCash, every collected device undergoes automated DoD 5220.22-M compliant data sanitization to guarantee 100 percent privacy compliance.`,
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    category: "Recycling Tips",
    author: "Elena Rostova",
    views: 980,
    likes: 64,
  },
  {
    title: "MacBook M-Series Trade-In Guide: How M1, M2 & M3 Laptops Hold Value",
    slug: "macbook-m-series-trade-in-guide-resale-value",
    desc: "Comparing resale performance across MacBook Air and MacBook Pro M1, M2, and M3 chips in the GCC market.",
    content: `Apple's transition to Silicon architecture revolutionized laptop performance and drastically slowed down hardware obsolescence. As a result, M-series MacBooks command some of the highest resale values in the UAE electronics market.

### Valuation Breakdown by Chip Generation
* MacBook Pro M3 Max / M3 Pro: Retains peak value due to immense popularity among video editors and developers in Dubai tech hubs.
* MacBook Air M2: The most sought-after ultraportable laptop for students and business travelers.
* MacBook Pro M1 (2020-2021): Still holds strong trade-in demand thanks to solid performance headroom.

### How to Get the Highest Buyout Quote for Your Laptop
* Include the original MagSafe 3 charger and USB-C power adapter.
* Clean the Liquid Retina display gently with isopropyl alcohol wipes.
* Check cycle count in System Settings -> Power (under 300 cycles gets top tier pricing).`,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    category: "Buying Guides",
    author: "Ibrahim W.",
    views: 1150,
    likes: 78,
  },
  {
    title: "E-Waste in the UAE: Why Selling Your Old Electronics Protects the Environment",
    slug: "e-waste-uae-selling-old-electronics-environment-protection",
    desc: "How circular economy initiatives in Dubai and Abu Dhabi turn discarded smartphones, tablets, and smartwatches into valuable recycled materials.",
    content: `Electronic waste (e-waste) is one of the fastest-growing waste streams globally. Millions of unused smartphones, broken tablets, and outdated smartwatches sit forgotten in drawers across the UAE.

### The Environmental Impact of Unused Tech
Discarded electronics contain heavy metals like lithium, cobalt, and copper. When improperly disposed of in landfills, these materials can leach into soil and water systems.

### The Power of Circular Trade-In
By selling your old tech to SellPhoneCash, your device enters a certified refurbishment and recycling pipeline:
1. Devices in working condition are refurbished and given a second life.
2. Non-functional devices are safely dismantled, salvaging valuable precious metals.

Join our green initiative today and get paid cash on the spot while reducing carbon footprint!`,
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    category: "Recycling Tips",
    author: "Team SellPhoneCash",
    views: 840,
    likes: 52,
  },
  {
    title: "Gaming Console Resale Comparison: PS5 Pro, PS5 Slim, Xbox Series X & Switch OLED",
    slug: "gaming-console-resale-comparison-ps5-pro-xbox-switch",
    desc: "Current market trade-in prices for gaming consoles and handheld PCs like Steam Deck and ROG Ally X in UAE.",
    content: `Thinking about upgrading your gaming setup? The gaming console resale market in Dubai is thriving, with high demand for pre-owned PlayStation, Xbox, and portable gaming PCs.

### Resale Demand Ranking in GCC
1. PlayStation 5 Slim & Pro: Highest demand and fastest turnover rate.
2. Steam Deck OLED & ROG Ally X: Enthusiast handheld PCs command premium resale rates.
3. Nintendo Switch OLED: Extremely steady value retention.

### Preparing Your Console for Pickup
Reset your console to factory settings, remove account passcodes, and bundle controllers and power cables for maximum payout!`,
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop",
    category: "Buying Guides",
    author: "Marcus Vance",
    views: 1650,
    likes: 112,
  }
];

const seedBlogs = async () => {
  try {
    await connectToMongoDB();
    console.log("Seeding clean, emoji-free blog articles into MongoDB...");

    for (const b of sampleBlogs) {
      await Blog.findOneAndUpdate(
        { slug: b.slug },
        { $set: b },
        { upsert: true, new: true }
      );
    }

    console.log("Successfully seeded all blog articles!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed blogs:", err);
    process.exit(1);
  }
};

seedBlogs();
