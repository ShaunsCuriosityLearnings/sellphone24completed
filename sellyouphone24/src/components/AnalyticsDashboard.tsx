"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Smartphone, 
  DollarSign, 
  Search, 
  MapPin, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
  Award,
  Clock
} from "lucide-react";

interface AnalyticsDashboardData {
  summary: {
    totalSessions: number;
    conversionRate: string;
    totalOrders: number;
    completedSales: number;
    totalValuationVolumeAED: number;
  };
  funnel: {
    visitors: number;
    browsed: number;
    valuationStarted: number;
    valuationCompleted: number;
    offerViewed: number;
    offerAccepted: number;
    pickupRequested: number;
    completedSales: number;
  };
  topDevices: Array<{
    _id: string;
    brand: string;
    valuations: number;
    offerAccepted: number;
    pickups: number;
    avgValuation: number;
  }>;
  missingModelSearches: Array<{
    _id: string;
    count: number;
    lastSearched: string;
  }>;
  locationStats: Array<{
    _id: string;
    sessions: number;
    converted: number;
  }>;
  trafficSources: Array<{
    _id: string;
    sessions: number;
    valuations: number;
    conversions: number;
    avgIntentScore: number;
  }>;
  alerts: Array<{
    type: "warning" | "info" | "danger";
    title: string;
    message: string;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("Analytics fetch failed:", err);
      setError("Failed to load live analytics data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Compiling 6-Layer Real-Time Intelligence Engine...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-rose-700">{error || "No analytics data available."}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { summary, funnel, topDevices, missingModelSearches, locationStats, trafficSources, alerts } = data;

  const funnelSteps = [
    { label: "1. Unique Visitors", count: funnel.visitors, color: "bg-slate-800" },
    { label: "2. Browsed Device", count: funnel.browsed, color: "bg-blue-600" },
    { label: "3. Started Valuation", count: funnel.valuationStarted, color: "bg-indigo-600" },
    { label: "4. Completed Valuation", count: funnel.valuationCompleted, color: "bg-purple-600" },
    { label: "5. Viewed Offer", count: funnel.offerViewed, color: "bg-teal-600" },
    { label: "6. Accepted Offer", count: funnel.offerAccepted, color: "bg-emerald-600" },
    { label: "7. Pickup Requested", count: funnel.pickupRequested, color: "bg-amber-500" },
    { label: "8. Completed Payout", count: funnel.completedSales, color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-8 w-full text-slate-800">
      
      {/* HEADER & REFRESH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            Live Real-Time Telemetry
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Analytics & Intelligence Hub</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full conversion funnel, pricing elasticity, and device demand insights for SellPhoneCash.com
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer shadow-md"
        >
          <RefreshCw size={14} />
          Refresh Metrics
        </button>
      </div>

      {/* SYSTEM ALERTS PANEL */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                alert.type === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider">{alert.title}</h4>
                <p className="text-xs mt-0.5 leading-normal">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. TOP STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Traffic Sessions</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{summary.totalSessions.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session-to-Lead Conv.</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{summary.conversionRate}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Smartphone size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{summary.totalOrders}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valuation AED Volume</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">AED {summary.totalValuationVolumeAED.toLocaleString()}</h3>
          </div>
        </div>

      </div>

      {/* 2. MASTER CONVERSION FUNNEL DIAGRAM */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Master Seller Conversion Funnel</h3>
            <p className="text-xs text-slate-500">Step-by-step visitor conversion progression and drop-off diagnosis</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            End-to-End Tracking Active
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {funnelSteps.map((step, idx) => {
            const maxVal = Math.max(funnel.visitors, 1);
            const pct = Math.round((step.count / maxVal) * 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span>{step.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{step.count.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-bold">({pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
                  <div
                    className={`h-full ${step.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TWO COLUMNS: TOP DEVICES MATRIX & SOURCING RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TOP DEVICES TABLE */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Top Valued Devices Performance</h3>
              <p className="text-xs text-slate-500">Highest volume models checked & sold by visitors</p>
            </div>
            <span className="text-xs font-bold text-slate-500">Top 10</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Device Model</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Valuations</th>
                  <th className="p-3">Offers Accepted</th>
                  <th className="p-3">Avg Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {topDevices && topDevices.length > 0 ? (
                  topDevices.map((dev, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-bold text-slate-900">{dev._id || "Generic Model"}</td>
                      <td className="p-3 text-slate-600">{dev.brand || "Apple"}</td>
                      <td className="p-3 font-semibold text-slate-800">{dev.valuations}</td>
                      <td className="p-3 font-semibold text-emerald-600">{dev.offerAccepted}</td>
                      <td className="p-3 font-bold text-slate-900">AED {Math.round(dev.avgValuation || 0).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">No device valuation data recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SOURCING RADAR (MISSING PRODUCT DEMAND) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sourcing Demand Radar</h3>
              <p className="text-xs text-slate-500">Unlisted models searched by visitors</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {missingModelSearches && missingModelSearches.length > 0 ? (
              missingModelSearches.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 capitalize block">{item._id}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Demand signal</span>
                  </div>
                  <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl">
                    {item.count} searches
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center">No missing device search queries recorded yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. TWO COLUMNS: LOCATION HEAT & TRAFFIC ACQUISITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* UAE LOCATION HEATMAP */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">UAE Location Demand Heat</h3>
              <p className="text-xs text-slate-500">Visitor & lead volume by City / Emirate</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {locationStats && locationStats.length > 0 ? (
              locationStats.map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800">{loc._id || "Dubai"}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{loc.sessions} sessions</span>
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-lg">{loc.converted} leads</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center">No location stats recorded yet.</p>
            )}
          </div>
        </div>

        {/* TRAFFIC SOURCE & UTM ATTRIBUTION */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Acquisition Channel Attribution</h3>
              <p className="text-xs text-slate-500">Traffic source $\rightarrow$ Valuation $\rightarrow$ Lead conversion</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {trafficSources && trafficSources.length > 0 ? (
              trafficSources.map((src, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block capitalize">{src._id || "Organic / Direct"}</span>
                    <span className="text-[10px] text-slate-400">Avg Intent Score: {Math.round(src.avgIntentScore || 0)}/100</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{src.sessions} visits</span>
                    <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-lg">{src.conversions} leads</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center">No traffic attribution data recorded yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
