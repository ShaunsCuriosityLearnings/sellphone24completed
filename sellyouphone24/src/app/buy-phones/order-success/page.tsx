"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  ShoppingBag, 
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "BUY-CONFIRMED";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      
      {/* Animated Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
        <CheckCircle2 size={42} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Placed Successfully
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          We have received your purchase order. An itemized invoice and store warranty certificate have been sent to your email.
        </p>
      </div>

      {/* Order Reference Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
          Your Order Reference Number:
        </div>
        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">
          #{orderId}
        </div>
        <div className="text-xs text-slate-500">
          Please keep this number handy for tracking your doorstep delivery.
        </div>
      </div>

      {/* Delivery Next Steps */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 text-left space-y-4 text-xs">
        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
          What Happens Next?
        </h3>
        
        <div className="space-y-3 text-slate-700">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">1. Order Inspection &amp; Packaging:</strong> Our technicians complete final 32-point diagnostic quality testing and package your phone with original accessories.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">2. Free Doorstep Delivery:</strong> Delivery takes <strong>24 to 48 hours</strong> across Dubai, Abu Dhabi, and all UAE Emirates. Our courier will call before arriving.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">3. Physical Inspection &amp; Payment:</strong> You physically inspect your device at your doorstep before paying via Cash or Card on Delivery.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={`https://wa.me/971555549817?text=Hello%20SellPhoneCash!%20I%20just%20placed%20order%20%23${orderId}.%20Can%20you%20confirm%20delivery%20status%3F`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-2"
        >
          <PhoneCall size={14} className="text-emerald-600" />
          <span>WhatsApp Support (+971 55 554 9817)</span>
        </a>

        <Link
          href="/buy-phones"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} />
          <span>Return to Store</span>
        </Link>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
