"use client";

import useCartStore from "@/app/stores/cartStore";
import { ProductType } from "@/types";
import { conditions } from "@/data/mockData";
import { 
  BadgeCheck, 
  Info, 
  Scale, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  Minus, 
  Plus, 
  MessageCircle, 
  Check, 
  Clock 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { analytics } from "@/lib/analytics";
import { pushDataLayer } from "@/lib/gtm";

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

const ProductInteraction = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { addToCart } = useCartStore();

  const [selectedStorage, setSelectedStorage] = useState(product.storages[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "Standard");
  const [selectedCondition, setSelectedCondition] = useState(conditions[0].slug);
  const [quantity, setQuantity] = useState(1);

  // Retrieve selected condition multiplier
  const activeCondition = conditions.find((c) => c.slug === selectedCondition) || conditions[0];
  const conditionMultiplier = activeCondition.multiplier;

  // Calculate live expected payout quote
  const basePrice = product.basePrice;
  const storageBoost = product.storages.find((s) => s.size === selectedStorage)?.priceBoost || 0;
  const unitPrice = Math.round((basePrice + storageBoost) * conditionMultiplier);
  const totalPrice = unitPrice * quantity;

  // Track initial valuation completion on load & on recalculations
  useEffect(() => {
    analytics.track("valuation_completed", "valuation", {
      model: product.name,
      brand: typeof product.brand === "string" ? product.brand : (product.brand as any)?.name || "Apple",
      storage: selectedStorage,
      color: selectedColor,
      condition: activeCondition.name,
      calculatedPrice: unitPrice,
    });

    if (selectedStorage && selectedCondition && totalPrice > 0) {
      pushDataLayer({
        event: "valuation_completed",
        device_id: product.id || (product as any)._id,
        device_name: product.name,
        device_brand: typeof product.brand === "string" ? product.brand : (product.brand as any)?.name,
        device_category: product.category,
        selected_storage: selectedStorage,
        selected_color: selectedColor,
        selected_condition: activeCondition.name,
        quantity,
        estimated_value: totalPrice,
        currency: "AED",
      });
    }
  }, [selectedStorage, selectedColor, selectedCondition, unitPrice, product, quantity, totalPrice, activeCondition.name]);

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    analytics.track("recalculation_performed", "behaviour", {
      model: product.name,
      storage,
      condition: activeCondition.name,
      calculatedPrice: unitPrice,
    });
  };

  const handleConditionChange = (condSlug: string) => {
    setSelectedCondition(condSlug);
    analytics.track("recalculation_performed", "behaviour", {
      model: product.name,
      condition: condSlug,
      calculatedPrice: unitPrice,
    });
  };

  const handleAddToSellList = () => {
    analytics.track("offer_accepted", "conversion", {
      model: product.name,
      storage: selectedStorage,
      condition: activeCondition.name,
      calculatedPrice: unitPrice,
    });
    pushDataLayer({
      event: "add_to_sell_list",
      device_id: product.id || (product as any)._id,
      device_name: product.name,
      estimated_value: totalPrice,
      currency: "AED",
    });
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      selectedStorage,
      selectedColor,
      selectedCondition: activeCondition.name,
      quantity,
      calculatedPrice: unitPrice,
      images: product.images,
      shortDescription: product.shortDescription,
    });
    toast.success("Added to Sell List!");
  };

  const handleSellInstantly = () => {
    analytics.track("offer_accepted", "conversion", {
      model: product.name,
      storage: selectedStorage,
      condition: activeCondition.name,
      calculatedPrice: unitPrice,
    });
    pushDataLayer({
      event: "begin_checkout_sell_now",
      device_id: product.id || (product as any)._id,
      device_name: product.name,
      estimated_value: totalPrice,
      currency: "AED",
    });
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      selectedStorage,
      selectedColor,
      selectedCondition: activeCondition.name,
      quantity,
      calculatedPrice: unitPrice,
      images: product.images,
      shortDescription: product.shortDescription,
    });
    router.push("/cart?step=1");
  };

  const whatsappMessage = encodeURIComponent(
    `Hi SellPhoneCash! I want to sell my ${product.brand} ${product.name} (${selectedStorage}, Color: ${selectedColor}, Condition: ${activeCondition.name}, Qty: ${quantity}) for the locked price of AED ${totalPrice.toLocaleString()} in Dubai. Please schedule my free 3-hour doorstep collection.`
  );

  return (
    <div className="flex flex-col gap-5 text-slate-800">
      
      {/* 1. LIVE VALUATION PRICE BANNER (MATCHING REFERENCE IMAGE AT TOP) */}
      <div className="border border-emerald-500/30 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Instant Guaranteed Cash Offer</p>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <h2 className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              AED {totalPrice.toLocaleString()}
            </h2>
            <span className="text-sm font-semibold text-slate-400 line-through">
              AED {Math.round(totalPrice * 1.18).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl shadow-2xs">
          <Clock size={13} />
          <span>Price Locked for 7 Days</span>
        </div>
      </div>

      {/* 2. PICK A COLOR (SWATCHES MATCHING REFERENCE IMAGE) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider">
            Pick a Color
          </h3>
          <span className="font-semibold text-emerald-600">{selectedColor}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => {
            const isSelected = selectedColor === color;
            const lower = color.toLowerCase();
            const swatchClass = COLOR_SWATCH_MAP[lower] || "bg-slate-400";

            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border ${swatchClass} shadow-xs shrink-0`}
                />
                <span>{color}</span>
                {isSelected && <Check size={12} className="text-white shrink-0 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SELECT SPECIFICATION / STORAGE */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider">
            Storage Capacity
          </h3>
          <span className="font-semibold text-slate-500">{selectedStorage}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {product.storages.map((storageObj) => {
            const storage = storageObj.size;
            const boost = storageObj.priceBoost || 0;
            const isSelected = selectedStorage === storage;

            return (
              <button
                key={storage}
                type="button"
                onClick={() => handleStorageChange(storage)}
                className={`py-2.5 px-3 rounded-2xl border text-center transition cursor-pointer font-bold text-xs sm:text-sm ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 text-slate-950 font-black shadow-xs ring-1 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div>{storage}</div>
                {boost > 0 ? (
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">+AED {boost}</span>
                ) : (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Standard</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SELECT CONDITION */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>Device Condition</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600">{activeCondition.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {conditions.map((cond) => {
            const isSelected = selectedCondition === cond.slug;
            return (
              <button
                key={cond.slug}
                type="button"
                onClick={() => handleConditionChange(cond.slug)}
                className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span className="truncate">{cond.name}</span>
                    {isSelected && <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {Math.round(cond.multiplier * 100)}% Value
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Condition hint */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-start gap-2 text-xs text-slate-600">
          <Info size={14} className="text-emerald-600 shrink-0 mt-0.5" />
          <span>{activeCondition.description}</span>
        </div>
      </div>

      {/* 5. QUANTITY STEPPER */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
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

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          Guaranteed 7-Day Offer
        </span>
      </div>

      {/* 5. DUAL ACTION BUTTONS + WHATSAPP */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleSellInstantly}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/15"
          >
            <Zap size={16} />
            <span>Sell Now &amp; Book Pickup</span>
          </button>

          <button
            type="button"
            onClick={handleAddToSellList}
            className="w-full bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag size={16} />
            <span>Add to Sell List</span>
          </button>
        </div>

        <a
          href={`https://wa.me/971555549817?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
        >
          <MessageCircle size={15} className="text-emerald-600" />
          <span>Need help? Chat on WhatsApp for instant quote</span>
        </a>
      </div>

    </div>
  );
};

export default ProductInteraction;
