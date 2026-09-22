"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/lib/analytics";
import { MessageSquare, Sparkles, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DynamicNudgeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already dismissed nudge in current session
    const dismissed = sessionStorage.getItem("spc_nudge_dismissed");
    if (dismissed) return;

    analytics.onNudgeTrigger(() => {
      if (!sessionStorage.getItem("spc_nudge_dismissed")) {
        setIsOpen(true);
      }
    });
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("spc_nudge_dismissed", "true");
    analytics.track("nudge_dismissed", "behaviour");
  };

  const handleWhatsAppClick = () => {
    analytics.track("whatsapp_clicked", "conversion", { source: "dynamic_nudge" });
    setIsOpen(false);
    sessionStorage.setItem("spc_nudge_dismissed", "true");
    window.open("https://wa.me/971500000000?text=Hi%21%20I%20want%20to%20lock%20in%20my%20device%20valuation%20offer.", "_blank");
  };

  const handleCheckoutClick = () => {
    analytics.track("nudge_accepted", "conversion");
    setIsOpen(false);
    sessionStorage.setItem("spc_nudge_dismissed", "true");
    router.push("/cart?step=1");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-slate-400 hover:text-white transition p-1 cursor-pointer"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="space-y-1.5 pr-4">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Exclusive Lock-In Bonus
          </span>
          <h4 className="font-extrabold text-sm text-white leading-tight">
            Lock in your highest valuation payout today!
          </h4>
          <p className="text-xs text-slate-300 leading-normal">
            Prices fluctuate daily. Complete your free doorstep pickup booking now to guarantee your top rate for 7 days.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={handleWhatsAppClick}
          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer"
        >
          <MessageSquare size={14} />
          WhatsApp Quote
        </button>
        <button
          onClick={handleCheckoutClick}
          className="flex items-center justify-center gap-1.5 bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer"
        >
          <Zap size={14} className="text-emerald-600" />
          Book Pickup
        </button>
      </div>
    </div>
  );
}
