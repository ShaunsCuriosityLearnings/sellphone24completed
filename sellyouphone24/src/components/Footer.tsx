import Link from "next/link";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-md space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-505 bg-emerald-500 flex items-center justify-center font-bold text-slate-900">
                S
              </div>
              <span className="font-bold text-xl tracking-tight">
                SellYourPhone<span className="text-emerald-500">24</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              SellYourPhone24 is the UAE&apos;s premier platform for selling used smartphones, tablets, and smartwatches. We make it easy to get an instant valuation, enjoy free doorstep pickup, and receive immediate payouts, all while promoting environmental sustainability through device recycling.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Recycle size={16} />
              100% Eco-Friendly Recycling Partner
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold text-white mb-4">Sell Devices</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/services/smartphones/apple" className="hover:text-emerald-400 transition">Sell iPhone</Link>
                </li>
                <li>
                  <Link href="/services/smartphones/samsung" className="hover:text-emerald-400 transition">Sell Samsung</Link>
                </li>
                <li>
                  <Link href="/services/smartphones/google" className="hover:text-emerald-400 transition">Sell Google Pixel</Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-emerald-400 transition">All Services</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="hover:text-emerald-400 transition">About Us</Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-emerald-400 transition">Blogs & News</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-emerald-400 transition">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support & Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/privacy-policy" className="hover:text-emerald-400 transition">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-emerald-400 transition">Help & FAQs</Link>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin size={12} className="text-emerald-400" />
                  Dubai Silicon Oasis, UAE
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-950 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Keep up with tech news</h3>
              <p className="text-sm text-slate-400 mt-1">
                Subscribe to our newsletter for tips on electronics care, pricing trends, and green recycling.
              </p>
            </div>

            <form className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full lg:w-80 px-4 py-3 rounded-xl border border-slate-800 bg-slate-900 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-600 transition text-sm cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} SellYourPhone24. All rights reserved. Registered under UAE Circular Economy Laws.
          </p>

          <div className="flex items-center gap-6 text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition">Twitter</a>
            <a href="#" className="hover:text-emerald-400 transition">Instagram</a>
            <a href="#" className="hover:text-emerald-400 transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
