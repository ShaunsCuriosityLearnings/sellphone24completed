"use client";

import Link from "next/link";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Gamepad2, 
  Headphones, 
  Tv, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";

interface DeviceCategory {
  title: string;
  slug: string;
  subtitle: string;
  priceNote: string;
  icon: typeof Smartphone;
  badge: string;
  accentColor: string;
  popularBrands: string[];
}

const CATEGORIES: DeviceCategory[] = [
  {
    title: "Mobile Phones",
    slug: "mobile",
    subtitle: "iPhones, Samsung Galaxy, Google Pixel & flagship smartphones",
    priceNote: "Up to AED 4,800",
    icon: Smartphone,
    badge: "High Demand",
    accentColor: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200 hover:border-emerald-500",
    popularBrands: ["iPhone 17/16/15", "Samsung S25/S24", "Pixel 9/8"],
  },
  {
    title: "Laptops & MacBooks",
    slug: "laptops",
    subtitle: "MacBook Pro M3/M2, MacBook Air, Dell XPS, HP Spectre & gaming laptops",
    priceNote: "Up to AED 7,500",
    icon: Laptop,
    badge: "Top Value",
    accentColor: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200 hover:border-blue-500",
    popularBrands: ["MacBook Pro", "MacBook Air", "Dell XPS", "Lenovo"],
  },
  {
    title: "Tablets & iPads",
    slug: "tablets",
    subtitle: "iPad Pro M4, iPad Air, iPad Mini & Samsung Galaxy Tab series",
    priceNote: "Up to AED 3,600",
    icon: Tablet,
    badge: "Instant Cash",
    accentColor: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200 hover:border-purple-500",
    popularBrands: ["iPad Pro", "iPad Air", "Galaxy Tab S9"],
  },
  {
    title: "Smartwatches",
    slug: "smartwatches",
    subtitle: "Apple Watch Ultra 2, Series 10/9, Samsung Galaxy Watch & Garmin",
    priceNote: "Up to AED 2,200",
    icon: Watch,
    badge: "Fast Pickup",
    accentColor: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200 hover:border-amber-500",
    popularBrands: ["Apple Watch Ultra", "Series 10/9", "Galaxy Watch 7"],
  },
  {
    title: "Gaming Consoles",
    slug: "mobile", // maps to general buyback or services
    subtitle: "PlayStation 5 Slim/Pro, Xbox Series X/S & Nintendo Switch OLED",
    priceNote: "Up to AED 1,850",
    icon: Gamepad2,
    badge: "Zero Haggle",
    accentColor: "from-rose-500/10 to-red-500/10 text-rose-600 border-rose-200 hover:border-rose-500",
    popularBrands: ["PS5 Slim/Pro", "Xbox Series X", "Switch OLED"],
  },
  {
    title: "Headphones & Audio",
    slug: "mobile",
    subtitle: "AirPods Max, AirPods Pro 2, Bose QuietComfort & Sony WH-1000XM5",
    priceNote: "Up to AED 1,400",
    icon: Headphones,
    badge: "Quick Quote",
    accentColor: "from-sky-500/10 to-cyan-500/10 text-sky-600 border-sky-200 hover:border-sky-500",
    popularBrands: ["AirPods Max", "Sony WH-1000XM5", "Bose Ultra"],
  },
];

interface Props {
  currentCategory?: string;
  title?: string;
  subtitle?: string;
}

export default function DeviceCategoryCards({
  currentCategory,
  title = "Explore More Device Categories We Buy",
  subtitle = "Instant competitive cash valuations, free 3-hour doorstep collection, and certified military-grade data wipe across Dubai & UAE.",
}: Props) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
            <Sparkles size={13} className="text-emerald-600" />
            <span>UAE Certified Buyback Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline shrink-0"
        >
          <span>View All Categories</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isCurrent = currentCategory?.toLowerCase() === cat.slug.toLowerCase();

          return (
            <Link
              key={cat.title}
              href={`/services/${cat.slug}`}
              className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between space-y-3 bg-white hover:shadow-md ${
                isCurrent
                  ? "border-emerald-500 ring-2 ring-emerald-500/10 shadow-xs"
                  : "border-slate-200/90 hover:border-slate-400"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.accentColor} flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs`}>
                    <IconComponent size={22} />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Instant Quote</span>
                  <span className="font-black text-emerald-600 text-sm">{cat.priceNote}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <Zap size={12} className="text-emerald-500" />
                  <span>3-Hr Pickup</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
