"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Clock, 
  Truck, 
  Sparkles, 
  RotateCw,
  Info
} from "lucide-react";

interface Props {
  product: ProductType;
  modelName: string;
  brand: string;
}

type ConditionKey = "flawless" | "good" | "fair" | "broken";

const CONDITIONS: { key: ConditionKey; label: string; sublabel: string; multiplier: number; badge: string; desc: string }[] = [
  {
    key: "flawless",
    label: "Flawless / Mint",
    sublabel: "Like brand new, zero scratches",
    multiplier: 1.0,
    badge: "100% Top Payout",
    desc: "Flawless screen & body, battery health > 85%, all biometric sensors (Face ID / Fingerprint) & cameras fully functional.",
  },
  {
    key: "good",
    label: "Good Condition",
    sublabel: "Minor micro-scratches on bezel",
    multiplier: 0.85,
    badge: "High Value Offer",
    desc: "Light cosmetic wear or pocket scuffs, screen has no deep gouges, battery healthy, 100% operational hardware.",
  },
  {
    key: "fair",
    label: "Fair Condition",
    sublabel: "Noticeable dents or heavy scuffs",
    multiplier: 0.70,
    badge: "Fair Market",
    desc: "Visible scratches, minor frame dents, or minor camera bezel wear. Device powers on and functions reliably.",
  },
  {
    key: "broken",
    label: "Broken / Cracked",
    sublabel: "Shattered display or cracked back",
    multiplier: 0.45,
    badge: "Instant Cash Salvage",
    desc: "Cracked front glass, shattered rear panel, or battery service alert. Logic board and power must be intact.",
  },
];

export default function ModelValuationWidget({ product, modelName, brand }: Props) {
  const storages = product.storages && product.storages.length > 0
    ? product.storages
    : [
        { size: "128GB", priceBoost: 0 },
        { size: "256GB", priceBoost: 250 },
        { size: "512GB", priceBoost: 550 },
        { size: "1TB", priceBoost: 950 },
      ];

  const [selectedStorage, setSelectedStorage] = useState(storages[0]);
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>("flawless");
  const [currentImageSide, setCurrentImageSide] = useState<"front" | "back">("front");

  const basePrice = product.basePrice || 2500;
  const storageBoost = selectedStorage.priceBoost || 0;
  const activeConditionObj = CONDITIONS.find((c) => c.key === selectedCondition) || CONDITIONS[0];
  
  const rawPrice = (basePrice + storageBoost) * activeConditionObj.multiplier;
  const estimatedPayout = Math.round(rawPrice / 10) * 10;

  const frontImg = product.images?.frontView || "/products/iphone-pro-max.jpg";
  const backImg = product.images?.backView || frontImg;
  const activeImg = currentImageSide === "front" ? frontImg : backImg;

  const whatsappMessage = encodeURIComponent(
    `Hi SellPhoneCash! I want to sell my ${brand} ${modelName} (${selectedStorage.size}, Condition: ${activeConditionObj.label}) for the live valuation of AED ${estimatedPayout.toLocaleString()} in Dubai. Please schedule my free 3-hour doorstep collection.`
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-8 items-center">
        
        {/* Left: Device Image Showcase with 3D Flip */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-2 sm:space-y-4 w-full">
          <div className="relative w-full max-w-[190px] sm:max-w-[280px] aspect-square bg-gradient-to-b from-slate-800/80 to-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-700/60 p-3 sm:p-6 flex items-center justify-center shadow-inner group mx-auto">
            
            {/* Live Database Image */}
            <div className="relative w-full h-full">
              <Image
                src={activeImg}
                alt={`${brand} ${modelName}`}
                fill
                sizes="(max-width: 768px) 190px, 288px"
                className="object-contain transition-all duration-500 drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] group-hover:scale-105"
                priority
              />
            </div>

            {/* Front / Back Toggle Pill */}
            {product.images?.backView && (
              <button
                type="button"
                onClick={() => setCurrentImageSide((prev) => (prev === "front" ? "back" : "front"))}
                className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1 transition shadow-lg cursor-pointer"
              >
                <RotateCw size={11} />
                <span>View {currentImageSide === "front" ? "Back" : "Front"}</span>
              </button>
            )}

            {/* Price Tag Overlay Badge */}
            <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-black text-[9px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg shadow-emerald-500/20">
              Live DB Quote
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] sm:text-xs text-center">
            <Sparkles size={12} className="text-emerald-400 shrink-0" />
            <span>Official {brand} Device Specifications Sourced</span>
          </div>
        </div>

        {/* Right: Interactive Calculator Controls */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-6 w-full">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Zap size={13} />
              <span>Interactive Cash Evaluator</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              Instant Valuation for {modelName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select your capacity and condition below to unlock your guaranteed 7-day trade-in price.
            </p>
          </div>

          {/* 1. Storage Capacity Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Choose Storage Capacity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {storages.map((st) => {
                const isSelected = selectedStorage.size === st.size;
                return (
                  <button
                    key={st.size}
                    type="button"
                    onClick={() => setSelectedStorage(st)}
                    className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl border text-center transition-all cursor-pointer font-bold text-xs sm:text-sm ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black scale-[1.02]"
                        : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div>{st.size}</div>
                    <div className={`text-[10px] ${isSelected ? "text-slate-900" : "text-slate-400"}`}>
                      {st.priceBoost ? `+AED ${st.priceBoost}` : "Standard"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Cosmetic Condition Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Select Cosmetic Condition
              </label>
              <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold">
                {activeConditionObj.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = selectedCondition === cond.key;
                return (
                  <button
                    key={cond.key}
                    type="button"
                    onClick={() => setSelectedCondition(cond.key)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-500/30 text-white"
                        : "bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm leading-tight text-white flex items-center justify-between">
                      <span className="truncate">{cond.label.split("/")[0]}</span>
                      {isSelected && <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {cond.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Condition description hint */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-300">
              <Info size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{activeConditionObj.desc}</span>
            </div>
          </div>

          {/* 3. Live Price Payout Banner & Call To Actions */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-800 to-slate-800/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Instant Locked Doorstep Value
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight flex items-baseline justify-center sm:justify-start gap-2">
                <span>AED {estimatedPayout.toLocaleString()}</span>
                <span className="text-xs font-normal text-slate-400 line-through">
                  AED {Math.round(estimatedPayout * 1.15).toLocaleString()}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-300/80 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Clock size={12} />
                <span>Price guaranteed & locked for 7 full days</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <Link
                href={`/products/${product.id || product._id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/25 shrink-0"
              >
                <span>Lock Price & Sell</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href={`https://wa.me/971555549817?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-all shrink-0"
              >
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-slate-400 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <Truck size={14} className="text-emerald-400" />
              <span>Free 3-Hr Pickup</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <Zap size={14} className="text-emerald-400" />
              <span>Instant Cash</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>DoD Wipe</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
