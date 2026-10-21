"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Search, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Gamepad2, 
  Tv,
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { LocationPageData } from "@/lib/seoData";
import { CategoryType, BrandType, ProductType } from "@/types";

interface LocationHeroPomaiiProps {
  page: LocationPageData;
  customH1?: string;
  customSubtitle?: string;
  customHeroImage?: string;
  categories?: CategoryType[];
  brands?: BrandType[];
  products?: ProductType[];
}

const DEFAULT_CATEGORIES: CategoryType[] = [
  { id: "smartphones", name: "Smartphones", slug: "smartphones", description: "", image: "" },
  { id: "laptops", name: "Laptops & MacBooks", slug: "laptops", description: "", image: "" },
  { id: "tablets", name: "Tablets & iPads", slug: "tablets", description: "", image: "" },
  { id: "smartwatches", name: "Smartwatches", slug: "smartwatches", description: "", image: "" },
  { id: "games", name: "Gaming Consoles", slug: "games", description: "", image: "" },
  { id: "tvs", name: "Smart TVs", slug: "tvs", description: "", image: "" },
];

const DUBAI_LOCATIONS = [
  { slug: "dubai-marina", name: "Dubai Marina" },
  { slug: "downtown-dubai", name: "Downtown Dubai" },
  { slug: "business-bay", name: "Business Bay" },
  { slug: "jlt", name: "JLT (Jumeirah Lake Towers)" },
  { slug: "palm-jumeirah", name: "Palm Jumeirah" },
  { slug: "al-barsha", name: "Al Barsha" },
  { slug: "deira", name: "Deira" },
  { slug: "bur-dubai", name: "Bur Dubai" },
  { slug: "dubai-silicon-oasis", name: "Dubai Silicon Oasis" },
];

