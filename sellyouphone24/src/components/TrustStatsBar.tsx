import { ShieldCheck, Truck, Award, Calendar, PhoneCall, CheckCircle2 } from "lucide-react";

export default function TrustStatsBar() {
  return (
    <section className="bg-slate-900 text-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 shadow-xl my-6 sm:my-10 border border-slate-800 relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* MOBILE LAYOUT (2-Column Grid + Full Width Banner) */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          
          {/* Card 1 */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <PhoneCall size={18} />
            </div>
            <h4 className="text-lg font-black text-white">25,000+</h4>
            <p className="text-[10px] text-slate-300 font-semibold leading-tight">Phones Purchased</p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <h4 className="text-lg font-black text-white">Since 2014</h4>
            <p className="text-[10px] text-slate-300 font-semibold leading-tight">10+ Years Trust</p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Award size={18} />
            </div>
            <h4 className="text-xs font-bold text-emerald-400">They&apos;ve Survived</h4>
            <p className="text-[10px] text-slate-300 font-semibold leading-tight">Built on Reliability</p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-xs font-bold text-white">Licensed UAE</h4>
            <p className="text-[10px] text-slate-300 font-semibold leading-tight">Official Business</p>
          </div>

        </div>

        {/* Card 5: Full Width Mobile Feature Banner */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-3.5 flex items-center justify-center gap-3 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
            <Truck size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-extrabold text-white">Free Doorstep Pickup</h4>
            <p className="text-[10px] text-emerald-300 font-medium">Within 3 Hours Across Dubai & All Emirates</p>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (5-Column Grid with Dividers) */}
      <div className="hidden md:grid md:grid-cols-5 gap-6 text-center divide-x divide-slate-800 items-center">
        
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <PhoneCall size={20} />
          </div>
          <h4 className="text-2xl font-black text-white">25,000+</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Phones Purchased</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Calendar size={20} />
          </div>
          <h4 className="text-2xl font-black text-white">Since 2014</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">10+ Years Trust</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Award size={20} />
          </div>
          <h4 className="text-lg font-bold text-emerald-400">They&apos;ve Survived</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Built on Reliability</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">Licensed UAE</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Official Business</p>
        </div>

        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Truck size={20} />
          </div>
          <h4 className="text-lg font-bold text-white">Free Doorstep Pickup</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Across Dubai & UAE</p>
        </div>

      </div>
    </section>
  );
}
