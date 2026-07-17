"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, BadgePercent } from "lucide-react";
import { categories as mockCategories } from "@/data/mockData";
import { CategoryType, BrandType } from "@/types";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [categoriesList, setCategoriesList] = useState<CategoryType[]>(mockCategories);
  const [brandsList, setBrandsList] = useState<BrandType[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategoriesList).catch(() => {});
    api.getBrands().then(setBrandsList).catch(() => {});
  }, []);

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
              <Link href="/services" className="text-sm font-semibold text-slate-700 hover:text-emerald-500 transition flex items-center gap-1 py-3">
                All Services <ChevronRight size={14} />
              </Link>
              {categoriesList.map((category) => (
                <div 
                  key={category.id}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(category.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                    className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition py-3"
                  >
                    Sell {category.name}
                  </Link>

                  {/* Brand Dropdown */}
                  {activeDropdown === category.slug && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 gap-3">
                        {brandsList
                          .filter(b => b.categories?.some(c => c.slug === category.slug || c === category.id || c === category._id))
                          .map((brand) => (
                          <Link 
                            key={brand.id} 
                            href={`/services/${category.slug}?brand=${brand.slug}`}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-xl">
                              {(brand.logo && (brand.logo.startsWith("/") || brand.logo.startsWith("http"))) ? (
                                <div className="relative w-full h-full">
                                  <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                </div>
                              ) : (
                                <span>{brand.logo || "📱"}</span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-700">{brand.name}</span>
                          </Link>
                        ))}
                        {brandsList.filter(b => b.categories?.some(c => c.slug === category.slug || c === category.id || c === category._id)).length === 0 && (
                          <p className="col-span-2 text-xs text-slate-400 text-center py-2">No brands available yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
              {categoriesList.map((category) => (
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
