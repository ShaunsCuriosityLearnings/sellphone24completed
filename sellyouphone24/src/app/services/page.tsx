import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Our Buyback Services | SellYourPhone24",
  description: "Explore the electronic devices we buy. Sell your used mobile phones, iPads, Android tablets, Apple Watches, and Galaxy Watches for top value.",
};

const ServicesPage = async () => {
  const categories = await api.getCategories();
  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
          Select Your Device Category
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          We buy a wide range of mobile electronics in the UAE. Select a category below to view the brands and models we accept.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-slate-100 hover:border-emerald-500/20 hover:shadow-xl rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group"
          >
            <div className="space-y-6">
              {/* Image box */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-6">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">
                  Sell {cat.name}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Category Highlights */}
              <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Instant evaluation in 60 seconds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Free doorstep inspection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  <span>Same-day bank transfer or cash</span>
                </li>
              </ul>
            </div>

            {/* Bottom Link */}
            <div className="mt-8 pt-4">
              <Link
                href={`/services/${cat.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold py-3 rounded-2xl transition duration-300 text-xs shadow-md"
              >
                Select Brand
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Trust banner */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-16 max-w-4xl mx-auto">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-extrabold text-slate-800 text-base">Don&apos;t see your device listed?</h3>
          <p className="text-xs text-slate-500 max-w-lg">
            We are constantly expanding our supported buyback catalogs. Get in touch with our Support team with your device specifications and we&apos;ll send you a custom offer.
          </p>
        </div>
        <Link
          href="/contact"
          className="bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold px-6 py-3 rounded-2xl text-xs transition whitespace-nowrap"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
