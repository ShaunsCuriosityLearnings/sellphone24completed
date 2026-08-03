"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Banknote, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  ArrowRight, 
  Zap, 
  Star, 
  MoreHorizontal,
  Smartphone,
  Tablet,
  Laptop,
  Flame,
  Activity
} from "lucide-react";

const whySellFeatures = [
  {
    icon: Banknote,
    title: "Instant Cash",
    desc: "Get paid on the spot",
  },
  {
    icon: Truck,
    title: "Free Doorstep Pickup",
    desc: "Within 3 hours in Dubai",
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    desc: "We beat competitors",
  },
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    desc: "100% transparent",
  },
  {
    icon: RotateCcw,
    title: "No Obligation",
    desc: "Cancel anytime, free",
  },
  {
    icon: Lock,
    title: "Data Privacy",
    desc: "100% data wiped",
  },
];

const livePrices = [
  {
    name: "iPhone 16 Pro Max",
    spec: "256GB",
    price: "AED 3,780",
    img: "/products/iphone-pro-max.jpg",
    id: "p1",
  },
  {
    name: "Samsung S25 Ultra",
    spec: "256GB",
    price: "AED 2,940",
    img: "/products/iphone (1).jpg",
    id: "p2",
  },
  {
    name: "Google Pixel 10 Pro",
    spec: "256GB",
    price: "AED 2,250",
    img: "/products/iphone (3).jpg",
    id: "p3",
  },
  {
    name: "iPhone 15 Pro",
    spec: "256GB",
    price: "AED 2,100",
    img: "/products/iphone (6).jpg",
    id: "p4",
  },
];

const popularCategories = [
  { name: "Sell iPhone", slug: "apple", icon: Smartphone, image: "/products/iphone-pro-max.jpg" },
  { name: "Sell Samsung", slug: "samsung", icon: Smartphone, image: "/products/iphone (1).jpg" },
  { name: "Sell Google Pixel", slug: "google", icon: Smartphone, image: "/products/iphone (3).jpg" },
  { name: "Sell Huawei", slug: "huawei", icon: Smartphone, image: "/products/iphone (6).jpg" },
  { name: "Sell OnePlus", slug: "oneplus", icon: Smartphone, image: "/products/iphone (4).jpg" },
  { name: "Sell iPad", slug: "tablets", icon: Tablet, image: "/products/ipad-pro-m4.webp" },
  { name: "Sell MacBook", slug: "laptops", icon: Laptop, image: "/products/macbook-pro.webp" },
  { name: "Other Devices", slug: "other", icon: MoreHorizontal, image: null },
];

const customerReviews = [
  {
    name: "Ahmed R.",
    location: "Dubai Marina",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    quote: '"Got my iPhone 15 Pro Max picked up in 1 hour and received cash instantly."',
  },
  {
    name: "Sara K.",
    location: "Jumeirah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    quote: '"Best price in Dubai! Very professional and trustworthy team."',
  },
  {
    name: "Khalid M.",
    location: "Business Bay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    quote: '"Smooth and quick process. Highly recommended!"',
  },
];

const recentPurchases = [
  {
    name: "iPhone 15 Pro Max",
    variant: "256GB • Natural Titanium",
    price: "AED 2,850",
    timeAgo: "5 mins ago",
    img: "/products/iphone-pro-max.jpg",
  },
  {
    name: "MacBook Pro M2",
    variant: "13-inch • 512GB",
    price: "AED 3,850",
    timeAgo: "11 mins ago",
    img: "/products/macbook-pro.webp",
  },
  {
    name: "Samsung S24 Ultra",
    variant: "256GB • Titanium Grey",
    price: "AED 2,450",
    timeAgo: "22 mins ago",
    img: "/products/iphone (1).jpg",
  },
];

