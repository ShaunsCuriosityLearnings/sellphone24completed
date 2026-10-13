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
  Info,
  CreditCard,
  Headphones,
  Star,
  Minus,
  Plus,
  MessageCircle,
  Check
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
    sublabel: "Zero scratches, 100% battery health",
    multiplier: 1.0,
    badge: "100% Top Payout",
    desc: "Flawless screen & housing, battery health above 85%, all biometric sensors (Face ID / Fingerprint) & cameras fully operational.",
  },
  {
    key: "good",
    label: "Good Condition",
    sublabel: "Light pocket scuffs or hairline marks",
    multiplier: 0.85,
    badge: "High Value Offer",
    desc: "Minor cosmetic handling wear on frame, display has zero deep cracks, battery healthy, 100% functional hardware.",
  },
  {
    key: "fair",
    label: "Fair Condition",
    sublabel: "Visible scratches or frame dents",
    multiplier: 0.70,
    badge: "Fair Market",
    desc: "Noticeable scratches, minor casing dents, or light camera ring wear. Device powers on and functions without issue.",
  },
  {
    key: "broken",
    label: "Broken / Cracked",
    sublabel: "Shattered display or cracked back glass",
    multiplier: 0.45,
    badge: "Instant Cash Salvage",
    desc: "Cracked front glass, shattered rear panel, or battery replacement alert. Logic board and power must remain intact.",
  },
];

const COLOR_SWATCH_MAP: Record<string, string> = {
  black: "bg-slate-900",
  "space black": "bg-slate-900",
  "space gray": "bg-slate-700",
  gray: "bg-slate-600",
  silver: "bg-slate-200 border-slate-300",
  white: "bg-white border-slate-300",
  gold: "bg-amber-200",
  blue: "bg-blue-600",
  "sky blue": "bg-sky-400",
  "deep purple": "bg-purple-900",
  purple: "bg-purple-600",
  green: "bg-emerald-600",
  pink: "bg-pink-300",
  red: "bg-rose-600",
  titanium: "bg-stone-400",
  "natural titanium": "bg-stone-300",
  "desert titanium": "bg-amber-100 border-amber-300",
};

