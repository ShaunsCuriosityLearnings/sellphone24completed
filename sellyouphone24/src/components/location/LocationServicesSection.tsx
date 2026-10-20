"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Gamepad2, 
  Tv, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap
} from "lucide-react";
import { CategoryType, BrandType, ProductType } from "@/types";

interface LocationServicesSectionProps {
  locationName: string;
  pickupSpeed?: string;
  categories?: CategoryType[];
  brands?: BrandType[];
  products?: ProductType[];
}

const DEFAULT_CATEGORIES: CategoryType[] = [
  { id: "smartphones", name: "Smartphones", slug: "smartphones", description: "Instant cash for iPhones, Samsung Galaxy & flagship phones.", image: "/products/iphone-pro-max.jpg" },
  { id: "laptops", name: "Laptops & MacBooks", slug: "laptops", description: "Top cash payouts for MacBooks, Dell XPS & gaming laptops.", image: "/products/macbook-pro.webp" },
  { id: "tablets", name: "Tablets & iPads", slug: "tablets", description: "Same-day buyback for iPads, Galaxy Tabs & Surface tablets.", image: "/products/ipad-pro-m4.webp" },
  { id: "smartwatches", name: "Smartwatches", slug: "smartwatches", description: "Cash offers for Apple Watch Ultra, Galaxy Watch & wearables.", image: "/products/apple-watch-ultra.webp" },
  { id: "games", name: "Gaming Consoles", slug: "games", description: "Sell PlayStation 5, Xbox Series X & Nintendo Switch systems.", image: "/products/gaming-console.webp" },
  { id: "tvs", name: "Smart TVs", slug: "tvs", description: "Doorstep inspection and buyback for OLED, QLED & 4K Smart TVs.", image: "/products/smart-tv.webp" },
];

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

export default function LocationServicesSection({ 
  locationName, 
  pickupSpeed = "Within 2 Hours",
  categories = [],
  brands = [],
  products = []
}: LocationServicesSectionProps) {
  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider">
            Live Database Services
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Doorstep Services Available in {locationName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Free collection arriving {pickupSpeed} to all residential towers and corporate offices across {locationName}.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
        >
          <span>All Services Directory</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Services Grid (Dynamically rendered from Database Categories) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeCategories.map((cat, idx) => {
          const Icon = getCategoryIcon(cat.slug || cat.name);
          const isAnyDevice = cat.slug === "any-device";
          const targetUrl = isAnyDevice ? "/sell-any-device" : `/services/${cat.slug}`;
          const catSlug = (cat.slug || "").toLowerCase();

          // 1. Filter brands linked to this category from DB
          let catBrands = brands.filter(b => {
            if (b.categories && b.categories.length > 0) {
              return b.categories.some((c: any) => {
                const s = typeof c === "string" ? c : c.slug || c.name;
                return (s || "").toLowerCase() === catSlug;
              });
            }
            if (products && products.length > 0) {
              return products.some(p => {
                const pBrand = (p.brand || "").toLowerCase();
                const pCat = (p.category || "").toLowerCase();
                return (pBrand === (b.name || "").toLowerCase() || pBrand === (b.slug || "").toLowerCase()) && pCat === catSlug;
              });
            }
            return false;
          }).slice(0, 4);

          // 2. Fallback: derive brands directly from products if catBrands is empty
          if (catBrands.length === 0 && products && products.length > 0) {
            const uniqueBrandNames = Array.from(new Set(
              products
                .filter(p => (p.category || "").toLowerCase() === catSlug)
                .map(p => p.brand)
                .filter(Boolean)
            ));
            catBrands = uniqueBrandNames.slice(0, 4).map(name => ({
              id: name.toLowerCase(),
              slug: name.toLowerCase(),
              name,
            }));
          }

          // 3. Fallback for smartphones if empty
          if (catBrands.length === 0 && (catSlug.includes("phone") || catSlug.includes("smartphones"))) {
            catBrands = [
              { id: "apple", slug: "apple", name: "Apple" },
              { id: "samsung", slug: "samsung", name: "Samsung" },
              { id: "google", slug: "google", name: "Google" },
              { id: "oneplus", slug: "oneplus", name: "OnePlus" },
            ];
          }

          return (
            <div
              key={cat.id || cat.slug || idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Icon size={22} className="stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200/60">
                    Active in {locationName}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Sell {cat.name} in {locationName}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {cat.description || `Instant online cash valuation and free licensed courier pickup across ${locationName}.`}
                  </p>
                </div>

                {/* Brands linked to this category from database */}
                {catBrands.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular {cat.name} Brands:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {catBrands.map((b) => (
                        <Link
                          key={b.id || b.slug}
                          href={`/services/${cat.slug}/${b.slug}`}
                          className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                        >
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  href={targetUrl}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-500 hover:text-slate-950 text-slate-800 text-xs font-bold transition-all group/btn cursor-pointer"
                >
                  <span>Explore {cat.name} Valuation</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
