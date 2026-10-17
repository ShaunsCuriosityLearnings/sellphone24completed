"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Zap, ShoppingBag, ArrowRight, Grid, Sparkles, Phone, Truck, ShieldCheck, Smartphone } from "lucide-react";
import { CategoryType, BrandType } from "@/types";
import { api } from "@/lib/api";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useCartStore from "@/app/stores/cartStore";
import useBuyCartStore from "@/app/stores/buyCartStore";

const DEFAULT_FALLBACK_BRANDS: BrandType[] = [
  { id: "apple", name: "Apple", slug: "apple", logo: "🍎", categories: ["smartphones", "laptops", "tablets", "smartwatches"] },
  { id: "samsung", name: "Samsung", slug: "samsung", logo: "📱", categories: ["smartphones", "tablets", "smartwatches", "tvs"] },
  { id: "google", name: "Google", slug: "google", logo: "🔎", categories: ["smartphones", "smartwatches"] },
  { id: "oneplus", name: "OnePlus", slug: "oneplus", logo: "➕", categories: ["smartphones", "tablets"] },
  { id: "dell", name: "Dell", slug: "dell", logo: "💻", categories: ["laptops"] },
  { id: "sony", name: "Sony", slug: "sony", logo: "🎮", categories: ["games", "tvs"] },
];

