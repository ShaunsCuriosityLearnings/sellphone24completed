import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Buyback Services | SellPhoneCash",
  description: "Explore the electronic devices we buy. Sell your used mobile phones, iPads, Android tablets, Apple Watches, and Galaxy Watches for top value.",
};

const ServicesPage = async () => {
  const categories = await api.getCategories();
  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-2 md:space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
          Select Your Device Category
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-500">
          We buy a wide range of mobile electronics in the UAE. Select a category below to view the brands and models we accept.
        </p>
      </div>

      {/* Grid container: 3 cards per row on mobile (grid-cols-3), 4 cards per row on desktop (lg:grid-cols-4) */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between transition-all duration-300 group"
          >
            <div className="space-y-2 sm:space-y-4">
              {/* Image box */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50/70 flex items-center justify-center p-2 border border-slate-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width:768px) 33vw, 25vw"
                  className="object-contain p-1 sm:p-2 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                  Sell {cat.name}
                </h2>
                <p className="text-[9px] sm:text-xs text-slate-500 leading-snug line-clamp-2 hidden sm:block">
                  {cat.description}
                </p>
              </div>

              {/* Category Highlights (Visible on sm and up) */}
              <ul className="hidden sm:block space-y-1.5 text-[10px] sm:text-xs text-slate-600 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">60-sec evaluation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">Free doorstep pickup</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">Instant cash payment</span>
                </li>
              </ul>
            </div>

            {/* Bottom Link */}
            <div className="mt-3 sm:mt-6 pt-2 border-t border-slate-100/60">
              <Link
                href={`/services/${cat.slug}`}
                className="w-full inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold py-2 sm:py-2.5 rounded-xl transition duration-300 text-[9px] sm:text-xs shadow-xs"
              >
                <span>Select Brand</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust banner */}
      <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 max-w-4xl mx-auto shadow-xs">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Don&apos;t see your device listed?</h3>
          <p className="text-xs text-slate-500 max-w-lg">
            We are constantly expanding our supported buyback catalogs. Get in touch with our Support team with your device specifications and we&apos;ll send you a custom offer.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition whitespace-nowrap"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
