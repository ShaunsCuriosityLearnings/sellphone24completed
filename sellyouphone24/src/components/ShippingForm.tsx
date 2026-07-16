"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingFormInputs, shippingFormSchema } from "@/types";
import { useRouter } from "next/navigation";

const ShippingForm = ({
  setShippingForm,
}: {
  setShippingForm: (data: ShippingFormInputs) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      state: "United Arab Emirates",
      pickupTime: "10:00 AM - 02:00 PM",
    }
  });

  const router = useRouter();

  const handleShippingForm: SubmitHandler<ShippingFormInputs> = (data) => {
    setShippingForm(data);
    router.push("/cart?step=2", { scroll: false });
  };

  return (
    <form
      onSubmit={handleSubmit(handleShippingForm)}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-800">Doorstep Pickup Details</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide the address and time slot for our representative to inspect and pick up your device.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Full Name</label>
          <input
            {...register("name")}
            placeholder="John Doe"
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Email Address</label>
          <input
            {...register("email")}
            placeholder="john@example.com"
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Mobile Number (e.g. +971501234567)</label>
          <input
            {...register("phone")}
            placeholder="+971501234567"
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        {/* CITY */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">City/Emirate</label>
          <select
            {...register("city")}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm bg-white"
          >
            <option value="">Select Emirate</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
            <option value="Ajman">Ajman</option>
            <option value="Fujairah">Fujairah</option>
            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
            <option value="Umm Al Quwain">Umm Al Quwain</option>
          </select>
          {errors.city && (
            <p className="text-red-500 text-xs">{errors.city.message}</p>
          )}
        </div>

        {/* STATE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Country</label>
          <input
            {...register("state")}
            disabled
            placeholder="United Arab Emirates"
            className="border border-slate-200 bg-slate-50 text-slate-400 rounded-xl p-3 outline-none text-sm"
          />
        </div>

        {/* POSTAL CODE (Optional in UAE) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Pincode / Zip Code (Optional)</label>
          <input
            {...register("pincode")}
            placeholder="00000"
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* PICKUP DATE */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Preferred Pickup Date</label>
          <input
            type="date"
            {...register("pickupDate")}
            min={new Date().toISOString().split("T")[0]}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm bg-white"
          />
          {errors.pickupDate && (
            <p className="text-red-500 text-xs">{errors.pickupDate.message}</p>
          )}
        </div>

        {/* PICKUP TIME SLOT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Preferred Time Slot</label>
          <select
            {...register("pickupTime")}
            className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm bg-white"
          >
            <option value="10:00 AM - 02:00 PM">Morning (10:00 AM - 02:00 PM)</option>
            <option value="02:00 PM - 06:00 PM">Afternoon (02:00 PM - 06:00 PM)</option>
            <option value="06:00 PM - 09:00 PM">Evening (06:00 PM - 09:00 PM)</option>
          </select>
          {errors.pickupTime && (
            <p className="text-red-500 text-xs">{errors.pickupTime.message}</p>
          )}
        </div>
      </div>

      {/* ADDRESS */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">Complete Home/Office Address</label>
        <textarea
          {...register("address")}
          rows={3}
          placeholder="Building name, Apartment/Office number, Street, Area..."
          className="border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm resize-none"
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold transition text-sm cursor-pointer shadow-lg shadow-emerald-500/10"
      >
        Confirm Pickup & Continue
      </button>
    </form>
  );
};

export default ShippingForm;
