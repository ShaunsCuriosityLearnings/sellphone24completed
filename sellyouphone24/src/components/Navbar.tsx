"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, BadgePercent } from "lucide-react";
import { categories } from "@/data/mockData";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-lg text-white group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              SellYourPhone<span className="text-emerald-500">24</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              <BadgePercent size={16} />
              Instant Quote
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row (Desktop Only) */}
      <div className="hidden lg:block border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Services Links (Left) */}
            <div className="flex items-center gap-8">
              <Link href="/services" className="text-sm font-semibold text-slate-700 hover:text-emerald-500 transition flex items-center gap-1">
                All Services <ChevronRight size={14} />
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition"
                >
                  Sell {category.name}
                </Link>
              ))}
            </div>

            {/* Other Links (Right) */}
            <div className="flex items-center gap-6">
              <Link href="/blogs" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition">
                Blogs
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition">
                About Us
              </Link>
              <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl absolute w-full">
          <div className="space-y-1">
            <div className="text-slate-400 px-3 py-2 text-xs font-bold uppercase tracking-wider">
              Our Services
            </div>
            <div className="space-y-1">
              <Link
                href="/services"
                className="flex items-center justify-between w-full px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition border-b border-slate-50"
              >
                All Services
                <ChevronRight size={14} className="text-slate-400" />
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                  className="flex items-center justify-between w-full px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition border-b border-slate-50"
                >
                  Sell {category.name}
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-1">
            <Link href="/blogs" className="block px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
              Blogs
            </Link>
            <Link href="/about" className="block px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition">
              Contact
            </Link>
          </div>

          <div className="pt-6">
            <Link
              href="/services"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold transition shadow-md"
            >
              <BadgePercent size={18} />
              Get Instant Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
