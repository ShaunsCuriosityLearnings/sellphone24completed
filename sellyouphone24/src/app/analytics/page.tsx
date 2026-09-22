"use client";

import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft size={16} /> Admin Portal
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="text-emerald-500" size={24} />
              SellPhoneCash Analytics & Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live conversion funnel, device demand radar, price elasticity, and UAE location heat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck size={14} /> Live Telemetry System
          </span>
        </div>
      </div>

      {/* Embedded Master Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  );
}
