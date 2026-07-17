import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full rounded-[40px] overflow-hidden bg-gradient-to-b from-emerald-50 to-white border border-emerald-100/50 mb-12 isolate">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-200/40 blur-[80px] mix-blend-multiply" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/3">
        <div className="w-[500px] h-[500px] rounded-full bg-teal-100/60 blur-[60px] mix-blend-multiply" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 items-center">
        {/* Text Content */}
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-emerald-600 text-xs font-bold tracking-wide uppercase">
            Precise Evaluation Guaranteed
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Turn Your Old Devices Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Instant Cash</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-lg leading-relaxed">
            Experience the simplest way to sell your tech. Free doorstep collection, instant valuation, and same-day payment across the UAE.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/services"
              className="group flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 w-full sm:w-auto"
            >
              Get Instant Quote
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-4 px-4 text-sm font-medium text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p>Trusted by 10k+<br />happy customers</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-6 mt-6 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
              <CheckCircle2 size={18} className="text-emerald-500" /> Free Pickup
            </div>
            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
              <Shield size={18} className="text-emerald-500" /> Secure Data Wipe
            </div>
          </div>
        </div>

        {/* Visual Content */}
        <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center lg:justify-end z-10">
          <div className="relative w-full max-w-md aspect-square">
            {/* Glassmorphism Card Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-2xl rotate-6 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-white/60 backdrop-blur-2xl border border-white shadow-xl rounded-[40px] -rotate-3" />

            {/* Main Image */}
            <div className="absolute inset-0 z-20 flex items-center justify-center group">
              <div className="relative w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-500 ease-out">
                <Image
                  src="/products/iphone 17 pro max 💖.jpg"
                  alt="Sell your Smartphone"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Floating Price Tag */}
            <div className="absolute top-8 right-0 z-30 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 animate-bounce">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Up to</p>
              <p className="text-2xl font-black text-emerald-500">AED 3,200</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
