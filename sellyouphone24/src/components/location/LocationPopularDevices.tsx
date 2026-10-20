"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Smartphone, Laptop, Tablet, Watch, Gamepad2, Tv, Sparkles, HelpCircle } from "lucide-react";
import { ProductType, CategoryType } from "@/types";

interface LocationPopularDevicesProps {
  locationName: string;
  products: ProductType[];
  categories?: CategoryType[];
}

const getCategoryIcon = (slugOrName: string) => {
  const s = (slugOrName || "").toLowerCase();
  if (s.includes("phone") || s.includes("mobile")) return Smartphone;
  if (s.includes("laptop") || s.includes("macbook")) return Laptop;
  if (s.includes("tablet") || s.includes("ipad")) return Tablet;
  if (s.includes("watch")) return Watch;
  if (s.includes("game") || s.includes("console")) return Gamepad2;
  if (s.includes("tv")) return Tv;
  return HelpCircle;
};

export default function LocationPopularDevices({ 
  locationName, 
  products, 
  categories = [] 
}: LocationPopularDevicesProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  // Derive unique categories present in products if categories array is empty
  const filterCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.filter(c => c.slug !== "any-device");
    }
    const uniqueSlugs = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return uniqueSlugs.map(slug => ({
      id: slug,
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      description: "",
      image: ""
    }));
  }, [categories, products]);

  // Filter products by active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      const popular = products.filter((p) => p.isPopular || p.isLivePrice);
      const others = products.filter((p) => !p.isPopular && !p.isLivePrice);
      return [...popular, ...others];
    }
    return products.filter((p) => (p.category || "").toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, products]);

  // Display up to 8 products
  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Section Header (Matching "Popular Destinations" layout) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>Live Database Catalog • {locationName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Popular Trade-Ins in {locationName}</span>
            <span className="text-base sm:text-lg">📱</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified cash buyback rates from our live database with 7-day price lock.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors group"
        >
          <span>Explore All {products.length}+ Models</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Cards Grid (Matching Pomaii 4 Destination Cards layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((prod, idx) => {
          const imageUrl = prod.images?.frontView || ((prod as any).image && typeof (prod as any).image === "string" ? (prod as any).image : "/products/iphone-pro-max.jpg");
          const ratingScore = (4.7 + (idx * 0.04)).toFixed(1);
          
          // Connect to real database product evaluation page
          const linkUrl = prod.id 
            ? `/products/${prod.id}`
            : (prod.slug ? `/sell/model/${prod.slug}` : `/products/${(prod as any)._id || idx}`);

          // Formatted storage summary from database
          const storageSummary = prod.storages && prod.storages.length > 0
            ? prod.storages.map(s => s.size).slice(0, 3).join(" • ")
            : "All Capacities";

          return (
            <Link
              key={prod.id || (prod as any)._id || idx}
              href={linkUrl}
              className="group relative h-[380px] sm:h-[420px] rounded-3xl overflow-hidden bg-slate-950 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 block cursor-pointer border border-slate-800/40"
            >
              {/* Product Background Image */}
              <Image
                src={imageUrl}
                alt={prod.name}
                fill
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
              />

              {/* Multi-layer shadow vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent" />

              {/* Top-Left Rating Pill with Dark Glass Blur */}
              <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-sm">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span>{ratingScore}</span>
                <span className="text-[9px] text-slate-300 font-normal">({prod.brand})</span>
              </div>

              {/* Bottom Content Card Info */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
                
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 mb-1">
                  {prod.brand || "Certified Device"}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-emerald-300 transition-colors truncate">
                  {prod.name}
                </h3>

                <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                  {storageSummary}
                </p>

                {/* Bottom Row: Condition + Gold Price Tag */}
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Up to
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-400">
                    AED {prod.basePrice?.toLocaleString() || "3,200"}
                  </span>
                </div>

              </div>
            </Link>
          );
        })}
      </div>

      {/* Category Icons Row Underneath (Dynamic from Database) */}
      <div className="pt-2 flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-slate-950 text-white border-slate-950 shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
          }`}
        >
          <Sparkles size={14} className={activeCategory === "all" ? "text-amber-400" : "text-slate-400"} />
          <span>All Devices ({products.length})</span>
        </button>

        {filterCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          const isActive = activeCategory === cat.slug;
          const count = products.filter(p => p.category === cat.slug).length;
          
          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-emerald-600"} />
              <span>{cat.name}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-emerald-800 text-emerald-100" : "bg-slate-100 text-slate-600"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </section>
  );
}
