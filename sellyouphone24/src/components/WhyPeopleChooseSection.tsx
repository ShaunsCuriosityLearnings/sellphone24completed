"use client";

import React, { useRef, useState, useEffect } from "react";
import { TrendingUp, Truck, Banknote, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

interface WhyChooseProps {
  className?: string;
}

const REASONS = [
  {
    icon: TrendingUp,
    title: "Live Market Valuation",
    desc: "Best price based on real-time UAE market data.",
    badge: "Top Rates",
  },
  {
    icon: Truck,
    title: "Free Doorstep Pickup",
    desc: "We come to your home or office anywhere in Dubai.",
    badge: "Free 3-Hr",
  },
  {
    icon: Banknote,
    title: "Instant Cash Payment",
    desc: "Paid in physical AED cash or bank wire on the spot.",
    badge: "Immediate",
  },
  {
    icon: ShieldCheck,
    title: "100% Certified Data Wipe",
    desc: "Data permanently wiped; privacy 100% secured.",
    badge: "DoD Certified",
  },
];

export default function WhyPeopleChooseSection({ className = "" }: WhyChooseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollWidth <= clientWidth) return;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setActivePageIndex(progress > 0.3 ? 1 : 0);
  };

  const scrollToPage = (pageIdx: number) => {
    if (!scrollRef.current) return;
    const targetScroll = pageIdx === 0 ? 0 : scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
    setActivePageIndex(pageIdx);
  };

  return (
    <section className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-6 lg:p-7 shadow-xs space-y-2.5 sm:space-y-4 ${className}`}>
      
      {/* Header with Title, Subtitle, and Swipe Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
            Why People Choose SellPhoneCash
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
            A trusted and hassle-free way to sell your device in Dubai.
          </p>
        </div>

        {/* Mobile Swipe Cue + Indicators */}
        <div className="sm:hidden flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
            Swipe →
          </span>
        </div>

        {/* Desktop Quick Nav Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scrollToPage(0)}
            aria-label="Previous"
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={13} />
          </button>
          <button
            onClick={() => scrollToPage(1)}
            aria-label="Next"
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CARDS: Exactly 2 visible first on mobile, scroll smoothly to the other 2 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-1 snap-x snap-mandatory gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3.5 no-scrollbar scroll-smooth -mx-0.5 px-0.5"
      >
        {REASONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="w-[calc(50%-4px)] min-w-[calc(50%-4px)] max-w-[calc(50%-4px)] sm:w-auto sm:min-w-0 sm:max-w-none shrink-0 snap-start p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#EFE9DF] hover:border-emerald-300 transition-colors flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50/90 px-1.5 py-0.5 rounded-md border border-emerald-200/50">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Pagination Dot Indicator (Shows 1st pair / 2nd pair) */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 pt-0.5">
        <button
          onClick={() => scrollToPage(0)}
          aria-label="Cards 1 and 2"
          className={`h-1.5 rounded-full transition-all ${
            activePageIndex === 0 ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-200"
          }`}
        />
        <button
          onClick={() => scrollToPage(1)}
          aria-label="Cards 3 and 4"
          className={`h-1.5 rounded-full transition-all ${
            activePageIndex === 1 ? "w-6 bg-emerald-600" : "w-1.5 bg-slate-200"
          }`}
        />
      </div>

    </section>
  );
}
