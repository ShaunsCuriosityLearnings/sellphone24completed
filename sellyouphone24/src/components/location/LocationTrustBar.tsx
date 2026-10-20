import React from "react";
import { Compass, Tag, ShieldCheck, Headphones, Zap, Banknote, Truck } from "lucide-react";

interface LocationTrustBarProps {
  locationName: string;
  pickupSpeed?: string;
}

export default function LocationTrustBar({ locationName, pickupSpeed = "Within 2 Hours" }: LocationTrustBarProps) {
  const features = [
    {
      icon: Truck,
      title: "Complimentary Pickup",
      desc: `Direct to your door in ${locationName} (${pickupSpeed}).`,
    },
    {
      icon: Tag,
      title: "Best Price Guarantee",
      desc: "Top UAE market payouts with a 7-day price lock.",
    },
    {
      icon: ShieldCheck,
      title: "Safe & Certified Wipe",
      desc: "100% military-grade data erasure on the spot.",
    },
    {
      icon: Headphones,
      title: "24/7 Priority Support",
      desc: "Live WhatsApp dispatch assistance across Dubai.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-3 sm:gap-3.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white shadow-xs flex items-center justify-center shrink-0 text-slate-800 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-colors">
                <Icon size={18} className="stroke-[1.75]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
