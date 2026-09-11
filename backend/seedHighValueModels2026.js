import "dotenv/config";
import fs from "fs";
import path from "path";
import { connectToMongoDB } from "./config/db.js";
import Category from "./models/Category.js";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";

const DEFAULT_IMAGE_MAP = {
  iphone18promax: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro-max.png",
  iphone18pro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro.png",
  iphone18slim: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-plus.png",
  iphone18: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16.png",
  iphone18fold: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-16-pro-max.png",
  iphonese4: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/iphone-se-3rd-gen.png",
  s26ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-s24-ultra.png",
  s25ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-s24-ultra.png",
  zfold7: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  zflip7: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-flip-6.png",
  macbookm5max: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-pro-16.png",
  macbookm4air: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-air-15.png",
  macstudiom4: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/macbook-pro-16.png",
  msititan: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/dell-alienware-m16.png",
  huaweimatext: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  honormagicv3: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-z-fold-6.png",
  xiaomi15ultra: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/oneplus-12.png",
  vivox200pro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/pixel-8-pro.png",
  visionpro: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  garminfenix8: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  garminmarq: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png",
  huaweiwatchgold: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/samsung-watch-6-classic.png",
  switch2: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/nintendo-switch-oled.png",
  airpodsmax2: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/apple-watch-ultra-2.png"
};

