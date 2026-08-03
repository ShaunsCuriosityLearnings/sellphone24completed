import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ProductList from "@/components/ProductList";
import TrustStatsBar from "@/components/TrustStatsBar";
import FrontpageSellSection from "@/components/FrontpageSellSection";
import QuickEvaluationWidget from "@/components/QuickEvaluationWidget";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CASCADING QUICK EVALUATION SEARCH WIDGET */}
      <section className="-mt-8 relative z-20">
        <QuickEvaluationWidget />
      </section>

      {/* 3. TRUST & STATISTICS BADGES BAR */}
      <TrustStatsBar />

      {/* 4. MAIN CATEGORY SERVICES GRID */}
      <ServicesGrid />

      {/* 5. HOW IT WORKS SECTION (SINGLE ROW ON MOBILE VIEW) */}
      <section className="bg-white rounded-[28px] md:rounded-[40px] border border-slate-100 p-4 sm:p-8 md:p-12 shadow-sm space-y-6 md:space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-800">
            Sell Your Device in <span className="text-emerald-500">3 Easy Steps</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Our streamlined process gets you paid instantly, right from your home or office in the UAE.
          </p>
        </div>

        {/* SINGLE ROW GRID ON MOBILE VIEW (grid-cols-3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 p-2 sm:p-4 bg-slate-50/60 md:bg-transparent rounded-2xl border md:border-none border-slate-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-emerald-100/70 md:bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm md:text-xl shadow-inner">
              01
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-base md:text-lg leading-tight">Select Device</h3>
            <p className="text-[10px] md:text-xs text-slate-500 leading-normal">
              Choose your model, storage, color & condition.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 p-2 sm:p-4 bg-slate-50/60 md:bg-transparent rounded-2xl border md:border-none border-slate-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-emerald-100/70 md:bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm md:text-xl shadow-inner">
              02
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-base md:text-lg leading-tight">Get Quote</h3>
            <p className="text-[10px] md:text-xs text-slate-500 leading-normal">
              Accept real-time top valuation quote.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2 md:space-y-4 p-2 sm:p-4 bg-slate-50/60 md:bg-transparent rounded-2xl border md:border-none border-slate-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-emerald-100/70 md:bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm md:text-xl shadow-inner">
              03
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-base md:text-lg leading-tight">Doorstep Pay</h3>
            <p className="text-[10px] md:text-xs text-slate-500 leading-normal">
              Free pickup & instant doorstep cash payment.
            </p>
          </div>

        </div>
      </section>

      {/* 6. POPULAR MODELS */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Popular Devices We Buy</h2>
          <p className="text-sm text-slate-500">Instantly sell these trending models at premium rates</p>
        </div>
        
        <ProductList params="homepage" />
      </section>

      {/* 7. REFERENCE DESIGN HOME PAGE SECTION */}
      <FrontpageSellSection />

      {/* 8. GREEN RECYCLING CORNER & STATISTICS */}
      <section className="bg-slate-900 rounded-[28px] md:rounded-[40px] text-white p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-900 to-slate-900" />
        <div className="relative z-10 grid lg:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              ♻️ Green E-waste Management
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Turn your old tech into <span className="text-emerald-400">instant cash</span> while protecting the environment.
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-2xl">
              Electronic waste is the fastest growing waste stream in the UAE. By selling your pre-owned smartphones, laptops, and tablets to SellPhoneCash, you give them a second life and reduce carbon footprint.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/services"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-xl font-extrabold text-xs md:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Zap size={16} />
                Sell Device Today
              </Link>
              <Link
                href="/about"
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition border border-slate-700"
              >
                Learn Our Process
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-5 text-center space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-emerald-400">100%</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Safe Data Wiped</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-5 text-center space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-white">30 Min</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Fast Doorstep Pickup</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-5 text-center space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-white">4.9/5</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Google Reviews</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-5 text-center space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-emerald-400">0 AED</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Hidden Fees</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
