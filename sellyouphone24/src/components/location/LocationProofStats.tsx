import React from "react";
import { Users, Banknote, Star, Clock } from "lucide-react";

interface LocationProofStatsProps {
  locationName: string;
  pickupSpeed?: string;
}

export default function LocationProofStats({ locationName, pickupSpeed = "Within 2 Hours" }: LocationProofStatsProps) {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Happy UAE Sellers",
    },
    {
      icon: Banknote,
      value: "AED 25M+",
      label: "Instant Cash Paid",
    },
    {
      icon: Star,
      value: "4.9 ★",
      label: "Average Google Rating",
      starHighlight: true,
    },
    {
      icon: Clock,
      value: pickupSpeed,
      label: `Arrival in ${locationName}`,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 border-y border-slate-200/80">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Icon size={18} className="stroke-[2]" />
              </div>
              <div>
                <div className={`text-base sm:text-xl font-black ${item.starHighlight ? "text-amber-500" : "text-slate-900"}`}>
                  {item.value}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
