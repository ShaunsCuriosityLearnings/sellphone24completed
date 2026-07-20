"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentFormInputs, PaymentFormSchema, ShippingFormInputs } from "@/types";
import useCartStore from "@/app/stores/cartStore";
import { toast } from "react-toastify";
import { Banknote, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";
import { useState } from "react";

const PaymentForm = ({
  shippingForm,
  onSubmitSuccess,
}: {
  shippingForm: ShippingFormInputs | null;
  onSubmitSuccess: () => void;
}) => {
  const {
    handleSubmit,
  } = useForm<PaymentFormInputs>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  const { cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = async () => {
    if (!shippingForm) {
      toast.error("Pickup details are missing. Please go back and fill step 1.");
      return;
    }

    if (cart.length === 0) {
      toast.error("No items in your sell list.");
      return;
    }

    setLoading(true);

    try {
      // Map frontend cart items to backend Order devices
      const devices = cart.map((item) => ({
        // Ensure we pass a 24-character hex ID if it's MongoDB, otherwise pass a fallback string
        productId: (item._id || String(item.id)).match(/^[0-9a-fA-F]{24}$/) 
          ? (item._id || String(item.id)) 
          : "65d78fa1b98cf931acbdc60f", // Fallback seeded device objectId if local mock ID
        name: item.name,
        brand: item.brand,
        category: item.category,
        selectedStorage: item.selectedStorage,
        selectedColor: item.selectedColor,
        selectedCondition: item.selectedCondition,
        calculatedPrice: item.calculatedPrice,
        quantity: item.quantity || 1,
      }));

      const totalPayout = cart.reduce((acc, item) => acc + item.calculatedPrice * (item.quantity || 1), 0);

      const orderData = {
        customerDetails: {
          name: shippingForm.name,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address: shippingForm.address,
          city: shippingForm.city,
          state: shippingForm.state || "United Arab Emirates",
          pincode: shippingForm.pincode || "00000",
        },
        pickupSchedule: {
          pickupDate: shippingForm.pickupDate,
          pickupTime: shippingForm.pickupTime,
        },
        devices,
        paymentMethod: "cash" as const,
        totalPayout,
      };

      const res = await api.createOrder(orderData);

      if (res.success) {
        toast.success("Sell order created successfully!");
        onSubmitSuccess();
      } else {
        toast.error(res.message || "Failed to create valuation request.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("An error occurred. Please verify your backend server is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="payout-form"
      onSubmit={handleSubmit(handlePaymentForm)}
      className="flex flex-col gap-6"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Preferred Payout Method</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select how you would like to receive the cash payment for your device.
        </p>
      </div>

      {/* PAYOUT METHOD - CASH ONLY */}
      <div className="flex flex-col gap-4">
        <div className="border border-emerald-500 bg-emerald-50/30 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Banknote className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-800">Cash on Pickup</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Our courier will verify the specifications of your device at your doorstep and pay you in **cash immediately** upon confirmation.
            </p>
          </div>
        </div>

        <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-500">
          <ShieldAlert className="text-amber-500 w-5 h-5 flex-shrink-0" />
          <p>
            Please note that other payout methods (Bank Transfer, PayPal) are currently disabled. Doorside collection and verification is cash-only.
          </p>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:text-slate-500 text-slate-950 py-3.5 rounded-xl font-bold transition text-sm cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
      >
        {loading ? "Submitting Request..." : "Complete Valuation & Request Pickup"}
      </button>
    </form>
  );
};

export default PaymentForm;
