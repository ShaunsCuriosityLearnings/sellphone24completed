"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface BlogTradeInCtaProps {
  blogSlug: string;
}

export default function BlogTradeInCta({ blogSlug }: BlogTradeInCtaProps) {
  const handleClick = () => {
    analytics.track("blog_cta_clicked", "conversion", {
      blogSlug,
      ctaLocation: "article_embedded_banner",
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg my-6">
      <div className="space-y-1">
        <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
          Ready to Sell Your Device?
        </span>
        <h3 className="text-xl sm:text-2xl font-black">
          Get an Instant Cash Quote for Your Used Phone in 60 Seconds
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          No hassle, no long listings. We offer doorstep pickup anywhere in Dubai, Abu Dhabi, Sharjah & UAE with instant cash payment.
        </p>
      </div>

      <Link
        href="/services"
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer"
      >
        <Zap size={16} className="text-emerald-400" />
        Calculate My Device Value Now
      </Link>
    </div>
  );
}