const matchBrandToCategory = (brand: BrandType, category: CategoryType): boolean => {
  const catSlug = category.slug.toLowerCase();
  const bSlug = (brand.slug || "").toLowerCase();
  const bName = (brand.name || "").toLowerCase();

  // Explicit category matching if brand.categories exists
  if (brand.categories && Array.isArray(brand.categories) && brand.categories.length > 0) {
    const catAliases =
      catSlug === "smartphones" || catSlug === "mobile"
        ? ["smartphones", "mobile", "phones"]
        : catSlug === "laptops" || catSlug === "macbooks"
        ? ["laptops", "macbooks"]
        : catSlug === "smartwatches" || catSlug === "watches"
        ? ["smartwatches", "watches"]
        : catSlug === "tablets" || catSlug === "ipads"
        ? ["tablets", "ipads"]
        : [catSlug];

    const isMatch = brand.categories.some((c) => {
      if (typeof c === "string") {
        const lowerC = c.toLowerCase();
        return c === category.id || c === category._id || catAliases.includes(lowerC);
      }
      if (typeof c === "object" && c !== null) {
        const cSlug = (c.slug || "").toLowerCase();
        const cId = c.id || c._id;
        const cName = (c.name || "").toLowerCase();
        return (
          catAliases.includes(cSlug) ||
          catAliases.includes(cName) ||
          (cId && (cId === category.id || cId === category._id || String(cId) === String(category.id)))
        );
      }
      return false;
    });

    if (isMatch) return true;
  }

  // Known defaults matching by brand name/slug if array matching wasn't matched
  if (catSlug === "smartphones") return ["apple", "samsung", "google", "oneplus", "xiaomi"].includes(bName) || ["apple", "samsung", "google", "oneplus", "xiaomi"].includes(bSlug);
  if (catSlug === "laptops") return ["apple", "dell", "hp", "asus", "lenovo", "microsoft", "razer", "acer", "msi"].includes(bName) || ["apple", "dell", "hp", "asus", "lenovo", "microsoft", "razer", "acer", "msi"].includes(bSlug);
  if (catSlug === "tablets") return ["apple", "samsung", "oneplus", "lenovo", "microsoft", "xiaomi"].includes(bName) || ["apple", "samsung", "oneplus", "lenovo", "microsoft", "xiaomi"].includes(bSlug);
  if (catSlug === "smartwatches") return ["apple", "samsung", "google"].includes(bName) || ["apple", "samsung", "google"].includes(bSlug);
  if (catSlug === "games") return ["sony", "microsoft", "nintendo", "valve", "asus", "lenovo", "meta", "msi"].includes(bName) || ["sony", "microsoft", "nintendo", "valve", "asus", "lenovo", "meta", "msi"].includes(bSlug);
  if (catSlug === "tvs") return ["samsung", "lg", "sony", "tcl"].includes(bName) || ["samsung", "lg", "sony", "tcl"].includes(bSlug);

  return false;
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [categoriesList, setCategoriesList] = useState<CategoryType[]>([]);
  const [brandsList, setBrandsList] = useState<BrandType[]>(DEFAULT_FALLBACK_BRANDS);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const buyCart = useBuyCartStore((state) => state.cart);
  const buyCartCount = buyCart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  useEffect(() => {
    api.getCategories()
      .then((data) => {
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

    api.getBrands().then((fetchedBrands) => {
      if (fetchedBrands && fetchedBrands.length > 0) {
        setBrandsList(fetchedBrands);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getMatchingBrandsForCategory = (category: CategoryType) => {
    const catSlug = (category.slug || "").toLowerCase();
    const catId = (category.id || category._id || "").toString();
    const catName = (category.name || "").toLowerCase();

    const matched = brandsList.filter((brand) => {
      if (!brand.categories || !Array.isArray(brand.categories) || brand.categories.length === 0) return true;
      return brand.categories.some((c: any) => {
        if (!c) return false;
        if (typeof c === "string") {
          const s = c.toLowerCase();
          return s === catSlug || s === catName || c === catId;
        }
        if (typeof c === "object") {
          const s = (c.slug || c.name || "").toLowerCase();
          const id = (c._id || c.id || "").toString();
          return s === catSlug || s === catName || (id && id === catId);
        }
        return false;
      });
    });
    return matched.length > 0 ? matched : brandsList;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs max-w-full">
      
      {/* TOP ANNOUNCEMENT & TRUST TICKER BAR */}
      <div className="bg-slate-950 text-white text-[10px] sm:text-[11px] font-medium py-1.5 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold whitespace-nowrap">
              🇦🇪 UAE #1 Buyback
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300 truncate">
              <Truck size={12} className="text-emerald-400 shrink-0" />
              Free Pickup Across Dubai
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:0555549817" className="flex items-center gap-1 text-emerald-400 font-extrabold hover:underline">
              <Phone size={11} />
              <span>0555549817</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN TOP HEADER BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-extrabold text-lg sm:text-xl text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
              SellPhone<span className="text-emerald-500">Cash</span>
            </span>
          </Link>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-slate-600">
              <Link
                href="/buy-phones"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  pathname.startsWith("/buy-phones")
                    ? "bg-emerald-500 text-slate-950 shadow-xs"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <Smartphone size={14} />
                <span>Buy Phones</span>
              </Link>
              <Link href="/blogs" className="hover:text-emerald-600 transition">
                Blogs
              </Link>
              <Link href="/about" className="hover:text-emerald-600 transition">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-emerald-600 transition">
                Contact
              </Link>
            </div>

            {/* Buy Phones Store Cart Pill */}
            {buyCartCount > 0 && (
              <Link
                href="/buy-phones/cart"
                className="relative px-2.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5 font-bold text-xs shrink-0 shadow-xs"
                title="View Buy Phones Store Cart"
              >
                <ShoppingBag size={14} className="text-emerald-400" />
                <span className="hidden sm:inline">Store Cart</span>
                <span className="bg-emerald-500 text-slate-950 font-black rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px]">
                  {buyCartCount}
                </span>
              </Link>
            )}

            {/* Sell List Cart Pill */}
            {cartCount > 0 && (
              <Link
                href="/cart"
                className="relative px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition flex items-center gap-1.5 font-bold text-xs border border-emerald-200/60 shrink-0"
              >
                <ShoppingBag size={15} />
                <span className="hidden sm:inline">Sell List</span>
                <span className="bg-emerald-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Instant Quote CTA Button */}
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Zap size={15} className="fill-slate-950" />
              <span>Instant Quote</span>
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-500 hover:text-slate-950 lg:hidden transition flex items-center justify-center shrink-0 cursor-pointer shadow-md"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* ROW 2: CATEGORY NAVIGATION BAR (DESKTOP) */}
      <div className="hidden lg:block bg-slate-900 text-white border-t border-slate-800 relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-bold tracking-wide">
            
            <div className="flex items-center gap-2">
              <Link
                href="/services"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  pathname === "/services" ? "bg-emerald-500 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Grid size={14} className="text-emerald-400" />
                <span>All Sell Services</span>
              </Link>
            </div>

            <div className="flex items-center gap-1 xl:gap-2 h-full">
              {categoriesList.map((category) => {
                const categoryBrands = brandsList.filter((b) => matchBrandToCategory(b, category));
                const displayBrands = categoryBrands.length > 0 ? categoryBrands.slice(0, 6) : brandsList.slice(0, 6);
                const hasBrands = displayBrands.length > 0;

                return (
                  <div
                    key={category.id || category.slug}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(category.slug)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                      className={`px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 whitespace-nowrap ${
                        pathname.includes(`/services/${category.slug}`)
                          ? "text-emerald-400 bg-slate-800"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>{category.name}</span>
                      {hasBrands && (
                        <ChevronDown size={12} className="text-slate-400 group-hover:text-emerald-400 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>

                    {activeDropdown === category.slug && hasBrands && (
                      <div className="absolute top-full left-0 w-64 bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-2 border-b border-slate-100 flex justify-between items-center">
                          <span>Popular {category.name} Brands</span>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">Instant Cash</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-2.5">
                          {displayBrands.map((brand) => (
                            <Link
                              key={brand.id || brand._id || brand.name}
                              href={`/services/${category.slug}?brand=${brand.slug}`}
                              className="flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50/70 hover:border-emerald-200 transition border border-transparent group/item"
                            >
                              <div className="w-6 h-6 flex items-center justify-center text-xs shrink-0 rounded-lg bg-slate-100 group-hover/item:bg-white transition">
                                {(brand.logo && (brand.logo.startsWith("/") || brand.logo.startsWith("http"))) ? (
                                  <div className="relative w-4 h-4">
                                    <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                                  </div>
                                ) : (
                                  <span>{brand.logo || "📱"}</span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-700 group-hover/item:text-emerald-700 truncate">{brand.name}</span>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-center">
                          <Link
                            href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                          >
                            <span>View All {category.name} Models</span>
                            <ArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <Sparkles size={13} />
              <span>Instant UAE Cash Valuation</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-2xl absolute top-full left-0 w-full z-50 max-h-[85vh] overflow-y-auto">
          
          {/* BUY PHONES STORE HIGHLIGHT (MOBILE) */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Smartphone size={13} className="text-emerald-600" />
                Buy Phones Store
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                12M Warranty
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/buy-phones"
                className="flex-1 bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl text-center shadow-xs hover:bg-emerald-600 transition"
              >
                Browse All Phones
              </Link>
              {buyCartCount > 0 && (
                <Link
                  href="/buy-phones/cart"
                  className="bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <ShoppingBag size={13} className="text-emerald-400" />
                  <span>Cart ({buyCartCount})</span>
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              Sell Devices
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/services"
                className="flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition"
              >
                <span>All Services & Categories</span>
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
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl text-sm font-bold transition shadow-md"
            >
              <Zap size={18} />
              Get Instant Quote Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
