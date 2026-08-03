"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { CategoryType } from "@/types";

const defaultCategories: CategoryType[] = [
  {
    id: "cat-1",
    name: "Smartphones",
    slug: "smartphones",
    description: "Sell iPhones, Samsung Galaxy, Pixel & more",
    image: "/products/iphone-pro-max.jpg",
  },
  {
    id: "cat-2",
    name: "Laptops",
    slug: "laptops",
    description: "Sell MacBooks, Dell XPS, HP, Lenovo & Asus",
    image: "/products/macbook-pro.webp",
  },
  {
    id: "cat-3",
    name: "Tablets",
    slug: "tablets",
    description: "Sell iPad Pro, Galaxy Tab & Surface",
    image: "/products/ipad-pro-m4.webp",
  },
  {
    id: "cat-4",
    name: "Smartwatches",
    slug: "smartwatches",
    description: "Sell Apple Watch Ultra, Galaxy Watch",
    image: "/products/apple-watch-ultra.webp",
  },
  {
    id: "cat-5",
    name: "Consoles & Gaming",
    slug: "games",
    description: "Sell PS5 Pro, Xbox Series X, Switch OLED",
    image: "/products/ps5-slim.webp",
  },
  {
    id: "cat-6",
    name: "Smart TVs",
    slug: "tvs",
    description: "Sell OLED, QLED & 4K TVs",
    image: "/products/samsung-neo-qled.webp",
  },
];

const ServicesGrid = () => {
  const [categories, setCategories] = useState<CategoryType[]>(defaultCategories);

  useEffect(() => {
    api.getCategories()
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-4 my-8 md:my-12">
      
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            Direct Category Buyback
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Explore Our Services</h2>
          <p className="text-xs md:text-sm text-slate-500">Select a category to get instant cash evaluation</p>
        </div>

        <Link href="/services" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0">
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* MOBILE HORIZONTAL SCROLL NOTIFICATION BAR */}
      <div className="sm:hidden flex items-center justify-between bg-slate-900 text-white text-[11px] px-3.5 py-2 rounded-2xl shadow-sm">
        <span className="font-bold flex items-center gap-1.5 text-emerald-400">
          👉 Swipe categories horizontally
        </span>
        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
          2 in a row <ChevronRight size={12} className="animate-pulse text-emerald-400" />
        </span>
      </div>

      {/* MOBILE HORIZONTAL SNAP CAROUSEL (SHOWS 2 CARDS IN A ROW) */}
      <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 scrollbar-none px-0.5 relative">
        {categories.map((category) => (
          <Link
            key={category.id || category.slug}
            href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
            className="w-[calc(50%-0.375rem)] shrink-0 snap-start group flex flex-col items-center justify-between bg-white border border-slate-200/70 hover:border-emerald-500 rounded-3xl p-4 shadow-xs active:scale-95 transition-all duration-200"
          >
            {/* Image Container */}
            <div className="relative w-16 h-16 mb-2">
              <Image 
                src={category.image || "/products/iphone-pro-max.jpg"} 
                alt={category.name} 
                fill 
                className="object-contain drop-shadow-md p-1"
              />
            </div>
            
            {/* Title & CTA */}
            <div className="text-center">
              <h3 className="font-extrabold text-slate-900 text-xs truncate max-w-[120px]">
                {category.name}
              </h3>
              <p className="text-[9px] text-emerald-600 font-black uppercase tracking-wider mt-1">
                Get Quote →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* DESKTOP GRID (FULL 6-COLUMN GRID) */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id || category.slug}
            href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
            className="group flex flex-col items-center justify-between bg-white hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-500/40 rounded-[28px] p-5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-20 h-20 mb-3 group-hover:scale-110 transition-transform duration-300">
              <Image 
                src={category.image || "/products/iphone-pro-max.jpg"} 
                alt={category.name} 
                fill 
                className="object-contain drop-shadow-md p-1"
              />
            </div>
            
            <div className="text-center">
              <h3 className="font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors text-xs md:text-sm">
                Sell {category.name}
              </h3>
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-1 group-hover:text-emerald-500">
                Get Top Quote →
              </p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
};

export default ServicesGrid;
