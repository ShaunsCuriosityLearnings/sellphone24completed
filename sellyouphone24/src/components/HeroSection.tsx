import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import QuickEvaluationWidget from "@/components/QuickEvaluationWidget";

const HeroSection = () => {
  return (
    <section className="relative w-full rounded-[40px] overflow-hidden bg-gradient-to-b from-emerald-50 via-teal-50/20 to-white border border-emerald-100/50 mb-8 isolate">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-200/40 blur-[80px] mix-blend-multiply" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/3">
        <div className="w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-[60px] mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-8 space-y-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-600 text-xs font-bold tracking-wide uppercase">
              ⚡ Instant Cash Valuation UAE
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Turn Your Old Devices Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Instant Cash</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
              Experience the simplest way to sell your tech. Free doorstep collection, instant valuation, and same-day payment across the UAE.
            </p>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                <CheckCircle2 size={18} className="text-emerald-500" /> Free Pickup
              </div>
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                <Shield size={18} className="text-emerald-500" /> Secure Data Wipe
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative h-[320px] md:h-[400px] w-full flex items-center justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-md aspect-square">
              {/* Glassmorphism Card Behind */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-2xl rotate-6 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] -rotate-3" />

              {/* Main Image */}
              <div className="absolute inset-0 z-20 flex items-center justify-center group">
                <div className="relative w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-500 ease-out">
                  <Image
                    src="/products/iphone-pro-max.jpg"
                    alt="Sell your Smartphone"
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating Price Tag */}
              <div className="absolute top-4 right-0 z-30 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 animate-bounce">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Up to</p>
                <p className="text-2xl font-black text-emerald-500">AED 3,780</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Quick Evaluation Cascading Dropdowns */}
        <div className="pt-2">
          <QuickEvaluationWidget />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
