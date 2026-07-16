"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight, Laptop, Tablet, Watch, Smartphone, FileText, Info, Phone, BadgePercent } from "lucide-react";
import { products, brands, categories } from "@/data/mockData";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileBrand, setActiveMobileBrand] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMobileBrand(null);
  }, [pathname]);

  // Group products by brand for the desktop dropdown hierarchy
  const getProductsByBrand = (brandName: string) => {
    return products.filter((p) => p.brand.toLowerCase() === brandName.toLowerCase()).slice(0, 5);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-xl text-slate-900 group-hover:scale-105 transition-transform duration-300">
                S
              </div>
              <span className="font-bold text-xl tracking-tight group-hover:text-emerald-400 transition-colors">
                SellYourPhone<span className="text-emerald-500">24</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              
              {/* Hierarchical Dropdown: Sell Devices */}
              <div className="relative group/menu py-6">
                <button className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition cursor-pointer">
                  Sell Devices
                  <ChevronDown size={14} className="group-hover/menu:rotate-180 transition-transform duration-300 text-slate-400" />
                </button>

                {/* Level 1 Dropdown: Brands (Category Page) */}
                <div className="absolute left-0 top-[80px] w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 py-3 z-50">
                  <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Select a Brand
                  </div>
                  {brands.map((brand) => {
                    const brandProducts = getProductsByBrand(brand.name);
                    return (
                      <div key={brand.id} className="relative group/brand px-2">
                        <Link
                          href={`/services/smartphones/${brand.slug}`}
                          className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{brand.logo}</span>
                            {brand.name}
                          </span>
                          <ChevronRight size={14} className="text-slate-500" />
                        </Link>

                        {/* Level 2 Dropdown: Products */}
                        {brandProducts.length > 0 && (
                          <div className="absolute left-full top-0 ml-1 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/brand:opacity-100 group-hover/brand:visible transition-all duration-200 py-3">
                            <div className="px-4 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                              Popular {brand.name} Models
                            </div>
                            {brandProducts.map((product) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition"
                              >
                                {product.name}
                              </Link>
                            ))}
                            <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                              <Link
                                href={`/services/smartphones/${brand.slug}`}
                                className="block text-center text-xs text-emerald-400 hover:text-emerald-300 py-1 hover:bg-slate-800 rounded-lg transition"
                              >
                                View All {brand.name} Devices
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="border-t border-slate-800 mt-2 pt-2 px-2">
                    <Link
                      href="/services"
                      className="block text-center text-xs text-emerald-400 hover:text-emerald-300 py-1 hover:bg-slate-800 rounded-lg transition font-medium"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/blogs" className="text-sm font-medium text-slate-300 hover:text-white transition">
                Blogs
              </Link>

              <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">
                About Us
              </Link>

              <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <BadgePercent size={16} />
              Instant Quote
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <div className="text-slate-500 px-3 py-2 text-xs font-semibold uppercase tracking-wider">
              Sell Devices
            </div>
            
            {brands.map((brand) => {
              const brandProducts = getProductsByBrand(brand.name);
              const isBrandActive = activeMobileBrand === brand.name;
              return (
                <div key={brand.id} className="space-y-1">
                  <button
                    onClick={() => setActiveMobileBrand(isBrandActive ? null : brand.name)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                  >
                    <span className="flex items-center gap-2">
                      <span>{brand.logo}</span>
                      {brand.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${isBrandActive ? "rotate-180" : ""}`} />
                  </button>

                  {isBrandActive && (
                    <div className="pl-6 space-y-1 border-l border-slate-800 ml-5">
                      {brandProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="block px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                        >
                          {product.name}
                        </Link>
                      ))}
                      <Link
                        href={`/services/smartphones/${brand.slug}`}
                        className="block px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        All {brand.name} Devices →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-1">
            <Link href="/blogs" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition">
              Blogs
            </Link>
            <Link href="/about" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition">
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition">
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/services"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-full text-sm font-semibold transition"
            >
              <BadgePercent size={16} />
              Get Instant Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
