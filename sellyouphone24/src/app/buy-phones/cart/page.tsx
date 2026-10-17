"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Lock, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import useBuyCartStore from "@/app/stores/buyCartStore";

export default function BuyPhonesCartPage() {
  const { cart, hasHydrated, updateQuantity, removeFromCart, getSubtotal, getTotalItems } = useBuyCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = 0; // Free delivery across UAE
  const totalAmount = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't added any certified pre-owned smartphones to your cart yet. Explore our latest flagship deals with 12 months warranty!
        </p>
        <div className="pt-2">
          <Link
            href="/buy-phones"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition"
          >
            <span>Browse Certified Phones</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <ShoppingBag size={24} className="text-emerald-500" />
            <span>Shopping Cart</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your certified pre-owned smartphone order before delivery checkout.
          </p>
        </div>
        <Link
          href="/buy-phones"
          className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedStorage}-${item.selectedColor}-${idx}`} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl p-1 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={item.image || "/products/iphone-pro-max.jpg"}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.brand}
                    </span>
                    <h3 className="font-black text-sm text-slate-900 mt-1">{item.title}</h3>
                    <div className="text-[11px] text-slate-500 space-x-2 mt-0.5">
                      <span>💾 {item.selectedStorage}</span>
                      <span>•</span>
                      <span>🎨 {item.selectedColor}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{item.condition}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      🛡️ 12-Month Store Warranty Included
                    </div>
                  </div>
                </div>

                {/* Pricing, Stepper & Removal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 py-1 font-black text-xs text-slate-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      AED {(item.price * item.quantity).toLocaleString()}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-slate-400">
                        AED {item.price.toLocaleString()} each
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>
            ))}
          </div>

          {/* Value Props Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 text-center text-xs">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <Truck size={16} className="text-emerald-500 shrink-0" />
              <span>Free Delivery in Dubai &amp; UAE</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700 py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-100">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>12 Months Store Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <RotateCcw size={16} className="text-emerald-500 shrink-0" />
              <span>7-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-black text-slate-950">Order Summary</h2>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Subtotal ({getTotalItems()} items):</span>
                <span className="font-bold text-slate-900">AED {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-3">
                <span>Doorstep Express Delivery:</span>
                <span className="font-extrabold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-3">
                <span>VAT (5% Inclusive):</span>
                <span className="font-bold text-slate-900">AED 0.00</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 text-sm font-black text-slate-950">
                <span>Total Amount:</span>
                <span className="text-xl text-emerald-600">AED {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lock size={13} />
                <span>Zero Risk • Pay on Delivery</span>
              </div>
              <p className="text-slate-600">
                Inspect your smartphone at your doorstep before handing over cash or paying with card.
              </p>
            </div>

            <Link
              href="/buy-phones/checkout"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-center"
            >
              <span>Proceed to Delivery Checkout</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