const NEW_BRANDS = [
  { name: "Huawei", slug: "huawei", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/huawei-logo.png" },
  { name: "Honor", slug: "honor", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/honor-logo.png" },
  { name: "Vivo", slug: "vivo", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/vivo-logo.png" },
  { name: "MSI", slug: "msi", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/msi-logo.png" },
  { name: "Garmin", slug: "garmin", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/garmin-logo.png" },
  { name: "GPD", slug: "gpd", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/gpd-logo.png" },
  { name: "Focal", slug: "focal", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/focal-logo.png" },
  { name: "Bose", slug: "bose", logo: "https://res.cloudinary.com/xwjzpwxq/image/upload/v1725700000/bose-logo.png" }
];

function generateSEODescription(name, category, highlights) {
  return `Looking to sell your used or pre-owned ${name} for instant top cash in Dubai, Abu Dhabi, Sharjah, or anywhere in the UAE? SellPhoneCash is the UAE's #1 trusted device buyback platform offering guaranteed highest market quotes, zero hidden charges, and 100% free doorstep pickup within 30 minutes.

### Why Trade In Your ${name} with SellPhoneCash?
- 🚀 **Instant Online Valuation:** Get an exact cash quote for your ${name} in under 30 seconds based on your storage capacity and physical condition.
- 🚚 **Free Doorstep Pickup:** Our courier representative collects your ${name} directly from your home, office, or hotel in Dubai, Abu Dhabi, Sharjah, Ajman, and Ras Al Khaimah.
- 💵 **On-the-Spot Instant Cash:** Receive instant cash payment or immediate bank transfer before handover.
- 🔒 **Certified 100% Data Wiping:** We perform complete data erasure following international privacy standards so your personal files, accounts, and photos remain 100% secure.

### Product Features & Specs:
${highlights}

Upgrade to your next tech device stress-free today. Select your ${name} condition above for an instant online payout estimate!`;
}

const NEW_HIGH_VALUE_PRODUCTS = [
  // APPLE IPHONE 18 & 17 LINEUP
  {
    name: "iPhone 18 Pro Max",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 4800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 900 },
      { size: "2TB", priceBoost: 1500 }
    ],
    colors: ["Space Black Titanium", "Natural Titanium", "Desert Titanium", "Deep Red Titanium"],
    shortDescription: "Next-Gen 2026 Flagship iPhone 18 Pro Max with A20 Bionic, 2TB Storage option & 100% Instant Cash Payout.",
    description: generateSEODescription(
      "iPhone 18 Pro Max",
      "smartphone",
      "- Next-generation Apple Silicon A20 Pro Bionic Bionic Chip\n- Up to 2TB Ultra High Speed Storage\n- Titanium Frame with Variable Aperture Triple Camera System\n- ProMotion 120Hz LTPO Super Retina XDR Display"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18promax },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Pro",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 4100,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 300 },
      { size: "512GB", priceBoost: 700 },
      { size: "1TB", priceBoost: 1200 }
    ],
    colors: ["Space Black Titanium", "Natural Titanium", "Desert Titanium"],
    shortDescription: "Pro-level 2026 iPhone 18 Pro with Titanium Design, ProMotion & Instant Doorstep Cash Pickup in Dubai.",
    description: generateSEODescription(
      "iPhone 18 Pro",
      "smartphone",
      "- Apple A20 Pro Bionic processor with enhanced Neural Engine\n- Compact 6.3-inch ProMotion Super Retina XDR OLED\n- Triple 48MP Pro camera array with 5x optical zoom\n- All-day battery life with fast MagSafe charging"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18pro },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Slim / Air",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 3400,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 300 },
      { size: "512GB", priceBoost: 650 }
    ],
    colors: ["Space White", "Sky Blue", "Graphite"],
    shortDescription: "Ultra-thin 2026 iPhone 18 Air / Slim flagship with premium aluminum body & top valuation in UAE.",
    description: generateSEODescription(
      "iPhone 18 Slim / Air",
      "smartphone",
      "- Ultra-thin featherweight chassis design\n- Next-gen OLED Super Retina display with ceramic shield\n- High-efficiency A19 Bionic chip\n- Advanced single-lens computational photography"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18slim },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 2900,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 250 },
      { size: "512GB", priceBoost: 550 }
    ],
    colors: ["Ultramarine", "Teal", "Pink", "White", "Black"],
    shortDescription: "Base model 2026 iPhone 18 with vibrant OLED display, Dual Camera & 30-min pickup in UAE.",
    description: generateSEODescription(
      "iPhone 18",
      "smartphone",
      "- Apple A19 Bionic Chip with 6-core GPU\n- Dynamic Island & Action Button integration\n- Dual 48MP Fusion Camera system\n- Next-Gen aluminum chassis with color-infused glass back"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone 18 Fold",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 5200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1100 }
    ],
    colors: ["Space Black", "Titanium Silver"],
    shortDescription: "Apple's first ultra-luxury Foldable iPhone 18 Fold. Sell online for highest cash rate in Dubai.",
    description: generateSEODescription(
      "iPhone 18 Fold",
      "smartphone",
      "- Revolutionary inner crease-free flexible OLED panel\n- Dual Pro-grade camera sensors with Apple Intelligence\n- Custom titanium gear hinge architecture\n- Seamless iOS foldable multitasking mode"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphone18fold },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "iPhone SE (4th Gen OLED)",
    brandSlug: "apple",
    category: "smartphones",
    basePrice: 1300,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 200 }
    ],
    colors: ["Midnight", "Starlight", "RED"],
    shortDescription: "Budget-friendly 4th Gen iPhone SE with OLED, Face ID & Action Button. Fast cash payout.",
    description: generateSEODescription(
      "iPhone SE 4th Gen",
      "smartphone",
      "- 6.1-inch OLED Display with Face ID\n- Single 48MP Fusion Main Camera\n- A18 Bionic Chip with Apple Intelligence support\n- USB-C charging port"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.iphonese4 },
    isPopular: false,
    isLivePrice: true
  },

  // SAMSUNG GALAXY NEXT-GEN
  {
    name: "Samsung Galaxy S26 Ultra",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 4200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 450 },
      { size: "1TB", priceBoost: 950 }
    ],
    colors: ["Titanium Black", "Titanium Violet", "Titanium Yellow"],
    shortDescription: "2026 Samsung Galaxy S26 Ultra with 200MP Quad Telephoto, S-Pen & Instant UAE Cash Collection.",
    description: generateSEODescription(
      "Samsung Galaxy S26 Ultra",
      "smartphone",
      "- Snapdragon 8 Gen 5 for Galaxy Processor\n- Built-in S-Pen stylus with AI gesture control\n- 200MP Quad Camera with 100x Space Zoom\n- Anti-reflective Corning Gorilla Armor 6.8-inch QHD+ AMOLED"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.s26ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 3500,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 850 }
    ],
    colors: ["Titanium Gray", "Titanium Black"],
    shortDescription: "Galaxy S25 Ultra with Titanium frame, Galaxy AI & Top Cash Valuation in Dubai & Abu Dhabi.",
    description: generateSEODescription(
      "Samsung Galaxy S25 Ultra",
      "smartphone",
      "- Snapdragon 8 Gen 4 / Elite Chipset\n- Flat 6.8-inch Dynamic AMOLED 2X display\n- Advanced Galaxy AI live translation & photo editing\n- 5000mAh battery with 45W fast charging"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.s25ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Samsung Galaxy Z Fold 7",
    brandSlug: "samsung",
    category: "smartphones",
    basePrice: 4400,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1000 }
    ],
    colors: ["Crafted Black", "Navy", "Silver Shadow"],
    shortDescription: "Ultra slim Galaxy Z Fold 7 foldable smartphone with dual AMOLED screens & top cash payout.",
    description: generateSEODescription(
      "Samsung Galaxy Z Fold 7",
      "smartphone",
      "- Ultra-thin dual AMOLED foldable design\n- Snapdragon 8 Gen 5 Flagship processor\n- 50MP Triple Camera setup with 3x optical zoom\n- Armor Aluminum & IP48 water resistance"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.zfold7 },
    isPopular: true,
    isLivePrice: true
  },

  // ULTRA LUXURY FOLDABLES & CAMERAS
  {
    name: "Huawei Mate XT Ultimate (Tri-Fold)",
    brandSlug: "huawei",
    category: "smartphones",
    basePrice: 7200,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 800 },
      { size: "1TB", priceBoost: 1600 }
    ],
    colors: ["Ruihong Red", "Dark Black"],
    shortDescription: "World's First Triple-Folding Smartphone Huawei Mate XT. Get top luxury trade-in price in Dubai.",
    description: generateSEODescription(
      "Huawei Mate XT Ultimate Design Tri-Fold",
      "smartphone",
      "- World's first 10.2-inch Triple-Folding OLED Display\n- XMAGE camera system with variable physical aperture\n- Kirin 9010 5G processor with HarmonyOS Next\n- Genuine leather and gold accents finish"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.huaweimatext },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Honor Magic V3",
    brandSlug: "honor",
    category: "smartphones",
    basePrice: 3800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 500 },
      { size: "1TB", priceBoost: 1000 }
    ],
    colors: ["Redwood Brown", "Velvet Black", "Green"],
    shortDescription: "World's thinnest dual-screen foldable Honor Magic V3. Free doorstep pickup & instant cash in UAE.",
    description: generateSEODescription(
      "Honor Magic V3",
      "smartphone",
      "- World's thinnest 9.2mm folded thickness\n- Snapdragon 8 Gen 3 Flagship processor\n- Falcon Camera system with 50MP Periscope telephoto\n- 5150mAh Silicon-Carbon Battery"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.honormagicv3 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Xiaomi 15 Ultra",
    brandSlug: "xiaomi",
    category: "smartphones",
    basePrice: 2900,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 400 },
      { size: "1TB", priceBoost: 850 }
    ],
    colors: ["Black Vegan Leather", "White Ceramic"],
    shortDescription: "Leica Quad-Camera Xiaomi 15 Ultra with 1-inch sensor & 200MP Telephoto. Immediate cash quote.",
    description: generateSEODescription(
      "Xiaomi 15 Ultra",
      "smartphone",
      "- Leica Quad Camera system featuring 1-inch main sensor & 200MP Periscope\n- Snapdragon 8 Elite Processor\n- 2K WQHD+ AMOLED 120Hz Display\n- 90W HyperCharge & 80W Wireless Charging"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.xiaomi15ultra },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Vivo X200 Pro",
    brandSlug: "vivo",
    category: "smartphones",
    basePrice: 2750,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 350 },
      { size: "1TB", priceBoost: 750 }
    ],
    colors: ["Titanium Gray", "Ocean Blue"],
    shortDescription: "Zeiss APO Telephoto Camera monster Vivo X200 Pro. Fast cash pickup across Dubai & Sharjah.",
    description: generateSEODescription(
      "Vivo X200 Pro",
      "smartphone",
      "- Zeiss APO 200MP Telephoto Lens with T* anti-reflective coating\n- MediaTek Dimensity 9400 / Snapdragon 8 Elite\n- 6000mAh BlueVolt battery\n- 1.5K 120Hz Eye Protection AMOLED"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.vivox200pro },
    isPopular: false,
    isLivePrice: true
  },

  // MACBOOKS & WORKSTATIONS
  {
    name: "MacBook Pro 16\" M5 Max (2026)",
    brandSlug: "apple",
    category: "laptops",
    basePrice: 8500,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 1000 },
      { size: "4TB", priceBoost: 2500 }
    ],
    colors: ["Space Black", "Silver"],
    shortDescription: "Ultimate M5 Max Apple Silicon 16-inch Workstation Laptop. Sell for maximum cash value in UAE.",
    description: generateSEODescription(
      "MacBook Pro 16-inch M5 Max",
      "laptop",
      "- Apple M5 Max Chip with 40-core GPU & 128GB Unified Memory\n- 16.2-inch Liquid Retina XDR Display with 1600 nits peak brightness\n- Up to 22 hours battery life\n- HDMI 2.1, SDXC card slot, 3x Thunderbolt 5 ports"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.macbookm5max },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "MacStudio M4 Ultra",
    brandSlug: "apple",
    category: "laptops",
    basePrice: 9200,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 1200 },
      { size: "4TB", priceBoost: 2800 }
    ],
    colors: ["Silver"],
    shortDescription: "Mac Studio M4 Ultra desktop workstation. Sell pre-owned Apple hardware for instant cash in Dubai.",
    description: generateSEODescription(
      "Mac Studio M4 Ultra Desktop",
      "laptop / workstation",
      "- M4 Ultra chip delivering 32 CPU cores and 80 GPU cores\n- Support for up to 8 8K displays simultaneously\n- Silent thermal architecture with copper heat sink\n- Thunderbolt 5 & 10Gb Ethernet connectivity"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.macstudiom4 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "MSI Titan 18 HX",
    brandSlug: "msi",
    category: "laptops",
    basePrice: 8200,
    storages: [
      { size: "1TB", priceBoost: 0 },
      { size: "2TB", priceBoost: 900 },
      { size: "4TB", priceBoost: 2200 }
    ],
    colors: ["Core Black"],
    shortDescription: "18-inch 4K Mini-LED RTX 4090/5090 MSI Titan 18 HX Gaming Workstation. Immediate doorstep payout.",
    description: generateSEODescription(
      "MSI Titan 18 HX Gaming Laptop",
      "laptop",
      "- Intel Core i9-14900HX / 15th Gen HX Processor\n- Nvidia GeForce RTX 4090 / 5090 16GB VRAM\n- 18-inch 4K 120Hz Mini-LED Display\n- Cherry MX Mechanical Keyboard & Vapor Chamber Cooling"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.msititan },
    isPopular: true,
    isLivePrice: true
  },

  // SPATIAL & SMARTWATCHES
  {
    name: "Apple Vision Pro",
    brandSlug: "apple",
    category: "smartwatches",
    basePrice: 7800,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 600 },
      { size: "1TB", priceBoost: 1200 }
    ],
    colors: ["Solo Knit / Dual Loop"],
    shortDescription: "Apple Vision Pro Spatial Computing Headset. Trade in for top cash rate across Dubai & Abu Dhabi.",
    description: generateSEODescription(
      "Apple Vision Pro Spatial Computer Headset",
      "spatial headset / smartwatch",
      "- Dual 4K Micro-OLED displays with 23 million pixels\n- M2 & R1 dual-chip architecture for real-time spatial video\n- Eye & Hand tracking navigation interface\n- Aluminum alloy frame with 3D laminated glass"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.visionpro },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Garmin Fenix 8 (51mm AMOLED Sapphire)",
    brandSlug: "garmin",
    category: "smartwatches",
    basePrice: 2200,
    storages: [
      { size: "Standard 32GB", priceBoost: 0 }
    ],
    colors: ["DLC Titanium / Orange", "Black Titanium"],
    shortDescription: "Diver-rated 51mm AMOLED Sapphire Garmin Fenix 8 GPS Watch. Instant quote & free collection.",
    description: generateSEODescription(
      "Garmin Fenix 8 51mm AMOLED Sapphire",
      "smartwatch",
      "- 1.4-inch AMOLED display with scratch-resistant Sapphire lens\n- Built-in speaker & microphone for voice calls & commands\n- Diver-rated up to 40 meters with leakproof buttons\n- Multi-band GPS with SatIQ technology"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.garminfenix8 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Garmin Marq Gen 2 Commander",
    brandSlug: "garmin",
    category: "smartwatches",
    basePrice: 3600,
    storages: [
      { size: "Titanium 32GB", priceBoost: 0 }
    ],
    colors: ["Grade-5 Titanium"],
    shortDescription: "Grade-5 Titanium luxury Garmin Marq Gen 2 Commander. Sell pre-owned luxury watch in Dubai.",
    description: generateSEODescription(
      "Garmin Marq Gen 2 Commander",
      "smartwatch",
      "- Crafted from Grade-5 Titanium with domed sapphire lens\n- Tactical stealth mode & kill switch features\n- Preloaded TopoActive maps & aviation navigation\n- Up to 16 days battery life in smartwatch mode"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.garminmarq },
    isPopular: false,
    isLivePrice: true
  },
  {
    name: "Huawei Watch Ultimate (18K Gold Edition)",
    brandSlug: "huawei",
    category: "smartwatches",
    basePrice: 6500,
    storages: [
      { size: "Standard", priceBoost: 0 }
    ],
    colors: ["18K Solid Gold / Ceramic Black"],
    shortDescription: "Luxury 18K Solid Gold Inlay Huawei Watch Ultimate. Sell for highest cash quote in Dubai.",
    description: generateSEODescription(
      "Huawei Watch Ultimate 18K Gold Edition",
      "smartwatch",
      "- 18K Solid Gold embedded bezel and crown\n- Zirconium-based liquid metal case\n- 100-meter scuba diving grade water resistance\n- 14 days battery life with fast wireless charging"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.huaweiwatchgold },
    isPopular: true,
    isLivePrice: true
  },

  // GAMING HANDHELDS & AUDIO
  {
    name: "Nintendo Switch 2",
    brandSlug: "nintendo",
    category: "games",
    basePrice: 1150,
    storages: [
      { size: "256GB", priceBoost: 0 },
      { size: "512GB", priceBoost: 250 }
    ],
    colors: ["Neon Red/Blue", "Matte Black"],
    shortDescription: "Nintendo Switch 2 Next-Gen Handheld Console. Sell online with doorstep cash pickup in UAE.",
    description: generateSEODescription(
      "Nintendo Switch 2",
      "gaming console",
      "- Custom Nvidia Tegra T239 Processor with DLSS upscaling\n- 8-inch 1080p 120Hz HDR LCD Screen\n- Magnetic Joy-Con attachments & backward compatibility\n- 4K TV docked output resolution"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.switch2 },
    isPopular: true,
    isLivePrice: true
  },
  {
    name: "Apple AirPods Max 2 (USB-C)",
    brandSlug: "apple",
    category: "smartwatches",
    basePrice: 1250,
    storages: [
      { size: "Standard", priceBoost: 0 }
    ],
    colors: ["Midnight", "Starlight", "Blue", "Purple", "Orange"],
    shortDescription: "Apple AirPods Max 2 with USB-C, Lossless Audio & Active Noise Cancellation. Immediate payout.",
    description: generateSEODescription(
      "Apple AirPods Max 2 (USB-C)",
      "headphones / smartwatch",
      "- USB-C port supporting Lossless wired audio\n- Apple-designed dynamic driver with dual H1 chips\n- Active Noise Cancellation with Transparency mode\n- Memory foam ear cushions & stainless steel canopy"
    ),
    images: { frontView: DEFAULT_IMAGE_MAP.airpodsmax2 },
    isPopular: true,
    isLivePrice: true
  }
];

