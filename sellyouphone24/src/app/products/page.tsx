import ProductList from "@/components/ProductList";
import DeviceCategoryCards from "@/components/DeviceCategoryCards";
import { Sparkles, Truck, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Any Device in Dubai | Instant Cash Quote | SellPhoneCash",
  description: "Browse all devices we buy across Dubai & UAE. iPhones, MacBooks, iPads, Apple Watches & Gaming Consoles. Free 3-hour doorstep pickup and instant cash payment.",
  keywords: [
    "Sell phone Dubai",
    "Sell MacBook UAE",
    "Sell iPad Dubai",
    "Sell Apple Watch Dubai",
    "Cash for electronics Dubai",
    "Trade in devices UAE"
  ],
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string }>;
}) => {
  const { category, brand } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>UAE Instant Device Buyback Catalog</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sell Used Electronics &amp; Devices for Instant Cash
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Choose your device model to calculate your locked 7-day trade-in valuation. Free 3-hour collection anywhere in Dubai and instant payment on your doorstep.
          </p>
        </div>

        {/* Quick Trust Highlights with Lucide Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-emerald-400 shrink-0" />
            <span>Free 3-Hour Doorstep Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-emerald-400 shrink-0" />
            <span>Spot Cash or Instant Bank Wire</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>100% Certified Data Sanitization</span>
          </div>
        </div>
      </div>

      {/* 1. DEVICE CATEGORY CARDS SECTION (MATCHES USER REQUEST) */}
      <DeviceCategoryCards 
        currentCategory={category} 
        title="Select Your Device Category"
        subtitle="Click any category below to browse specific brands and models with live guaranteed buyback prices."
      />

      {/* 2. LIVE PRODUCT CATALOG GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
              Live Database
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {category ? `Browse ${category.toUpperCase()} Devices` : "Popular Devices We Buy Today"}
            </h2>
          </div>
        </div>

        <ProductList category={category} brand={brand} params="products" />
      </section>
    </div>
  );
};

export default ProductsPage;
