"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Smartphone, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Star, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  Lock, 
  Headset, 
  Gift, 
  ArrowLeftRight, 
  Mail, 
  X,
  SlidersHorizontal,
  RotateCcw
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import useBuyCartStore from "@/app/stores/buyCartStore";
import { BuyProductType } from "@/types";

// Phone brand logos currently in SellPhoneCash (Clean transparent vectors)
const BRAND_LOGOS: Array<{ id: string; name: string; logo: string; slug?: string }> = [
  { id: "apple", name: "Apple", logo: "/products/apple-logo.svg", slug: "apple" },
  { id: "samsung", name: "Samsung", logo: "/products/samsung-logo.svg", slug: "samsung" },
  { id: "google", name: "Google", logo: "/products/google-logo.svg", slug: "google" },
  { id: "oneplus", name: "OnePlus", logo: "/products/oneplus-logo.svg", slug: "oneplus" },
];

// Accessories matching the previous design
const ACCESSORIES = [
  {
    id: "acc-1",
    name: "Nova Buds Pro",
    subtitle: "Wireless Earbuds",
    price: 99,
    rating: 4.7,
    image: "/products/apple-watch-ultra.webp",
  },
  {
    id: "acc-2",
    name: "MagSafe Charger",
    subtitle: "Fast Wireless Charging",
    price: 49,
    rating: 4.6,
    image: "/products/galaxy-watch-6.webp",
  },
  {
    id: "acc-3",
    name: "Protective Case",
    subtitle: "For iPhone 16",
    price: 29,
    rating: 4.5,
    image: "/products/apple-watch-series9.webp",
  },
  {
    id: "acc-4",
    name: "Power Bank 20000mAh",
    subtitle: "Fast Charging",
    price: 59,
    rating: 4.7,
    image: "/products/meta-quest-3.webp",
  },
  {
    id: "acc-5",
    name: "Screen Protector",
    subtitle: "9H Tempered Glass",
    price: 19,
    rating: 4.6,
    image: "/products/nintendo-switch-oled.webp",
  },
];

