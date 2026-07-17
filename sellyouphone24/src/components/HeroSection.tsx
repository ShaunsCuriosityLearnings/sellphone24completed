import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, ShieldCheck, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 rounded-[32px] md:rounded-[40px] shadow-2xl mb-12">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-slate-900 to-slate-950" />
      
      <div className="relative z-10 grid lg:grid-cols-2 items-center min-h-[400px] lg:min-h-[480px]">
        {/* Left Content */}
        <div className="p-8 md:p-12 lg:p-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BadgeCheck size={14} />
            UAE&apos;s #1 Buyback Platform
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white" style={{ fontFamily: "var(--font-poppins)" }}>
            Get <span className="text-emerald-400">Top Value</span> for Your Used Devices
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-md leading-relaxed">
            Upgrade your tech or get instant cash. We offer the best market rates with free doorstep pickup across Dubai, Abu Dhabi, and the UAE.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-8 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Get Instant Quote
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
              <Zap className="text-emerald-500" size={16} /> Instant Payout
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
              <ShieldCheck className="text-emerald-500" size={16} /> Secure Data Wipe
            </div>
          </div>
        </div>

        {/* Right Image/Graphic Area */}
        <div className="relative h-full hidden lg:flex items-center justify-center p-12 overflow-hidden bg-gradient-to-l from-emerald-900/10 to-transparent">
          <div className="relative w-full aspect-square max-w-md">
            {/* Main Phone Image */}
            <div className="absolute inset-0 z-20 hover:scale-105 transition-transform duration-700 ease-out">
              <Image
                src="/products/iphone 17 pro max 💖.jpg"
                alt="Premium Smartphone Trade-in"
                fill
                priority
                className="object-contain drop-shadow-[0_0_60px_rgba(16,185,129,0.4)]"
              />
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full border border-emerald-500/10 animate-[spin_40s_linear_infinite_reverse]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
