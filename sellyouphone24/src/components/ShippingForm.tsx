"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingFormInputs, shippingFormSchema } from "@/types";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Home, 
  FileText, 
  Zap, 
  Clock, 
  Search, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  CheckCircle2,
  MessageCircle,
  Star,
  Mail,
  Navigation,
  Loader2
} from "lucide-react";
import Image from "next/image";
import useCartStore from "@/app/stores/cartStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

const uaeLocations = [
  "Dubai Marina",
  "Downtown Dubai",
  "Business Bay",
  "Jumeirah",
  "Palm Jumeirah",
  "Jumeirah Lake Towers (JLT)",
  "Al Barsha",
  "Dubai Silicon Oasis",
  "Deira",
  "Bur Dubai",
  "Dubai Hills Estate",
  "Mirdif",
  "Jumeirah Village Circle (JVC)",
  "Dubai Design District (d3)",
  "International City",
  "Abu Dhabi - City Center",
  "Sharjah - Al Majaz",
  "Ajman - Corniche",
];

export default function ShippingForm({
  onOrderCreated,
}: {
  onOrderCreated: (completedData: any) => void;
}) {
  const router = useRouter();
  const { cart } = useCartStore();

  const [loading, setLoading] = useState(false);
  
  // Calculate prefilled today's date and 3-hour window
  const todayStr = new Date().toISOString().split("T")[0];
  
  const now = new Date();
  const currentHour = now.getHours();
  let nextWindowSlot = "Today 2:30 PM - 5:30 PM";
  if (currentHour >= 17) {
    nextWindowSlot = "Tomorrow 10:00 AM - 1:00 PM";
  } else if (currentHour >= 12) {
    nextWindowSlot = "Today 4:00 PM - 7:00 PM";
  }

  const [pickupOption, setPickupOption] = useState<"3_hours" | "scheduled">("3_hours");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      pickupOption: "3_hours",
      pickupDate: todayStr,
      pickupTime: nextWindowSlot,
      city: "Dubai Marina",
      email: "",
    },
  });

  // GPS Auto-detect location
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setLocationStatus("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          
          if (data && data.address) {
            const detectedArea = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || "Dubai Marina";
            setValue("city", detectedArea, { shouldValidate: true });
            setLocationStatus(`📍 Detected: ${detectedArea}`);
          } else {
            setValue("city", "Dubai Marina");
            setLocationStatus("📍 Location detected!");
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
          setLocationStatus("Could not resolve area name. Please select manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        setIsLocating(false);
        setLocationStatus("GPS access denied. Please select your area below.");
      }
    );
  };

  const handleShippingSubmit: SubmitHandler<ShippingFormInputs> = async (data) => {
    if (cart.length === 0) {
      toast.error("No device selected for valuation.");
      return;
    }

    setLoading(true);

    try {
      const fullAddress = `${data.building}${data.apartment ? `, Apt/Office ${data.apartment}` : ""}${data.additionalNotes ? ` (${data.additionalNotes})` : ""}`;
      
      const devices = cart.map((item) => ({
        productId: (item._id || String(item.id)).match(/^[0-9a-fA-F]{24}$/) 
          ? (item._id || String(item.id)) 
          : "65d78fa1b98cf931acbdc60f",
        name: item.name || "Mobile Device",
        brand: item.brand || "Apple",
        category: item.category || "mobile",
        selectedStorage: item.selectedStorage || "Standard",
        selectedColor: item.selectedColor || "Standard",
        selectedCondition: item.selectedCondition || "Good",
        calculatedPrice: Number(item.calculatedPrice) || 0,
        quantity: item.quantity || 1,
      }));

      const totalPayout = cart.reduce((acc, item) => acc + item.calculatedPrice * (item.quantity || 1), 0);

      const orderData = {
        customerDetails: {
          name: data.name,
          email: data.email || "customer@sellphone.ae",
          phone: data.phone,
          address: fullAddress,
          city: data.city,
          state: "UAE",
          pincode: "",
        },
        pickupSchedule: {
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
        },
        devices,
        paymentMethod: "cash" as const,
        totalPayout,
      };

      const res = await api.createOrder(orderData);

      if (res.success || res.order) {
        toast.success("Valuation pickup booked successfully!");
        onOrderCreated({
          order: res.order,
          shippingForm: { ...data, address: fullAddress },
          item: cart[0],
          totalPayout
        });
      } else {
        toast.error(res.message || "Failed to create valuation request.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("An error occurred while creating order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-6">
      
      {/* 1. NEED CASH URGENTLY? TOP BANNER WITH CHECKBOXES */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Need Cash Urgently?</h3>
            <p className="text-xs text-slate-500">Get your device picked up within 3 hours!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-3 items-center">
          
          {/* Option A: Request Pickup Within 3 Hours */}
          <div
            onClick={() => {
              setPickupOption("3_hours");
              setValue("pickupOption", "3_hours");
            }}
            className={`md:col-span-8 p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
              pickupOption === "3_hours"
                ? "border-emerald-500 bg-white shadow-md shadow-emerald-500/5"
                : "border-slate-200 bg-slate-50/50 hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pickupOption === "3_hours" ? "border-emerald-500" : "border-slate-300"}`}>
                {pickupOption === "3_hours" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs md:text-sm">Request Pickup Within 3 Hours</span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Available today in Dubai & UAE</p>
              </div>
            </div>
          </div>

          {/* Option B: Schedule Pickup Later */}
          <div
            onClick={() => {
              setPickupOption("scheduled");
              setValue("pickupOption", "scheduled");
            }}
            className={`md:col-span-4 p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
              pickupOption === "scheduled"
                ? "border-emerald-500 bg-white shadow-md"
                : "border-slate-200 bg-slate-50/50 hover:bg-white"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${pickupOption === "scheduled" ? "border-emerald-500" : "border-slate-300"}`}>
              {pickupOption === "scheduled" && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">Schedule Pickup Later</span>
              <p className="text-[10px] text-slate-400">Choose date & time</p>
            </div>
          </div>

        </div>

        {/* Dynamic Next Available Time Box */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Clock size={16} className="text-emerald-500" />
            <span>Next Available Slot:</span>
          </div>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
            {nextWindowSlot}
          </span>
        </div>
      </div>

      {/* 2. PICKUP DETAILS FORM HEADER */}
      <div className="space-y-1 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <MapPin size={16} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Pickup Details</h2>
        </div>
        <p className="text-xs text-slate-500">
          We&apos;ll come to your doorstep, inspect the device, and pay you instantly.
        </p>
      </div>

      {/* 3. INPUT FIELDS GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* FULL NAME */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Full Name *</label>
          <div className="relative">
            <input
              {...register("name")}
              placeholder="John Doe"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.name && <p className="text-rose-500 text-[11px] font-medium">{errors.name.message}</p>}
        </div>

        {/* MOBILE NUMBER */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
          <div className="relative">
            <input
              {...register("phone")}
              placeholder="0555549817"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.phone && <p className="text-rose-500 text-[11px] font-medium">{errors.phone.message}</p>}
        </div>

        {/* AREA / LOCATION WITH AUTO-GPS CAPTURE */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700">Area / Location *</label>
            <button
              type="button"
              onClick={handleAutoDetectLocation}
              disabled={isLocating}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <Navigation size={12} className={isLocating ? "animate-spin" : ""} />
              {isLocating ? "Detecting..." : "Auto-Detect My Location"}
            </button>
          </div>
          <div className="relative">
            <select
              {...register("city")}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer appearance-none"
            >
              {uaeLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {locationStatus && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{locationStatus}</p>}
          {errors.city && <p className="text-rose-500 text-[11px] font-medium">{errors.city.message}</p>}
        </div>

        {/* BUILDING / TOWER */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Building / Tower *</label>
          <div className="relative">
            <input
              {...register("building")}
              placeholder="e.g. Marina Pinnacle"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.building && <p className="text-rose-500 text-[11px] font-medium">{errors.building.message}</p>}
        </div>

        {/* APARTMENT / OFFICE NO */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Apartment / Office No.</label>
          <div className="relative">
            <input
              {...register("apartment")}
              placeholder="e.g. 1205"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <Home size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* ADDITIONAL NOTES (OPTIONAL) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700">Additional Notes (Optional)</label>
          <div className="relative">
            <input
              {...register("additionalNotes")}
              placeholder="e.g. Near reception, call before coming"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* EMAIL ADDRESS (OPTIONAL) */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
          <div className="relative">
            <input
              {...register("email")}
              placeholder="john@example.com"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

      </div>

      {/* SCHEDULE PICKUP DATE & TIME IF CUSTOMER CHOSE SCHEDULED */}
      {pickupOption === "scheduled" && (
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in duration-200">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Preferred Date</label>
            <input
              type="date"
              {...register("pickupDate")}
              min={todayStr}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Preferred Time Slot</label>
            <select
              {...register("pickupTime")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800"
            >
              <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
              <option value="01:00 PM - 05:00 PM">Afternoon (01:00 PM - 05:00 PM)</option>
              <option value="05:00 PM - 09:00 PM">Evening (05:00 PM - 09:00 PM)</option>
            </select>
          </div>
        </div>
      )}

      {/* 4. TRUST BADGES ROW UNDER FORM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center gap-2">
          <Search size={16} className="text-emerald-500 shrink-0" />
          <div>
            <h5 className="font-bold text-slate-800 text-[11px]">Free Doorstep Inspection</h5>
            <p className="text-[9px] text-slate-400">Takes less than 10 mins</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center gap-2">
          <Clock size={16} className="text-emerald-500 shrink-0" />
          <div>
            <h5 className="font-bold text-slate-800 text-[11px]">No Hidden Charges</h5>
            <p className="text-[9px] text-slate-400">100% Transparent</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <div>
            <h5 className="font-bold text-slate-800 text-[11px]">Instant Cash Payment</h5>
            <p className="text-[9px] text-slate-400">Get paid on the spot</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl flex items-center gap-2">
          <RotateCcw size={16} className="text-emerald-500 shrink-0" />
          <div>
            <h5 className="font-bold text-slate-800 text-[11px]">Cancel Anytime</h5>
            <p className="text-[9px] text-slate-400">No obligation, 100% free</p>
          </div>
        </div>
      </div>

      {/* SECURITY NOTICE */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
        <Lock size={12} className="text-slate-400" />
        <span>Your information is secure and encrypted. We never share your personal data.</span>
      </div>

      {/* 5. DIRECT ORDER CREATION BUTTON */}
      <div className="space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] disabled:bg-slate-300 disabled:text-slate-500 text-slate-950 font-extrabold py-4 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Booking Doorstep Pickup...</span>
            </>
          ) : (
            <>
              <Zap size={18} />
              <span>{pickupOption === "3_hours" ? "Book FREE Pickup Within 3 Hours →" : "Confirm Scheduled Pickup →"}</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 font-medium">
          🛡️ No obligation. Cancel anytime for FREE.
        </p>
      </div>

      {/* 6. BOTTOM HELPER & LIVE ACTIVITY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        
        {/* WhatsApp Help */}
        <a
          href="https://wa.me/971555549817"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <MessageCircle size={20} />
          </div>
          <div>
            <h5 className="font-bold text-slate-800 text-xs group-hover:text-emerald-600 transition-colors">Need Help?</h5>
            <p className="text-[10px] text-slate-500">Chat with team on WhatsApp</p>
            <p className="text-[9px] font-bold text-emerald-600">0555549817 (Reply &lt; 2 mins)</p>
          </div>
        </a>

        {/* Agent Badge */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden relative bg-slate-200 border border-emerald-400 shrink-0">
            <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Pickup Agent" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h5 className="font-bold text-slate-800 text-xs">Ahmed Khan</h5>
              <CheckCircle2 size={12} className="text-emerald-500" />
            </div>
            <div className="flex text-amber-400 text-[10px]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </div>
            <p className="text-[9px] text-slate-400 font-medium">500+ Successful Pickups</p>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 shrink-0">
            <Image src="/products/iphone-pro-max.jpg" alt="Live Order" fill className="object-contain p-1" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h5 className="font-bold text-slate-800 text-xs">Live Activity</h5>
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-1">Sarah sold an iPhone 15 Pro</p>
            <p className="text-[9px] text-slate-400">2 mins ago in Business Bay</p>
          </div>
        </div>

      </div>

    </form>
  );
}
