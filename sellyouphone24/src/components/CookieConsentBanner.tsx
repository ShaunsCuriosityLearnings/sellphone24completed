"use client";

import { useEffect, useState } from "react";
import { X, Lock, Check, Cookie } from "lucide-react";
import { cookieConsent } from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [marketingOptIn, setMarketingOptIn] = useState(true);

  useEffect(() => {
    const prefs = cookieConsent.getPreferences();
    if (!prefs.hasAnswered) {
      // Delay presentation slightly for smooth UX
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    cookieConsent.acceptAll();
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    cookieConsent.rejectNonEssential();
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    cookieConsent.setPreferences(analyticsOptIn, marketingOptIn);
    setShowModal(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* COMPACT FLOATING COOKIE CARD MATCHING REFERENCE DESIGN */}
      <div className="fixed bottom-6 left-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-96 animate-in slide-in-from-bottom-6 fade-in duration-300">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-6 text-slate-900 space-y-4">
          
          {/* HEADER WITH CLOSE X BUTTON */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Cookies Settings
            </h3>
            <button
              onClick={handleEssentialOnly}
              className="p-1 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* DESCRIPTION BODY TEXT */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience on SellPhoneCash.com. By clicking accept, you agree to this, as outlined in our Privacy Policy.
          </p>

          {/* BUTTONS ROW */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleAcceptAll}
              className="w-full bg-[#1c1e2e] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer text-center shadow-xs"
            >
              Accept
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer text-center"
            >
              Preferences
            </button>
          </div>

        </div>
      </div>

      {/* PREFERENCES MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Cookie className="text-slate-900" size={20} />
                <h3 className="font-extrabold text-base text-slate-900">Cookie & Telemetry Preferences</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* 1. Essential */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Lock size={14} className="text-emerald-600" />
                    Essential & System Cookies
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Required for basic site navigation, secure authentication, and trade-in list storage. Always active.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0">
                  Always Active
                </span>
              </div>

              {/* 2. Analytics */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-slate-900">Analytics & Device Demand Radar</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Helps us track device trade-in drop-off steps, popular models, and missing device search demand.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsOptIn}
                  onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                  className="w-5 h-5 accent-slate-900 rounded-md cursor-pointer shrink-0 mt-0.5"
                />
              </div>

              {/* 3. Marketing */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-slate-900">Marketing & Campaign Attribution</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Enables Google Ads, Meta/Instagram Pixel, and campaign attribution (UTMs) to measure ad performance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="w-5 h-5 accent-slate-900 rounded-md cursor-pointer shrink-0 mt-0.5"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check size={14} /> Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