export default function ModelValuationWidget({ product, modelName, brand }: Props) {
  const storages = product.storages && product.storages.length > 0
    ? product.storages
    : [
        { size: "128GB", priceBoost: 0 },
        { size: "256GB", priceBoost: 250 },
        { size: "512GB", priceBoost: 550 },
        { size: "1TB", priceBoost: 950 },
      ];

  const colors = product.colors && product.colors.length > 0
    ? product.colors
    : ["Space Black", "Natural Titanium", "Silver", "Deep Blue"];

  const [selectedStorage, setSelectedStorage] = useState(storages[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey>("flawless");
  const [activeImageKey, setActiveImageKey] = useState<"frontView" | "backView" | "sideView">("frontView");
  const [quantity, setQuantity] = useState(1);

  const basePrice = product.basePrice || 2800;
  const storageBoost = selectedStorage.priceBoost || 0;
  const activeConditionObj = CONDITIONS.find((c) => c.key === selectedCondition) || CONDITIONS[0];
  
  const unitPrice = Math.round(((basePrice + storageBoost) * activeConditionObj.multiplier) / 10) * 10;
  const estimatedPayout = unitPrice * quantity;
  const retailComparison = Math.round(estimatedPayout * 1.18);

  const imagesMap = {
    frontView: product.images?.frontView || "/products/iphone-pro-max.jpg",
    backView: product.images?.backView || product.images?.frontView || "/products/iphone-pro-max.jpg",
    sideView: product.images?.sideView || null,
  };

  const currentDisplayImg = imagesMap[activeImageKey] || imagesMap.frontView;

  const whatsappMessage = encodeURIComponent(
    `Hi SellPhoneCash! I would like to sell my ${brand} ${modelName} (${selectedStorage.size}, Color: ${selectedColor}, Condition: ${activeConditionObj.label}, Qty: ${quantity}) for the locked price of AED ${estimatedPayout.toLocaleString()} in Dubai. Please schedule my free 3-hour doorstep collection.`
  );

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden space-y-6">
      
      {/* 2-Column Hero: Image Showcase (Left) + Interactive Options & Quote (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
        
        {/* LEFT COLUMN: PRODUCT IMAGE GALLERY WITH THUMBNAIL STRIP */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-square sm:aspect-[4/5] rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8 flex items-center justify-center overflow-hidden group">
            {/* Top Live Quote Badge */}
            <div className="absolute top-3.5 left-3.5 z-10 bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles size={11} />
              <span>Live UAE Quote</span>
            </div>

            {/* Front/Back Flip Toggle Button */}
            {product.images?.backView && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageKey((prev) => (prev === "frontView" ? "backView" : "frontView"))
                }
                className="absolute top-3.5 right-3.5 z-10 bg-white/95 hover:bg-slate-900 hover:text-white text-slate-700 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
              >
                <RotateCw size={11} />
                <span>{activeImageKey === "frontView" ? "Back View" : "Front View"}</span>
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full">
              <Image
                src={currentDisplayImg}
                alt={`${brand} ${modelName}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-contain p-2 sm:p-4 transition-all duration-500 group-hover:scale-105 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>

          {/* Thumbnail Gallery Strip matching Reference Design */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveImageKey("frontView")}
              className={`relative aspect-square rounded-2xl border p-2 bg-slate-50 flex items-center justify-center transition cursor-pointer overflow-hidden ${
                activeImageKey === "frontView"
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image
                src={imagesMap.frontView}
                alt="Front View"
                fill
                className="object-contain p-1.5"
              />
            </button>

            {product.images?.backView && (
              <button
                type="button"
                onClick={() => setActiveImageKey("backView")}
                className={`relative aspect-square rounded-2xl border p-2 bg-slate-50 flex items-center justify-center transition cursor-pointer overflow-hidden ${
                  activeImageKey === "backView"
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Image
                  src={imagesMap.backView}
                  alt="Back View"
                  fill
                  className="object-contain p-1.5"
                />
              </button>
            )}

            {product.images?.sideView && (
              <button
                type="button"
                onClick={() => setActiveImageKey("sideView")}
                className={`relative aspect-square rounded-2xl border p-2 bg-slate-50 flex items-center justify-center transition cursor-pointer overflow-hidden ${
                  activeImageKey === "sideView"
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Image
                  src={imagesMap.sideView}
                  alt="Side View"
                  fill
                  className="object-contain p-1.5"
                />
              </button>
            )}

            {/* Quick color indicator pill thumbnail */}
            <div className="relative aspect-square rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-2 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">Selected Color</span>
              <span className="text-[10px] font-extrabold text-slate-800 truncate max-w-full px-1">{selectedColor}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS, PRICING, VARIANT SELECTORS & CTA */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          {/* Header & Title Area */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                {brand} Official Buyback Program
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">Dubai &amp; UAE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {brand} {modelName}
            </h1>

            {/* Rating Stars using Lucide Star icons */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">4.9</span>
              <span className="text-xs text-slate-400">(258+ Verified UAE Reviews)</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
              Receive the highest market cash payout for your {brand} {modelName}. Instant transparent evaluation, free 3-hour doorstep courier pickup anywhere in Dubai, and 100% certified data wipe.
            </p>
          </div>

          {/* Pricing Highlight Section matching Reference Design */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white border border-emerald-200/90 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Instant Guaranteed Cash Offer
              </div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                  AED {estimatedPayout.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-400 line-through">
                  AED {retailComparison.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-xs">
              <Clock size={13} />
              <span>Price Locked for 7 Days</span>
            </div>
          </div>

          {/* 1. Pick a Color Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Pick a Color
              </label>
              <span className="font-semibold text-emerald-600">{selectedColor}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {colors.map((colorName) => {
                const isSelected = selectedColor === colorName;
                const lower = colorName.toLowerCase();
                const swatchClass = COLOR_SWATCH_MAP[lower] || "bg-slate-400";

                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => setSelectedColor(colorName)}
                    title={colorName}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${swatchClass} shadow-xs shrink-0`}
                    />
                    <span>{colorName}</span>
                    {isSelected && <Check size={12} className="text-white shrink-0 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Choose Storage Capacity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Storage Capacity
              </label>
              <span className="font-semibold text-slate-500">{selectedStorage.size}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {storages.map((st) => {
                const isSelected = selectedStorage.size === st.size;
                return (
                  <button
                    key={st.size}
                    type="button"
                    onClick={() => setSelectedStorage(st)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition cursor-pointer font-bold text-xs sm:text-sm ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-xs scale-[1.02]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>{st.size}</div>
                    <div className={`text-[10px] ${isSelected ? "text-slate-900 font-bold" : "text-slate-400"}`}>
                      {st.priceBoost ? `+AED ${st.priceBoost}` : "Standard"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Cosmetic Condition Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 uppercase tracking-wider">
                Device Condition
              </label>
              <span className="font-semibold text-emerald-600">{activeConditionObj.badge}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONDITIONS.map((cond) => {
                const isSelected = selectedCondition === cond.key;
                return (
                  <button
                    key={cond.key}
                    type="button"
                    onClick={() => setSelectedCondition(cond.key)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span className="truncate">{cond.label.split("/")[0]}</span>
                        {isSelected && <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {cond.sublabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Condition Description Hint */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-600">
              <Info size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{activeConditionObj.desc}</span>
            </div>
          </div>

          {/* 4. Quantity Stepper & Urgency Note */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 py-1 font-bold text-xs text-slate-900 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="p-2 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} />
              <span>High UAE Resale Demand This Week</span>
            </div>
          </div>

          {/* 5. Dual Action CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Link
              href={`/products/${product.id || product._id}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Zap size={17} />
              <span>Lock Price &amp; Book Pickup</span>
            </Link>

            <a
              href={`https://wa.me/971555549817?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-800 text-slate-900 font-bold text-sm transition-all cursor-pointer"
            >
              <MessageCircle size={17} />
              <span>WhatsApp Instant Quote</span>
            </a>
          </div>

          {/* 6. Three Trust Perks with Lucide Icons (Exact layout from reference image) */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={17} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Free 3-Hour Doorstep Pickup</h4>
                <p className="text-[11px] text-slate-500">Free courier collection provided across Dubai, Abu Dhabi &amp; UAE.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard size={17} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Instant &amp; Secure Payments</h4>
                <p className="text-[11px] text-slate-500">Physical cash in hand or immediate direct bank transfer upon handover.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Headphones size={17} />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">24/7 Dedicated Support</h4>
                <p className="text-[11px] text-slate-500">Direct WhatsApp support and diagnostic guidance always available.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
