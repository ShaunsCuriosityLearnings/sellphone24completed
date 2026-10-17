"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";
import useBuyCartStore from "@/app/stores/buyCartStore";
import { api } from "@/lib/api";

export default function BuyPhonesCheckoutPage() {
  const router = useRouter();
  const { cart, hasHydrated, getSubtotal, clearCart } = useBuyCartStore();

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Dubai");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card_on_delivery">("cod");

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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please select a smartphone from our certified catalog before checking out.</p>
        <Link
          href="/buy-phones"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = 0; // Free delivery across UAE
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim() || !email.trim()) {
      toast.error("Please fill in your name, email, phone number, and street address.");
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerDetails: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          city,
          address: address.trim(),
          building: building.trim(),
          apartment: apartment.trim(),
          notes: notes.trim(),
        },
        items: cart.map((item) => ({
          productId: item._id && item._id.length === 24 ? item._id : null,
          title: item.title,
          brand: item.brand,
          model: item.model,
          selectedStorage: item.selectedStorage,
          selectedColor: item.selectedColor,
          condition: item.condition,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        paymentMethod,
        marketingAttribution: {
          source: typeof window !== "undefined" ? localStorage.getItem("spc_utm_source") || "direct" : "direct",
          medium: typeof window !== "undefined" ? localStorage.getItem("spc_utm_medium") || "none" : "none",
          campaign: typeof window !== "undefined" ? localStorage.getItem("spc_utm_campaign") || "none" : "none",
          referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        },
      };

      const res = await api.createBuyOrder(orderPayload);

      if (res && res.success) {
        clearCart();
        toast.success("Order confirmed successfully!");
        router.push(`/buy-phones/order-success?orderId=${res.order.orderNumber}`);
      } else {
        throw new Error(res.message || "Failed to submit purchase order");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Checkout &amp; Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Free express doorstep delivery across Dubai and all UAE Emirates.
          </p>
        </div>
        <Link
          href="/buy-phones/cart"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery & Customer Information */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">1</span>
                <span>Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohammed Al Mansoori"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (For Invoice &amp; Warranty Certificate) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. mohammed@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">2</span>
                <span>Delivery Address (UAE)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Emirate *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                    <option value="Al Ain">Al Ain</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Area *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Marina Promenade, Dubai Marina"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Building / Tower Name</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Al Sahab Tower 2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apartment / Flat Number</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="e.g. Apt 1402"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with security"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">3</span>
                <span>Payment Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <Banknote size={16} className="text-emerald-600" />
                      <span>Cash on Delivery</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Inspect device &amp; pay driver cash</div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("card_on_delivery")}
                  className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === "card_on_delivery"
                      ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card_on_delivery"}
                    onChange={() => setPaymentMethod("card_on_delivery")}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      <CreditCard size={16} className="text-emerald-600" />
                      <span>Card on Delivery</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Pay via credit/debit card machine</div>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
                <Lock size={14} className="text-emerald-600 shrink-0" />
                <span>Zero Risk Guarantee: No advance payment required online. Pay only upon physical inspection.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs sticky top-20">
              <h2 className="text-base font-black text-slate-950">Review Your Order</h2>

              {/* Line items mini-preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 bg-slate-50 rounded-lg p-0.5 border border-slate-200 shrink-0 overflow-hidden">
                        <Image src={item.image || "/products/iphone-pro-max.jpg"} alt={item.title} fill className="object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[170px]">{item.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.selectedStorage} • {item.selectedColor} • Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900">
                      AED {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">AED {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express UAE Delivery:</span>
                  <span className="font-extrabold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Warranty:</span>
                  <span className="font-bold text-emerald-700">12 Months (Included)</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-sm font-black text-slate-950">
                  <span>Total Amount Due:</span>
                  <span className="text-xl text-emerald-600">AED {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>{submitting ? "Confirming Order..." : `Place Order (AED ${totalAmount.toLocaleString()})`}</span>
              </button>

              <div className="text-center text-[10px] text-slate-400">
                By placing this order, you agree to our 12-month store warranty and 7-day hassle-free return policy.
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
}
