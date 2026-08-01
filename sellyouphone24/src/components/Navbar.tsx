"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Zap, ShoppingBag, ArrowRight } from "lucide-react";
import { CategoryType, BrandType } from "@/types";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useCartStore from "@/app/stores/cartStore";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [categoriesList, setCategoriesList] = useState<CategoryType[]>([]);
  const [brandsList, setBrandsList] = useState<BrandType[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    api.getCategories()
      .then((data) => {
        // Deduplicate categories (e.g. smartphones vs mobile)
        const seenNames = new Set<string>();
        const filtered = data.filter((cat) => {
          const normName = cat.name.toLowerCase() === "mobile" ? "smartphones" : cat.name.toLowerCase();
          if (seenNames.has(normName)) return false;
          seenNames.add(normName);
          return true;
        });
        setCategoriesList(filtered);
      })
      .catch(() => {});

    api.getBrands().then(setBrandsList).catch(() => {});
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Primary Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-extrabold text-xl text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              SellPhone<span className="text-emerald-500">Cash</span>
            </span>
          </Link>

          {/* Desktop Core Nav Links */}
          <div className="hidden xl:flex items-center gap-1 xl:gap-2">
            <Link
              href="/services"
              className={`px-3 py-2 text-sm font-bold transition rounded-lg ${
                pathname === "/services" ? "text-emerald-600 bg-emerald-50" : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
              }`}
            >
              All Services
            </Link>

            {categoriesList.map((category) => (
              <div
                key={category.id || category.slug}
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown(category.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition rounded-lg inline-flex items-center gap-1 whitespace-nowrap"
                >
                  {category.name}
                  {brandsList.some(b => b.categories?.some(c => c.slug === category.slug || c === category.id || c === category._id)) && (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:rotate-180" />
                  )}
                </Link>

                {/* Brand Dropdown Menu */}
                {activeDropdown === category.slug && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-2">
                      Popular {category.name} Brands
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {brandsList
                        .filter(b => b.categories?.some(c => c.slug === category.slug || c === category.id || c === category._id))
                        .slice(0, 6)
                        .map((brand) => (
                          <Link
                            key={brand.id}
                            href={`/services/${category.slug}?brand=${brand.slug}`}
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                          >
                            <div className="w-6 h-6 flex items-center justify-center text-sm shrink-0">
                              {(brand.logo && (brand.logo.startsWith("/") || brand.logo.startsWith("http"))) ? (
                                <div className="relative w-full h-full">
                                  <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                </div>
                              ) : (
                                <span>{brand.logo || "📱"}</span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-700 truncate">{brand.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link href="/blogs" className="hidden lg:inline-block text-sm font-semibold text-slate-600 hover:text-emerald-600 transition px-2">
              Blogs
            </Link>
            <Link href="/about" className="hidden lg:inline-block text-sm font-semibold text-slate-600 hover:text-emerald-600 transition px-2">
              About
            </Link>
            <Link href="/contact" className="hidden lg:inline-block text-sm font-semibold text-slate-600 hover:text-emerald-600 transition px-2">
              Contact
            </Link>

            {/* Sell Cart Icon */}
            {cartCount > 0 && (
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition flex items-center gap-1.5 font-bold text-xs"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline">Sell List</span>
                <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Instant Quote CTA Button */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all hover:scale-102 shrink-0 cursor-pointer"
            >
              <Zap size={16} className="fill-white" />
              <span>Instant Quote</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 xl:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Category Quick Bar (For Medium Screens lg-xl) */}
      <div className="hidden lg:flex xl:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs font-bold text-slate-700 whitespace-nowrap">
          <Link href="/services" className="text-emerald-600 flex items-center gap-1">
            All Categories <ChevronDown size={12} />
          </Link>
          {categoriesList.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={cat.slug === 'any-device' ? '/sell-any-device' : `/services/${cat.slug}`}
              className="hover:text-emerald-600 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-2xl absolute top-full left-0 w-full z-50">
          <div className="space-y-1">
            <div className="text-slate-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              Sell Device Categories
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/services"
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
              >
                <span>All Services & Brands</span>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
              {categoriesList.map((category) => (
                <Link
                  key={category.id || category.slug}
                  href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition"
                >
                  <span>Sell {category.name}</span>
                  <ArrowRight size={14} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
            <Link href="/blogs" className="py-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">
              Blogs
            </Link>
            <Link href="/about" className="py-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">
              About Us
            </Link>
            <Link href="/contact" className="py-2.5 bg-slate-50 rounded-xl hover:bg-slate-100">
              Contact
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/services"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold transition shadow-md"
            >
              <Zap size={18} />
              Get Instant Quote Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
