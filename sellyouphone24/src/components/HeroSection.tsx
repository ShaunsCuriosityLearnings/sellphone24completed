"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Shield } from "lucide-react";
import QuickEvaluationWidget from "@/components/QuickEvaluationWidget";
import { api } from "@/lib/api";
import { ProductType } from "@/types";

const HeroSection = () => {
  const [heroProduct, setHeroProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    async function loadHero() {
      const p = await api.getHeroProduct();
      if (p) setHeroProduct(p);
    }
    loadHero();
  }, []);

  const heroImage = (typeof heroProduct?.images === "object" && heroProduct.images?.frontView) || (typeof heroProduct?.images === "string" ? heroProduct.images : "/products/iphone-pro-max.jpg");
  const heroName = heroProduct?.name || "Sell your Smartphone";
  
  // Calculate max valuation payout tag
  const maxStorageBoost = heroProduct?.storages?.reduce((max, s) => Math.max(max, s.priceBoost || 0), 0) || 0;
  const topValuationPrice = heroProduct ? (heroProduct.basePrice + maxStorageBoost) : 3780;

  return (
    <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-50/80 via-teal-50/20 to-white border border-slate-200/80 mb-6 isolate shadow-xs">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-200/40 blur-[80px] mix-blend-multiply" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/3">
        <div className="w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-[60px] mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 md:pt-16 pb-8 space-y-8 md:space-y-10 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center w-full">
          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 relative z-10 w-full">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-600 text-xs font-bold tracking-wide uppercase">
              Instant Cash Valuation UAE
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Turn Your Old Devices Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Instant Cash</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
              Experience the simplest way to sell your tech. Free doorstep collection, instant valuation, and same-day payment across the UAE.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Free Pickup
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-semibold">
                <Shield size={18} className="text-emerald-500 shrink-0" /> Secure Data Wipe
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative h-[260px] sm:h-[320px] md:h-[400px] w-full flex items-center justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-xs sm:max-w-md aspect-square">
              {/* Glassmorphism Card Behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-2xl rotate-6 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] -rotate-3" />

              {/* Main Image */}
              <div className="absolute inset-0 z-20 flex items-center justify-center group">
                <div className="relative w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-500 ease-out">
                  <Image
                    src={heroImage}
                    alt={heroName}
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating Price Tag */}
              <div className="absolute top-2 sm:top-4 right-0 z-30 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-emerald-50 animate-bounce">
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                  {heroProduct ? heroProduct.name : "Up to"}
                </p>
                <p className="text-xl sm:text-2xl font-black text-emerald-500">AED {topValuationPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Quick Evaluation Cascading Dropdowns */}
        <div className="pt-2 w-full">
          <QuickEvaluationWidget />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