async function seedHighValueModels() {
  try {
    console.log("⚡ Connecting to MongoDB for SellPhoneCash...");
    await connectToMongoDB();

    const initialProductCount = await Product.countDocuments();
    const initialBrandCount = await Brand.countDocuments();
    console.log(`📊 Initial State: ${initialBrandCount} Brands, ${initialProductCount} Products.`);

    // 1. CREATE AUTOMATIC BACKUP BEFORE SEEDING
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    
    const productsBackup = await Product.find({}).lean();
    const brandsBackup = await Brand.find({}).lean();
    const categoriesBackup = await Category.find({}).lean();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `pre-seed-2026-high-value-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify({ products: productsBackup, brands: brandsBackup, categories: categoriesBackup }, null, 2));
    console.log(`🔒 Automatic Pre-seed Backup created at: ${backupPath}`);

    // 2. UPSERT NEW BRANDS
    console.log("\n🏷️ Processing Brands...");
    const brandMap = {};
    const existingBrands = await Brand.find({});
    existingBrands.forEach(b => { brandMap[b.slug] = b._id; });

    for (const bData of NEW_BRANDS) {
      const brand = await Brand.findOneAndUpdate(
        { slug: bData.slug },
        { name: bData.name, slug: bData.slug, logo: bData.logo },
        { upsert: true, new: true }
      );
      brandMap[bData.slug] = brand._id;
      console.log(`  ✅ Brand Upserted: ${bData.name} (${bData.slug})`);
    }

    // 3. UPSERT NEW HIGH VALUE PRODUCTS WITH RICH SEO DESCRIPTIONS
    console.log("\n📦 Processing 2026 High-Value Products with SEO descriptions...");
    let addedCount = 0;
    let updatedCount = 0;

    for (const pData of NEW_HIGH_VALUE_PRODUCTS) {
      const brandId = brandMap[pData.brandSlug];
      if (!brandId) {
        console.warn(`⚠️ Warning: Brand slug ${pData.brandSlug} not found. Skipping ${pData.name}.`);
        continue;
      }

      const productPayload = {
        name: pData.name,
        brand: brandId,
        category: pData.category,
        basePrice: pData.basePrice,
        storages: pData.storages,
        colors: pData.colors,
        description: pData.description,
        shortDescription: pData.shortDescription,
        images: pData.images,
        isPopular: pData.isPopular,
        isLivePrice: pData.isLivePrice
      };

      const existing = await Product.findOne({ name: pData.name });
      if (existing) {
        await Product.updateOne({ _id: existing._id }, productPayload);
        updatedCount++;
        console.log(`  🔄 Product Updated: ${pData.name}`);
      } else {
        await Product.create(productPayload);
        addedCount++;
        console.log(`  ✨ Product Created: ${pData.name}`);
      }
    }

    const finalProductCount = await Product.countDocuments();
    const finalBrandCount = await Brand.countDocuments();

    console.log("\n==========================================");
    console.log(`🎉 SEEDING COMPLETE FOR SELLPHONECASH!`);
    console.log(`📈 Brands: ${initialBrandCount} -> ${finalBrandCount}`);
    console.log(`📦 Products: ${initialProductCount} -> ${finalProductCount} (Added: ${addedCount}, Updated: ${updatedCount})`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seedHighValueModels();
