export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoStat {
  value: string;
  label: string;
}

export interface SeoFeature {
  title: string;
  description: string;
  iconName?: string;
}

export interface ServicePageData {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  targetKeywords: string[];
  categorySlug: string;
  catalogLink: string;
  heroBadge: string;
  introText: string[];
  sellingSteps: { title: string; desc: string }[];
  acceptedConditions: { title: string; desc: string; badge: string }[];
  priceRangeEstimate: string;
  popularModels: { name: string; slug: string; startingPrice: string }[];
  faqs: SeoFaq[];
  relatedLocations: string[];
  relatedServices: string[];
}

export interface ModelPageData {
  slug: string;
  brand: string;
  modelName: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  targetKeywords: string[];
  categorySlug: string;
  catalogLink: string;
  heroBadge: string;
  estimatedPriceRange: string;
  specsSummary: string[];
  conditionPrices: { condition: string; estimate: string; notes: string }[];
  whySellWithUs: string[];
  faqs: SeoFaq[];
  relatedModels: string[];
  relatedLocations: string[];
}

export interface LocationPageData {
  slug: string;
  locationName: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  targetKeywords: string[];
  pickupSpeed: string;
  keyLandmarks: string[];
  coverageDescription: string;
  neighborhoodsServed: string[];
  serviceHighlights: string[];
  faqs: SeoFaq[];
  relatedLocations: string[];
  topModels: string[];
}

