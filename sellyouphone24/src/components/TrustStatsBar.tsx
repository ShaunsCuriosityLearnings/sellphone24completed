import { ShieldCheck, Truck, Award, Calendar, PhoneCall, CheckCircle2 } from "lucide-react";

export default function TrustStatsBar() {
  return (
    <section className="bg-slate-900 text-white rounded-[32px] p-6 md:p-8 shadow-xl my-8 border border-slate-800">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
        
        {/* Item 1 */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <PhoneCall size={20} />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-white">25,000+</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Phones Purchased</p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Calendar size={20} />
          </div>
          <h4 className="text-xl md:text-2xl font-black text-white">Since 2014</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">10+ Years Trust</p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Award size={20} />
          </div>
          <h4 className="text-base md:text-lg font-bold text-emerald-400">They&apos;ve Survived</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Built on Reliability</p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-base md:text-lg font-bold text-white">Licensed UAE</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Official Business</p>
        </div>

        {/* Item 5 */}
        <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
            <Truck size={20} />
          </div>
          <h4 className="text-base md:text-lg font-bold text-white">Free Doorstep Pickup</h4>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Across Dubai & UAE</p>
        </div>

      </div>
    </section>
  );
}
