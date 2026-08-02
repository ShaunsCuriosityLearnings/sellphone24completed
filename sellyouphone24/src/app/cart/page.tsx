"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";

import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2, 
  ClipboardList, 
  MapPin, 
  Calendar, 
  Clock, 
  Banknote, 
  BadgePercent,
  ShieldCheck,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Edit,
  Truck,
  RotateCcw
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { ShippingFormInputs } from "@/types";
import useCartStore from "../stores/cartStore";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Pickup Details",
    description: "Enter pickup details",
  },
  {
    id: 2,
    title: "Payment Info",
    description: "Confirm payment",
  },
  {
    id: 3,
    title: "Instant Payment",
    description: "Get paid instantly",
  },
];

const CartCheckoutContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shippingForm, setShippingForm] = useState<ShippingFormInputs | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [showWhyPrice, setShowWhyPrice] = useState<boolean>(false);
  
  const activeStep = parseInt(searchParams.get("step") || "1");
  const { cart, clearCart } = useCartStore();

  const activeItem = cart[0] || null;

  const subtotal = activeItem ? activeItem.calculatedPrice * (activeItem.quantity || 1) : 0;
  const totalPayout = subtotal;

  const handleStepChange = (step: number) => {
    router.push(`/cart?step=${step}`, {
      scroll: false,
    });
  };

  const handleOrderCompletion = () => {
    setCompletedOrder({
      item: activeItem,
      totalPayout,
      shippingForm
    });
    clearCart();
    handleStepChange(3);
  };

  // SUCCESS STEP 3 RENDER
  if (activeStep === 3) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={44} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Valuation Request Booked!</h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Your pickup appointment is confirmed. Our representative will contact you shortly to coordinate the collection.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 text-left space-y-6 max-w-xl mx-auto shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3">Request Summary</h3>
          
          {completedOrder && (
            <>
              {/* Product Details Section */}
              {completedOrder.item && (
                <div className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                    <Image
                      src={completedOrder.item.images.frontView}
                      alt={completedOrder.item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm">{completedOrder.item.name}</h3>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[9px] text-slate-400 font-bold uppercase">
                      <span>{completedOrder.item.selectedStorage}</span>
                      <span>•</span>
                      <span>{completedOrder.item.selectedColor}</span>
                      <span>•</span>
                      <span className="text-emerald-600">{completedOrder.item.selectedCondition}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping and Total Section */}
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" />
                  <span><strong>Pickup Location:</strong> {completedOrder.shippingForm?.address || completedOrder.shippingForm?.building}, {completedOrder.shippingForm?.city}, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-emerald-500" />
                  <span><strong>Date:</strong> {completedOrder.shippingForm?.pickupDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-500" />
                  <span><strong>Time Slot:</strong> {completedOrder.shippingForm?.pickupTime}</span>
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                  <span className="font-bold text-sm text-slate-800">Estimated Evaluation:</span>
                  <strong className="text-emerald-600 text-xl font-black">AED {completedOrder.totalPayout.toLocaleString()}</strong>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Please make sure you have backed up your photos, contacts, and logged out of iCloud/Google account settings prior to the pickup appointment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            {completedOrder && (
              <a
                href={`https://wa.me/971555972150?text=${encodeURIComponent(
                  `🚨 *NEW ORDER CREATED - SellPhoneCash*\n\n` +
                  `👤 *Customer Name:* ${completedOrder.shippingForm?.name || "Customer"}\n` +
                  `📞 *Phone:* ${completedOrder.shippingForm?.phone || "N/A"}\n` +
                  `📧 *Email:* ${completedOrder.shippingForm?.email || "N/A"}\n\n` +
                  `📍 *Pickup Address:* ${completedOrder.shippingForm?.address || ""}, ${completedOrder.shippingForm?.city || ""}, UAE\n` +
                  `📅 *Pickup Date:* ${completedOrder.shippingForm?.pickupDate || ""}\n` +
                  `⏰ *Time Slot:* ${completedOrder.shippingForm?.pickupTime || ""}\n\n` +
                  `📱 *Device:* ${completedOrder.item?.name || "Device"} (${completedOrder.item?.selectedStorage || ""}, ${completedOrder.item?.selectedColor || ""}, ${completedOrder.item?.selectedCondition || ""})\n` +
                  `💰 *Estimated Evaluation:* AED ${completedOrder.totalPayout?.toLocaleString() || 0}\n` +
                  `💵 *Payment Method:* Cash on Doorstep Collection`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <span>💬 Send Order Details to WhatsApp (+971555972150)</span>
              </a>
            )}
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition text-center"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Valuation Checkout</h1>
        <p className="text-xs md:text-sm text-slate-500">Book your doorstep pickup slot and confirm your cash payout</p>
      </div>

      {/* STEPS HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 border-b pb-6 border-slate-200/60 max-w-4xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => {
              if (step.id === 1 || shippingForm) {
                handleStepChange(step.id);
              }
            }}
            className={`flex items-center gap-3 pb-3 border-b-2 cursor-pointer transition-all w-full md:w-auto ${
              step.id === activeStep ? "border-emerald-500 text-slate-900" : "border-transparent text-slate-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                step.id === activeStep 
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {step.id}
            </div>

            <div>
              <p className="font-bold text-xs md:text-sm">{step.title}</p>
              <p className="text-[10px] text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN: CHECKOUT FORM */}
        <div className="w-full lg:w-7/12 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {!activeItem ? (
            <div className="text-center py-12 space-y-4">
              <ClipboardList className="w-14 h-14 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No device selected for valuation.</p>
              <Link href="/services" className="inline-block text-xs font-extrabold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition">
                Browse devices to get valuation →
              </Link>
            </div>
          ) : activeStep === 1 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 2 ? (
            <PaymentForm shippingForm={shippingForm} onSubmitSuccess={handleOrderCompletion} />
          ) : null}
        </div>

        {/* RIGHT COLUMN: YOUR DEVICE SIDEBAR */}
        <div className="w-full lg:w-5/12">
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900">Your Device</h2>
              {activeItem && (
                <Link
                  href={`/products/${activeItem.id}`}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  Edit
                </Link>
              )}
            </div>

            {activeItem ? (
              <div className="space-y-5">
                
                {/* Device Card Row */}
                <div className="flex gap-4 items-center bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                    <Image
                      src={activeItem.images.frontView}
                      alt={activeItem.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm">{activeItem.name}</h3>
                    <p className="text-[11px] font-medium text-slate-500">
                      {activeItem.selectedStorage} • {activeItem.selectedColor} • {activeItem.selectedCondition}
                    </p>
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      {activeItem.selectedCondition}
                    </span>
                  </div>
                </div>

                {/* You'll Receive Big Valuation Banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">You&apos;ll Receive</p>
                  <h2 className="text-3xl md:text-4xl font-black text-emerald-600">
                    AED {subtotal.toLocaleString()}
                  </h2>
                  <span className="inline-block bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase shadow-xs">
                    Paid in Cash Today
                  </span>
                </div>

                {/* Fee Breakdown */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Device Payout Value</span>
                    <span className="font-extrabold text-slate-900">AED {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 font-semibold items-center">
                    <span>Inspection Fee</span>
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-slate-400 text-[10px]">AED 50</span>
                      <span className="text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded text-[10px]">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-600 font-semibold items-center">
                    <span>Doorstep Pickup</span>
                    <span className="text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded text-[10px]">FREE</span>
                  </div>
                </div>

                {/* Trust Badges Box */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                    <p className="font-extrabold text-slate-900 text-xs">25,000+</p>
                    <p className="text-[9px] text-slate-400">Devices Purchased</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                    <p className="font-extrabold text-amber-500 text-xs flex items-center justify-center gap-0.5">
                      <Star size={10} fill="currentColor" /> 4.9/5
                    </p>
                    <p className="text-[9px] text-slate-400">Google Rating</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
                    <p className="font-extrabold text-slate-900 text-xs">Since 2014</p>
                    <p className="text-[9px] text-slate-400">Trusted in UAE</p>
                  </div>
                </div>

                {/* Accordion: Why this price? */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowWhyPrice(!showWhyPrice)}
                    className="w-full bg-slate-50/80 hover:bg-slate-100 p-3 flex justify-between items-center text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <span>Why this price?</span>
                    {showWhyPrice ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showWhyPrice && (
                    <div className="p-3 text-[11px] text-slate-500 leading-relaxed bg-white border-t border-slate-100">
                      Price is based on today&apos;s real-time secondary UAE market rates, device condition, storage size, and demand.
                    </div>
                  )}
                </div>

                {/* Sidebar Bottom Footer Signals */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px] text-slate-400 text-center font-medium">
                  <span>🛡️ Licensed Business</span>
                  <span>🔒 Secure & Encrypted</span>
                  <span>⌛ Data Protection</span>
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400">No device selected.</p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

const CartPage = () => {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-500 font-medium">Loading checkout details...</div>}>
      <CartCheckoutContent />
    </Suspense>
  );
};

export default CartPage;
