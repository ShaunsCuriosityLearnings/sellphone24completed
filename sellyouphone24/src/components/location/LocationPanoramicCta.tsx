import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

interface LocationPanoramicCtaProps {
  locationName: string;
  pickupSpeed?: string;
}

export default function LocationPanoramicCta({ locationName, pickupSpeed = "Within 2 Hours" }: LocationPanoramicCtaProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Panoramic Banner matching "Your Next Adventure Starts Here" */}
      <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 shadow-2xl border border-emerald-900/40">
        
        {/* Left Panoramic Photography with Mask */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 z-0 opacity-40 lg:opacity-60">
          <Image
            src="/images/dubai-hero-phones.jpg"
            alt={`Sell Your Phone in ${locationName}`}
            fill
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-950/70 to-slate-950 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent lg:hidden" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-7 sm:p-12 lg:p-16 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
          
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 rounded-full text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-400" />
              <span>Doorstep Collection Active in {locationName}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Your Cash Payout Starts Here.
            </h2>

            <p className="text-xs sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
              Licensed courier dispatch arriving in {pickupSpeed} across {locationName}. 2-minute diagnostic check, verified data wipe, and immediate cash in hand.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero Inspection Fees</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400" />
                <span>Instant Cash or Bank Wire</span>
              </span>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5 text-center"
            >
              <span>Schedule Free Pickup</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href={`https://wa.me/971555549817?text=${encodeURIComponent(
                `Hi SellPhoneCash! I am in ${locationName} and want to book a doorstep courier pickup for cash.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm px-6 py-4 rounded-full border border-slate-700 hover:border-slate-600 transition-all text-center"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>

        </div>

      </div>

    </section>
  );
}