export default function BuyPhonesPage() {
  const [products, setProducts] = useState<BuyProductType[]>([]);
  const [brandLogosList, setBrandLogosList] = useState(BRAND_LOGOS);
  const [loading, setLoading] = useState(true);

  // Minimalist & Professional Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [minPrice, setMinPrice] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Category Icon Row Active Tab
  const [activeCategory, setActiveCategory] = useState("all");

  const { addToCart } = useBuyCartStore();

  const handleQuickCart = (phone: BuyProductType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: String(phone.id || (phone as any)._id),
      _id: String((phone as any)._id || phone.id),
      title: phone.title,
      brand: phone.brand,
      model: phone.model || phone.title,
      price: phone.price,
      originalPrice: phone.originalPrice,
      selectedStorage: phone.selectedStorage || phone.storages?.[0]?.size || "128GB",
      selectedColor: phone.colors?.[0] || "Natural Titanium",
      condition: phone.condition || "Pristine (Like New)",
      quantity: 1,
      image: phone.images?.frontView || "/products/iphone-pro-max.jpg",
      stock: phone.stock,
      warranty: phone.warranty,
      batteryHealth: phone.batteryHealth,
    });
    toast.success(`Added ${phone.title} to your bag!`);
  };

  // Newsletter
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodData, brandData] = await Promise.all([
          api.getBuyProducts(),
          api.getBrands().catch(() => []),
        ]);
        setProducts(prodData);

        // Merge dynamic brands with logos from SellPhoneCash if available
        if (brandData && brandData.length > 0) {
          const map = new Map<string, { id: string; name: string; logo: string; slug?: string }>();
          BRAND_LOGOS.forEach((b) => map.set(b.name.toLowerCase(), { ...b, slug: b.id }));
          brandData.forEach((b: any) => {
            const key = b.name.toLowerCase();
            const brandSlug = b.slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            if (!map.has(key)) {
              if (b.logo && (b.logo.startsWith("/") || b.logo.startsWith("http"))) {
                map.set(key, {
                  id: String(b.id || b._id || brandSlug),
                  name: b.name,
                  logo: b.logo,
                  slug: brandSlug,
                });
              }
            } else {
              const existing = map.get(key)!;
              map.set(key, { ...existing, slug: brandSlug });
            }
          });
          setBrandLogosList(Array.from(map.values()));
        }
      } catch (err) {
        console.error("Failed to fetch buy products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle clicking on moving brand logo: filters models below on that same page
  const handleBrandClick = (brandName: string) => {
    if (selectedBrand.toLowerCase() === brandName.toLowerCase()) {
      setSelectedBrand("all");
    } else {
      setSelectedBrand(brandName);
    }
    setSelectedModel("all");
    setActiveCategory("all");

    // Smooth scroll down to models section below
    const el = document.getElementById("featured-phones-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  // Compute available brands
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand.trim());
    });
    return Array.from(set);
  }, [products]);

  // Compute available models
  const availableModels = useMemo(() => {
    const list = selectedBrand === "all" 
      ? products 
      : products.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
    return list.map((p) => p.title);
  }, [products, selectedBrand]);

  // Check if any filter is active
  const hasActiveFilters = 
    searchQuery.trim() !== "" || 
    selectedBrand !== "all" || 
    selectedModel !== "all" || 
    minPrice !== "all" || 
    maxPrice !== "all" || 
    selectedCondition !== "all" ||
    activeCategory !== "all";

  const activeFilterCount = [
    searchQuery.trim() !== "",
    selectedBrand !== "all",
    selectedModel !== "all",
    minPrice !== "all" || maxPrice !== "all",
    selectedCondition !== "all",
    activeCategory !== "all",
  ].filter(Boolean).length;

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedModel("all");
    setMinPrice("all");
    setMaxPrice("all");
    setSelectedCondition("all");
    setSortBy("featured");
    setActiveCategory("all");
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = products.filter((phone) => {
      // 1. Live text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = phone.title?.toLowerCase().includes(q);
        const matchesBrand = phone.brand?.toLowerCase().includes(q);
        const matchesModel = phone.model?.toLowerCase().includes(q);
        const matchesCondition = phone.condition?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesModel && !matchesCondition) {
          return false;
        }
      }

      // 2. Category pill filter
      if (activeCategory === "flagship") {
        if (!(phone.price >= 2500 || phone.title.toLowerCase().includes("pro") || phone.title.toLowerCase().includes("ultra"))) return false;
      } else if (activeCategory === "mid-range") {
        if (!(phone.price >= 1500 && phone.price < 2500)) return false;
      } else if (activeCategory === "budget") {
        if (!(phone.price < 1500)) return false;
      } else if (activeCategory === "gaming") {
        if (!(phone.brand.toLowerCase() === "oneplus" || phone.title.toLowerCase().includes("ultra") || phone.price >= 2000)) return false;
      } else if (activeCategory === "camera") {
        if (!(phone.title.toLowerCase().includes("pro") || phone.title.toLowerCase().includes("ultra") || phone.brand.toLowerCase() === "google")) return false;
      }

      // 3. Hero filter: Brand
      if (selectedBrand !== "all" && phone.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // 4. Hero filter: Model
      if (selectedModel !== "all" && phone.title.toLowerCase() !== selectedModel.toLowerCase()) {
        return false;
      }

      // 5. Hero filter: Condition
      if (selectedCondition !== "all" && !phone.condition.toLowerCase().includes(selectedCondition.toLowerCase())) {
        return false;
      }

      // 6. Hero filter: Min Price
      if (minPrice !== "all" && phone.price < Number(minPrice)) {
        return false;
      }

      // 7. Hero filter: Max Price
      if (maxPrice !== "all" && phone.price > Number(maxPrice)) {
        return false;
      }

      return true;
    });

    // Sort result
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return result;
  }, [products, searchQuery, activeCategory, selectedBrand, selectedModel, selectedCondition, minPrice, maxPrice, sortBy]);

  const handleAddToCart = (phone: BuyProductType) => {
    const message = encodeURIComponent(
      `Hello SellPhoneCash! 👋\n\nI want to order this phone from the store:\n📱 Model: ${phone.title}\n💾 Storage: ${phone.selectedStorage || phone.storages?.[0]?.size || "Standard"}\n💰 Price: AED ${phone.price.toLocaleString()}\n🛡️ Condition: ${phone.condition}\n\nPlease confirm availability for delivery in Dubai.`
    );
    window.open(`https://wa.me/971555549817?text=${message}`, "_blank");
    toast.success(`Opening WhatsApp inquiry for ${phone.title}!`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing! Exclusive deals will arrive in your inbox.");
    setEmailInput("");
  };

  return (
    <div className="w-full px-[5px] bg-slate-50 text-slate-900 pb-16 space-y-6 pt-2">
      
      {/* =========================================================================
          1. HERO HEADER SECTION (From Reference Image: Light, Clean, 3 Phones)
         ========================================================================= */}
      <section className="w-full relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs pt-8 sm:pt-12 pb-6 px-4 sm:px-8 lg:px-12">
        
        {/* Subtle Architectural City Skyline Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white pointer-events-none" />
        <div 
          className="absolute top-0 right-0 w-full lg:w-2/3 h-72 opacity-15 bg-no-repeat bg-right-top bg-contain pointer-events-none"
          style={{ backgroundImage: `url('/images/dubai-hero-phones.jpg')` }}
        />

        {/* Hero Content Grid (Left: Typography & CTAs | Right: 3 Flagship Phones Array) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle, Buttons, and Trust Metrics */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.08]">
                Find Your Perfect Phone <br />
                Buy Your <span className="text-emerald-500">Dreams</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-normal max-w-lg leading-relaxed pt-1">
                Explore thousands of verified smartphones from trusted sellers. Best prices. Full store warranty. Buy with confidence.
              </p>
            </div>

            {/* Two Action Buttons: Green Primary & White Secondary */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById("featured-phones-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                Browse Phones
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("brand-marquee-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-all hover:border-slate-400 cursor-pointer"
              >
                Shop By Brand
              </button>
            </div>

            {/* Clean 3-Metric Stats (No Delivery or Pickup Clutter) */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 max-w-lg">
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-950">1,000+</div>
                  <div className="text-[10px] text-slate-500 font-medium">Phones Listed</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-950">Verified Tech</div>
                  <div className="text-[10px] text-slate-500 font-medium">Inspected &amp; Tested</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-950">Best Prices</div>
                  <div className="text-[10px] text-slate-500 font-medium">Market Competitive</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: 3 Real Flagship Phones Arranged (Horizontally Proportioned on Mobile) */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0">
            
            <div className="relative w-full max-w-lg h-52 sm:h-88 flex items-center justify-center">
              
              {/* Left Flanking Phone (Samsung S24 Ultra) */}
              <div className="absolute left-2 sm:left-6 top-4 sm:top-8 w-28 sm:w-48 h-40 sm:h-72 transition-transform duration-500 hover:scale-105 z-10">
                <Image
                  src="/products/samsung (1).jpg"
                  alt="Samsung Galaxy S24 Ultra"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

              {/* Center Prominent Phone (iPhone 16 Pro Max - Front & Center) */}
              <div className="relative w-36 sm:w-56 h-48 sm:h-84 z-20 transition-transform duration-500 hover:scale-105">
                <Image
                  src="/products/iphone-pro-max.jpg"
                  alt="Apple iPhone 16 Pro Max"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Right Flanking Phone (iPhone 15 Pro) */}
              <div className="absolute right-2 sm:right-6 top-4 sm:top-8 w-28 sm:w-48 h-40 sm:h-72 transition-transform duration-500 hover:scale-105 z-10">
                <Image
                  src="/products/iphone (4).jpg"
                  alt="Apple iPhone 15 Pro"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            2. MINIMALIST & PROFESSIONAL SEARCH & FILTER BAR (Desktop & Mobile)
           ========================================================================= */}
        <div className="relative z-20 mt-6 sm:mt-8 pt-1">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm p-3 sm:p-4 space-y-3">
            
            {/* Top Row: Live Search Input + Desktop Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Search Input Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by model, brand, or specs (e.g. iPhone 15 Pro, S24 Ultra)..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Desktop Filter Dropdowns (Minimal & Professional) */}
              <div className="hidden sm:flex items-center gap-2">
                
                {/* Brand Dropdown */}
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("all");
                  }}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Brands</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {/* Price Range Dropdown */}
                <select
                  value={minPrice === "all" && maxPrice === "all" ? "all" : `${minPrice}-${maxPrice}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "all") { setMinPrice("all"); setMaxPrice("all"); }
                    else if (val === "under-1500") { setMinPrice("0"); setMaxPrice("1500"); }
                    else if (val === "1500-3000") { setMinPrice("1500"); setMaxPrice("3000"); }
                    else if (val === "above-3000") { setMinPrice("3000"); setMaxPrice("8000"); }
                  }}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under-1500">Under AED 1,500</option>
                  <option value="1500-3000">AED 1,500 - 3,000</option>
                  <option value="above-3000">AED 3,000+</option>
                </select>

                {/* Condition Dropdown */}
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Conditions</option>
                  <option value="Pristine">✨ Pristine (Like-New)</option>
                  <option value="Grade A">💎 Grade A (Excellent)</option>
                  <option value="Grade B">🏷️ Grade B (Good Value)</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>

                {/* Reset Filter Button */}
                {hasActiveFilters && (
                  <button
                    onClick={handleResetAllFilters}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-400 transition cursor-pointer"
                    title="Reset All Filters"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Action Controls */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    hasActiveFilters || mobileFiltersOpen 
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xs" 
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center ml-0.5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetAllFilters}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 cursor-pointer"
                    title="Reset Filters"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

            </div>

            {/* Mobile Expandable Filter Panel */}
            {mobileFiltersOpen && (
              <div className="sm:hidden pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="all">All Conditions</option>
                    <option value="Pristine">✨ Pristine</option>
                    <option value="Grade A">💎 Grade A</option>
                    <option value="Grade B">🏷️ Grade B</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget</label>
                  <select
                    value={minPrice === "all" && maxPrice === "all" ? "all" : `${minPrice}-${maxPrice}`}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "all") { setMinPrice("all"); setMaxPrice("all"); }
                      else if (val === "under-1500") { setMinPrice("0"); setMaxPrice("1500"); }
                      else if (val === "1500-3000") { setMinPrice("1500"); setMaxPrice("3000"); }
                      else if (val === "above-3000") { setMinPrice("3000"); setMaxPrice("8000"); }
                    }}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                  >
                    <option value="all">Any Price</option>
                    <option value="under-1500">&lt; AED 1,500</option>
                    <option value="1500-3000">AED 1.5k - 3k</option>
                    <option value="above-3000">AED 3,000+</option>
                  </select>
                </div>
              </div>
            )}

            {/* Row 2: Minimalist One-Tap Brand Pills & Budget Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <button
                onClick={() => { setSelectedBrand("all"); setSelectedModel("all"); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedBrand === "all" 
                    ? "bg-slate-900 text-white shadow-2xs" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Brands
              </button>

              {availableBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBrand(selectedBrand === b ? "all" : b);
                    setSelectedModel("all");
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedBrand === b
                      ? "bg-emerald-500 text-slate-950 font-black shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {b}
                </button>
              ))}

              {[
                { label: "< AED 1.5k", min: "0", max: "1500" },
                { label: "AED 1.5k - 3k", min: "1500", max: "3000" },
                { label: "AED 3k+", min: "3000", max: "8000" },
              ].map((p, idx) => {
                const isSel = minPrice === p.min && maxPrice === p.max;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isSel) { setMinPrice("all"); setMaxPrice("all"); }
                      else { setMinPrice(p.min); setMaxPrice(p.max); }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                      isSel
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          3. MOVING BRAND LOGOS ROW (LOGOS ONLY - NO BACKGROUND CONTAINERS)
         ========================================================================= */}
      <section id="brand-marquee-section" className="w-full py-5 sm:py-7 px-2 overflow-hidden relative group">
        
        {/* Soft edge gradient fades for seamless infinite scroll */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/90 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center overflow-hidden">
          {/* Moving brand logos track: left to right - PURE LOGOS ONLY (BIG & PROMINENT) */}
          <div className="flex items-center gap-10 sm:gap-16 md:gap-20 animate-marquee-ltr hover:[animation-play-state:paused] py-3 cursor-pointer">
            {[...brandLogosList, ...brandLogosList, ...brandLogosList, ...brandLogosList].map((brand, idx) => {
              const brandSlug = (brand.slug || brand.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <Link
                  key={`${brand.id || brand.name}-${idx}`}
                  href={`/buy-phones/brand/${encodeURIComponent(brandSlug)}`}
                  title={`View all ${brand.name} phones & devices`}
                  className="group/brand relative flex flex-col items-center justify-center p-2 transition-all duration-300 cursor-pointer shrink-0 min-w-[150px] sm:min-w-[200px] md:min-w-[240px] h-20 sm:h-24 md:h-28 opacity-80 hover:opacity-100 hover:scale-115"
                >
                  <div className="relative w-36 sm:w-48 md:w-56 h-14 sm:h-18 md:h-22 flex items-center justify-center">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover/brand:opacity-100 transition-opacity mt-1">
                    Explore {brand.name} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </section>

      {/* =========================================================================
          4. BRAND MODELS & FEATURED PHONES SECTION (Clean 2-Cards/Row Grid)
         ========================================================================= */}
      <section id="featured-phones-section" className="w-full space-y-4">
        
        {/* Header row: Minimalist title + count + reset */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight">
              {selectedBrand !== "all" ? `${selectedBrand} Models` : "All Phone Models"}
            </h2>
            <span className="text-[11px] sm:text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredProducts.length} {filteredProducts.length === 1 ? "device" : "devices"}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Catalog Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading certified devices...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-2xs">
            <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No phones found matching your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, price budget, or brand selection.
            </p>
            <button
              onClick={handleResetAllFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* ===================================================================
              PROPER CLEAN CARDS GRID: 2 CARDS IN ONE ROW ON MOBILE, 4 ON DESKTOP
             =================================================================== */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
            {filteredProducts.map((phone) => {
              const pId = phone.id || (phone as any)._id;
              const conditionBadge = phone.condition?.includes("Pristine")
                ? "✨ Pristine"
                : phone.condition?.includes("Grade A")
                ? "💎 Grade A"
                : "🏷️ Value Deal";

              const savings = phone.originalPrice && phone.originalPrice > phone.price
                ? phone.originalPrice - phone.price
                : null;

              return (
                <div
                  key={pId}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 p-2.5 sm:p-3.5 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Card Image Area with Subtle Gradient & Floating Badges */}
                  <Link
                    href={`/buy-phones/${pId}`}
                    className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 group-hover:from-emerald-50/30 group-hover:to-slate-50 transition-colors"
                  >
                    {/* Top Left: Subtle Condition / Savings Badge */}
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      {savings ? (
                        <span className="text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-2xs">
                          Save AED {savings.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200/80 shadow-2xs">
                          {conditionBadge}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Quick Bag Button */}
                    <button
                      onClick={(e) => handleQuickCart(phone, e)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-500 flex items-center justify-center shadow-2xs transition active:scale-90 border border-slate-200/60 cursor-pointer"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingBag size={13} className="sm:w-3.5 sm:h-3.5" />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-full h-full flex items-center justify-center p-1">
                      <Image
                        src={phone.images?.frontView || "/products/iphone-pro-max.jpg"}
                        alt={phone.title}
                        fill
                        className="object-contain p-1 group-hover:scale-106 transition-transform duration-300 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>

                    {/* Bottom Pill: Battery / Warranty */}
                    <div className="absolute bottom-1.5 left-2 right-2 text-center pointer-events-none">
                      <span className="text-[9px] font-semibold text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs truncate inline-block max-w-[90%]">
                        🛡️ 12-Mo Warranty
                      </span>
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                        {phone.brand}
                      </span>
                      <Link
                        href={`/buy-phones/${pId}`}
                        className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 block mt-0.5"
                        title={phone.title}
                      >
                        {phone.title}
                      </Link>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {phone.selectedStorage || phone.storages?.[0]?.size || "128GB"} • {phone.condition?.includes("Pristine") ? "Like New" : "Certified"}
                      </div>
                    </div>

                    {/* Pricing and Action Button */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs sm:text-sm md:text-base font-black text-slate-950">
                          AED {phone.price.toLocaleString()}
                        </span>
                        {phone.originalPrice && phone.originalPrice > phone.price && (
                          <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                            AED {phone.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/buy-phones/${pId}`}
                        className="mt-2 w-full py-2 px-2.5 rounded-xl bg-slate-900 group-hover:bg-emerald-500 group-hover:text-slate-950 text-white font-bold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs text-center cursor-pointer"
                      >
                        <span>View Deal</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* =========================================================================
          5. TWO MID FEATURE BANNERS (PREVIOUS DESIGN RESTORED)
         ========================================================================= */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Banner 1 (Left): Compare Devices */}
        <div className="bg-gradient-to-br from-slate-100 via-emerald-50/40 to-slate-100 border border-slate-200 rounded-[28px] rounded-tr-md p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs relative">
          
          <div className="space-y-3 max-w-[60%] z-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
              Compare Devices
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Find the perfect phone for your needs with full side-by-side specs and battery tests.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("featured-phones-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs transition shadow-sm cursor-pointer"
              >
                <span>Start Comparing</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 3 Phones angled illustration */}
          <div className="relative w-36 sm:w-44 h-36 sm:h-44 shrink-0 flex items-center justify-center">
            <div className="absolute left-0 top-3 w-20 h-32 rounded-lg overflow-hidden shadow-md transform -rotate-12 bg-white">
              <Image src="/products/iphone (4).jpg" alt="Compare Phone 1" fill className="object-cover" />
            </div>
            <div className="absolute center top-0 w-22 h-36 rounded-xl overflow-hidden shadow-xl z-10 bg-white">
              <Image src="/products/samsung (1).jpg" alt="Compare Phone 2" fill className="object-cover" />
            </div>
            <div className="absolute right-0 top-3 w-20 h-32 rounded-lg overflow-hidden shadow-md transform rotate-12 bg-white">
              <Image src="/products/iphone-pro-max.jpg" alt="Compare Phone 3" fill className="object-cover" />
            </div>
          </div>

        </div>

        {/* Banner 2 (Right): Why SellPhoneCash? */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/60 rounded-[28px] rounded-tl-md p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs relative">
          
          <div className="space-y-3 z-10 max-w-[62%]">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
              Why SellPhoneCash?
            </h3>
            
            <div className="space-y-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100 shrink-0" />
                <span>Latest Models &amp; Genuine Screens</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100 shrink-0" />
                <span>Best Prices Across UAE</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100 shrink-0" />
                <span>Trusted by 15,000+ Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 fill-emerald-100 shrink-0" />
                <span>Easy 7-Day Returns &amp; Warranty</span>
              </div>
            </div>
          </div>

          {/* Green Shield + Phones Art */}
          <div className="relative w-32 sm:w-40 h-32 sm:h-40 shrink-0 flex items-center justify-center">
            <div className="absolute -left-2 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center z-20">
              <ShieldCheck size={28} className="text-emerald-600" />
            </div>
            <div className="relative w-28 h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-900">
              <Image src="/products/iphone 17 pro max 💖.jpg" alt="Verified Phone" fill className="object-cover" />
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          6. TOP SELLING ACCESSORIES SECTION (PREVIOUS DESIGN RESTORED)
         ========================================================================= */}
      <section className="w-full space-y-4">
        
        {/* Header row */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Top Selling Accessories
          </h2>
          <button
            onClick={() => {
              const el = document.getElementById("featured-phones-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {ACCESSORIES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between text-left group hover:border-slate-300"
            >
              
              {/* Accessory Thumbnail */}
              <div className="relative w-full h-28 bg-slate-50 rounded-md mb-3 flex items-center justify-center overflow-hidden p-2 group-hover:scale-105 transition-transform">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Title & Specs */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-900 truncate">
                  {item.name}
                </h4>
                <div className="text-[11px] text-slate-400 truncate">
                  {item.subtitle}
                </div>
              </div>

              {/* Price & Star Rating */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-sm font-extrabold text-slate-950 flex items-baseline gap-1">
                  <span className="text-emerald-600 text-xs font-bold">AED</span>
                  <span>{item.price}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                  <Star size={12} className="fill-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          7. DUAL PROMO CARDS (PREVIOUS DESIGN RESTORED)
         ========================================================================= */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Promo 1: Tech Deals (Pink/Purple Gradient) */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-fuchsia-100 border border-purple-200/80 rounded-2xl p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs">
          
          <div className="space-y-2 z-10">
            <div className="text-xs font-black text-purple-900 uppercase tracking-wider">
              Limited Time Deals
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
              Tech Deals
            </h3>
            <div className="text-xl sm:text-2xl font-black text-fuchsia-600">
              Up to 40% OFF
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("featured-phones-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                <span>Shop Deals</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Product Cutout Mockups */}
          <div className="relative w-32 sm:w-40 h-32 sm:h-40 shrink-0 flex items-center justify-center">
            <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-lg border border-purple-200 bg-white transform rotate-6">
              <Image src="/products/iphone-pro-max.jpg" alt="Promo Phone" fill className="object-cover" />
            </div>
          </div>

        </div>

        {/* Promo 2: Verified & Certified Stock */}
        <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 flex items-center justify-between overflow-hidden shadow-xs">
          
          <div className="space-y-2 z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
              Verified &amp; Certified
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xs font-medium">
              Every device passes our rigorous <strong className="text-emerald-800 font-extrabold">32-point inspection</strong> and includes up to 12 months comprehensive store warranty.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("featured-phones-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
              >
                <span>Browse Certified Stock</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Two phones exchanging with sync arrows */}
          <div className="relative w-36 sm:w-44 h-32 sm:h-40 shrink-0 flex items-center justify-center">
            <div className="absolute left-0 w-16 h-28 rounded-lg overflow-hidden shadow-md bg-white border border-slate-200">
              <Image src="/products/iphone (2).jpg" alt="Old Phone" fill className="object-cover" />
            </div>
            
            {/* Center sync arrow pill in theme green */}
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-md z-20">
              <ArrowLeftRight size={14} />
            </div>

            <div className="absolute right-0 w-18 h-30 rounded-lg overflow-hidden shadow-lg bg-white border border-slate-200">
              <Image src="/products/iphone-pro-max.jpg" alt="New Phone" fill className="object-cover" />
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          8. TRUST GUARANTEES ROW (PREVIOUS DESIGN RESTORED)
         ========================================================================= */}
      <section className="w-full bg-white rounded-lg border border-slate-200/80 p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center">
          
          <div className="flex flex-col items-center space-y-1 py-2 sm:py-0">
            <Truck className="w-6 h-6 text-slate-800 mb-1" />
            <div className="font-extrabold text-xs text-slate-900">Free Shipping</div>
            <div className="text-[11px] text-slate-500">On all orders across Dubai</div>
          </div>

          <div className="flex flex-col items-center space-y-1 py-2 sm:py-0">
            <Lock className="w-6 h-6 text-slate-800 mb-1" />
            <div className="font-extrabold text-xs text-slate-900">Secure Payments</div>
            <div className="text-[11px] text-slate-500">100% safe &amp; Cash on Delivery</div>
          </div>

          <div className="flex flex-col items-center space-y-1 py-2 sm:py-0">
            <Headset className="w-6 h-6 text-slate-800 mb-1" />
            <div className="font-extrabold text-xs text-slate-900">24/7 Support</div>
            <div className="text-[11px] text-slate-500">We're here for you anytime</div>
          </div>

          <div className="flex flex-col items-center space-y-1 py-2 sm:py-0">
            <Gift className="w-6 h-6 text-slate-800 mb-1" />
            <div className="font-extrabold text-xs text-slate-900">Easy Returns</div>
            <div className="text-[11px] text-slate-500">7-day hassle-free policy</div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. STAY UPDATED NEWSLETTER BAR (PREVIOUS DESIGN RESTORED WITH GREEN)
         ========================================================================= */}
      <section className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Left Icon & Text */}
          <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-950">
                Stay Updated
              </h3>
              <p className="text-xs text-slate-500">
                Get the latest deals, new launches and exclusive offers.
              </p>
            </div>
          </div>

          {/* Right Input Form */}
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto max-w-md">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address"
              className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-sm transition whitespace-nowrap cursor-pointer"
            >
              Subscribe
            </button>
          </form>

        </div>
      </section>

    </div>
  );
}
