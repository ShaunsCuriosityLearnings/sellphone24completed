"use client";

import Link from "next/link";
import { Search, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogHeroBanner({ defaultSearch = "" }: { defaultSearch?: string }) {
  const [search, setSearch] = useState(defaultSearch);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/blogs");
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-10 md:p-12 overflow-hidden shadow-xl border border-slate-800">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading, Subtitle & Search Bar */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>SellPhoneCash Official Tech Journal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Smart Phone Valuations & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Tech Resale Insights
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
            Explore market depreciation forecasts, device trade-in guides, data sanitization standards, and circular electronics recycling trends across Dubai & the UAE.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1 flex items-center bg-slate-800/80 border border-slate-700/80 focus-within:border-emerald-400 rounded-2xl px-4 py-3 shadow-inner transition">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles e.g., iPhone resale value, data wiping..."
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-white placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
            >
              <span>Search Journal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Key Highlights Box */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Instant Buyout Quotes</h4>
              <p className="text-xs text-slate-400 mt-0.5">7-day price guarantee lock across all UAE Emirates.</p>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">DoD Data Sanitization</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% military-grade data erasure before device resale.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/services"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold rounded-xl text-xs text-center block transition"
            >
              Check Your Device Value →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
