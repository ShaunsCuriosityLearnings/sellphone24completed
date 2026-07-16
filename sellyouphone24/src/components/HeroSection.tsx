"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { products } from "@/data/mockData";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter products based on search input
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    setSuggestions(filtered);
  }, [query]);

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (productId: number | string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-slate-950 text-white rounded-[40px] px-6 md:px-12 lg:px-20 mb-12 shadow-2xl">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-950 to-slate-950" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(15,23,42,0.4)_100%)] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} />
            UAE&apos;s Top Rated Buyback Platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Sell Your Used Phone for <span className="text-emerald-500 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Instant Cash</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
            Get an instant price quote for your iPhone, Samsung Galaxy, or Pixel. We pick up from your doorstep in Dubai, Abu Dhabi, & UAE, and pay you instantly!
          </p>

          {/* Autocomplete Search Bar */}
          <div ref={containerRef} className="relative max-w-lg w-full">
            <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-emerald-500 rounded-2xl p-2 transition shadow-xl">
              <Search className="w-5 h-5 text-slate-500 ml-3" />
              <input
                type="text"
                placeholder="Search your device model (e.g. iPhone 15 Pro Max)..."
                className="w-full bg-transparent border-none outline-none py-3 px-4 text-sm md:text-base text-white placeholder-slate-500 focus:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="px-3 py-1 text-xs bg-slate-800 text-slate-400 hover:text-white rounded-lg transition mr-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800 transition border-b border-slate-800/50 last:border-0 cursor-pointer"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-white">{product.name}</h4>
                      <p className="text-xs text-slate-500">{product.brand} • {product.category}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      Get up to AED {product.basePrice}
                    </span>
                  </button>
                ))}
              </div>
            )}
            
            {isFocused && query.trim() !== "" && suggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 text-center text-slate-500 text-sm z-50">
                No matching devices found. Try searching by brand or model name.
              </div>
            )}
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-slate-400 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Zap className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <span>Free Doorstep Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <span>Depreciation Lock</span>
            </div>
          </div>
        </div>

        {/* Right Product Spotlight Image */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 flex items-center justify-center p-8 shadow-inner border border-emerald-500/10">
            <div className="relative w-full h-full animate-bounce duration-[4000ms]">
              <Image
                src="/products/iphone 17 pro max 💖.jpg"
                alt="Featured Smartphone Spotlight"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
              />
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -left-4 bottom-12 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-sm">
                4.9
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Trustpilot Rating</p>
                <h4 className="font-bold text-xs text-white">5,000+ Reviews</h4>
              </div>
            </div>

            {/* Floating Speed Badge */}
            <div className="absolute -right-4 top-12 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                ⏱️
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Fast Pickup</p>
                <h4 className="font-bold text-xs text-white">Under 24 Hours</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
