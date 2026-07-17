import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import ProductList from "@/components/ProductList";
import { brands } from "@/data/mockData";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Smartphone, BadgePercent, CheckCircle2, Eye, Calendar } from "lucide-react";
import { api } from "@/lib/api";

const Homepage = async () => {
  const blogs = await api.getBlogs();
  const latestBlogs = blogs.slice(0, 2);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <HeroSection />

      {/* Services Grid */}
      <ServicesGrid />

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            Sell Your Device in <span className="text-emerald-500">3 Easy Steps</span>
          </h2>
          <p className="text-sm text-slate-500">
            Our streamlined process gets you paid instantly, right from your home or office in the UAE.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4 p-4 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-inner">
              01
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Select Your Device</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Find your phone, tablet, or smartwatch model and select its storage size, color, and condition details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4 p-4 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-inner">
              02
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Get Instant Quote</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Our real-time price calculator will display the maximum valuation for your device. Accept the quote to book a slot.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4 p-4 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-inner">
              03
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Free Pickup & Pay</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Our courier will meet you at your preferred time to verify the device specs and transfer the payout instantly.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Shop by Brand</h2>
            <p className="text-sm text-slate-500">Choose a brand to see available buyback devices</p>
          </div>
          <Link href="/services" className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
            See All Brands
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/services/smartphones/${brand.slug}`}
              className="bg-white border border-slate-100 hover:border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center text-center justify-center hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{brand.logo}</span>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-500 transition-colors text-sm md:text-base">
                {brand.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Get Top Value →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR MODELS */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Popular Devices We Buy</h2>
          <p className="text-sm text-slate-500">Instantly sell these trending models at premium rates</p>
        </div>
        
        {/* Render ProductList configured for homepage limit */}
        <ProductList params="homepage" />
      </section>

      {/* GREEN RECYCLING CORNER & STATISTICS */}
      <section className="bg-slate-900 rounded-[40px] text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-900 to-slate-900" />
        <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              ♻️ Green E-waste Management
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Join the Circular Economy & Save the UAE Environment
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Electronic waste is one of the fastest-growing environmental concerns in the region. By selling your old devices on SellYourPhone24, you ensure they are either safely refurbished and given a second life, or responsively recycled for materials, keeping hazardous heavy metals out of landfill systems.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-emerald-400">12.5k+</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Devices Refurbished</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-emerald-400">4.2 Tons</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Carbon Offset Saved</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-emerald-400">AED 18M+</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Valuations Paid Out</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-48 h-48 bg-slate-800 rounded-[35px] border border-slate-700 flex items-center justify-center flex-col p-6 text-center space-y-3">
              <span className="text-5xl">🌱</span>
              <h3 className="font-extrabold text-sm text-white">ISO 14001 Certified</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Our recycling channels comply with UAE federal e-waste standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REPLICATED BLOG HIGHLIGHTS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Latest from Tech & Recycling Blogs</h2>
            <p className="text-sm text-slate-500">Expert guides on device care, security, and market price trends</p>
          </div>
          <Link href="/blogs" className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
            See All Articles
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {latestBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="bg-white border border-slate-100 hover:border-emerald-500/20 hover:shadow-lg rounded-3xl p-6 flex flex-col sm:flex-row gap-5 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative w-full sm:w-1/3 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                <Image src={blog.img} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-500">{blog.category}</span>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{blog.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(blog.createdAt || new Date()).toLocaleDateString()}
                  </span>
                  <span>By {blog.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-slate-100/50 border border-slate-200/50 rounded-[40px] p-8 md:p-12 space-y-10">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">What UAE Sellers Say</h2>
          <p className="text-xs text-slate-500">Hear from thousands of satisfied customers in Dubai, Abu Dhabi & Sharjah.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Had an outstanding experience. Got an instant price estimate for my iPhone 14 Pro, the driver picked it up from Dubai Marina within 4 hours, and bank transfer cleared on the spot!&quot;
            </p>
            <div>
              <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">★★★★★</div>
              <h4 className="font-bold text-xs text-slate-800">Sarah M.</h4>
              <p className="text-[9px] text-slate-400 uppercase font-semibold">Dubai resident</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;The best way to sell old tech. Highly professional courier. Handed my old iPad and received cash instantly. Fully recommended instead of dealing with random buyers online.&quot;
            </p>
            <div>
              <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">★★★★★</div>
              <h4 className="font-bold text-xs text-slate-800">Tariq A.</h4>
              <p className="text-[9px] text-slate-400 uppercase font-semibold">Abu Dhabi resident</p>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Great support team. Walked me through deleting my iCloud accounts properly. Courier verified the condition fast and payment arrived in minutes.&quot;
            </p>
            <div>
              <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">★★★★★</div>
              <h4 className="font-bold text-xs text-slate-800">Faisal K.</h4>
              <p className="text-[9px] text-slate-400 uppercase font-semibold">Sharjah resident</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm space-y-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">How is my device valuation calculated?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your valuation is based on your device model, storage capacity, and its current physical condition. We monitor secondary markets in the UAE daily to offer you competitive market rates.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Do I need to erase my personal data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Yes, we strongly recommend backing up and performing a full factory reset before handover. Read our detailed guide on the Blogs page. Additionally, our pickup agents verify that Activation lock is disabled.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Is doorstep pickup really free?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Yes, absolutely! Doorstep pickup is 100% free across all Emirates (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, and UAQ) at your preferred time slot.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">How soon do I receive my payment?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cash payments are handed over instantly. Bank transfers are initialized during pickup and clear same-day (usually within minutes depending on UAE Central Bank instant transfer support).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
