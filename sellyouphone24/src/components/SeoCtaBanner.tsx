import Link from "next/link";
import { MessageSquare, ArrowRight, ShieldCheck, Truck, Clock, CheckCircle2 } from "lucide-react";

interface SeoCtaBannerProps {
  heading?: string;
  subheading?: string;
  quoteLink?: string;
  quoteButtonText?: string;
  whatsappMessage?: string;
  deviceName?: string;
}

export default function SeoCtaBanner({
  heading,
  subheading,
  quoteLink = "/services",
  quoteButtonText = "Get Instant Cash Quote",
  whatsappMessage,
  deviceName,
}: SeoCtaBannerProps) {
  const defaultHeading = deviceName
    ? `Ready to Sell Your ${deviceName} in Dubai?`
    : "Get The Guaranteed Highest Cash Value in Dubai";

  const defaultSubheading =
    "Lock in your 7-day guaranteed valuation online, enjoy free 3-hour doorstep collection, and receive instant cash on the spot.";

  const finalWhatsappMsg = encodeURIComponent(
    whatsappMessage ||
      `Hi SellPhoneCash! I want to get an instant valuation for selling my ${deviceName || "phone"} in Dubai.`
  );

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-10 shadow-lg my-2 sm:my-8">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 sm:space-y-6">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck size={13} />
          <span>UAE Licensed & Certified Buyback Partner</span>
        </div>

        <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {heading || defaultHeading}
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {subheading || defaultSubheading}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 pt-1 sm:pt-2">
          <Link
            href={quoteLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-base transition-all transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20"
          >
            <span>{quoteButtonText}</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href={`https://wa.me/971555549817?text=${finalWhatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-base transition-all"
          >
            <MessageSquare size={16} className="text-emerald-400" />
            <span>WhatsApp Us Now</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="pt-3 sm:pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2">
            <Truck size={14} className="text-emerald-400 shrink-0" />
            <span>Free 3-Hour Doorstep Pickup</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={14} className="text-emerald-400 shrink-0" />
            <span>7-Day Guaranteed Price Lock</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Instant Cash In Hand or Wire</span>
          </div>
        </div>
      </div>
    </div>
  );
}
