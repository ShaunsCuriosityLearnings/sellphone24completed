"use client";

import useCartStore from "@/app/stores/cartStore";
import { ProductType } from "@/types";
import { conditions, storagePriceBoosts } from "@/data/mockData";
import { BadgeCheck, Info, Scale, ShoppingBag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductInteraction = ({ product }: { product: ProductType }) => {
  const router = useRouter();
  const { addToCart } = useCartStore();

  const [selectedStorage, setSelectedStorage] = useState(product.storages[0]?.size || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedCondition, setSelectedCondition] = useState(conditions[0].slug);
  const [quantity, setQuantity] = useState(1);

  // Retrieve selected condition multiplier
  const activeCondition = conditions.find((c) => c.slug === selectedCondition) || conditions[0];
  const conditionMultiplier = activeCondition.multiplier;

  // Calculate live expected payout quote
  const basePrice = product.basePrice;
  const storageBoost = product.storages.find(s => s.size === selectedStorage)?.priceBoost || 0;
  const unitPrice = Math.round((basePrice + storageBoost) * conditionMultiplier);
  const totalPrice = unitPrice * quantity;

  const handleAddToSellList = () => {
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

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      
      {/* 1. SELECT STORAGE */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">1. Select Storage</h3>
        <div className="flex flex-wrap gap-2.5">
          {product.storages.map((storageObj) => {
            const storage = storageObj.size;
            const boost = storageObj.priceBoost || 0;
            return (
              <button
                key={storage}
                onClick={() => setSelectedStorage(storage)}
                className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition cursor-pointer flex flex-col items-center min-w-[70px] ${
                  selectedStorage === storage
                    ? "border-emerald-500 bg-emerald-50/40 text-slate-900"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                }`}
              >
                <span>{storage}</span>
                {boost > 0 && <span className="text-[9px] text-emerald-600 font-bold mt-0.5">+AED {boost}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECT COLOR */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">2. Select Color</h3>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                selectedColor === color
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SELECT CONDITION */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          3. Device Condition
          <span className="text-[10px] text-slate-400 font-normal normal-case flex items-center gap-0.5">
            <Info size={12} />
            Affects overall valuation
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conditions.map((cond) => (
            <button
              key={cond.slug}
              type="button"
              onClick={() => setSelectedCondition(cond.slug)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                selectedCondition === cond.slug
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-sm text-slate-800">{cond.name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">
                  {Math.round(cond.multiplier * 100)}% Value
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-normal">{cond.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* LIVE VALUATION BLOCK */}
      <div className="border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Valuation</p>
            <h2 className="text-3xl font-extrabold text-emerald-600 mt-1">
              AED {totalPrice.toLocaleString()}
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Price locked for 7 days after request</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-full">
              <BadgeCheck size={12} />
              Best Value Guarantee
            </div>
          </div>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-semibold text-slate-500">Quantity to Sell:</span>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-white text-slate-800"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-2">
        <button
          onClick={handleSellInstantly}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-lg shadow-emerald-500/10"
        >
          <Zap size={18} />
          Sell Now & Book Pickup
        </button>
      </div>
    </div>
  );
};

export default ProductInteraction;
