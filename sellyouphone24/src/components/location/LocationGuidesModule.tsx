import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, ShieldCheck, Zap } from "lucide-react";

interface LocationGuidesModuleProps {
  locationName: string;
}

export default function LocationGuidesModule({ locationName }: LocationGuidesModuleProps) {
  const guides = [
    {
      title: `How Doorstep Courier Collection Works in ${locationName}`,
      desc: "Learn how our licensed mobile technician arrives at your lobby, tests hardware in 2 minutes, and issues immediate cash.",
      image: "/images/doorstep-van-pickup.jpg",
      readTime: "3 min read",
      tag: "Process Guide",
      link: "/blogs",
    },
    {
      title: "How We Perform 100% Certified Data Wipe In Front of You",
      desc: "Zero data leakage risk. We guide you through iCloud/Google deregistration and perform permanent factory sanitization.",
      image: "/images/dubai-hero-phones.jpg",
      readTime: "4 min read",
      tag: "Data Security",
      link: "/blogs",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Warm Cream Container matching Pomaii Travel Stories Card */}
      <div className="bg-[#FAF8F5] border border-[#EFE9DF] rounded-3xl sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xs">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (Editorial Text & Pill Button) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
              Need Guidance?
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {locationName} Trade-In Stories & Guides
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Selling directly to verified licensed buyers protects you from Dubizzle lowballers, counterfeit currency, and meeting strangers in parking lots.
            </p>

            <div className="pt-1">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md hover:-translate-y-0.5"
              >
                <span>Read Trade-In Guides</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column (2 Visual Story Cards matching Pomaii) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {guides.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
                    {item.tag}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-emerald-600" />
                      <span>{item.readTime}</span>
                    </span>
                    <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Read Story</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
