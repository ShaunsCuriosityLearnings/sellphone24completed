"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Zap, Banknote, ArrowRight, CheckCircle2 } from "lucide-react";

interface ProcessVideosSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function ProcessVideosSection({
  title = "Watch How the SellPhoneCash Process Works",
  subtitle = "From getting your instant online valuation to doorstep pickup and receiving cash in your hand in under 3 hours across Dubai & the UAE.",
  badge = "Process In Action • Real Doorstep Video",
  className = "",
}: ProcessVideosSectionProps) {
  // Video 1 ref & states (Landscape 16:9)
  const video1Ref = useRef<HTMLVideoElement>(null);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isMuted1, setIsMuted1] = useState(true);

  // Video 2 ref & states (Portrait 9:16)
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isMuted2, setIsMuted2] = useState(true);

  const togglePlay1 = () => {
    if (!video1Ref.current) return;
    if (isPlaying1) {
      video1Ref.current.pause();
      setIsPlaying1(false);
    } else {
      video1Ref.current.play();
      setIsPlaying1(true);
    }
  };

  const toggleMute1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video1Ref.current) return;
    video1Ref.current.muted = !isMuted1;
    setIsMuted1(!isMuted1);
  };

  const togglePlay2 = () => {
    if (!video2Ref.current) return;
    if (isPlaying2) {
      video2Ref.current.pause();
      setIsPlaying2(false);
    } else {
      video2Ref.current.play();
      setIsPlaying2(true);
    }
  };

  const toggleMute2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video2Ref.current) return;
    video2Ref.current.muted = !isMuted2;
    setIsMuted2(!isMuted2);
  };

  return (
    <section className={`w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl md:rounded-[40px] p-5 sm:p-8 md:p-12 shadow-2xl border border-slate-800 relative overflow-hidden ${className}`}>
      
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8 sm:space-y-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title.includes("SellPhoneCash") ? (
              <>
                {title.split("SellPhoneCash")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  SellPhoneCash
                </span>
                {title.split("SellPhoneCash")[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 2-Column Responsive Video Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* VIDEO 1: Landscape 16:9 - Complete Doorstep Selling Walkthrough (7 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-xs flex flex-col justify-between">
            
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  Complete Process Walkthrough
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                16:9 Widescreen
              </span>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner group">
              <video
                ref={video1Ref}
                src="/videos/video1.mp4"
                playsInline
                preload="metadata"
                controls
                muted={isMuted1}
                onPlay={() => setIsPlaying1(true)}
                onPause={() => setIsPlaying1(false)}
                className="w-full h-full object-cover"
              />

              {/* Floating Mute/Unmute Quick Toggle */}
              <button
                onClick={toggleMute1}
                aria-label={isMuted1 ? "Unmute video" : "Mute video"}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition shadow-md"
              >
                {isMuted1 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              {/* Initial Large Play Overlay when paused */}
              {!isPlaying1 && (
                <div
                  onClick={togglePlay1}
                  className="absolute inset-0 z-10 bg-black/30 hover:bg-black/20 flex items-center justify-center cursor-pointer transition"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform hover:scale-110 transition duration-200">
                    <Play size={24} className="ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>

            {/* Step Checkpoints underneath Video 1 */}
            <div className="space-y-2 pt-1">
              <h4 className="text-sm font-bold text-white">How It Works in 3 Quick Steps:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] font-medium leading-tight">1. Instant Valuation Quote</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] font-medium leading-tight">2. Free Doorstep Pickup</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-[11px] font-medium leading-tight">3. Cash on the Spot</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* VIDEO 2: Portrait 9:16 - Doorstep Handover & Instant Cash (5 cols)        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-xs flex flex-col justify-between">
            
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-xs">⚡</span>
                <span className="text-xs font-bold text-white tracking-wide">
                  Doorstep Handover & Cash
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Short Reel Guide
              </span>
            </div>

            {/* Mobile / Reel Mockup Frame */}
            <div className="flex justify-center w-full py-1">
              <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] rounded-[28px] overflow-hidden bg-black border-4 border-slate-800 shadow-2xl group">
                <video
                  ref={video2Ref}
                  src="/videos/video2.mp4"
                  playsInline
                  preload="metadata"
                  controls
                  muted={isMuted2}
                  onPlay={() => setIsPlaying2(true)}
                  onPause={() => setIsPlaying2(false)}
                  className="w-full h-full object-cover"
                />

                {/* Floating Mute/Unmute Quick Toggle */}
                <button
                  onClick={toggleMute2}
                  aria-label={isMuted2 ? "Unmute video" : "Mute video"}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/10 transition shadow-md"
                >
                  {isMuted2 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {/* Initial Large Play Overlay when paused */}
                {!isPlaying2 && (
                  <div
                    onClick={togglePlay2}
                    className="absolute inset-0 z-10 bg-black/30 hover:bg-black/20 flex items-center justify-center cursor-pointer transition"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform hover:scale-110 transition duration-200">
                      <Play size={22} className="ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Reel Bullet Points */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-[11px] font-semibold text-slate-200">Service Coverage</span>
                <span className="text-[11px] text-emerald-400 font-bold">All 7 Emirates</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-[11px] font-semibold text-slate-200">Average Pickup Time</span>
                <span className="text-[11px] text-white font-bold">Within 3 Hours</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-[11px] font-semibold text-slate-200">Payment Method</span>
                <span className="text-[11px] text-emerald-400 font-bold">Instant Cash / Bank</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Call-to-Action Bar */}
        <div className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm sm:text-base">
              Ready to experience the easiest tech sale in the UAE?
            </h4>
            <p className="text-xs text-slate-400">
              Get an accurate quote in 30 seconds. No hidden fees, free doorstep collection.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/services"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Zap size={14} />
              Calculate My Price
            </Link>
            <Link
              href="/sell-any-device"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition border border-slate-700 flex items-center gap-1.5"
            >
              Custom Request
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
