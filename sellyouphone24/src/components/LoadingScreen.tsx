"use client";

import React from "react";
import { Smartphone, Sparkles, Zap } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  subtext = "Instant Valuation & Doorstep Payouts",
  fullScreen = true,
}: LoadingScreenProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-xl text-white transition-opacity duration-300 pointer-events-auto"
    : "relative w-full min-h-[350px] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-lg text-white rounded-3xl p-8 border border-sky-500/20";

  return (
    <div className={containerClasses}>
      {/* Background Ambient Glow & Blue Shadow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-400/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Glassmorphic Central Card with Deep Blue Shadow */}
      <div className="relative z-10 bg-slate-900/75 border border-sky-500/30 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center max-w-sm w-[90%] shadow-[0_0_90px_rgba(37,99,235,0.4),0_20px_50px_rgba(2,6,23,0.7)]">
        {/* Animated Multi-Ring Spinner Container */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          {/* Glowing Ambient Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-sky-400/30 blur-md animate-pulse" />

          {/* Outer Spin Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-400 border-r-blue-500 border-b-sky-300/40 animate-spin" />

          {/* Inner Counter-Spin Ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-cyan-400 border-l-blue-400 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
          />

          {/* Core Device / Sparkle Icon */}
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/40">
            <Smartphone className="w-6 h-6 text-white animate-pulse" />
          </div>

          {/* Orbiting Sparkling Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/50 animate-bounce">
            <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
          </div>
        </div>

        {/* Branding & Status Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            <span>SellPhoneCash</span>
          </div>

          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-200">
            {message}
          </h3>

          <p className="text-xs text-slate-400 max-w-[220px] mx-auto leading-relaxed">
            {subtext}
          </p>
        </div>

        {/* Animated Speed Shimmer Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-6 border border-sky-500/20">
          <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 w-1/2 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
