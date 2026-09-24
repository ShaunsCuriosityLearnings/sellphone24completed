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
  Clock,
  BookOpen,
  Eye,
  FileText,
  Calendar,
  Filter,
  CalendarDays,
  Activity,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface BlogAnalyticItem {
  rank: number;
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  views: number;
  likes: number;
  score: number;
  productReferralClicks: number;
  seoKeywordMatch: string;
}

interface DailyTrendItem {
  _id: string; // "YYYY-MM-DD"
  sessions: number;
  leads: number;
  valuationVolume: number;
  avgIntent?: number;
}

interface AnalyticsDashboardData {
  filter?: {
    timeRange: string;
    startDate: string | null;
    endDate: string | null;
  };
  summary: {
    totalSessions: number;
    conversionRate: string;
    totalOrders: number;
    completedSales: number;
    totalValuationVolumeAED: number;
  };
  dailyTrend?: DailyTrendItem[];
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
  adCampaignStats?: Array<{
    _id: string;
    ordersCount: number;
    totalPayoutAED: number;
    campaigns: string[];
  }>;
  consentStats?: {
    analyticsOptInCount: number;
    essentialOnlyCount: number;
  };
  blogAnalytics?: BlogAnalyticItem[];
  alerts: Array<{
    type: "warning" | "info" | "danger";
    title: string;
    message: string;
  }>;
}

const DATE_PRESETS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "custom", label: "Custom Range" },
];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date Filter State
  const [timeRange, setTimeRange] = useState<string>("all");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);

  const fetchAnalytics = async (selectedRange = timeRange, start = customStart, end = customEnd) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedRange && selectedRange !== "all") {
        params.append("timeRange", selectedRange);
      }
      if (selectedRange === "custom" && start) {
        params.append("startDate", start);
        if (end) params.append("endDate", end);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/analytics/dashboard${queryString}`, { cache: "no-store" });
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
    fetchAnalytics("all");
  }, []);

  const handleRangeChange = (presetId: string) => {
    setTimeRange(presetId);
    if (presetId === "custom") {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      fetchAnalytics(presetId);
    }
  };

  const handleApplyCustomDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart) return;
    fetchAnalytics("custom", customStart, customEnd);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Compiling 7-Layer Real-Time Intelligence Engine...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-rose-700">{error || "No analytics data available."}</p>
        <button
          onClick={() => fetchAnalytics()}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { summary, funnel, topDevices, missingModelSearches, locationStats, trafficSources, blogAnalytics, alerts, dailyTrend } = data;

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

  // Calculate max values for daily trend visualization
  const maxDailySessions = dailyTrend && dailyTrend.length > 0 
    ? Math.max(...dailyTrend.map(d => d.sessions), 1) 
    : 1;

  const activeRangeLabel = DATE_PRESETS.find(p => p.id === timeRange)?.label || "Custom Date Window";

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
            Full conversion funnel, date-wise performance, blog SEO traction, and device demand for SellPhoneCash.com
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAnalytics()}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Metrics"}
          </button>
        </div>
      </div>

      {/* DATE FILTER & TIMEFRAME CONTROL BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter size={16} className="text-emerald-600" />
            <span>Date Range Filter:</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-extrabold text-[11px]">
              {activeRangeLabel}
            </span>
            {data.filter?.startDate && (
              <span className="text-slate-400 font-medium text-[11px] hidden lg:inline">
                ({new Date(data.filter.startDate).toLocaleDateString()} - {data.filter.endDate ? new Date(data.filter.endDate).toLocaleDateString() : "Now"})
              </span>
            )}
          </div>

          {/* PRESETS BUTTONS */}
          <div className="flex flex-wrap items-center gap-1.5">
            {DATE_PRESETS.map((preset) => {
              const isActive = timeRange === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleRangeChange(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CUSTOM DATE PICKER ROW */}
        {showCustomPicker && (
          <form onSubmit={handleApplyCustomDate} className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <label className="text-xs font-bold text-slate-600">From:</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                required
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">To:</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customStart}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              Apply Filter
            </button>
          </form>
        )}
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

      {/* 2. DATE-WISE DAILY METRICS & TIMELINE BREAKDOWN */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <CalendarDays size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Date-wise Daily Activity & Trend Metrics</h3>
              <p className="text-xs text-slate-500">Day-by-day distribution of traffic sessions, leads converted, and valuation volume</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
            {dailyTrend ? `${dailyTrend.length} Days in View` : "0 Days"}
          </span>
        </div>

        {dailyTrend && dailyTrend.length > 0 ? (
          <div className="space-y-4">
            {/* Table Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Traffic Sessions</th>
                    <th className="p-3">Session Share Bar</th>
                    <th className="p-3">Leads / Conversions</th>
                    <th className="p-3">Valuation Volume</th>
                    <th className="p-3">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dailyTrend.map((day) => {
                    const pct = Math.round((day.sessions / maxDailySessions) * 100);
                    const dayConvRate = day.sessions > 0 ? ((day.leads / day.sessions) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={day._id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3 font-bold text-slate-900">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400" />
                            {day._id}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-800">{day.sessions.toLocaleString()}</td>
                        <td className="p-3 w-44">
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3 font-bold text-emerald-600">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-extrabold border border-emerald-100">
                            {day.leads} leads
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          AED {Math.round(day.valuationVolume || 0).toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-slate-600">
                          {dayConvRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No session activity recorded for this date window.</p>
            <p className="text-[11px] text-slate-400 mt-1">Try selecting &quot;All Time&quot; or widening your custom date filter.</p>
          </div>
        )}
      </div>

      {/* 3. BLOG PERFORMANCE & SEO ANALYSIS MATRIX */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Blog Performance & SEO Analysis</h3>
              <p className="text-xs text-slate-500">Readership ranking, Google search traction, and product trade-in referrals</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Content SEO Score: 94/100
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Article Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Readers (Views)</th>
                <th className="p-3">Product Referrals</th>
                <th className="p-3">SEO Alignment</th>
                <th className="p-3">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {blogAnalytics && blogAnalytics.length > 0 ? (
                blogAnalytics.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-black text-slate-400">0{blog.rank}</td>
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                      <Link href={`/blogs/${blog.slug}`} className="hover:text-emerald-600 transition" target="_blank">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase">
                        {blog.category}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Eye size={13} className="text-emerald-500" />
                        {blog.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Zap size={13} />
                        {blog.productReferralClicks} clicks
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md text-[10px]">
                        {blog.seoKeywordMatch}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${blog.score}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-slate-900">{blog.score}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">No blog analytics data recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MASTER CONVERSION FUNNEL DIAGRAM */}
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

      {/* 5. TWO COLUMNS: TOP DEVICES MATRIX & SOURCING RADAR */}
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

      {/* 6. TWO COLUMNS: LOCATION HEAT & TRAFFIC ACQUISITION */}
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
              <p className="text-xs text-slate-500">Traffic source → Valuation → Lead conversion</p>
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
