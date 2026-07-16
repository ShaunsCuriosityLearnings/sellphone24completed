import { Recycle, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | SellYourPhone24",
  description: "Learn about the mission of SellYourPhone24. We are Dubai's top electronic buyback platform, committed to circular tech recycling and instant payouts.",
};

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 text-slate-800">
      
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Pioneering Sustainable <br />
          <span className="text-emerald-500">Tech Buybacks in the UAE</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          We simplify device resale to help UAE residents clear out drawers, unlock value, and save our environment.
        </p>
      </div>

      {/* Core Values grid */}
      <div className="grid md:grid-cols-3 gap-6 pt-6">
        
        {/* Value 1 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Recycle size={24} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Circular Economy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We are dedicated to extending the lifespan of mobile devices. Every phone we purchase is either responsibly refurbished or cleanly harvested for materials.
          </p>
        </div>

        {/* Value 2 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Secured Data Wipe</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data security is our top priority. We implement military-grade sanitization procedures to guarantee all user records are erased from all purchased tech.
          </p>
        </div>

        {/* Value 3 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Award size={24} />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Transparent Valuation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No hidden deductions or bait-and-switch pricing. Our real-time calculator is backed by secondary market analytics to give you competitive payouts.
          </p>
        </div>

      </div>

      {/* Our Mission Detail Section */}
      <div className="bg-slate-900 text-white rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Environmental Footprint Goal</h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Every year, millions of electronic units find their way to landfill grounds globally, leaking nickel, lithium, and lead into ecological networks. Our goal is to make recycling so seamless that it becomes the default choice in Dubai, Abu Dhabi, and the rest of the UAE. Through local collections, we hope to redirect 100,000 devices away from dump yards by 2028.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="bg-slate-850 p-6 rounded-3xl border border-slate-800 text-center space-y-2">
              <span className="text-4xl">🌵</span>
              <h4 className="font-bold text-xs text-white">Save UAE Deserts</h4>
              <p className="text-[10px] text-slate-400">Join our clean recycling program today.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ shortcut CTA */}
      <div className="text-center pt-8 border-t border-slate-100 space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base">Ready to sell your used device?</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Get a quote and schedule a free pickup from your home. We pay cash instantly.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs transition cursor-pointer"
        >
          Explore Supported Devices
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
};

export default AboutPage;