export default function FrontpageSellSection() {
  const [mobileTab, setMobileTab] = useState<"prices" | "popular">("prices");

  return (
    <div className="space-y-8 md:space-y-12 my-8 md:my-12 w-full">
      
      {/* 1. WHY SELL TO SELLPHONECASH? */}
      <section className="space-y-4 text-center w-full">
        <h2 className="text-xl md:text-3xl font-extrabold text-slate-900">
          Why Sell to <span className="text-emerald-500">SellPhoneCash</span>?
        </h2>

        {/* Mobile View Features Grid (Compact 2-Cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 w-full">
          {whySellFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl md:rounded-3xl p-3.5 md:p-5 flex flex-col items-center text-center space-y-2 md:space-y-3 shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group w-full"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-slate-950 flex items-center justify-center transition-colors duration-300">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs md:text-sm">{feat.title}</h4>
                  <p className="text-[10px] md:text-[11px] text-slate-500 mt-0.5 leading-snug">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MOBILE-ONLY INTERACTIVE TABBED SECTION (FULL-WIDTH MOBILE VIEW) */}
      {/* ========================================================================= */}
      <div className="lg:hidden space-y-4 w-full">
        
        {/* Mobile Segmented Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 w-full">
          <button
            onClick={() => setMobileTab("prices")}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "prices"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity size={14} className={mobileTab === "prices" ? "text-emerald-500" : ""} />
            <span>Today&apos;s Live Prices</span>
          </button>
          
          <button
            onClick={() => setMobileTab("popular")}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === "popular"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flame size={14} className={mobileTab === "popular" ? "text-emerald-500" : ""} />
            <span>Popular Devices</span>
          </button>
        </div>

        {/* Tab 1: Today's Live Buying Prices */}
        {mobileTab === "prices" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-3 animate-in fade-in duration-200 w-full">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Real-time UAE Buying Rates</h3>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Rates
              </span>
            </div>

            <div className="space-y-2 w-full">
              {livePrices.map((item) => (
                <Link
                  key={item.id}
                  href="/services"
                  className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 bg-slate-50/40 active:bg-slate-100 transition w-full"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.name}</h4>
                      <p className="text-[9px] font-medium text-slate-400">{item.spec}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600 text-xs bg-emerald-50 px-2.5 py-1 rounded-xl">
                    {item.price}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/services"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 pt-2 border-t border-slate-100"
            >
              <span>View All Buying Prices</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Tab 2: Popular Devices We Buy */}
        {mobileTab === "popular" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-3 animate-in fade-in duration-200 w-full">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2">Select Brand to Trade-in</h3>

            <div className="grid grid-cols-2 gap-2 w-full">
              {popularCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.slug === "other" ? "/sell-any-device" : `/services?brand=${cat.slug}`}
                  className="bg-slate-50 border border-slate-100 active:border-emerald-500 rounded-2xl p-3 flex flex-col items-center text-center justify-center transition group cursor-pointer w-full"
                >
                  <div className="w-10 h-10 relative flex items-center justify-center mb-1">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                        <MoreHorizontal size={16} />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-800 text-[11px] truncate w-full">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* DESKTOP TWO-COLUMN: TODAY'S LIVE PRICES + POPULAR DEVICES */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch w-full">
        
        {/* Left Box: Today's Live Buying Prices */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-6 w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base md:text-lg">
                Today&apos;s Live Buying Prices
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Updated 5 mins ago
              </span>
            </div>

            <div className="space-y-3">
              {livePrices.map((item) => (
                <Link
                  key={item.id}
                  href="/services"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:border-emerald-200 hover:bg-slate-50/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-400">{item.spec}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600 text-xs md:text-sm">
                    {item.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/services"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100"
          >
            View All Prices
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Right Box: Popular Devices We Buy */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-6 w-full">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base md:text-lg mb-4">
              Popular Devices We Buy
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {popularCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.slug === "other" ? "/sell-any-device" : `/services?brand=${cat.slug}`}
                  className="bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center text-center justify-center hover:shadow-md transition-all duration-200 group cursor-pointer w-full"
                >
                  <div className="w-12 h-12 relative flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                        <MoreHorizontal size={20} />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. GREEN CALLOUT BANNER (NEED CASH TODAY?) */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative overflow-hidden w-full">
        <div className="flex items-center gap-3 md:gap-4 relative z-10 w-full md:w-auto">
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-base md:text-2xl font-black leading-tight">
              Need Cash Today? Book a FREE Pickup Within 3 Hours
            </h3>
            <p className="text-[10px] md:text-xs text-emerald-100 mt-0.5 font-medium flex items-center gap-2">
              <span>Quick & 100% Free Service</span>
              <span>•</span>
              <span className="font-bold text-white">Available Across Dubai & UAE</span>
            </p>
          </div>
        </div>

        <Link
          href="/cart"
          className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3.5 md:py-4 px-6 md:px-8 rounded-2xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap relative z-10 active:scale-95 cursor-pointer"
        >
          Request Pickup Now
          <ArrowRight size={16} className="text-emerald-600" />
        </Link>
      </section>

      {/* 4. TWO-COLUMN: REVIEWS + RECENT PURCHASES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch w-full">
        
        {/* Left Box: What Our Customers Say */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-4 md:p-6 shadow-sm space-y-4 flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm md:text-lg">
                What Our Customers Say
              </h3>
              <Link href="/about" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Mobile Carousel / Desktop Grid */}
            <div className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto snap-x scrollbar-none pb-2 lg:pb-0 w-full">
              {customerReviews.map((rev, idx) => (
                <div 
                  key={idx} 
                  className="w-[260px] sm:w-[280px] lg:w-auto shrink-0 snap-start bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative bg-slate-200 shrink-0">
                      <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{rev.name}</h4>
                      <p className="text-[9px] text-slate-400">{rev.location}</p>
                    </div>
                    <span className="ml-auto text-xs font-black text-amber-500">G</span>
                  </div>

                  <p className="text-[10px] md:text-[11px] text-slate-600 italic leading-relaxed line-clamp-3">
                    {rev.quote}
                  </p>

                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Box: Recent Purchases */}
        <div className="col-span-1 lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-4 md:p-6 shadow-sm space-y-3.5 w-full">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm md:text-lg">
              Recent Purchases
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>

          <div className="space-y-2.5 w-full">
            {recentPurchases.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-50 bg-slate-50/40 w-full">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                    <Image src={p.img} alt={p.name} fill className="object-contain p-1" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{p.name}</h4>
                    <p className="text-[9px] text-slate-400">{p.variant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-extrabold text-emerald-600 text-xs">
                    {p.price}
                  </span>
                  <span className="text-[9px] font-medium text-slate-400">{p.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
