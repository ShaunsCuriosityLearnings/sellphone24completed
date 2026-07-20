"use client";

import PaymentForm from "@/components/PaymentForm";
import ShippingForm from "@/components/ShippingForm";

import Image from "next/image";
import { ArrowRight, CheckCircle2, ClipboardList, MapPin, Calendar, Clock, Banknote, BadgePercent } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { ShippingFormInputs } from "@/types";
import useCartStore from "../stores/cartStore";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Pickup Details",
    description: "Enter pickup schedule",
  },
  {
    id: 2,
    title: "Payout Info",
    description: "Confirm cash payment",
  },
];

const CartCheckoutContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shippingForm, setShippingForm] = useState<ShippingFormInputs | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  
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
    // Capture the final details before the cart is cleared
    setCompletedOrder({
      item: activeItem,
      totalPayout,
      shippingForm
    });
    clearCart(); // Clear the cart now that we saved the details for the success page
    handleStepChange(3);
  };

  // SUCCESS STEP 3 RENDER
  if (activeStep === 3) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
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
                  <span><strong>Pickup Location:</strong> {completedOrder.shippingForm.address}, {completedOrder.shippingForm.city}, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-emerald-500" />
                  <span><strong>Date:</strong> {completedOrder.shippingForm.pickupDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-500" />
                  <span><strong>Time Slot:</strong> {completedOrder.shippingForm.pickupTime}</span>
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                  <span className="font-bold text-sm text-slate-800">Total Valuation:</span>
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
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
            >
              Back to Homepage
            </Link>
            <Link
              href="/blogs/safely-erase-phone-before-selling"
              className="px-6 py-3 border border-slate-200 text-slate-600 hover:text-emerald-500 text-xs font-semibold rounded-xl transition bg-white"
            >
              Data Erasure Guide
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Valuation Checkout</h1>
        <p className="text-xs text-slate-500">Book your doorstep pickup slot and confirm your cash payout</p>
      </div>

      {/* STEPS LIST */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 border-b pb-6 border-slate-200/60 max-w-4xl mx-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => {
              if (step.id === 1 || shippingForm) {
                handleStepChange(step.id);
              }
            }}
            className={`flex items-center gap-3 pb-3 border-b-2 cursor-pointer transition-all w-full md:w-auto ${
              step.id === activeStep ? "border-emerald-500 text-slate-800" : "border-transparent text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-slate-900 ${
                step.id === activeStep ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              {step.id}
            </div>

            <div>
              <p className="font-bold text-xs">{step.title}</p>
              <p className="text-[10px] text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENT COLUMNS */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT COLUMN: FORM VIEW */}
        <div className="w-full lg:w-7/12 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {!activeItem ? (
            <div className="text-center py-10 space-y-4">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">No device selected for valuation.</p>
              <Link href="/services" className="inline-block text-xs font-bold text-emerald-500 underline">
                Browse devices to get valuation →
              </Link>
            </div>
          ) : activeStep === 1 ? (
            <ShippingForm setShippingForm={setShippingForm} />
          ) : activeStep === 2 ? (
            <PaymentForm shippingForm={shippingForm} onSubmitSuccess={handleOrderCompletion} />
          ) : null}
        </div>

        {/* RIGHT COLUMN: Payout SUMMARY */}
        <div className="w-full lg:w-5/12">
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-800">Selling Device</h2>

            {activeItem ? (
              <div className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-2">
                  <Image
                    src={activeItem.images.frontView}
                    alt={activeItem.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">{activeItem.name}</h3>
                  <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[9px] text-slate-400 font-bold uppercase">
                    <span>{activeItem.selectedStorage}</span>
                    <span>•</span>
                    <span>{activeItem.selectedColor}</span>
                    <span>•</span>
                    <span className="text-emerald-600">{activeItem.selectedCondition}</span>
                  </div>
                  <p className="font-extrabold text-xs text-emerald-600">
                    AED {activeItem.calculatedPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No device selected.</p>
            )}

            <hr className="border-slate-100" />

            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Estimated Payout</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Device Payout Value</span>
                <span className="text-slate-800">AED {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500 font-semibold items-center">
                <span>Doorstep Inspection & Pickup</span>
                <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">FREE</span>
              </div>

              <hr className="border-slate-100" />

              <div className="flex justify-between items-baseline text-slate-800">
                <span className="font-extrabold text-sm">Total Expected Payout</span>
                <span className="text-2xl font-black text-emerald-600">
                  AED {totalPayout.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="flex gap-3 pt-2">
              {activeStep > 1 && (
                <button
                  onClick={() => handleStepChange(activeStep - 1)}
                  className="flex-1 border border-slate-200 hover:border-slate-300 py-3 rounded-2xl text-xs font-bold text-slate-600 transition bg-white cursor-pointer"
                >
                  Back
                </button>
              )}

              {activeStep === 1 && (
                <p className="text-[10px] text-slate-400 text-center leading-normal w-full bg-slate-50 p-3 rounded-2xl">
                  Please submit the pickup address form to continue to payout confirmation.
                </p>
              )}

              {activeStep === 2 && (
                <p className="text-[10px] text-slate-400 text-center leading-normal w-full bg-slate-50 p-3 rounded-2xl">
                  Confirm your cash-on-pickup payment details in the form to request collection.
                </p>
              )}
            </div>
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