// -------------------------------------------------------------
// 1. SERVICE PAGES (7 Pages)
// -------------------------------------------------------------
export const SERVICE_PAGES: Record<string, ServicePageData> = {
  "iphone-dubai": {
    slug: "iphone-dubai",
    title: "Sell iPhone in Dubai | Instant Cash On The Spot | SellPhoneCash",
    metaDescription: "Sell your used or new iPhone in Dubai for the highest cash payout. Free doorstep pickup within 3 hours across all Dubai areas. Instant payment guaranteed.",
    h1: "Sell iPhone in Dubai for Instant Cash",
    subtitle: "Turn your pre-owned, sealed, or even broken Apple iPhone into immediate cash today. Free collection at your home, office, or cafe anywhere in Dubai.",
    targetKeywords: ["sell iphone dubai", "sell used iphone dubai", "iphone buyback dubai", "cash for iphone uae", "sell broken iphone dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "Top Cash for All iPhone Models",
    introText: [
      "Looking to upgrade to the latest Apple flagship or simply cash in on your existing device? SellPhoneCash offers the highest competitive cash buyback rates for iPhones across Dubai and the UAE.",
      "Whether you have the brand new iPhone 16 Pro Max, an iPhone 15, or an older iPhone 11 or 12, our transparent digital valuation system ensures you get honest market rates with zero hidden inspection fees.",
      "We provide complimentary, licensed courier pickup at your doorstep in under 3 hours, test your device in front of you, and hand over cash or instant bank transfer on the spot."
    ],
    sellingSteps: [
      { title: "1. Select Model & Condition", desc: "Choose your iPhone model, storage capacity, and cosmetic grade to receive a transparent price guarantee." },
      { title: "2. Free 3-Hour Doorstep Pickup", desc: "Our verified field specialist meets you anywhere in Dubai — Marina, Downtown, JLT, Deira, or DSO." },
      { title: "3. On-The-Spot Cash Payout", desc: "Fast 2-minute diagnostic check followed by immediate cash in hand or instant UAE bank transfer." }
    ],
    acceptedConditions: [
      { title: "Brand New / Sealed", desc: "Original box unopened with valid UAE / International warranty. Maximum payout.", badge: "100% Value" },
      { title: "Flawless / Like New", desc: "No scratches, clean battery health, all original sensors (FaceID, TrueTone) functional.", badge: "Top Market" },
      { title: "Good / Minor Wear", desc: "Light pocket scuffs or hairline marks. Fully operational hardware and cameras.", badge: "High Payout" },
      { title: "Cracked Screen / Broken", desc: "Shattered display, cracked back glass, or degraded battery. We still pay cash!", badge: "Fair Cash" }
    ],
    priceRangeEstimate: "AED 650 - AED 4,800",
    popularModels: [
      { name: "iPhone 16 Pro Max", slug: "iphone-pro-max", startingPrice: "AED 3,600" },
      { name: "iPhone 16 / 16 Plus", slug: "iphone-16", startingPrice: "AED 2,500" },
      { name: "iPhone 15 Pro / Max", slug: "iphone-15", startingPrice: "AED 2,200" },
      { name: "iPhone 14 Series", slug: "iphone-14", startingPrice: "AED 1,450" },
      { name: "iPhone 13 Series", slug: "iphone-13", startingPrice: "AED 1,100" }
    ],
    faqs: [
      {
        question: "How do I get the highest price when selling my iPhone in Dubai?",
        answer: "To maximize your iPhone valuation, ensure your iCloud account is signed out, bring the original box and accessories if available, and keep the exterior clean. Our transparent pricing locks your valuation for 7 full days."
      },
      {
        question: "Do you buy broken or water-damaged iPhones?",
        answer: "Yes! We purchase iPhones with cracked screens, damaged back glass, faulty Face ID, battery service warnings, and non-working cameras. Simply select 'Broken' condition during valuation."
      },
      {
        question: "How fast is doorstep pickup in Dubai?",
        answer: "We offer express courier pickup within 3 hours anywhere in Dubai, including Dubai Marina, Downtown, Business Bay, JLT, Deira, Bur Dubai, and Dubai Silicon Oasis."
      },
      {
        question: "How will I be paid for my iPhone?",
        answer: "You can choose between physical cash in UAE Dirhams (AED) handed to you directly upon inspection or an instant bank wire transfer directly to your UAE bank account."
      },
      {
        question: "Is my personal data wiped securely?",
        answer: "Absolutely. We follow strict international data sanitization protocols. We verify with you that 'Find My iPhone' is disabled and perform a factory reset adhering to UAE privacy and electronic recycling standards."
      }
    ],
    relatedLocations: ["dubai-marina", "downtown-dubai", "jlt", "business-bay", "deira", "jumeirah"],
    relatedServices: ["phone-for-cash-dubai", "used-phone-dubai", "broken-phone-dubai", "phone-buyback-dubai"]
  },

  "samsung-dubai": {
    slug: "samsung-dubai",
    title: "Sell Samsung in Dubai | Best Cash Value Today | SellPhoneCash",
    metaDescription: "Sell your used Samsung Galaxy in Dubai. We buy Galaxy S24, S23, Z Fold, Z Flip, and Note devices for top instant cash. Free 3-hour doorstep collection.",
    h1: "Sell Samsung Phone in Dubai for Immediate Cash",
    subtitle: "Get the best market valuation for your Samsung Galaxy S-Series, Z Fold, Z Flip, or A-Series smartphone. Fast, reliable, and completely hassle-free.",
    targetKeywords: ["sell samsung dubai", "sell samsung galaxy uae", "samsung buyback dubai", "cash for used samsung phone", "sell galaxy fold dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Top Payout for Galaxy S & Foldables",
    introText: [
      "Upgrading to the newest Samsung Galaxy or switching ecosystems? SellPhoneCash guarantees top-tier cash offers for pre-owned Samsung smartphones in Dubai.",
      "From high-end flagships like Galaxy S24 Ultra and Galaxy Z Fold6 to dependable daily drivers like the Galaxy A-series, we assess your phone based on real-time market trends.",
      "Skip classified scams and lowball market offers. With our dedicated courier service, you get verified pickup and instant payment at your convenience."
    ],
    sellingSteps: [
      { title: "1. Instant Valuation", desc: "Choose your Samsung Galaxy series and current condition to get a live market quote." },
      { title: "2. Schedule Free Pickup", desc: "Select your preferred time slot anywhere across Dubai. Our agent arrives promptly." },
      { title: "3. Quick Check & Cash", desc: "A rapid 2-minute diagnostic check is performed and cash is handed to you immediately." }
    ],
    acceptedConditions: [
      { title: "Sealed & Brand New", desc: "Factory sealed with official UAE distributor warranty (TRA/TDRA). Top premium.", badge: "Top Dirhams" },
      { title: "Excellent / Flawless", desc: "Pristine AMOLED screen without burn-in, mint housing, 100% working stylus/cameras.", badge: "Top Tier" },
      { title: "Good Condition", desc: "Minor bezel scuffs or normal daily wear. Screen intact and fully responsive.", badge: "Great Cash" },
      { title: "Cracked or Broken Screen", desc: "AMOLED lines, bleeding display, or shattered back glass accepted.", badge: "Instant Cash" }
    ],
    priceRangeEstimate: "AED 400 - AED 4,200",
    popularModels: [
      { name: "Galaxy S24 Ultra", slug: "samsung-s24", startingPrice: "AED 2,800" },
      { name: "Galaxy Z Fold 6 / 5", slug: "samsung-fold", startingPrice: "AED 2,600" },
      { name: "Galaxy Z Flip 6 / 5", slug: "samsung-flip", startingPrice: "AED 1,600" },
      { name: "Galaxy S23 Ultra", slug: "samsung-s24", startingPrice: "AED 1,900" },
      { name: "Galaxy S22 / S21 Series", slug: "samsung-s24", startingPrice: "AED 850" }
    ],
    faqs: [
      {
        question: "Do you buy Samsung phones with screen burn-in or green lines?",
        answer: "Yes, AMOLED screen burn-in or display lines are common on older OLED panels. We still provide competitive cash offers under our 'Average' or 'Broken' condition categories."
      },
      {
        question: "What should I do before handing over my Samsung Galaxy?",
        answer: "Back up your data using Samsung Smart Switch or Google Drive, sign out of your Samsung Account and Google Account, and factory reset the device. Our technician can also assist you during pickup."
      },
      {
        question: "Do I need the original Samsung 45W charger or box?",
        answer: "Having the original retail box and cable can increase your payout slightly, but it is not mandatory. You can sell your Samsung phone standalone."
      },
      {
        question: "How quickly can you pick up in Dubai Marina or JLT?",
        answer: "Our riders are continuously active in high-density areas like Dubai Marina, JLT, Downtown, and Business Bay, often reaching customers in under 60-90 minutes."
      },
      {
        question: "Can I sell a Samsung phone bought from another country?",
        answer: "Yes! We accept international Samsung models (Snapdragon and Exynos variants) provided they are network-unlocked and IMEI clean."
      }
    ],
    relatedLocations: ["dubai-marina", "business-bay", "al-barsha", "deira", "downtown-dubai"],
    relatedServices: ["phone-for-cash-dubai", "used-phone-dubai", "broken-phone-dubai", "phone-buyback-dubai"]
  },

  "used-phone-dubai": {
    slug: "used-phone-dubai",
    title: "Sell Used Phone in Dubai | Instant Cash & Free Pickup | SellPhoneCash",
    metaDescription: "Sell any used mobile phone in Dubai today. Best prices paid for used Apple, Samsung, Google, Xiaomi & OnePlus phones. Free 3-hr home pickup, cash paid on spot.",
    h1: "Sell Any Used Mobile Phone in Dubai",
    subtitle: "Get the highest trade-in cash value for your second-hand smartphone in Dubai. No lowballers, no meetups in shady parking lots — professional, safe, and instant.",
    targetKeywords: ["sell used phone dubai", "sell second hand phone dubai", "used mobile buyers dubai", "sell used smartphone uae", "where to sell used phone dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services",
    heroBadge: "Guaranteed Highest Valuation in UAE",
    introText: [
      "Selling a used phone in Dubai through peer-to-peer marketplaces usually involves endless haggling, delayed messages, and risky meetings with strangers.",
      "SellPhoneCash replaces the headache with a seamless 100% digital trade-in experience. We provide instant guaranteed online price quotes based on real-time market metrics.",
      "Our licensed agents pick up your phone from your home, apartment, or workspace anywhere in Dubai and pay you cash immediately."
    ],
    sellingSteps: [
      { title: "1. Instant Valuation", desc: "Pick your brand, model, and physical condition to see your guaranteed cash value." },
      { title: "2. Free Collection", desc: "Our professional courier visits your doorstep at the time you specify." },
      { title: "3. Immediate Payment", desc: "Device is verified in 2 minutes and cash is paid right then and there." }
    ],
    acceptedConditions: [
      { title: "Flawless", desc: "Look and feel like brand new with negligible signs of handling.", badge: "Top Dirhams" },
      { title: "Good", desc: "Normal micro-scratches from pocket usage, fully functioning internals.", badge: "Best Value" },
      { title: "Average", desc: "Visible casing dents, scratches, or wear. All buttons and display working.", badge: "Fair Cash" },
      { title: "Defective", desc: "Cracked glass, weak battery, or camera fault. We still buy it.", badge: "Cash Payout" }
    ],
    priceRangeEstimate: "AED 300 - AED 4,900",
    popularModels: [
      { name: "iPhone 16 Pro Max", slug: "iphone-pro-max", startingPrice: "AED 3,600" },
      { name: "Samsung S24 Ultra", slug: "samsung-s24", startingPrice: "AED 2,800" },
      { name: "iPhone 15 Series", slug: "iphone-15", startingPrice: "AED 2,200" },
      { name: "Google Pixel 9 Pro", slug: "google-pixel", startingPrice: "AED 2,100" },
      { name: "Samsung Fold Series", slug: "samsung-fold", startingPrice: "AED 2,500" }
    ],
    faqs: [
      {
        question: "Why sell to SellPhoneCash instead of Dubizzle or Facebook Marketplace?",
        answer: "Peer-to-peer sites involve answering dozens of messages, lowball hagglers, time-wasters, and security concerns. With SellPhoneCash, your price is guaranteed online, we come to your doorstep for free, and pay cash in 3 minutes."
      },
      {
        question: "What documents do I need to sell a used phone in Dubai?",
        answer: "In compliance with UAE consumer protection regulations, you will simply need to present a valid Emirates ID or Passport upon collection for identity verification."
      },
      {
        question: "How long is my price quote valid?",
        answer: "Our online valuation is locked and valid for 7 days, giving you complete peace of mind to prepare your phone and schedule a pickup at your convenience."
      },
      {
        question: "Do you buy other electronics along with used phones?",
        answer: "Yes, we also buy MacBooks, iPads, Apple Watches, Windows laptops, and gaming consoles for instant cash."
      },
      {
        question: "What if my phone model is not listed on your website?",
        answer: "You can click on 'Sell Any Device' or message us directly on WhatsApp at +971 55 554 9817 for a custom instant valuation from our procurement team."
      }
    ],
    relatedLocations: ["dubai-marina", "downtown-dubai", "jlt", "bur-dubai", "al-barsha", "dubai-silicon-oasis"],
    relatedServices: ["iphone-dubai", "samsung-dubai", "phone-for-cash-dubai", "broken-phone-dubai"]
  },

  "phone-for-cash-dubai": {
    slug: "phone-for-cash-dubai",
    title: "Sell Phone for Cash in Dubai | Instant Cash Payout | SellPhoneCash",
    metaDescription: "Get instant cash for your phone in Dubai today! Free doorstep collection within 3 hours. We pay top AED cash on the spot for all phone brands and conditions.",
    h1: "Sell Your Phone for Instant Cash in Dubai",
    subtitle: "Need fast cash for your mobile phone? Get an upfront online quote and receive real physical cash or instant bank transfer right at your door.",
    targetKeywords: ["sell phone for cash dubai", "instant cash for phone dubai", "cash for mobile phone uae", "phone cash payout dubai", "same day cash for phone"],
    categorySlug: "smartphones",
    catalogLink: "/services",
    heroBadge: "Instant AED Cash in Hand",
    introText: [
      "When you need instant liquidity or want to declutter electronics for cold hard cash, SellPhoneCash is Dubai's most reliable cash buyback partner.",
      "We believe selling your smartphone should take minutes, not days. We have eliminated bureaucratic trade-in store vouchers and complicated mail-in return windows.",
      "When our verified field agent arrives at your location in Dubai, your phone is inspected on the spot and genuine UAE currency is handed directly to you."
    ],
    sellingSteps: [
      { title: "1. 30-Second Online Quote", desc: "Select your phone specifications and get an immediate guaranteed cash figure." },
      { title: "2. Fast Doorstep Arrival", desc: "Our licensed representative reaches your location anywhere in Dubai within 3 hours." },
      { title: "3. Direct Cash In Hand", desc: "Device is verified and your cash payout is delivered immediately." }
    ],
    acceptedConditions: [
      { title: "Brand New Sealed", desc: "Never opened, manufacturer seals intact. Highest market payout.", badge: "Top Cash" },
      { title: "Gently Used", desc: "Minor cosmetic wear, all hardware and biometric sensors fully operational.", badge: "Instant Cash" },
      { title: "Heavy Wear", desc: "Deep scratches, edge scuffs, but fully functioning display and motherboard.", badge: "Fair Payout" },
      { title: "Non-Functional", desc: "Won't turn on, water damaged, or shattered glass. Cash for parts.", badge: "Scrap Cash" }
    ],
    priceRangeEstimate: "AED 300 - AED 4,800",
    popularModels: [
      { name: "iPhone 16 Pro Max", slug: "iphone-pro-max", startingPrice: "AED 3,600" },
      { name: "iPhone 15 Pro", slug: "iphone-15", startingPrice: "AED 2,400" },
      { name: "Samsung S24 Ultra", slug: "samsung-s24", startingPrice: "AED 2,800" },
      { name: "Samsung Z Fold 6", slug: "samsung-fold", startingPrice: "AED 2,700" },
      { name: "Google Pixel 9", slug: "google-pixel", startingPrice: "AED 1,800" }
    ],
    faqs: [
      {
        question: "Can I receive physical cash rather than a bank transfer?",
        answer: "Yes! Unlike most retailers who offer only gift cards or store credit, our representative hands you physical UAE Dirham cash on the spot upon device handover."
      },
      {
        question: "Is there any charge for doorstep collection in Dubai?",
        answer: "Doorstep collection is 100% free of charge across all Dubai neighborhoods. If you decide not to sell after our agent arrives, there is zero cancellation fee."
      },
      {
        question: "How quickly can I get the cash today?",
        answer: "From the moment you confirm your booking on our website, our dispatch team can have an agent at your door in as little as 60 to 180 minutes."
      },
      {
        question: "Are your cash prices negotiable?",
        answer: "Our prices are algorithmically calculated against live wholesale and retail UAE market indexes to ensure you are receiving the highest payout possible upfront."
      },
      {
        question: "What happens to the data on my phone?",
        answer: "Our field agent will help you ensure all accounts (iCloud, Google, Samsung) are signed out and the device is completely factory wiped before cash is handed over."
      }
    ],
    relatedLocations: ["downtown-dubai", "dubai-marina", "business-bay", "jlt", "deira"],
    relatedServices: ["iphone-dubai", "samsung-dubai", "used-phone-dubai", "phone-buyback-dubai"]
  },

  "broken-phone-dubai": {
    slug: "broken-phone-dubai",
    title: "Sell Broken Phone in Dubai | Cash for Damaged & Cracked Phones | SellPhoneCash",
    metaDescription: "Sell your broken, cracked, or damaged phone in Dubai for instant cash! We buy phones with broken screens, dead batteries, or water damage with free pickup.",
    h1: "Sell Broken or Damaged Phone in Dubai",
    subtitle: "Don't throw away your cracked or non-working mobile phone. Get immediate cash for damaged Apple, Samsung, and Android devices across Dubai.",
    targetKeywords: ["sell broken phone dubai", "sell cracked screen phone dubai", "cash for damaged phone uae", "broken iphone buyers dubai", "sell faulty mobile dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services",
    heroBadge: "We Buy Cracked, Damaged & Faulty Phones",
    introText: [
      "Most shops and trade-in programs in Dubai reject smartphones that have cracked displays, shattered rear glass, or motherboard issues. We don't!",
      "At SellPhoneCash, we believe every device retains value through reusable components, genuine OEM camera sensors, logic boards, and recyclable precious materials.",
      "Instead of letting your broken phone sit in a drawer losing value every day, let us collect it for free and pay you fair cash value on the spot."
    ],
    sellingSteps: [
      { title: "1. Select 'Broken' Condition", desc: "Choose your model and mark its condition as broken or cracked to view the salvage cash value." },
      { title: "2. We Collect at Your Door", desc: "Our technician arrives anywhere in Dubai to inspect the device safely." },
      { title: "3. Receive Cash Payout", desc: "No quibbling or sudden deductions — get paid instantly in cash or bank transfer." }
    ],
    acceptedConditions: [
      { title: "Cracked Front Glass", desc: "Display functions with glass fractures, touch digitizer responsive.", badge: "Highest Broken Rate" },
      { title: "Shattered Front & Back", desc: "Severe cosmetic breakage on glass panels, cameras functional.", badge: "Solid Payout" },
      { title: "Black Screen / Dead OLED", desc: "Phone powers on or vibrates, but screen remains black or shows lines.", badge: "Component Value" },
      { title: "Water Damaged / Dead", desc: "Device does not turn on. We evaluate internal salvageable parts.", badge: "Salvage Cash" }
    ],
    priceRangeEstimate: "AED 150 - AED 2,200",
    popularModels: [
      { name: "Broken iPhone 15 Pro Max", slug: "iphone-pro-max", startingPrice: "AED 1,600" },
      { name: "Broken iPhone 14 Pro", slug: "iphone-14", startingPrice: "AED 1,000" },
      { name: "Broken Galaxy S24 Ultra", slug: "samsung-s24", startingPrice: "AED 1,200" },
      { name: "Broken Galaxy Z Fold 5", slug: "samsung-fold", startingPrice: "AED 1,100" },
      { name: "Broken iPhone 13", slug: "iphone-13", startingPrice: "AED 600" }
    ],
    faqs: [
      {
        question: "Can I sell an iPhone that has a completely shattered screen and back glass?",
        answer: "Yes, absolutely! We regularly buy iPhones and Galaxy phones that have suffered severe drops. The internal components like cameras, logic board, and sensors still hold significant cash value."
      },
      {
        question: "Can you wipe my data if the screen is completely black?",
        answer: "Yes. If your screen is non-responsive, our certified technical team uses secure hardware flashing tools to verify the deletion of user data, or you can remotely erase the device via iCloud or Google Find My Device."
      },
      {
        question: "Do you buy phones that do not turn on at all?",
        answer: "Yes, we purchase dead or water-damaged phones for their scrap and component salvage value."
      },
      {
        question: "Why not fix the screen instead of selling?",
        answer: "Original OLED screen replacements in Dubai often cost AED 1,000 to AED 1,800. Selling your damaged phone to us and putting the cash toward a new model is frequently more cost-effective."
      },
      {
        question: "Do you buy iCloud locked phones?",
        answer: "No. For security and anti-theft compliance under UAE federal law, the seller must be able to remove their iCloud or Google Account credentials."
      }
    ],
    relatedLocations: ["deira", "bur-dubai", "dubai-marina", "al-barsha", "downtown-dubai"],
    relatedServices: ["iphone-dubai", "samsung-dubai", "used-phone-dubai", "old-phone-dubai"]
  },

  "old-phone-dubai": {
    slug: "old-phone-dubai",
    title: "Sell Old Phone in Dubai | Highest Cash Trade-In & Recycle | SellPhoneCash",
    metaDescription: "Sell your old phones in Dubai for instant cash! We buy previous generation iPhones, Samsungs, and older smartphones. Free doorstep pickup across Dubai.",
    h1: "Sell Old Smartphones in Dubai for Instant Cash",
    subtitle: "Clear out your drawers and turn your old phones into spending money. Safe eco-friendly recycling and top trade-in prices across Dubai.",
    targetKeywords: ["sell old phone dubai", "old mobile buyers dubai", "recycle old phone uae", "trade in old phone dubai", "cash for old electronics dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services",
    heroBadge: "Eco-Friendly Recycling with Instant Payout",
    introText: [
      "Did you know the average Dubai resident has 2 to 3 unused smartphones sitting in drawers losing value every month?",
      "Lithium-ion batteries degrade over time, and outdated operating systems lose resale value rapidly. The best time to cash in on an old device is right now.",
      "SellPhoneCash accepts previous generation Apple, Samsung, Google, Huawei, and Xiaomi phones, providing responsible certified recycling and instant cash payouts."
    ],
    sellingSteps: [
      { title: "1. Check Your Old Device", desc: "Search your model from our extensive database of over 500+ smartphones." },
      { title: "2. Free Doorstep Pickup", desc: "No need to drive to computer plazas or mall kiosks. We come directly to you." },
      { title: "3. Cash & Eco-Certificate", desc: "Receive immediate cash in hand while supporting UAE circular green economy initiatives." }
    ],
    acceptedConditions: [
      { title: "Fully Functional", desc: "Turns on, touchscreen works, battery holds reasonable charge.", badge: "Highest Value" },
      { title: "Aesthetic Wear", desc: "Heavy scratching or worn chassis, but all essential functions operating.", badge: "Good Cash" },
      { title: "Aging Battery", desc: "Battery service warning or requires constant charging.", badge: "Fair Value" },
      { title: "Non-Working", desc: "Obsolete hardware or hardware failure, eligible for green material recovery.", badge: "Eco Cash" }
    ],
    priceRangeEstimate: "AED 100 - AED 1,800",
    popularModels: [
      { name: "iPhone 13 / 13 Pro", slug: "iphone-13", startingPrice: "AED 1,100" },
      { name: "iPhone 12 / 12 Pro", slug: "iphone-13", startingPrice: "AED 800" },
      { name: "iPhone 11 / 11 Pro", slug: "iphone-13", startingPrice: "AED 600" },
      { name: "Samsung Galaxy S22", slug: "samsung-s24", startingPrice: "AED 750" },
      { name: "Samsung Galaxy S21", slug: "samsung-s24", startingPrice: "AED 550" }
    ],
    faqs: [
      {
        question: "Can I sell multiple old phones in one pickup?",
        answer: "Yes! Many customers sell 2, 3, or even 5 old phones at once. Our agent will assess all devices together and provide an aggregated instant cash payout."
      },
      {
        question: "What if I lost the original charger or box?",
        answer: "No problem at all. We understand older phones rarely have their original packaging. We buy the device standalone without any penalty."
      },
      {
        question: "What happens to old phones that cannot be resold?",
        answer: "Devices that cannot be restored are disassembled following UAE circular economy standards. Valuable metals like gold, copper, and cobalt are responsibly recovered."
      },
      {
        question: "Is there a minimum value required for free pickup in Dubai?",
        answer: "No strict minimum! If you have multiple old devices or a single smartphone with trade-in value, our free doorstep service is completely available."
      },
      {
        question: "Can you help me transfer photos to my new phone before wiping?",
        answer: "We advise backing up your photos to cloud storage (Google Photos, iCloud, or a laptop) prior to pickup. Our technician can give you a few minutes during collection to verify everything is safe."
      }
    ],
    relatedLocations: ["dubai-silicon-oasis", "deira", "bur-dubai", "al-barsha", "jlt"],
    relatedServices: ["used-phone-dubai", "phone-for-cash-dubai", "broken-phone-dubai", "phone-buyback-dubai"]
  },

  "phone-buyback-dubai": {
    slug: "phone-buyback-dubai",
    title: "Phone Buyback Dubai | Instant Valuation & Guaranteed Payout | SellPhoneCash",
    metaDescription: "Premier mobile phone buyback service in Dubai. Guaranteed instant online valuation, 7-day price lock, free doorstep collection, and immediate cash payment.",
    h1: "Professional Phone Buyback Service in Dubai",
    subtitle: "The simplest, fastest corporate and consumer device buyback service in the UAE. Guaranteed rates, zero haggling, and immediate cash disbursement.",
    targetKeywords: ["phone buyback dubai", "mobile buyback uae", "device trade in dubai", "smartphone buyback program", "sell tech dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services",
    heroBadge: "Licensed UAE Buyback Partner",
    introText: [
      "SellPhoneCash is the UAE's foremost professional buyback provider for personal electronics, handling thousands of smartphones, tablets, and laptops every month.",
      "Our automated pricing algorithm tracks real-time secondary market demand in the Gulf region, enabling us to guarantee the absolute highest return for your electronics.",
      "Whether you are an individual upgrading your phone or an enterprise retiring corporate device fleets, our seamless buyback program ensures fast, certified, and compliant settlements."
    ],
    sellingSteps: [
      { title: "1. Transparent Valuation", desc: "Get an instant valuation based on transparent criteria and 7-day price lock." },
      { title: "2. Free Insured Logistics", desc: "Our licensed drivers pick up the hardware directly from your residential or commercial address." },
      { title: "3. Direct Instant Settlement", desc: "Instant funds release via cash or local wire transfer upon verification." }
    ],
    acceptedConditions: [
      { title: "Corporate Surplus / Sealed", desc: "Unused business stock, brand new inventory, or upgrade overstock.", badge: "Maximum Yield" },
      { title: "Grade A (Mint)", desc: "Flawless condition with minimal battery cycles, all components authentic.", badge: "Top Value" },
      { title: "Grade B (Good)", desc: "Standard cosmetic signs of corporate or personal usage. 100% operational.", badge: "Strong Rate" },
      { title: "Grade C (Heavy Wear)", desc: "Dents or screen scratches, battery degradation under 80%.", badge: "Fair Buyback" }
    ],
    priceRangeEstimate: "AED 400 - AED 5,000",
    popularModels: [
      { name: "iPhone 16 Pro Max", slug: "iphone-pro-max", startingPrice: "AED 3,600" },
      { name: "iPhone 15 Pro", slug: "iphone-15", startingPrice: "AED 2,300" },
      { name: "Samsung S24 Ultra", slug: "samsung-s24", startingPrice: "AED 2,800" },
      { name: "MacBook Pro M3", slug: "macbook-pro", startingPrice: "AED 4,200" },
      { name: "iPad Pro M4", slug: "ipad-pro", startingPrice: "AED 3,100" }
    ],
    faqs: [
      {
        question: "How does the 7-day price lock guarantee work?",
        answer: "When you complete an online valuation on SellPhoneCash, the quote is fixed for 7 days. Even if market prices drop during that week, you are 100% guaranteed the original quoted payout."
      },
      {
        question: "Do you offer corporate buybacks for companies in Dubai?",
        answer: "Yes, we handle bulk device liquidation for businesses, startups, and institutions throughout Dubai, Abu Dhabi, and Sharjah with certified data sanitization certificates."
      },
      {
        question: "How does your buyback rate compare with telecom operator trade-in programs?",
        answer: "Telecom operators and retail megastores typically offer restricted store credit or bill credits at 20-30% below market value. We pay direct cash with no store lock-in."
      },
      {
        question: "What security measures protect my private information?",
        answer: "Every single device undergoes Department of Defense (DoD) compliant data sanitization. We verify all factory locks are removed in your presence before purchase."
      },
      {
        question: "Can I sell other Apple and Samsung gear through the buyback program?",
        answer: "Yes! In addition to phones, our buyback catalog includes MacBooks, iPads, Apple Watches, Galaxy Watches, and Windows laptops."
      }
    ],
    relatedLocations: ["business-bay", "downtown-dubai", "dubai-marina", "jlt", "deira"],
    relatedServices: ["iphone-dubai", "samsung-dubai", "used-phone-dubai", "phone-for-cash-dubai"]
  }
};

// -------------------------------------------------------------
// 2. MODEL PAGES (18 Pages)
// -------------------------------------------------------------
export const MODEL_PAGES: Record<string, ModelPageData> = {
  "iphone-17": {
    slug: "iphone-17",
    brand: "Apple",
    modelName: "iPhone 17",
    title: "Sell iPhone 17 in Dubai | Highest Cash Valuation | SellPhoneCash",
    metaDescription: "Sell your iPhone 17 in Dubai for the highest cash payout. Free 3-hour doorstep collection across Dubai, instant cash in hand or bank transfer.",
    h1: "Sell iPhone 17 in Dubai for Top Cash",
    subtitle: "Upgrade or liquidate your Apple iPhone 17. Instant valuation with zero hidden fees and free doorstep pickup anywhere in Dubai.",
    targetKeywords: ["sell iphone 17 dubai", "iphone 17 buyback dubai", "trade in iphone 17 uae", "cash for iphone 17 dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "Flagship Buyback Program",
    estimatedPriceRange: "AED 2,800 - AED 4,600",
    specsSummary: ["A19 Bionic Processor", "ProMotion 120Hz Display", "Advanced Dual/Triple Camera", "USB-C Fast Charging", "Titanium Frame"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,800 - 4,600", notes: "Original box unopened with factory seal intact." },
      { condition: "Flawless / Like New", estimate: "AED 3,400 - 4,100", notes: "No scratches, 100% battery capacity, all sensors perfect." },
      { condition: "Good Condition", estimate: "AED 3,000 - 3,600", notes: "Minor handling marks on edges, glass flawless." },
      { condition: "Cracked / Damaged", estimate: "AED 2,000 - 2,800", notes: "Display scratch or cracked back glass, operational logic board." }
    ],
    whySellWithUs: ["Guaranteed 7-day price lock", "Free 3-hour doorstep collection in Dubai", "Instant cash or bank transfer", "100% certified data wipe"],
    faqs: [
      { question: "How much is my iPhone 17 worth in Dubai?", answer: "Valuation depends on storage capacity (128GB, 256GB, 512GB) and cosmetic condition. Payouts range from AED 2,800 up to AED 4,600." },
      { question: "Can I sell a sealed iPhone 17 received as a gift?", answer: "Yes! Brand new sealed devices fetch top market premiums on SellPhoneCash." },
      { question: "Do you pick up in Dubai Marina or Downtown?", answer: "Yes, our couriers reach anywhere in Dubai within 3 hours of booking." }
    ],
    relatedModels: ["iphone-pro-max", "iphone-16", "iphone-15", "samsung-s26"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "business-bay", "jlt"]
  },

  "iphone-16": {
    slug: "iphone-16",
    brand: "Apple",
    modelName: "iPhone 16",
    title: "Sell iPhone 16 in Dubai | Instant Cash On The Spot | SellPhoneCash",
    metaDescription: "Sell your iPhone 16 in Dubai. Best trade-in cash value guaranteed. Free 3-hour doorstep pickup across UAE. Instant cash or bank transfer.",
    h1: "Sell iPhone 16 in Dubai for Maximum Value",
    subtitle: "Get top market cash for your Apple iPhone 16 or 16 Plus today. Fast, simple, and completely transparent with free home collection.",
    targetKeywords: ["sell iphone 16 dubai", "iphone 16 trade in value uae", "sell used iphone 16 dubai", "cash for iphone 16"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "High Market Demand",
    estimatedPriceRange: "AED 2,200 - AED 3,600",
    specsSummary: ["A18 Bionic Chip", "Apple Intelligence Ready", "Camera Control Button", "Super Retina XDR OLED", "Dynamic Island"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,000 - 3,600", notes: "Original box unopened with factory seal intact." },
      { condition: "Flawless / Mint", estimate: "AED 2,600 - 3,100", notes: "Immaculate condition, zero blemishes, 95%+ battery." },
      { condition: "Good Condition", estimate: "AED 2,200 - 2,600", notes: "Light cosmetic wear on borders, screen clean." },
      { condition: "Cracked / Damaged", estimate: "AED 1,400 - 2,000", notes: "Cracked screen or rear glass, functioning logic board." }
    ],
    whySellWithUs: ["Instant payment on collection", "No haggling or classified scams", "Free doorstep pickup in Dubai", "Certified data sanitization"],
    faqs: [
      { question: "What is the trade-in value of an iPhone 16 in Dubai?", answer: "An iPhone 16 typically trades in between AED 2,200 and AED 3,600 depending on storage size and cosmetic condition." },
      { question: "Do you buy iPhone 16 with scratched screens?", answer: "Yes! Simply choose 'Good' or 'Average' condition to receive an honest guaranteed quote." },
      { question: "How fast is cash payment?", answer: "Our technician gives you cash or confirms a bank transfer immediately upon inspection at your door." }
    ],
    relatedModels: ["iphone-pro-max", "iphone-15", "iphone-17", "samsung-s25"],
    relatedLocations: ["dubai-marina", "jlt", "downtown-dubai", "al-barsha"]
  },

  "iphone-15": {
    slug: "iphone-15",
    brand: "Apple",
    modelName: "iPhone 15",
    title: "Sell iPhone 15 in Dubai | Fast Doorstep Cash | SellPhoneCash",
    metaDescription: "Sell your iPhone 15 in Dubai today. Guaranteed high trade-in value, free 3-hour doorstep collection, and immediate cash payout. Get a free quote now.",
    h1: "Sell iPhone 15 in Dubai for Instant Cash",
    subtitle: "Get immediate dirhams for your iPhone 15, 15 Plus, or 15 Pro. Free pickup across all Dubai areas within 3 hours.",
    targetKeywords: ["sell iphone 15 dubai", "iphone 15 price uae sell", "sell used iphone 15 dubai", "buyback iphone 15"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "Popular Trade-In Model",
    estimatedPriceRange: "AED 1,600 - AED 2,900",
    specsSummary: ["A16 / A17 Pro Chip", "USB-C Port", "Dynamic Island Display", "48MP Main Camera", "Matte Glass Back"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 2,200 - 2,900", notes: "Like new, battery health over 90%, zero scratches." },
      { condition: "Good", estimate: "AED 1,800 - 2,300", notes: "Normal usage marks, screen and cameras perfect." },
      { condition: "Average", estimate: "AED 1,400 - 1,800", notes: "Noticeable pocket wear or small frame nicks." },
      { condition: "Broken Screen", estimate: "AED 900 - 1,400", notes: "Cracked display or back glass." }
    ],
    whySellWithUs: ["7-day locked valuation", "Pickup in 3 hours anywhere in Dubai", "Immediate cash in hand", "Official UAE trade-in partner"],
    faqs: [
      { question: "How much can I get for an iPhone 15 in Dubai?", answer: "Expect between AED 1,600 and AED 2,900 depending on whether it is standard, Plus, Pro, or Pro Max, and its storage capacity." },
      { question: "Do I need the original USB-C cable?", answer: "Having the cable is helpful, but you will still receive top cash without it." }
    ],
    relatedModels: ["iphone-pro-max", "iphone-16", "iphone-14", "samsung-s24"],
    relatedLocations: ["dubai-marina", "business-bay", "deira", "bur-dubai"]
  },

  "iphone-14": {
    slug: "iphone-14",
    brand: "Apple",
    modelName: "iPhone 14",
    title: "Sell iPhone 14 in Dubai | Instant Cash On The Spot | SellPhoneCash",
    metaDescription: "Sell your used iPhone 14 in Dubai. Top market buyback prices, free 3-hour home pickup across all Dubai districts, instant cash in hand.",
    h1: "Sell iPhone 14 in Dubai for Top Cash",
    subtitle: "Turn your pre-owned iPhone 14 or iPhone 14 Plus into instant cash today. Simple valuation, fast doorstep inspection, zero hassle.",
    targetKeywords: ["sell iphone 14 dubai", "iphone 14 buyback uae", "sell used iphone 14 dubai", "trade in iphone 14"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "Consistent High Demand",
    estimatedPriceRange: "AED 1,150 - AED 2,100",
    specsSummary: ["A15 Bionic 5-Core GPU", "Super Retina XDR OLED", "Crash Detection", "Action Mode Video", "Ceramic Shield"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,600 - 2,100", notes: "Mint condition, 88%+ battery, no scratches." },
      { condition: "Good", estimate: "AED 1,300 - 1,650", notes: "Light surface scuffs, all features 100% operational." },
      { condition: "Average", estimate: "AED 1,000 - 1,300", notes: "Visible wear on aluminum edges." },
      { condition: "Cracked", estimate: "AED 650 - 1,000", notes: "Cracked glass with working display." }
    ],
    whySellWithUs: ["Free doorstep pickup in 3 hours", "Zero lowballing or time-wasting", "Instant cash payout", "Certified data erasure"],
    faqs: [
      { question: "What is the resale value of an iPhone 14 in Dubai?", answer: "The iPhone 14 typically sells for AED 1,150 to AED 2,100 based on storage tier and cosmetic grade." },
      { question: "Do you buy iPhone 14 with battery service warning?", answer: "Yes! Degraded batteries are expected on older devices. We still offer competitive buyback rates." }
    ],
    relatedModels: ["iphone-13", "iphone-15", "iphone-pro-max", "samsung-s24"],
    relatedLocations: ["jlt", "deira", "bur-dubai", "al-barsha"]
  },

  "iphone-13": {
    slug: "iphone-13",
    brand: "Apple",
    modelName: "iPhone 13",
    title: "Sell iPhone 13 in Dubai | Instant Cash Today | SellPhoneCash",
    metaDescription: "Sell your iPhone 13 or iPhone 13 mini in Dubai for cash. Instant guaranteed valuation, free 3-hour courier pickup, instant cash payout on collection.",
    h1: "Sell iPhone 13 in Dubai for Immediate Cash",
    subtitle: "Cash in on your iPhone 13 before market depreciation continues. Instant price lock and free doorstep pickup throughout Dubai.",
    targetKeywords: ["sell iphone 13 dubai", "iphone 13 buyback uae", "sell used iphone 13 dubai", "cash for iphone 13"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "High Volume Buyback",
    estimatedPriceRange: "AED 850 - AED 1,650",
    specsSummary: ["A15 Bionic Chip", "Cinematic Mode Video", "OLED Super Retina XDR", "Dual 12MP Cameras", "MagSafe Wireless"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,250 - 1,650", notes: "No scratches, clean housing, battery >85%." },
      { condition: "Good", estimate: "AED 1,000 - 1,300", notes: "Standard daily pocket wear, clean display." },
      { condition: "Average", estimate: "AED 750 - 1,000", notes: "Scratched housing or minor screen scuffs." },
      { condition: "Broken Screen", estimate: "AED 450 - 750", notes: "Cracked display or back glass." }
    ],
    whySellWithUs: ["Immediate AED payout on spot", "Free pickup across Dubai", "Guaranteed 7-day quote", "Friendly professional service"],
    faqs: [
      { question: "How much can I get for an iPhone 13 in Dubai today?", answer: "iPhone 13 devices fetch between AED 850 and AED 1,650 depending on condition and storage size." },
      { question: "Can I sell an iPhone 13 mini?", answer: "Yes, we buy all iPhone 13 series including mini, standard, Pro, and Pro Max." }
    ],
    relatedModels: ["iphone-14", "iphone-15", "iphone-pro-max", "samsung-s24"],
    relatedLocations: ["dubai-silicon-oasis", "deira", "bur-dubai", "jumeirah"]
  },

  "iphone-pro-max": {
    slug: "iphone-pro-max",
    brand: "Apple",
    modelName: "iPhone Pro Max",
    title: "Sell iPhone Pro Max in Dubai | Highest Cash Rates | SellPhoneCash",
    metaDescription: "Sell your iPhone Pro Max (16, 15, 14, 13 Pro Max) in Dubai for the highest cash payout. Free doorstep pickup in 3 hours, immediate cash in hand.",
    h1: "Sell iPhone Pro Max in Dubai for Top Cash",
    subtitle: "Apple's flagship Pro Max models command the highest resale values in the UAE. Get an upfront guaranteed price and instant cash payout today.",
    targetKeywords: ["sell iphone pro max dubai", "sell iphone 16 pro max dubai", "sell iphone 15 pro max uae", "iphone pro max trade in dubai"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/apple",
    heroBadge: "Highest Payout Device",
    estimatedPriceRange: "AED 1,500 - AED 4,900",
    specsSummary: ["Grade 5 Titanium / Stainless Steel", "ProMotion 120Hz Super Retina", "5x Telephoto Optical Zoom", "Largest Battery Capacity", "Action Button & Camera Control"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,800 - 4,900", notes: "Factory sealed box with valid warranty." },
      { condition: "Flawless", estimate: "AED 3,100 - 4,200", notes: "Immaculate condition, zero blemishes, healthy battery." },
      { condition: "Good", estimate: "AED 2,400 - 3,200", notes: "Normal handling scuffs, flawless display." },
      { condition: "Cracked Screen", estimate: "AED 1,400 - 2,300", notes: "Cracked display or back glass." }
    ],
    whySellWithUs: ["Highest cash guarantee in Dubai", "Free 3-hour doorstep collection", "Instant cash or wire transfer", "Zero lowballing"],
    faqs: [
      { question: "Which iPhone Pro Max models do you buy?", answer: "We buy all generations from iPhone 11 Pro Max up to the latest iPhone 16 Pro Max and iPhone 17 Pro Max." },
      { question: "Why do Pro Max models hold higher value in Dubai?", answer: "High secondary market demand and premium build materials ensure Pro Max devices retain up to 65% of their value year-over-year in the UAE." }
    ],
    relatedModels: ["iphone-16", "iphone-15", "samsung-fold", "samsung-s25"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "business-bay", "jumeirah"]
  },

  "samsung-s26": {
    slug: "samsung-s26",
    brand: "Samsung",
    modelName: "Galaxy S26",
    title: "Sell Samsung Galaxy S26 in Dubai | Top Cash Payout | SellPhoneCash",
    metaDescription: "Sell your Samsung Galaxy S26 / S26 Ultra in Dubai. Guaranteed instant valuation, free 3-hour home pickup across Dubai, cash paid on the spot.",
    h1: "Sell Samsung Galaxy S26 in Dubai",
    subtitle: "Get the best cash trade-in value for Samsung's premier flagship. Free doorstep collection anywhere in Dubai.",
    targetKeywords: ["sell samsung s26 dubai", "galaxy s26 buyback dubai", "trade in samsung s26 uae", "cash for samsung s26"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Next-Gen Flagship Buyback",
    estimatedPriceRange: "AED 2,600 - AED 4,400",
    specsSummary: ["Snapdragon Gen Flagship Chip", "Dynamic AMOLED 2X 120Hz", "200MP Quad Camera Setup", "Galaxy AI Integration", "Integrated S-Pen"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,600 - 4,400", notes: "Unopened original retail packaging." },
      { condition: "Flawless", estimate: "AED 3,000 - 3,700", notes: "Like new, pristine screen without micro-scratches." },
      { condition: "Good", estimate: "AED 2,500 - 3,100", notes: "Normal light pocket wear, perfect display." },
      { condition: "Cracked", estimate: "AED 1,600 - 2,200", notes: "Screen fracture or back glass damage." }
    ],
    whySellWithUs: ["Guaranteed 7-day quote", "Free 3-hour doorstep arrival", "Direct cash payout", "Certified data sanitization"],
    faqs: [
      { question: "How much is a Samsung Galaxy S26 worth in Dubai?", answer: "Depending on whether it is standard, Plus, or Ultra, values range from AED 2,600 up to AED 4,400." },
      { question: "Can I sell an international version of the S26?", answer: "Yes, we accept both UAE TRA versions and unlocked international models." }
    ],
    relatedModels: ["samsung-s25", "samsung-fold", "iphone-17", "iphone-pro-max"],
    relatedLocations: ["dubai-marina", "business-bay", "downtown-dubai", "jlt"]
  },

  "samsung-s25": {
    slug: "samsung-s25",
    brand: "Samsung",
    modelName: "Galaxy S25",
    title: "Sell Samsung Galaxy S25 in Dubai | Instant Cash | SellPhoneCash",
    metaDescription: "Sell your Samsung Galaxy S25 / S25 Ultra in Dubai. Top market buyback price, free 3-hour doorstep collection, instant cash on the spot.",
    h1: "Sell Samsung Galaxy S25 in Dubai for Top Cash",
    subtitle: "Get maximum dirhams for your Galaxy S25, S25+, or S25 Ultra today. Transparent valuation with immediate cash payment.",
    targetKeywords: ["sell samsung s25 dubai", "galaxy s25 ultra buyback uae", "sell used samsung s25 dubai", "trade in galaxy s25"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Flagship Buyback",
    estimatedPriceRange: "AED 2,100 - AED 3,800",
    specsSummary: ["Snapdragon 8 Elite Processor", "Dynamic AMOLED 2X Display", "Advanced Galaxy AI Suite", "Armor Aluminum / Titanium", "Up to 1TB Storage"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,100 - 3,800", notes: "Unopened box with official seal." },
      { condition: "Flawless", estimate: "AED 2,600 - 3,200", notes: "Mint condition, zero marks, clean battery." },
      { condition: "Good", estimate: "AED 2,100 - 2,600", notes: "Minor handling scuffs on bezel." },
      { condition: "Cracked", estimate: "AED 1,300 - 1,800", notes: "Cracked front glass or rear casing." }
    ],
    whySellWithUs: ["Instant cash in hand", "Free doorstep pickup in 3 hours", "Zero negotiation headache", "Safe & secure transaction"],
    faqs: [
      { question: "What is the payout for Galaxy S25 Ultra in Dubai?", answer: "A flawless Galaxy S25 Ultra commands between AED 2,800 and AED 3,800 based on storage." },
      { question: "How does collection work?", answer: "Book online, our rider arrives at your home/office in 3 hours, tests the phone in 2 mins, and hands you cash." }
    ],
    relatedModels: ["samsung-s24", "samsung-fold", "iphone-16", "iphone-pro-max"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "al-barsha", "jlt"]
  },

  "samsung-s24": {
    slug: "samsung-s24",
    brand: "Samsung",
    modelName: "Galaxy S24",
    title: "Sell Samsung Galaxy S24 in Dubai | Instant Cash Today | SellPhoneCash",
    metaDescription: "Sell your Samsung Galaxy S24, S24+, or S24 Ultra in Dubai. Guaranteed instant valuation, free 3-hour doorstep collection, cash paid immediately.",
    h1: "Sell Samsung Galaxy S24 in Dubai for Instant Cash",
    subtitle: "Exchange your Samsung Galaxy S24 for instant dirhams today. Fast valuation, free doorstep pickup across Dubai, no haggling.",
    targetKeywords: ["sell samsung s24 dubai", "galaxy s24 ultra sell price uae", "sell used s24 dubai", "trade in samsung s24"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Most Active Trade-In",
    estimatedPriceRange: "AED 1,600 - AED 3,100",
    specsSummary: ["Snapdragon 8 Gen 3 / Exynos 2400", "Flat Dynamic AMOLED Display", "Titanium Frame on Ultra", "AI Circle to Search", "ProVisual Engine"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 2,200 - 3,100", notes: "Mint condition, battery health >90%, zero scratches." },
      { condition: "Good", estimate: "AED 1,800 - 2,300", notes: "Normal light pocket marks, clean display." },
      { condition: "Average", estimate: "AED 1,400 - 1,800", notes: "Noticeable bezel wear or frame scratches." },
      { condition: "Cracked", estimate: "AED 900 - 1,400", notes: "Broken front glass or rear casing." }
    ],
    whySellWithUs: ["7-day price guarantee", "Free pickup across Dubai", "Instant cash on inspection", "Professional data wipe"],
    faqs: [
      { question: "How much will I get for my Galaxy S24 Ultra in Dubai?", answer: "A Galaxy S24 Ultra in good to flawless condition trades for AED 2,200 to AED 3,100." },
      { question: "Do you buy Galaxy S24 with damaged S-Pen?", answer: "Yes, we still purchase the device even if the stylus is missing or damaged." }
    ],
    relatedModels: ["samsung-s25", "samsung-fold", "iphone-15", "google-pixel"],
    relatedLocations: ["dubai-marina", "business-bay", "deira", "bur-dubai"]
  },

  "samsung-fold": {
    slug: "samsung-fold",
    brand: "Samsung",
    modelName: "Galaxy Z Fold",
    title: "Sell Samsung Galaxy Fold in Dubai | Top Buyback Rates | SellPhoneCash",
    metaDescription: "Sell your Samsung Galaxy Z Fold 6, Fold 5, or Fold 4 in Dubai. Top cash offers, free 3-hour doorstep pickup across UAE, cash paid on collection.",
    h1: "Sell Samsung Galaxy Z Fold in Dubai for Top Cash",
    subtitle: "Get the highest cash value for your foldable smartphone. Free doorstep collection across Dubai with instant cash settlement.",
    targetKeywords: ["sell samsung fold dubai", "galaxy z fold 6 buyback uae", "sell used galaxy fold dubai", "cash for samsung fold"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Specialized Foldable Buyback",
    estimatedPriceRange: "AED 1,500 - AED 3,900",
    specsSummary: ["Dual AMOLED Displays", "Hinged Foldable Mechanism", "Under-Display Camera", "Multitasking Taskbar", "S-Pen Fold Edition Support"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 3,200 - 3,900", notes: "Unopened box with official seal." },
      { condition: "Flawless", estimate: "AED 2,500 - 3,200", notes: "Inner folding screen crease flawless, hinge smooth." },
      { condition: "Good", estimate: "AED 1,900 - 2,500", notes: "Normal wear on exterior hinge and frame." },
      { condition: "Inner Screen Defect", estimate: "AED 1,000 - 1,700", notes: "Black bleeding line on inner crease." }
    ],
    whySellWithUs: ["Expert foldable inspection", "Free pickup anywhere in Dubai", "Guaranteed cash payout", "Safe data removal"],
    faqs: [
      { question: "Do you buy Galaxy Z Fold with screen crease peeling?", answer: "Yes! Factory screen protector bubbling along the crease is normal. We still make strong cash offers." },
      { question: "How long does inspection take on a Fold?", answer: "Just 3-4 minutes to check both displays, hinge mechanism, and cameras." }
    ],
    relatedModels: ["samsung-flip", "samsung-s25", "iphone-pro-max", "google-pixel"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "business-bay", "jumeirah"]
  },

  "samsung-flip": {
    slug: "samsung-flip",
    brand: "Samsung",
    modelName: "Galaxy Z Flip",
    title: "Sell Samsung Galaxy Flip in Dubai | Instant Cash | SellPhoneCash",
    metaDescription: "Sell your Samsung Galaxy Z Flip 6, Flip 5, or Flip 4 in Dubai. Best trade-in prices, free 3-hour home pickup across Dubai, cash paid on spot.",
    h1: "Sell Samsung Galaxy Z Flip in Dubai for Cash",
    subtitle: "Turn your compact folding phone into instant dirhams today. Fast valuation, free doorstep pickup anywhere in Dubai.",
    targetKeywords: ["sell samsung flip dubai", "galaxy z flip 6 buyback uae", "sell used galaxy flip dubai", "trade in samsung flip"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/samsung",
    heroBadge: "Compact Foldable Buyback",
    estimatedPriceRange: "AED 900 - AED 2,400",
    specsSummary: ["FlexWindow Cover Screen", "Ultra-Compact Folding Form", "FlexCam Hands-Free", "Armor Aluminum Frame", "Water Resistant IPX8"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "AED 1,900 - 2,400", notes: "Factory sealed retail box." },
      { condition: "Flawless", estimate: "AED 1,500 - 1,900", notes: "Mint condition, hinge tight, screen pristine." },
      { condition: "Good", estimate: "AED 1,150 - 1,500", notes: "Normal pocket scuffs, working displays." },
      { condition: "Damaged Screen", estimate: "AED 600 - 1,000", notes: "Crease line or cracked outer glass." }
    ],
    whySellWithUs: ["Instant cash on collection", "Free 3-hour doorstep service", "No lowballing", "Trusted Dubai buyback provider"],
    faqs: [
      { question: "How much is a Galaxy Z Flip 5 / 6 worth in Dubai?", answer: "Trade-in values typically range from AED 1,150 for good condition up to AED 2,400 for new/sealed models." },
      { question: "Can I sell without the original box?", answer: "Yes, you can sell your Flip standalone." }
    ],
    relatedModels: ["samsung-fold", "samsung-s24", "iphone-16", "google-pixel"],
    relatedLocations: ["jlt", "dubai-marina", "al-barsha", "downtown-dubai"]
  },

  "google-pixel": {
    slug: "google-pixel",
    brand: "Google",
    modelName: "Google Pixel",
    title: "Sell Google Pixel in Dubai | Top Cash Payout | SellPhoneCash",
    metaDescription: "Sell your Google Pixel (Pixel 9, 8, 7 Pro) in Dubai for instant cash. Free 3-hour doorstep pickup across all Dubai areas. Cash on the spot guaranteed.",
    h1: "Sell Google Pixel Phone in Dubai for Top Cash",
    subtitle: "Get fair market cash for your Google Pixel 9 Pro, Pixel 8, or older Pixel smartphone. Free collection at your doorstep across Dubai.",
    targetKeywords: ["sell google pixel dubai", "google pixel 9 buyback uae", "sell used pixel dubai", "cash for google pixel"],
    categorySlug: "smartphones",
    catalogLink: "/services/smartphones/google",
    heroBadge: "Camera Enthusiast Buyback",
    estimatedPriceRange: "AED 800 - AED 2,800",
    specsSummary: ["Google Tensor G4 / G3", "Pure Android Experience", "Industry-Leading Computational Photography", "OLED Display", "7-Year Update Guarantee"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,800 - 2,800", notes: "Immaculate condition, zero blemishes." },
      { condition: "Good", estimate: "AED 1,300 - 1,800", notes: "Minor scratches on visor or frame." },
      { condition: "Average", estimate: "AED 900 - 1,300", notes: "Visible wear, fully functioning cameras." },
      { condition: "Cracked", estimate: "AED 500 - 900", notes: "Cracked screen or camera glass." }
    ],
    whySellWithUs: ["Rare model appreciation (we pay true value)", "Free doorstep pickup in 3 hours", "Instant cash payout", "Certified data wipe"],
    faqs: [
      { question: "Is it difficult to sell Google Pixel in Dubai?", answer: "While standard mall kiosks often refuse Pixels or offer very low prices, SellPhoneCash actively buys all Google Pixel models at fair market rates." },
      { question: "Do you buy US and Japanese Pixel models?", answer: "Yes, we accept both international and GCC variants as long as they are carrier-unlocked." }
    ],
    relatedModels: ["samsung-s24", "iphone-15", "iphone-16"],
    relatedLocations: ["dubai-silicon-oasis", "jlt", "dubai-marina", "business-bay"]
  },

  "macbook-pro": {
    slug: "macbook-pro",
    brand: "Apple",
    modelName: "MacBook Pro",
    title: "Sell MacBook Pro in Dubai | Top Cash Value | SellPhoneCash",
    metaDescription: "Sell your used MacBook Pro (M1, M2, M3, M4) in Dubai for instant cash! Free 3-hour doorstep collection across Dubai, instant payment guaranteed.",
    h1: "Sell MacBook Pro in Dubai for Instant Cash",
    subtitle: "Get the highest cash valuation for your Apple Silicon MacBook Pro 14\" or 16\". Free doorstep pickup and instant cash payout across Dubai.",
    targetKeywords: ["sell macbook pro dubai", "macbook pro buyback uae", "sell used apple laptop dubai", "cash for macbook pro"],
    categorySlug: "laptops",
    catalogLink: "/services/laptops",
    heroBadge: "High-Value Laptop Buyback",
    estimatedPriceRange: "AED 2,200 - AED 8,500",
    specsSummary: ["Apple M-Series Silicon (M1/M2/M3/M4 Pro/Max)", "Liquid Retina XDR Mini-LED Display", "Up to 128GB Unified Memory", "MagSafe 3 Charging", "Studio-Quality Mics & Speakers"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 3,800 - 8,500", notes: "Battery cycles <100, zero chassis dents, screen anti-reflective coating intact." },
      { condition: "Good", estimate: "AED 2,800 - 4,800", notes: "Minor edge scuffs, keyboard and trackpad clean." },
      { condition: "Average", estimate: "AED 2,200 - 3,400", notes: "Visible wear or small casing ding." },
      { condition: "Damaged / Faulty", estimate: "AED 1,200 - 2,500", notes: "Screen flexgate issue, dented lid, or faulty battery." }
    ],
    whySellWithUs: ["Highest valuation for Apple Silicon in UAE", "Free insured doorstep pickup in 3 hours", "Immediate cash or direct wire", "Hardware DoD data wipe"],
    faqs: [
      { question: "How is MacBook Pro valuation determined in Dubai?", answer: "Value is based on processor tier (M1, M2, M3, M4, Pro/Max), RAM capacity, SSD storage size, and battery cycle count." },
      { question: "Do you buy Intel-based MacBook Pros?", answer: "Yes, we still purchase Intel i7/i9 models, though Apple Silicon models command significantly higher prices." }
    ],
    relatedModels: ["macbook-air", "ipad-pro", "iphone-pro-max"],
    relatedLocations: ["dubai-marina", "business-bay", "downtown-dubai", "jlt"]
  },

  "macbook-air": {
    slug: "macbook-air",
    brand: "Apple",
    modelName: "MacBook Air",
    title: "Sell MacBook Air in Dubai | Instant Cash On Spot | SellPhoneCash",
    metaDescription: "Sell your MacBook Air (M1, M2, M3 13\" & 15\") in Dubai. Best trade-in prices, free 3-hour doorstep collection across Dubai, immediate cash payout.",
    h1: "Sell MacBook Air in Dubai for Immediate Cash",
    subtitle: "Cash in on your Apple MacBook Air 13-inch or 15-inch today. Free doorstep collection anywhere in Dubai with instant cash settlement.",
    targetKeywords: ["sell macbook air dubai", "macbook air buyback uae", "sell used macbook air dubai", "cash for macbook air"],
    categorySlug: "laptops",
    catalogLink: "/services/laptops",
    heroBadge: "Popular Laptop Buyback",
    estimatedPriceRange: "AED 1,400 - AED 4,200",
    specsSummary: ["Apple M1 / M2 / M3 Chip", "Fanless Silent Design", "Liquid Retina Display", "Up to 18 Hours Battery Life", "MagSafe 3 Fast Charging"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 2,300 - 4,200", notes: "Like new, battery healthy, zero scratches." },
      { condition: "Good", estimate: "AED 1,800 - 2,500", notes: "Normal light marks on bottom plate, pristine display." },
      { condition: "Average", estimate: "AED 1,400 - 1,800", notes: "Minor corner nick, fully operational." },
      { condition: "Screen Broken", estimate: "AED 800 - 1,300", notes: "Cracked display panel." }
    ],
    whySellWithUs: ["7-day locked valuation", "Free 3-hour doorstep arrival", "Direct cash in hand", "Complete data wipe"],
    faqs: [
      { question: "How much can I get for an M1 MacBook Air in Dubai?", answer: "An M1 MacBook Air typically sells for AED 1,400 to AED 1,900 depending on condition and SSD capacity." },
      { question: "Do I need the original charger?", answer: "Having the original 30W or 35W dual charger adds value, but we also buy the laptop standalone." }
    ],
    relatedModels: ["macbook-pro", "ipad-pro", "ipad-air"],
    relatedLocations: ["dubai-marina", "jlt", "downtown-dubai", "dubai-silicon-oasis"]
  },

  "ipad-pro": {
    slug: "ipad-pro",
    brand: "Apple",
    modelName: "iPad Pro",
    title: "Sell iPad Pro in Dubai | Top Cash Payout | SellPhoneCash",
    metaDescription: "Sell your iPad Pro (M4, M2, M1 11\" & 13\") in Dubai for instant cash. Free 3-hour doorstep collection across Dubai, immediate cash payment.",
    h1: "Sell iPad Pro in Dubai for Instant Cash",
    subtitle: "Get the highest cash buyback price for your Apple iPad Pro. Free doorstep pickup throughout Dubai with zero haggling.",
    targetKeywords: ["sell ipad pro dubai", "ipad pro buyback uae", "sell used ipad pro dubai", "cash for ipad pro"],
    categorySlug: "tablets",
    catalogLink: "/services/tablets",
    heroBadge: "Flagship Tablet Buyback",
    estimatedPriceRange: "AED 1,400 - AED 4,600",
    specsSummary: ["Ultra Retina XDR Tandem OLED / Mini-LED", "Apple Silicon M-Series Chips", "Apple Pencil Pro Support", "Face ID Biometrics", "Thunderbolt 4 Port"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 2,600 - 4,600", notes: "Pristine condition, no bends, clean screen." },
      { condition: "Good", estimate: "AED 1,900 - 2,800", notes: "Normal light marks on aluminum chassis." },
      { condition: "Average", estimate: "AED 1,400 - 1,900", notes: "Visible wear or small casing scuff." },
      { condition: "Cracked Screen", estimate: "AED 800 - 1,400", notes: "Cracked glass with working touch." }
    ],
    whySellWithUs: ["Top value for M4 & M2 models", "Free doorstep pickup in 3 hours", "Instant cash or wire transfer", "Secure iCloud wipe"],
    faqs: [
      { question: "How much is my iPad Pro worth in Dubai?", answer: "Values range from AED 1,400 for older M1 models up to AED 4,600 for current M4 OLED iPad Pros with high storage and Cellular." },
      { question: "Can I sell my Apple Pencil and Magic Keyboard together?", answer: "Yes! Bundling original Apple accessories increases your total cash payout." }
    ],
    relatedModels: ["ipad-air", "macbook-pro", "iphone-pro-max"],
    relatedLocations: ["dubai-marina", "business-bay", "downtown-dubai", "jumeirah"]
  },

  "ipad-air": {
    slug: "ipad-air",
    brand: "Apple",
    modelName: "iPad Air",
    title: "Sell iPad Air in Dubai | Instant Cash Today | SellPhoneCash",
    metaDescription: "Sell your iPad Air (M2, M1, 4th Gen) in Dubai for cash. Instant valuation, free 3-hour doorstep collection across Dubai, cash paid on collection.",
    h1: "Sell iPad Air in Dubai for Immediate Cash",
    subtitle: "Upgrade or liquidate your Apple iPad Air 11-inch or 13-inch today. Fast online valuation with free doorstep pickup in Dubai.",
    targetKeywords: ["sell ipad air dubai", "ipad air buyback uae", "sell used ipad air dubai", "cash for ipad air"],
    categorySlug: "tablets",
    catalogLink: "/services/tablets",
    heroBadge: "Popular Tablet Buyback",
    estimatedPriceRange: "AED 900 - AED 2,600",
    specsSummary: ["Apple M2 / M1 Silicon", "Liquid Retina Display", "Touch ID in Top Button", "USB-C Connectivity", "All-Day Battery Life"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,600 - 2,600", notes: "Like new, clean display, zero marks." },
      { condition: "Good", estimate: "AED 1,200 - 1,700", notes: "Normal light pocket marks, clean screen." },
      { condition: "Average", estimate: "AED 900 - 1,200", notes: "Minor scratches on back casing." },
      { condition: "Cracked Screen", estimate: "AED 500 - 900", notes: "Cracked front glass panel." }
    ],
    whySellWithUs: ["Instant cash payout", "Free pickup across Dubai in 3 hours", "Guaranteed 7-day quote", "Safe data removal"],
    faqs: [
      { question: "What is the trade-in value of an iPad Air in Dubai?", answer: "An iPad Air typically yields between AED 900 and AED 2,600 depending on screen size, generation, and storage capacity." },
      { question: "How quickly can you collect my iPad Air in Dubai?", answer: "Our courier can arrive at your location within 3 hours of online booking." }
    ],
    relatedModels: ["ipad-pro", "macbook-air", "iphone-15"],
    relatedLocations: ["jlt", "dubai-silicon-oasis", "deira", "al-barsha"]
  },

  "apple-watch": {
    slug: "apple-watch",
    brand: "Apple",
    modelName: "Apple Watch Series",
    title: "Sell Apple Watch in Dubai | Top Cash Valuation | SellPhoneCash",
    metaDescription: "Sell your Apple Watch Series 10, 9, 8, or SE in Dubai for instant cash! Free 3-hour doorstep collection, cash paid on spot.",
    h1: "Sell Apple Watch in Dubai for Instant Cash",
    subtitle: "Get immediate dirhams for your Apple Watch Series or SE. Free doorstep collection anywhere in Dubai with instant cash settlement.",
    targetKeywords: ["sell apple watch dubai", "apple watch buyback uae", "sell used apple watch dubai", "cash for apple watch"],
    categorySlug: "smartwatches",
    catalogLink: "/services/smartwatches",
    heroBadge: "Smartwatch Buyback",
    estimatedPriceRange: "AED 450 - AED 1,750",
    specsSummary: ["Always-On Retina OLED Display", "ECG & Heart Rate Sensors", "Sleep & Activity Tracking", "Fast Magnetic Charging", "Water Resistant 50m"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,000 - 1,750", notes: "Screen scratch-free, clean casing, 90%+ battery." },
      { condition: "Good", estimate: "AED 750 - 1,150", notes: "Minor scuffs on aluminum edge, working sensor." },
      { condition: "Average", estimate: "AED 450 - 750", notes: "Visible scratches on glass or casing." },
      { condition: "Cracked Glass", estimate: "AED 250 - 450", notes: "Cracked screen or faulty touch." }
    ],
    whySellWithUs: ["Fair valuation based on casing (Aluminum vs Stainless)", "Free 3-hour doorstep pickup", "Immediate cash in hand", "Fast inspection"],
    faqs: [
      { question: "Do stainless steel or titanium Apple Watches pay more?", answer: "Yes! Stainless steel and titanium models with sapphire crystal glass receive higher cash valuations than aluminum models." },
      { question: "What should I do before handing over my Apple Watch?", answer: "Unpair the watch from your iPhone in the Watch app. This automatically removes Activation Lock and creates an iCloud backup." }
    ],
    relatedModels: ["apple-watch-ultra", "iphone-16", "iphone-15"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "jlt", "business-bay"]
  },

  "apple-watch-ultra": {
    slug: "apple-watch-ultra",
    brand: "Apple",
    modelName: "Apple Watch Ultra",
    title: "Sell Apple Watch Ultra in Dubai | Highest Cash Rates | SellPhoneCash",
    metaDescription: "Sell your Apple Watch Ultra 2 or Ultra 1 in Dubai for top instant cash. Free 3-hour doorstep collection, cash paid on collection.",
    h1: "Sell Apple Watch Ultra in Dubai for Top Cash",
    subtitle: "Turn your rugged Apple Watch Ultra into immediate cash today. High market demand, transparent valuation, free doorstep pickup.",
    targetKeywords: ["sell apple watch ultra dubai", "apple watch ultra buyback uae", "sell used watch ultra dubai", "cash for watch ultra"],
    categorySlug: "smartwatches",
    catalogLink: "/services/smartwatches",
    heroBadge: "Premium Rugged Wearable",
    estimatedPriceRange: "AED 1,350 - AED 2,450",
    specsSummary: ["Aerospace-Grade Titanium 49mm Case", "Flat Sapphire Front Crystal", "3,000 Nits Peak Brightness", "Up to 36–72 Hours Battery", "Dual-Frequency Precision GPS"],
    conditionPrices: [
      { condition: "Flawless", estimate: "AED 1,800 - 2,450", notes: "Immaculate bezel, sapphire crystal scratch-free." },
      { condition: "Good", estimate: "AED 1,500 - 1,850", notes: "Minor outdoor wear on titanium bezel." },
      { condition: "Average", estimate: "AED 1,350 - 1,550", notes: "Noticeable dents on bezel lip." },
      { condition: "Damaged", estimate: "AED 750 - 1,200", notes: "Cracked sapphire or sensor issue." }
    ],
    whySellWithUs: ["Top cash guarantee in UAE", "Free 3-hour doorstep collection", "Instant cash or wire transfer", "Zero hassles"],
    faqs: [
      { question: "How much is an Apple Watch Ultra worth in Dubai?", answer: "An Apple Watch Ultra 1 or Ultra 2 typically sells for AED 1,350 to AED 2,450 based on condition and band combination." },
      { question: "Do you need the original Ultra band?", answer: "Original Alpine, Trail, or Ocean bands help increase value, but third-party bands are also accepted." }
    ],
    relatedModels: ["apple-watch", "iphone-pro-max", "iphone-16"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "jumeirah", "business-bay"]
  }
};

// -------------------------------------------------------------
// 3. LOCATION PAGES (9 Pages)
// -------------------------------------------------------------
export const LOCATION_PAGES: Record<string, LocationPageData> = {
  "dubai-marina": {
    slug: "dubai-marina",
    locationName: "Dubai Marina",
    title: "Sell Phone in Dubai Marina | Free 30-Min Doorstep Pickup | SellPhoneCash",
    metaDescription: "Sell your used phone in Dubai Marina today. Fastest 30-minute doorstep collection, instant cash on the spot. We buy iPhones, Samsungs, MacBooks & iPads.",
    h1: "Sell Your Phone in Dubai Marina for Instant Cash",
    subtitle: "Dubai Marina's top-rated device buyback service. We come directly to your tower, residence, or favorite Marina Walk cafe and pay cash on the spot.",
    targetKeywords: ["sell phone dubai marina", "iphone buyback dubai marina", "mobile buyer dubai marina", "cash for phone dubai marina", "sell used phone marina"],
    pickupSpeed: "30 - 60 Minutes",
    keyLandmarks: ["Marina Walk", "Dubai Marina Mall", "JBR The Walk", "Princess Tower", "Cayan Tower", "Marina Gate"],
    coverageDescription: "We have dedicated courier riders stationed directly in and around Dubai Marina 7 days a week from 9 AM to 10 PM. Whether you reside in high-rise towers along Al Marsa Street or waterfront residences at Marina Gate, our specialist can arrive at your lobby within 30 to 60 minutes.",
    neighborhoodsServed: ["Dubai Marina Walk", "JBR (Jumeirah Beach Residence)", "Marina Promenade", "Marina Quays", "Bluewaters Island"],
    serviceHighlights: ["Ultra-fast 30-60 min dispatch", "Inspection in your lobby or cafe", "Instant cash in AED or wire", "Zero pickup or cancellation fees"],
    faqs: [
      { question: "Can the technician meet me at my tower lobby in Dubai Marina?", answer: "Yes! Our technicians frequently meet clients in residential tower lobbies, at Marina Mall, or at coffee shops along Marina Walk." },
      { question: "How fast is collection in Dubai Marina?", answer: "Since we have dedicated riders active in the Marina and JBR corridor, collection usually happens in 30 to 60 minutes." },
      { question: "What if my building requires visitor security registration?", answer: "Our staff carry official UAE Emirates IDs and trade company credentials to comply with building concierge regulations seamlessly." }
    ],
    relatedLocations: ["jlt", "downtown-dubai", "al-barsha", "business-bay", "jumeirah"],
    topModels: ["iphone-pro-max", "iphone-16", "samsung-s25", "macbook-pro", "samsung-fold", "apple-watch-ultra"]
  },

  "jlt": {
    slug: "jlt",
    locationName: "Jumeirah Lake Towers (JLT)",
    title: "Sell Phone in JLT Dubai | Instant Cash On Spot | SellPhoneCash",
    metaDescription: "Sell your used phone in JLT (Jumeirah Lake Towers). Express 30-minute collection to any cluster (A to Z), instant cash paid on the spot. Sell iPhone, Samsung & more.",
    h1: "Sell Your Phone in JLT for Instant Cash",
    subtitle: "Fastest device buyback service across all JLT clusters (Cluster A to Z). Top cash value, free doorstep collection, and immediate payment.",
    targetKeywords: ["sell phone jlt", "mobile buyer jlt dubai", "iphone trade in jlt", "cash for phone jumeirah lake towers", "sell old phone jlt"],
    pickupSpeed: "30 - 45 Minutes",
    keyLandmarks: ["DMCC Metro Station", "Sobha Realty Metro", "JLT Park", "One JLT", "Tiffany Tower", "Armada Towers"],
    coverageDescription: "Our field agents operate continuously through all 26 clusters of Jumeirah Lake Towers. Whether you work in a DMCC office tower or live near JLT Central Park, we provide rapid, discreet pickups with immediate cash payment.",
    neighborhoodsServed: ["Cluster A through Z", "Jumeirah Heights", "JLT Lakeshore", "Meadows Border", "One JLT Business Hub"],
    serviceHighlights: ["Rapid access to all 26 clusters", "Office & residential desk pickup", "Instant cash or bank transfer", "Full data privacy guaranteed"],
    faqs: [
      { question: "Can you pick up from my office in JLT during business hours?", answer: "Yes, we regularly visit corporate offices in JLT. The evaluation takes less than 3 minutes at your desk or building reception." },
      { question: "Which clusters in JLT do you cover?", answer: "We cover every single cluster from Cluster A to Cluster Z without exception." },
      { question: "Do you pay cash or bank transfer?", answer: "We can hand you physical cash immediately or send an instant direct bank transfer to your UAE account." }
    ],
    relatedLocations: ["dubai-marina", "al-barsha", "dubai-silicon-oasis", "downtown-dubai"],
    topModels: ["iphone-16", "iphone-pro-max", "samsung-s24", "macbook-air", "ipad-pro", "apple-watch"]
  },

  "downtown-dubai": {
    slug: "downtown-dubai",
    locationName: "Downtown Dubai",
    title: "Sell Phone in Downtown Dubai | Instant Cash Doorstep | SellPhoneCash",
    metaDescription: "Sell your phone in Downtown Dubai today. We come to Burj Khalifa, Dubai Mall, or your apartment in 45 mins. Top cash for iPhone, Samsung, MacBooks & iPads.",
    h1: "Sell Your Phone in Downtown Dubai for Instant Cash",
    subtitle: "Premium device buyback right in the heart of the city. Top market valuation and immediate payment at your residence or executive suite.",
    targetKeywords: ["sell phone downtown dubai", "iphone buyback downtown dubai", "mobile buyer near dubai mall", "cash for phone burj khalifa", "sell used phone downtown"],
    pickupSpeed: "45 - 60 Minutes",
    keyLandmarks: ["Burj Khalifa", "The Dubai Mall", "Dubai Opera", "Mohammed Bin Rashid Boulevard", "Souk Al Bahar", "Address Downtown"],
    coverageDescription: "Operating along Sheikh Mohammed Bin Rashid Boulevard and surrounding prestigious residential addresses, our executive buyback service delivers white-glove device collections right to your lobby or hotel suite.",
    neighborhoodsServed: ["MBR Boulevard", "The Old Town", "Opera District", "Burj Residences", "South Ridge Towers", "Dubai Mall Suites"],
    serviceHighlights: ["White-glove executive service", "45-60 min arrival across Downtown", "Highest price for flagship devices", "100% certified data wipe"],
    faqs: [
      { question: "Can you meet at a cafe on Mohammed Bin Rashid Boulevard?", answer: "Yes! We can meet you at any cafe, lounge, or directly in your residential building lobby." },
      { question: "Do you buy sealed luxury devices like iPhone Pro Max or Fold in Downtown?", answer: "Yes, we specialize in high-end flagships and offer the highest cash rates in Dubai." }
    ],
    relatedLocations: ["business-bay", "dubai-marina", "jumeirah", "deira"],
    topModels: ["iphone-pro-max", "iphone-16", "samsung-fold", "macbook-pro", "apple-watch-ultra", "ipad-pro"]
  },

  "business-bay": {
    slug: "business-bay",
    locationName: "Business Bay",
    title: "Sell Phone in Business Bay | Instant Cash at Your Office | SellPhoneCash",
    metaDescription: "Sell your phone in Business Bay Dubai. Fast 45-minute pickup to your office tower or apartment. Cash paid on the spot for iPhone, Samsung, laptops.",
    h1: "Sell Your Phone in Business Bay for Top Cash",
    subtitle: "Fast, reliable device buyback for busy professionals and residents in Business Bay. Free doorstep arrival and instant cash payment.",
    targetKeywords: ["sell phone business bay", "mobile buyer business bay dubai", "iphone trade in business bay", "corporate phone buyback business bay"],
    pickupSpeed: "30 - 50 Minutes",
    keyLandmarks: ["Dubai Water Canal", "Bay Square", "The Opus by Zaha Hadid", "Executive Towers", "Vision Tower", "Churchill Towers"],
    coverageDescription: "Business Bay is one of our most active logistics zones. With couriers patrolling along Marasi Drive and Al Saada Street, we can be at your office or residence in under 45 minutes to complete your transaction with zero downtime.",
    neighborhoodsServed: ["Executive Towers", "Bay Square", "Marasi Drive Waterfront", "Al Asayel Street Hub", "Canal Promenade"],
    serviceHighlights: ["Ideal for office workers during lunch or break", "Rapid 30-50 min dispatch", "Corporate & personal devices", "Immediate cash or wire transfer"],
    faqs: [
      { question: "How quickly can you meet me in Bay Square or Executive Towers?", answer: "Typically in under 30 to 45 minutes. Our representative can meet you right in the lobby or retail plaza." },
      { question: "Do you buy laptops and corporate MacBooks in Business Bay?", answer: "Yes, we buy MacBooks, Windows laptops, and phones from individual professionals as well as company fleets." }
    ],
    relatedLocations: ["downtown-dubai", "dubai-marina", "jumeirah", "bur-dubai"],
    topModels: ["iphone-pro-max", "iphone-16", "macbook-pro", "samsung-s25", "ipad-pro"]
  },

  "deira": {
    slug: "deira",
    locationName: "Deira",
    title: "Sell Phone in Deira Dubai | Instant Cash On Spot | SellPhoneCash",
    metaDescription: "Sell your used or old phone in Deira Dubai. Best cash prices, beats Naif and Sabkha shops without the haggling. Free doorstep pickup, cash paid on spot.",
    h1: "Sell Your Phone in Deira for Instant Cash",
    subtitle: "Skip the chaos and lowballing of crowded electronics markets. Get a transparent, guaranteed cash payout at your doorstep in Deira.",
    targetKeywords: ["sell phone deira", "mobile buyers deira dubai", "sell used phone naif", "sell iphone deira city centre", "cash for phone deira"],
    pickupSpeed: "45 - 60 Minutes",
    keyLandmarks: ["Deira City Centre", "Al Ghurair Centre", "Gold Souk", "Rigga Street", "Maktoum Road", "Clock Tower"],
    coverageDescription: "Avoid navigating crowded mobile souks in Naif and Sabkha where shopkeepers haggle aggressively. SellPhoneCash delivers honest wholesale prices directly to your door anywhere in Deira with instant dirhams in hand.",
    neighborhoodsServed: ["Al Rigga", "Al Muraqqabat", "Al Port Saeed", "Abu Hail", "Naif", "Hor Al Anz"],
    serviceHighlights: ["Higher payout than crowded market stalls", "No haggling or lowball tactics", "Free doorstep pickup across Deira", "Instant cash payment"],
    faqs: [
      { question: "Why sell to SellPhoneCash instead of mobile shops in Naif or Sabkha?", answer: "Naif shops frequently waste time with extreme lowball offers and inspection fees. With us, your quote is guaranteed online and we pay cash at your door." },
      { question: "Do you buy broken or old phones in Deira?", answer: "Yes, we purchase used, cracked, broken, and older model smartphones throughout Deira." }
    ],
    relatedLocations: ["bur-dubai", "downtown-dubai", "dubai-silicon-oasis", "al-barsha"],
    topModels: ["iphone-15", "iphone-14", "samsung-s24", "iphone-13", "samsung-flip"]
  },

  "bur-dubai": {
    slug: "bur-dubai",
    locationName: "Bur Dubai",
    title: "Sell Phone in Bur Dubai | Instant Cash Today | SellPhoneCash",
    metaDescription: "Sell your phone in Bur Dubai for instant cash today. Free doorstep pickup in Al Mankhool, Al Karama, Oud Metha. Top cash for iPhone, Samsung, laptops.",
    h1: "Sell Your Phone in Bur Dubai for Top Cash",
    subtitle: "Convenient, safe, and professional mobile buyback in historic Bur Dubai. Free doorstep collection and instant cash payout.",
    targetKeywords: ["sell phone bur dubai", "mobile buyer bur dubai", "sell used phone karama", "cash for phone mankhool", "iphone trade in bur dubai"],
    pickupSpeed: "45 - 60 Minutes",
    keyLandmarks: ["BurJuman Centre", "Meena Bazaar", "Al Karama Market", "Oud Metha", "Al Fahidi Historical District"],
    coverageDescription: "Covering Al Mankhool, Al Karama, Al Raffa, and Oud Metha, our mobile collection team visits your apartment or office to make selling your pre-owned electronics effortless and profitable.",
    neighborhoodsServed: ["Al Mankhool", "Al Karama", "Al Raffa", "Oud Metha", "Al Souk Al Kabeer", "Zabeel Border"],
    serviceHighlights: ["Free apartment or office collection", "Instant cash in hand", "Transparent diagnostic check", "All phone brands accepted"],
    faqs: [
      { question: "Can you pick up from my flat in Mankhool or Karama?", answer: "Yes! Our courier visits your exact building and flat address, or meets you outside BurJuman Centre." },
      { question: "What brands do you buy in Bur Dubai?", answer: "We buy Apple, Samsung, Google Pixel, Xiaomi, OnePlus, Huawei, as well as laptops and tablets." }
    ],
    relatedLocations: ["deira", "downtown-dubai", "business-bay", "jumeirah"],
    topModels: ["iphone-15", "iphone-14", "samsung-s24", "iphone-13", "macbook-air"]
  },

  "jumeirah": {
    slug: "jumeirah",
    locationName: "Jumeirah",
    title: "Sell Phone in Jumeirah Dubai | Free Doorstep Pickup | SellPhoneCash",
    metaDescription: "Sell your phone in Jumeirah (Jumeirah 1, 2, 3, Umm Suqeim). Top cash for iPhones, Samsungs, MacBooks. Dispatched to your villa in 45 mins.",
    h1: "Sell Your Phone in Jumeirah for Instant Cash",
    subtitle: "Private, discreet villa collection across Jumeirah 1, 2, 3 and Umm Suqeim. Guaranteed top cash rates for your high-end electronics.",
    targetKeywords: ["sell phone jumeirah", "iphone buyback jumeirah dubai", "mobile buyer umm suqeim", "cash for phone jumeirah 1 2 3"],
    pickupSpeed: "45 - 60 Minutes",
    keyLandmarks: ["Burj Al Arab", "Kite Beach", "Mercato Mall", "Boxpark", "City Walk Border", "La Mer"],
    coverageDescription: "Providing premium private villa collections along Jumeirah Beach Road and Al Wasl Road. We arrive promptly at your gate with discreet, respectful, and certified service.",
    neighborhoodsServed: ["Jumeirah 1", "Jumeirah 2", "Jumeirah 3", "Umm Suqeim 1, 2, 3", "Al Safa", "Al Manara"],
    serviceHighlights: ["Private villa gate arrival", "Discreet & high-security service", "Top cash or instant wire transfer", "Complete device sanitization"],
    faqs: [
      { question: "Do you come directly to villas in Jumeirah?", answer: "Yes, our drivers navigate residential communities in Jumeirah 1, 2, 3 and Umm Suqeim daily." },
      { question: "Can I sell multiple family devices in one go?", answer: "Certainly! We frequently buy families' combined old iPhones, iPads, and MacBooks in a single visit." }
    ],
    relatedLocations: ["downtown-dubai", "dubai-marina", "business-bay", "al-barsha"],
    topModels: ["iphone-pro-max", "iphone-16", "macbook-pro", "ipad-pro", "apple-watch-ultra"]
  },

  "al-barsha": {
    slug: "al-barsha",
    locationName: "Al Barsha",
    title: "Sell Phone in Al Barsha | Instant Cash Doorstep | SellPhoneCash",
    metaDescription: "Sell your used phone in Al Barsha (Barsha 1, 2, 3 & South). Quick 30-45 minute pickup near Mall of the Emirates. Cash paid on the spot.",
    h1: "Sell Your Phone in Al Barsha for Instant Cash",
    subtitle: "Get immediate dirhams for your phone in Al Barsha. Located close to Mall of the Emirates, Barsha Heights (TECOM), and Barsha South.",
    targetKeywords: ["sell phone al barsha", "mobile buyer barsha dubai", "iphone buyback mall of the emirates", "sell used phone tecom", "cash for phone barsha heights"],
    pickupSpeed: "30 - 45 Minutes",
    keyLandmarks: ["Mall of the Emirates", "Barsha Pond Park", "Barsha Heights (TECOM)", "Al Barsha South", "Dubai Science Park"],
    coverageDescription: "With direct proximity to Sheikh Zayed Road and Al Khail Road, our Al Barsha dispatch team provides rapid 30-minute responses to apartments in Barsha 1 and villas in Barsha 2, 3, and Barsha South.",
    neighborhoodsServed: ["Al Barsha 1", "Al Barsha 2", "Al Barsha 3", "Al Barsha South", "Barsha Heights (TECOM)"],
    serviceHighlights: ["30-45 minute collection time", "Near MOE & TECOM hubs", "Instant cash or bank transfer", "Transparent on-site testing"],
    faqs: [
      { question: "How quickly can you reach Barsha Heights or near MOE?", answer: "Usually within 30 to 45 minutes from when you submit your booking." },
      { question: "Do you buy laptops and tablets in Al Barsha as well?", answer: "Yes, we purchase all MacBooks, iPads, and Windows gaming laptops." }
    ],
    relatedLocations: ["dubai-marina", "jlt", "downtown-dubai", "dubai-silicon-oasis"],
    topModels: ["iphone-16", "iphone-pro-max", "samsung-s24", "macbook-air", "apple-watch"]
  },

  "dubai-silicon-oasis": {
    slug: "dubai-silicon-oasis",
    locationName: "Dubai Silicon Oasis (DSO)",
    title: "Sell Phone in Dubai Silicon Oasis | Instant Cash | SellPhoneCash",
    metaDescription: "Sell your phone in Dubai Silicon Oasis (DSO). Fast free doorstep collection to your tower or villa in DSO. Cash paid on spot for iPhone, Samsung, MacBooks.",
    h1: "Sell Your Phone in Dubai Silicon Oasis for Instant Cash",
    subtitle: "Premier tech buyback service right in Dubai's technology hub. Free doorstep collection across DSO with instant cash payment.",
    targetKeywords: ["sell phone dubai silicon oasis", "sell phone dso", "mobile buyer silicon oasis", "iphone trade in dso", "cash for phone silicon oasis"],
    pickupSpeed: "45 - 60 Minutes",
    keyLandmarks: ["Silicon Central Mall", "Dubai Digital Park", "Cedre Villas", "Semmer Villas", "Academic City Border"],
    coverageDescription: "SellPhoneCash has strong operational roots in Dubai Silicon Oasis. Whether you live in high-rise towers around Silicon Central or residential communities in Cedre and Semmer Villas, our team offers prompt free collection.",
    neighborhoodsServed: ["Cedre Villas", "Semmer Villas", "Silicon Digital Park Area", "Palace Towers", "Axis Residences", "Academic City Border"],
    serviceHighlights: ["Local hub presence in DSO", "Fast 45-60 min villa & tower pickup", "Instant cash or wire transfer", "Full data sanitization on spot"],
    faqs: [
      { question: "Is SellPhoneCash based in or near Dubai Silicon Oasis?", answer: "Yes! Our operations hub is based in Dubai Silicon Oasis, which allows us to provide rapid service throughout DSO and Academic City." },
      { question: "Can you meet at Silicon Central Mall?", answer: "Yes! We can meet you at Silicon Central, in your residential lobby, or at your villa gate." }
    ],
    relatedLocations: ["al-barsha", "deira", "bur-dubai", "downtown-dubai"],
    topModels: ["iphone-16", "iphone-15", "samsung-s24", "macbook-air", "google-pixel", "ipad-air"]
  }
};

export const SERVICE_SLUGS = [
  ...Object.keys(SERVICE_PAGES),
  "sell-iphone-in-dubai",
  "sell-samsung-in-dubai",
  "sell-used-phone-in-dubai",
  "sell-phone-for-cash-dubai",
  "sell-broken-phone-in-dubai",
  "sell-old-phone-in-dubai",
  "phone-buyback-dubai",
];

export const MODEL_SLUGS = [
  ...Object.keys(MODEL_PAGES),
  "iphone-16-pro-max",
  "iphone-15-pro-max",
  "iphone-14-pro-max",
  "iphone-13-pro-max",
  "samsung-galaxy-s24-ultra",
  "samsung-galaxy-s25-ultra",
  "samsung-galaxy-s26-ultra",
  "galaxy-s24-ultra",
  "galaxy-z-fold-6",
  "galaxy-z-flip-6",
  "macbook-pro-16",
  "macbook-air-m2",
  "macbook-air-m3",
  "apple-watch-ultra-2",
  "playstation-5-slim",
];

export const LOCATION_SLUGS = Object.keys(LOCATION_PAGES);

// Robust dynamic resolvers with fuzzy matching to guarantee ZERO 404s
export function resolveServicePage(rawSlug: string): ServicePageData {
  if (!rawSlug) return SERVICE_PAGES["iphone-dubai"];
  const s = rawSlug.toLowerCase().trim();

  // 1. Direct match in dictionary
  if (SERVICE_PAGES[s]) return SERVICE_PAGES[s];

  // 2. Normalize by removing "sell-" and "-in-dubai" or "-dubai"
  const stripped = s.replace(/^sell-/, "").replace(/-in-dubai$/, "").replace(/-dubai$/, "");
  
  if (s.includes("iphone")) return SERVICE_PAGES["iphone-dubai"];
  if (s.includes("samsung")) return SERVICE_PAGES["samsung-dubai"];
  if (s.includes("broken")) return SERVICE_PAGES["broken-phone-dubai"];
  if (s.includes("used")) return SERVICE_PAGES["used-phone-dubai"];
  if (s.includes("cash") || s.includes("for-cash")) return SERVICE_PAGES["phone-for-cash-dubai"];
  if (s.includes("buyback")) return SERVICE_PAGES["phone-buyback-dubai"];
  if (s.includes("old")) return SERVICE_PAGES["old-phone-dubai"];

  // 3. Fallback to closest match or default
  for (const page of Object.values(SERVICE_PAGES)) {
    if (page.slug.includes(stripped) || stripped.includes(page.slug)) {
      return page;
    }
  }

  return SERVICE_PAGES["iphone-dubai"];
}

export function resolveModelPage(rawSlug: string): ModelPageData {
  if (!rawSlug) return MODEL_PAGES["iphone-16"];
  const s = rawSlug.toLowerCase().trim();

  // 1. Direct match
  if (MODEL_PAGES[s]) return MODEL_PAGES[s];

  // 2. Alias mapping
  if (s.includes("iphone-16-pro-max") || s === "iphone-16-pro-max") return MODEL_PAGES["iphone-pro-max"] || MODEL_PAGES["iphone-16"];
  if (s.includes("iphone-17")) return MODEL_PAGES["iphone-17"];
  if (s.includes("iphone-16")) return MODEL_PAGES["iphone-16"];
  if (s.includes("iphone-15")) return MODEL_PAGES["iphone-15"];
  if (s.includes("iphone-14")) return MODEL_PAGES["iphone-14"];
  if (s.includes("iphone-13")) return MODEL_PAGES["iphone-13"];
  if (s.includes("s26")) return MODEL_PAGES["samsung-s26"];
  if (s.includes("s25")) return MODEL_PAGES["samsung-s25"];
  if (s.includes("s24") || s.includes("samsung-galaxy-s24")) return MODEL_PAGES["samsung-s24"];
  if (s.includes("fold")) return MODEL_PAGES["samsung-fold"];
  if (s.includes("flip")) return MODEL_PAGES["samsung-flip"];
  if (s.includes("pixel")) return MODEL_PAGES["google-pixel"];
  if (s.includes("macbook-pro")) return MODEL_PAGES["macbook-pro"];
  if (s.includes("macbook-air")) return MODEL_PAGES["macbook-air"];
  if (s.includes("ipad-pro")) return MODEL_PAGES["ipad-pro"];
  if (s.includes("ipad-air") || s.includes("ipad")) return MODEL_PAGES["ipad-air"];
  if (s.includes("watch-ultra")) return MODEL_PAGES["apple-watch-ultra"];
  if (s.includes("watch")) return MODEL_PAGES["apple-watch"];

  // 3. Dynamic generator for any unlisted model slug (ZERO 404 guarantee)
  const formatted = s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug: s,
    brand: s.includes("samsung") ? "Samsung" : s.includes("google") || s.includes("pixel") ? "Google" : "Apple",
    modelName: formatted,
    title: `Sell ${formatted} in Dubai | Highest Cash Valuation | SellPhoneCash`,
    metaDescription: `Sell your ${formatted} in Dubai for instant cash payout. Free 3-hour doorstep collection across Dubai, guaranteed 7-day price lock.`,
    h1: `Sell ${formatted} in Dubai for Top Cash`,
    subtitle: `Upgrade or sell your pre-owned ${formatted}. Transparent online valuation with free doorstep collection and immediate cash payment across Dubai.`,
    targetKeywords: [`sell ${s.replace(/-/g, " ")} dubai`, `${s.replace(/-/g, " ")} buyback uae`],
    categorySlug: s.includes("macbook") || s.includes("laptop") ? "laptops" : s.includes("watch") ? "smartwatches" : s.includes("ipad") || s.includes("tab") ? "tablets" : "smartphones",
    catalogLink: "/services",
    heroBadge: "Guaranteed UAE Cash Offer",
    estimatedPriceRange: "AED 1,500 - AED 4,500",
    specsSummary: ["High-Resolution OLED / Retina Display", "Fast Multi-Core Processing", "High Battery Endurance", "Full UAE Carrier Compatibility"],
    conditionPrices: [
      { condition: "Brand New Sealed", estimate: "Top Value Payout", notes: "Original box unopened with factory seal intact." },
      { condition: "Flawless / Like New", estimate: "Up to 90% Value", notes: "Zero scratches, 100% battery capacity, all sensors perfect." },
      { condition: "Good Condition", estimate: "Strong Cash Payout", notes: "Minor handling wear on bezel, display completely intact." },
      { condition: "Cracked / Damaged", estimate: "Fair Cash Rate", notes: "Cracked screen or back glass, fully operational motherboard." }
    ],
    whySellWithUs: ["Guaranteed 7-day price lock", "Free 3-hour doorstep collection in Dubai", "Instant cash or bank transfer", "100% certified data wipe"],
    faqs: [
      { question: `How much can I get when selling my ${formatted} in Dubai?`, answer: `Valuations depend on storage capacity and cosmetic grade. SellPhoneCash checks real-time Dubai secondary market demand to guarantee you the top rate.` },
      { question: `How fast is collection in Dubai?`, answer: `Our licensed field technician meets you at your home, office, or coffee shop anywhere in Dubai within 3 hours.` },
      { question: `How will I be paid?`, answer: `Choose immediate physical cash in UAE Dirhams (AED) or an instant bank wire directly to your UAE account upon diagnostic review.` }
    ],
    relatedModels: ["iphone-16-pro-max", "iphone-17", "samsung-s26", "macbook-pro"],
    relatedLocations: ["dubai-marina", "downtown-dubai", "business-bay", "jlt"]
  };
}

export function resolveLocationPage(rawSlug: string): LocationPageData {
  if (!rawSlug) return LOCATION_PAGES["dubai-marina"];
  const s = rawSlug.toLowerCase().trim();

  if (LOCATION_PAGES[s]) return LOCATION_PAGES[s];

  for (const page of Object.values(LOCATION_PAGES)) {
    if (page.slug.includes(s) || s.includes(page.slug)) {
      return page;
    }
  }

  const formatted = s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug: s,
    locationName: formatted,
    title: `Sell Phone in ${formatted}, Dubai | Instant Cash & Free Pickup`,
    metaDescription: `Sell your used phone in ${formatted}, Dubai for top cash. Free 3-hour doorstep courier pickup and immediate payment.`,
    h1: `Sell Your Phone in ${formatted} for Instant Cash`,
    subtitle: `Doorstep mobile phone, tablet, and laptop buyback in ${formatted}. Highest payouts guaranteed with zero pickup fees.`,
    targetKeywords: [`sell phone ${s.replace(/-/g, " ")}`, `phone buyback ${s.replace(/-/g, " ")}`],
    pickupSpeed: "Within 3 Hours",
    keyLandmarks: [`${formatted} Center`, `${formatted} Metro`, "Local Landmarks"],
    coverageDescription: `Complete 100% courier coverage across all residences and offices in ${formatted}, Dubai.`,
    neighborhoodsServed: [formatted, "Downtown Dubai", "Dubai Marina", "Business Bay"],
    serviceHighlights: ["Free 3-Hour Doorstep Pickup", "Cash on the Spot", "100% Certified Data Wipe", "7-Day Price Lock"],
    faqs: [
      { question: `How quickly can a driver arrive in ${formatted}?`, answer: `Our licensed field technician arrives at your doorstep in ${formatted} within 3 hours of confirmation.` },
      { question: `Do I have to pay for courier pickup in ${formatted}?`, answer: `No, doorstep collection anywhere in ${formatted} is 100% free with zero obligation.` }
    ],
    relatedLocations: ["dubai-marina", "downtown-dubai", "business-bay", "jlt"],
    topModels: ["iphone-16", "iphone-pro-max", "samsung-s24", "macbook-pro"]
  };
}

