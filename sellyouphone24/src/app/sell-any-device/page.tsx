"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useState } from "react";
import { Send, Smartphone } from "lucide-react";

// Form Schema
const customDeviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  deviceBrand: z.string().min(1, "Brand is required"),
  deviceModel: z.string().min(1, "Model is required"),
  condition: z.enum(["flawless", "good", "average", "broken"], {
    errorMap: () => ({ message: "Please select a condition" }),
  }),
  description: z.string().optional(),
});

type CustomDeviceInputs = z.infer<typeof customDeviceSchema>;

export default function SellAnyDevicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomDeviceInputs>({
    resolver: zodResolver(customDeviceSchema),
  });

  const onSubmit = async (data: CustomDeviceInputs) => {
    setIsSubmitting(true);
    try {
      await api.submitCustomDeviceRequest(data);
      toast.success("Request submitted successfully! We will contact you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10 space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone size={32} />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800" style={{ fontFamily: "var(--font-poppins)" }}>
          Sell Any Device
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Can't find your device in our standard catalog? No problem! Fill out the form below with your device details, and our team will get back to you with a custom quote.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input
                {...register("phone")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="+971 50 123 4567"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Device Brand</label>
              <input
                {...register("deviceBrand")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="e.g. Sony, Huawei, Lenovo"
              />
              {errors.deviceBrand && <p className="text-red-500 text-xs mt-1">{errors.deviceBrand.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Device Model & Specs</label>
              <input
                {...register("deviceModel")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="e.g. PlayStation 5, Lenovo ThinkPad X1 Carbon (16GB RAM, 512GB SSD)"
              />
              {errors.deviceModel && <p className="text-red-500 text-xs mt-1">{errors.deviceModel.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Device Condition</label>
              <select
                {...register("condition")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white"
              >
                <option value="">Select Condition...</option>
                <option value="flawless">Flawless (Like new, no scratches)</option>
                <option value="good">Good (Light scratches, fully working)</option>
                <option value="average">Average (Visible wear, fully working)</option>
                <option value="broken">Broken (Cracked screen/back, functional issues)</option>
              </select>
              {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Additional Details (Optional)</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                placeholder="Any accessories included? Any specific issues we should know about?"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {isSubmitting ? "Submitting..." : "Get Custom Quote"}
            {!isSubmitting && <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