export default function LocationHeroPomaii({ 
  page, 
  customH1, 
  customSubtitle,
  customHeroImage,
  categories = DEFAULT_CATEGORIES,
  brands = [],
  products = []
}: LocationHeroPomaiiProps) {
  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const defaultHeroFallback = "/images/dubai-hero-phones.jpg";
  const [imgSrc, setImgSrc] = useState<string>(customHeroImage || page.heroImage || defaultHeroFallback);

  React.useEffect(() => {
    setImgSrc(customHeroImage || page.heroImage || defaultHeroFallback);
  }, [customHeroImage, page.heroImage]);

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategories[0]?.slug || "smartphones");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>(page.slug);

  // Available brands from DB matching selected category
  const availableBrands = useMemo(() => {
    // 1. Try matching from brands list with category metadata or products correlation
    const matching = brands.filter((b) => {
      if (b.categories && b.categories.length > 0) {
        return b.categories.some((c: any) => {
          const s = typeof c === "string" ? c : c.slug || c.name;
          return (s || "").toLowerCase() === selectedCategory.toLowerCase();
        });
      }
      if (products && products.length > 0) {
        return products.some((p) => 
          ((p.brand || "").toLowerCase() === (b.name || "").toLowerCase() || (p.brand || "").toLowerCase() === (b.slug || "").toLowerCase()) &&
          (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      return false;
    });

    if (matching.length > 0) {
      return matching;
    }

    // 2. Otherwise derive directly from products in that category
    const brandNames = Array.from(new Set(
      products
        .filter(p => (p.category || "").toLowerCase() === selectedCategory.toLowerCase())
        .map(p => p.brand)
        .filter(Boolean)
    ));
    if (brandNames.length > 0) {
      return brandNames.map(b => ({ slug: b.toLowerCase(), name: b }));
    }

    // 3. Fallback for smartphones
    if (selectedCategory.toLowerCase().includes("phone") || selectedCategory.toLowerCase().includes("smartphones")) {
      return [
        { slug: "apple", name: "Apple" },
        { slug: "samsung", name: "Samsung" },
        { slug: "google", name: "Google" },
        { slug: "oneplus", name: "OnePlus" },
      ];
    }

    return brands;
  }, [brands, products, selectedCategory]);

  // Available models from DB matching category & brand
  const availableModels = useMemo(() => {
    return products.filter(p => {
      const matchCat = (p.category || "").toLowerCase() === selectedCategory.toLowerCase();
      const matchBrand = selectedBrand === "all" || (p.brand || "").toLowerCase() === selectedBrand.toLowerCase();
      return matchCat && matchBrand;
    });
  }, [products, selectedCategory, selectedBrand]);

  // Calculate destination URL pointing to real database page
  const targetSearchUrl = useMemo(() => {
    if (selectedModel !== "all") {
      const prod = products.find(p => String(p.id || (p as any)._id) === selectedModel || p.slug === selectedModel);
      if (prod) {
        return prod.id ? `/products/${prod.id}` : (prod.slug ? `/sell/model/${prod.slug}` : `/products/${selectedModel}`);
      }
      return `/products/${selectedModel}`;
    }
    if (selectedBrand !== "all") {
      return `/services/${selectedCategory}/${selectedBrand}`;
    }
    return selectedCategory === "any-device" ? "/sell-any-device" : `/services/${selectedCategory}`;
  }, [selectedModel, selectedBrand, selectedCategory, products]);

  return (
    <section className="relative w-full pt-1 pb-10 sm:pb-16 lg:pb-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO CONTAINER (WARM SCULPTED FRAME + RIGHT-ALIGNED LOCATION SHOWCASE)  */}
      {/* ========================================================================= */}
      <div className="relative w-full min-h-[480px] sm:min-h-[520px] lg:h-[560px] rounded-3xl sm:rounded-[40px] overflow-hidden shadow-xl border border-[#EBE5DA] bg-gradient-to-br from-[#FAF8F5] via-[#F5F2EB] to-[#ECE6DB] flex items-center">
        
        {/* Subtle decorative background watermarks & ambient nature tints */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container: Two-Column Responsive Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Editorial Text & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 text-slate-900">
              
              {/* Top Eyebrow Pill with Nature/Tech Leaf Accent */}
              <div className="inline-flex items-center gap-2 bg-white/90 border border-emerald-200/80 px-3.5 py-1.5 rounded-full shadow-xs backdrop-blur-xs">
                <span className="text-emerald-700 text-xs">🌿</span>
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
                  Doorstep Tech Buyback • {page.locationName}
                </span>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
                {customH1 ? (
                  customH1
                ) : (
                  <>
                    Sell Your Tech. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">
                      Get Instant Cash.
                    </span>
                  </>
                )}
              </h1>

              {/* Clear Subtitle */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-medium leading-relaxed max-w-lg">
                {customSubtitle || (
                  `Complimentary licensed courier collection across ${page.locationName} in under ${page.pickupSpeed}. On-the-spot device testing with immediate cash or bank transfer.`
                )}
              </p>

              {/* Primary Action Button (Warm Amber/Orange Pill Button matching Pomaii) */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Instant Valuation</span>
                  <ArrowRight size={15} />
                </Link>

                <a
                  href={`https://wa.me/971555549817?text=${encodeURIComponent(
                    `Hi SellPhoneCash! I am in ${page.locationName} and want to sell my device for instant cash. Please send courier pickup details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>WhatsApp Dispatch</span>
                </a>
              </div>

              {/* Trust Micro-Checkmarks */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-bold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Zero Pickup Fee</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>100% Data Wiped</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Cash in Hand</span>
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN: Location Photo Showcase (Untouched Resolution, Right-Aligned) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 group">
                
                {/* Ambient Blurred Backdrop behind the image for smooth fill */}
                <div className="absolute inset-0 scale-125 blur-xl opacity-35">
                  <Image
                    src={imgSrc}
                    alt=""
                    fill
                    className="object-cover"
                    aria-hidden="true"
                  />
                </div>

                {/* Natural Aspect Ratio Photo Showcase */}
                <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center">
                  <Image
                    src={imgSrc}
                    alt={`Sell Your Phone in ${page.locationName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 460px"
                    priority
                    onError={() => setImgSrc(defaultHeroFallback)}
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle lower gradient vignette for badge readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Location & Arrival Speed Badges */}
                <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 shadow-md">
                    <MapPin size={13} className="text-emerald-400" />
                    <span>{page.locationName}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-xs">
                    {page.pickupSpeed}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING SEGMENTED VALUATION SEARCH BAR (Matching Pomaii Reference)    */}
      {/* ========================================================================= */}
      <div className="relative -mt-10 sm:-mt-14 z-30 max-w-5xl mx-auto px-3 sm:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-200/90 p-2 sm:p-2.5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2 lg:gap-0 lg:divide-x divide-slate-100 items-center">
            
            {/* Segment 1: Category from Database */}
            <div className="lg:col-span-3 px-3 py-1.5 sm:py-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Smartphone size={11} className="text-emerald-500" />
                <span>Category</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedBrand("all");
                  setSelectedModel("all");
                }}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer truncate mt-0.5"
              >
                {activeCategories.map((cat) => (
                  <option key={cat.id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Segment 2: Brand from Database */}
            <div className="lg:col-span-3 px-3 py-1.5 sm:py-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Sparkles size={11} className="text-emerald-500" />
                <span>Brand</span>
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel("all");
                }}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer truncate mt-0.5"
              >
                <option value="all">All Brands</option>
                {availableBrands.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Segment 3: Live Models from Database */}
            <div className="lg:col-span-3 px-3 py-1.5 sm:py-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Laptop size={11} className="text-emerald-500" />
                <span>Target Model</span>
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer truncate mt-0.5"
              >
                <option value="all">All Available Models</option>
                {availableModels.slice(0, 15).map((m) => (
                  <option key={m.id || (m as any)._id} value={m.slug || String(m.id || (m as any)._id)}>
                    {m.name} (AED {m.basePrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Segment 4: Search Action Button */}
            <div className="lg:col-span-3 p-1">
              <Link
                href={targetSearchUrl}
                className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm py-3 sm:py-3.5 px-5 rounded-xl sm:rounded-full transition-all shadow-md hover:shadow-lg shadow-slate-950/20 group cursor-pointer"
              >
                <span>Calculate Value</span>
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search size={12} className="stroke-[3]" />
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
