"use client";

import { useState } from "react";
import { 
  FileText, 
  Cpu, 
  Star, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Scale, 
  Monitor, 
  Battery, 
  HardDrive, 
  Camera, 
  Award,
  ChevronDown,
  Clock,
  Sparkles
} from "lucide-react";
import { SeoFaq } from "@/lib/seoData";

export interface SpecRow {
  specification: string;
  details: string;
  moreInfo: string;
  remarks: string;
  icon?: typeof Cpu;
}

interface Props {
  modelName: string;
  brand: string;
  category?: string;
  description?: string;
  specs?: SpecRow[];
  faqs?: SeoFaq[];
}

export default function ProductSpecificationTabs({
  modelName,
  brand,
  category = "Smartphones",
  description,
  specs,
  faqs = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "process" | "faqs">("specs");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Default rich specs if not explicitly passed
  const isLaptop = category.toLowerCase().includes("laptop") || modelName.toLowerCase().includes("macbook");
  const isWatch = category.toLowerCase().includes("watch");
  const isTablet = category.toLowerCase().includes("tablet") || modelName.toLowerCase().includes("ipad");

  const defaultSpecs: SpecRow[] = isLaptop
    ? [
        {
          specification: "Processor / Chip",
          details: "Apple M3 / M2 Pro / Intel Core i7",
          moreInfo: "High-Efficiency Neural Engine",
          remarks: "Fast computing & export",
          icon: Cpu,
        },
        {
          specification: "Display",
          details: "Liquid Retina XDR / TrueTone",
          moreInfo: "120Hz ProMotion 1000 nits",
          remarks: "Colour-accurate panel",
          icon: Monitor,
        },
        {
          specification: "Memory & Storage",
          details: "16GB - 64GB Unified / 512GB - 2TB SSD",
          moreInfo: "Ultra-fast NVMe read speeds",
          remarks: "Original factory configuration",
          icon: HardDrive,
        },
        {
          specification: "Battery Life",
          details: "Up to 18-22 Hours video playback",
          moreInfo: "MagSafe 3 Fast Charging",
          remarks: "High battery cycle count accepted",
          icon: Battery,
        },
        {
          specification: "Cosmetic Grades",
          details: "Sealed, Mint, Good, or Light Scratched",
          moreInfo: "Inspected at doorstep in 3 mins",
          remarks: "Guaranteed locked cash quote",
          icon: Award,
        },
        {
          specification: "Data Sanitization",
          details: "DoD 5220.22-M Certified Wipe",
          moreInfo: "iCloud signed out before wipe",
          remarks: "100% data privacy assured",
          icon: ShieldCheck,
        },
      ]
    : isWatch
    ? [
        {
          specification: "Case & Material",
          details: "Aerospace Titanium / Aluminium",
          moreInfo: "Sapphire Crystal Front Glass",
          remarks: "Water resistant 100m",
          icon: Scale,
        },
        {
          specification: "Display",
          details: "Always-On Retina OLED (3000 nits)",
          moreInfo: "Precision Dual-Frequency GPS",
          remarks: "Sunlight readable display",
          icon: Monitor,
        },
        {
          specification: "Sensors & Health",
          details: "ECG, Blood Oxygen, Depth Gauge",
          moreInfo: "Crash & Fall Detection",
          remarks: "All biometric sensors verified",
          icon: Cpu,
        },
        {
          specification: "Battery Life",
          details: "Up to 36 - 72 Hours battery",
          moreInfo: "Magnetic Fast USB-C Charging",
          remarks: "Battery health >80% top value",
          icon: Battery,
        },
        {
          specification: "Trade-In Guarantee",
          details: "Instant Cash or Direct Bank Transfer",
          moreInfo: "Free 3-Hour Doorstep Pickup",
          remarks: "Zero haggling guaranteed",
          icon: CreditCard,
        },
      ]
    : [
        {
          specification: "Weight & Build",
          details: "~178 g - 225 g Titanium Frame",
          moreInfo: "Ceramic Shield Generation Glass",
          remarks: "Premium ergonomic grip",
          icon: Scale,
        },
        {
          specification: "Display",
          details: "Super Retina XDR OLED 120Hz",
          moreInfo: "Dynamic Island / ProMotion",
          remarks: "Vibrant HDR10+ outdoor clarity",
          icon: Monitor,
        },
        {
          specification: "Processor & AI",
          details: "Latest Flagship Bionic / Snapdragon",
          moreInfo: "3nm Architecture Neural Engine",
          remarks: "Flagship speed & gaming",
          icon: Cpu,
        },
        {
          specification: "Camera System",
          details: "48MP Dual / Triple Camera Array",
          moreInfo: "Photonic Engine & 5x Optical Zoom",
          remarks: "4K Dolby Vision video",
          icon: Camera,
        },
        {
          specification: "Battery & Power",
          details: "All-Day Battery / 25W MagSafe & USB-C",
          moreInfo: "Fast 50% charge in 30 mins",
          remarks: "Health tested transparently",
          icon: Battery,
        },
        {
          specification: "Conditions Accepted",
          details: "Brand New Sealed, Mint, Good, Broken",
          moreInfo: "Screen crack / Back glass accepted",
          remarks: "Honest market valuation",
          icon: Award,
        },
        {
          specification: "Buyback Security",
          details: "100% Certified Data Erasure",
          moreInfo: "Free 3-Hour Doorstep Pickup UAE",
          remarks: "Instant cash or bank wire",
          icon: ShieldCheck,
        },
      ];

  const tableSpecs = specs && specs.length > 0 ? specs : defaultSpecs;

  return (
    <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-6">
      {/* Navigation Tabs Bar matching Reference Image */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4 sm:gap-8 justify-start sm:justify-center no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("specs")}
          className={`pb-3.5 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "specs"
              ? "text-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Cpu size={16} />
          <span>Specifications & Details</span>
          {activeTab === "specs" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`pb-3.5 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "description"
              ? "text-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText size={16} />
          <span>Description</span>
          {activeTab === "description" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("process")}
          className={`pb-3.5 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "process"
              ? "text-blue-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck size={16} />
          <span>Reviews & Guarantee</span>
          {activeTab === "process" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        {faqs.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`pb-3.5 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "faqs"
                ? "text-blue-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <HelpCircle size={16} />
            <span>Product FAQs</span>
            {activeTab === "faqs" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        )}
      </div>

      {/* TAB CONTENT 1: SPECIFICATIONS TABLE (MATCHES REFERENCE DESIGN) */}
      {activeTab === "specs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Official Technical Specifications &amp; Buyback Criteria
              </h3>
              <p className="text-xs text-slate-500">
                Transparent verification points assessed by our licensed Dubai technician during collection.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Verified Against UAE Market Standard
            </span>
          </div>

          {/* Structured Table matching reference image design */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[620px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-1/4">Specification</th>
                  <th className="py-3.5 px-4 w-1/4">Details</th>
                  <th className="py-3.5 px-4 w-1/4">More Info</th>
                  <th className="py-3.5 px-4 w-1/4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {tableSpecs.map((row, idx) => {
                  const RowIcon = row.icon || Cpu;
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isEven ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <RowIcon size={13} />
                        </div>
                        <span>{row.specification}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">
                        {row.details}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {row.moreInfo}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                          <span>{row.remarks}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DESCRIPTION */}
      {activeTab === "description" && (
        <div className="space-y-4 max-w-4xl text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            About Selling Your {brand} {modelName} in Dubai &amp; UAE
          </h3>
          <p>
            {description ||
              `SellPhoneCash provides an effortless, transparent way to liquidate or upgrade your pre-owned ${brand} ${modelName}. Forget dealing with unpredictable classified listings, haggling WhatsApp messages, or lowball offline street shops in Deira. Our live automated valuation algorithm tracks current secondary market prices in the UAE to guarantee you the highest legitimate payout.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Truck size={14} className="text-emerald-600" />
                <span>Free 3-Hour Doorstep Pickup</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Our licensed courier meets you at your residence, workplace, or cafe anywhere in Dubai, Abu Dhabi, or Sharjah.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CreditCard size={14} className="text-emerald-600" />
                <span>Instant Cash or Bank Transfer</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Get paid on the spot in physical AED cash or an instant local wire transfer immediately upon diagnostic sign-off.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Military-Grade Data Wipe</span>
              </div>
              <p className="text-[11px] text-slate-500">
                All devices receive certified DoD 5220.22-M data sanitization, ensuring zero photos, messages, or files remain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PROCESS & REVIEWS */}
      {activeTab === "process" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Verified Seller Reviews &amp; Trust Ratings
              </h3>
              <p className="text-xs text-slate-500">
                Over 12,000 satisfied tech owners have traded in their devices across the UAE with a 4.9/5 satisfaction rate.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-amber-900">4.9 / 5.0 Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                name: "Omar Al-Mansoor",
                area: "Dubai Marina",
                review: "Booked collection for my iPhone at 11 AM, technician arrived at 1:15 PM in Marina. Tested FaceID, paid cash on spot. Zero hassle!",
                model: `${brand} ${modelName}`,
              },
              {
                name: "Sarah Jenkins",
                area: "Downtown Dubai",
                review: "Far better than Dubizzle lowballers. Locked the price online, courier honored the exact valuation with no bargaining.",
                model: `${brand} ${modelName}`,
              },
              {
                name: "Rajesh Sharma",
                area: "Business Bay",
                review: "Instant bank transfer directly to my ENBD account while the courier was right at my apartment door. Professional and swift.",
                model: `${brand} ${modelName}`,
              },
            ].map((rev, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic">"{rev.review}"</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900 block">{rev.name}</span>
                    <span className="text-slate-400">{rev.area}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Verified Sale
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: FAQS */}
      {activeTab === "faqs" && faqs.length > 0 && (
        <div className="space-y-3">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Frequently Asked Questions for {brand} {modelName}
            </h3>
            <p className="text-xs text-slate-500">
              Common questions answered regarding doorstep inspection, payouts, and data security.
            </p>
          </div>

          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-sm pr-3">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 bg-slate-50/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
