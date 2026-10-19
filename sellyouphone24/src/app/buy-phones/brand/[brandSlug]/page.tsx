"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Search, 
  SlidersHorizontal, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  Grid3X3, 
  List, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  Tag,
  CheckCircle2,
  Package
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import useBuyCartStore from "@/app/stores/buyCartStore";
import { BuyProductType, BrandType } from "@/types";

// Standard brand logos fallback
const BRAND_FALLBACKS: Record<string, string> = {
  apple: "/products/apple-logo.svg",
  samsung: "/products/samsung-logo.svg",
  google: "/products/google-logo.svg",
  oneplus: "/products/oneplus-logo.svg",
  xiaomi: "/products/xiaomi-logo.svg",
};

export default function BrandCatalogPage() {
  const params = useParams();
  const router = useRouter();
  const rawBrandSlug = Array.isArray(params.brandSlug) ? params.brandSlug[0] : (params.brandSlug as string);
  const currentSlug = decodeURIComponent(rawBrandSlug || "").toLowerCase();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<BuyProductType[]>([]);
  const [allBrands, setAllBrands] = useState<BrandType[]>([]);
  const [currentBrandInfo, setCurrentBrandInfo] = useState<BrandType | null>(null);

  // Cart store
  const { addToCart } = useBuyCartStore();

  // Wishlist state (stored in local state with instant heart animation)
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Layout View mode: Grid vs List (matching reference image top toolbar)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mobile layout view mode: horizontal rows vs compact grid
  const [mobileCatalogLayout, setMobileCatalogLayout] = useState<"horizontal" | "grid">("horizontal");

  // Mobile Filter Drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Sort option (Popular First, Price: lowest, Price: highest, Rating, Newest)
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating" | "newest">("popular");

  // Sidebar Filter States (faithfully matching reference image layout)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Collapsible sidebar sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    brand: true,
    condition: true,
    color: true,
    storage: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync URL search query parameters (from navbar dropdowns or direct links)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const searchParam = sp.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
      const cond = sp.get("condition");
      if (cond) {
        setSelectedConditions([cond]);
      }
      const cat = sp.get("category");
      if (cat) {
        setSelectedCategories([cat]);
      }
    }
  }, []);

  // Load brand details and catalog items
  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const [brandList, catalog] = await Promise.all([
          api.getBuyBrands().catch(() => []),
          api.getBuyProducts().catch(() => []),
        ]);

        setAllBrands(brandList);
        setProducts(catalog);

        // Find current brand entity
        const matched = brandList.find(
          (b) =>
            b.slug?.toLowerCase() === currentSlug ||
            b.name.toLowerCase() === currentSlug ||
            b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === currentSlug ||
            String(b.id || b._id) === currentSlug
        );

        if (matched) {
          setCurrentBrandInfo(matched);
        } else {
          // Capitalize slug for display if brand record isn't in DB yet
          const formattedName = currentSlug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          setCurrentBrandInfo({
            id: currentSlug,
            name: formattedName,
            slug: currentSlug,
            logo: BRAND_FALLBACKS[currentSlug] || "/products/apple-logo.svg",
          });
        }
      } catch (err) {
        console.error("Failed to load brand catalog:", err);
      } finally {
        setLoading(false);
      }
    }

    if (currentSlug) {
      loadCatalog();
    }
  }, [currentSlug]);

  const brandDisplayName = currentBrandInfo?.name || "Brand";

  // Filter products strictly linked to this brand or matching brand name
  const brandProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((p) => {
      // 1. Direct ObjectId Brand reference check
      if (p.brandRef) {
        const refId = typeof p.brandRef === "object" ? p.brandRef?._id || p.brandRef?.id : p.brandRef;
        if (currentBrandInfo && (refId === currentBrandInfo.id || refId === currentBrandInfo._id)) {
          return true;
        }
      }

      // 2. Name or Slug comparison check
      const pBrandLower = (p.brand || "").toLowerCase().trim();
      const targetBrandLower = (brandDisplayName || currentSlug).toLowerCase().trim();
      const targetSlug = currentSlug.replace(/-/g, " ");

      return (
        pBrandLower === targetBrandLower ||
        pBrandLower === currentSlug ||
        pBrandLower.includes(targetBrandLower) ||
        targetBrandLower.includes(pBrandLower) ||
        pBrandLower === targetSlug
      );
    });
  }, [products, currentBrandInfo, currentSlug, brandDisplayName]);

  // Available attributes dynamically computed from this brand's stock
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach((p) => {
      (p.colors || []).forEach((c) => {
        if (c && c.trim()) set.add(c.trim());
      });
    });
    return Array.from(set);
  }, [brandProducts]);

  const availableStorages = useMemo(() => {
    const set = new Set<string>();
    brandProducts.forEach((p) => {
      (p.storages || []).forEach((s) => {
        if (s.size) set.add(s.size);
      });
    });
    return Array.from(set);
  }, [brandProducts]);

  // Color mapping for swatches
  const getColorHex = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("blue")) return "#3b82f6";
    if (lower.includes("black") || lower.includes("dark") || lower.includes("space gray")) return "#1e293b";
    if (lower.includes("white") || lower.includes("silver") || lower.includes("starlight")) return "#e2e8f0";
    if (lower.includes("gold")) return "#eab308";
    if (lower.includes("titanium")) return "#94a3b8";
    if (lower.includes("green") || lower.includes("alpine")) return "#10b981";
    if (lower.includes("purple") || lower.includes("violet")) return "#a855f7";
    if (lower.includes("red")) return "#ef4444";
    return "#cbd5e1";
  };

  // Full active filtering
  const filteredProducts = useMemo(() => {
    return brandProducts.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesModel = (product.model || "").toLowerCase().includes(q);
        const matchesDesc = (product.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesModel && !matchesDesc) return false;
      }

      // 2. Category Filter (smartphones, laptops, tablets, smartwatches, etc.)
      if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
        const prodCat = (product.category || "smartphones").toLowerCase();
        const matchesCategory = selectedCategories.some((c) => {
          const cLow = c.toLowerCase();
          return prodCat.includes(cLow) || (cLow === "smartphones" && (prodCat.includes("phone") || prodCat.includes("mobile")));
        });
        if (!matchesCategory) return false;
      }

      // 3. Price Range Filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // 4. Condition Filter
      if (selectedConditions.length > 0) {
        const matchesCondition = selectedConditions.some((cond) =>
          product.condition.toLowerCase().includes(cond.toLowerCase())
        );
        if (!matchesCondition) return false;
      }

      // 5. Color Filter
      if (selectedColors.length > 0 && !selectedColors.includes("all")) {
        const matchesColor = (product.colors || []).some((c) =>
          selectedColors.some((sc) => c.toLowerCase().includes(sc.toLowerCase()))
        );
        if (!matchesColor) return false;
      }

      // 6. Storage Filter
      if (selectedStorages.length > 0) {
        const matchesStorage = (product.storages || []).some((s) =>
          selectedStorages.includes(s.size)
        );
        if (!matchesStorage) return false;
      }

      // 7. Only in stock toggle
      if (onlyInStock) {
        if (!product.isAvailable || (product.stock !== undefined && product.stock <= 0)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      // Popular first (featured first)
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    brandProducts,
    searchQuery,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedConditions,
    selectedColors,
    selectedStorages,
    onlyInStock,
    sortBy,
  ]);

  // Wishlist toggling
  const handleToggleWishlist = (productId: string, title: string) => {
    setWishlist((prev) => {
      const next = !prev[productId];
      if (next) {
        toast.info(`Added ${title} to your favorites!`);
      }
      return { ...prev, [productId]: next };
    });
  };

  // Quick Cart Action (Shopping Bag Button from Image 1)
  const handleQuickAdd = (product: BuyProductType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: String(product.id || product._id),
      _id: String(product._id || product.id),
      title: product.title,
      brand: product.brand,
      model: product.model || product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      selectedStorage: product.selectedStorage || product.storages?.[0]?.size || "128GB",
      selectedColor: product.colors?.[0] || "Natural Titanium",
      condition: product.condition || "Pristine (Like New)",
      quantity: 1,
      image: product.images?.frontView || "/products/iphone-pro-max.jpg",
      stock: product.stock,
      warranty: product.warranty,
      batteryHealth: product.batteryHealth,
    });

    toast.success(`Added ${product.title} to your bag!`);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories(["smartphones"]);
    setMinPrice(0);
    setMaxPrice(8000);
    setSelectedConditions([]);
    setSelectedColors([]);
    setSelectedStorages([]);
    setOnlyInStock(false);
    setSortBy("popular");
  };

  const activeFilterCount =
    (selectedCategories.length > 0 && !selectedCategories.includes("all") ? 1 : 0) +
    (minPrice > 0 || maxPrice < 8000 ? 1 : 0) +
    selectedConditions.length +
    selectedColors.length +
    selectedStorages.length +
    (onlyInStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      
      {/* =========================================================================
          TOP BREADCRUMBS & TOOLBAR (FAITHFULLY REPRODUCED FROM IMAGE 1)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        
        {/* Breadcrumb line: Main / Catalog / {Brand} */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
          <Link href="/" className="hover:text-slate-800 transition">Main</Link>
          <span className="text-slate-300">/</span>
          <Link href="/buy-phones" className="hover:text-slate-800 transition">Catalog</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">{brandDisplayName}</span>
        </nav>

        {/* Header row: Catalog Heading + Count Badge + View Mode + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2.5">
              <span>{brandDisplayName} Catalog</span>
              
              {/* Blue Circular Pill Badge with active count (from Image 1) */}
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                {filteredProducts.length}
              </span>
            </h1>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
            >
              <Filter size={14} className="text-blue-600" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>

          {/* Right Toolbar: Grid/List switchers & Sort dropdown */}
          <div className="flex items-center gap-3">
            
            {/* Mobile View Toggle: List vs Grid */}
            <div className="sm:hidden flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => setMobileCatalogLayout("horizontal")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  mobileCatalogLayout === "horizontal" ? "bg-blue-50 text-blue-600" : "text-slate-400"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setMobileCatalogLayout("grid")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  mobileCatalogLayout === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400"
                }`}
              >
                Grid
              </button>
            </div>

            {/* View Mode Toggle for Tablet/Desktop: Grid [:::] vs List [=] */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Sort Dropdown (from Image 1: "Popular First v") */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer pr-8 appearance-none"
              >
                <option value="popular">Popular First</option>
                <option value="price-asc">Price: Lowest First</option>
                <option value="price-desc">Price: Highest First</option>
                <option value="rating">Best Customer Rating</option>
                <option value="newest">Newest Releases</option>
              </select>
              <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

        </div>

        {/* Mobile Horizontal Quick Filter Bar (Immediate 1-Tap Filter Chips) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2.5 pb-1">
          {/* Filter Drawer Opener Pill */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal size={12} />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Quick Categories */}
          {[
            { id: "all", label: "All" },
            { id: "smartphones", label: "Smartphones" },
            { id: "tablets", label: "Tablets" },
            { id: "watches", label: "Watches" },
            { id: "audio", label: "Audio" },
          ].map((cat) => {
            const isSel = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === "all") setSelectedCategories(["all"]);
                  else setSelectedCategories([cat.id]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  isSel ? "bg-slate-900 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {/* Quick Price Ranges */}
          {[
            { label: "< 1.5k", min: 0, max: 1500 },
            { label: "1.5k - 3k", min: 1500, max: 3000 },
            { label: "3k+", min: 3000, max: 8000 },
          ].map((p, idx) => {
            const isSel = minPrice === p.min && maxPrice === p.max;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isSel) { setMinPrice(0); setMaxPrice(8000); }
                  else { setMinPrice(p.min); setMaxPrice(p.max); }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                  isSel ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {/* In Stock Only */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
              onlyInStock ? "bg-emerald-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            In Stock
          </button>
        </div>

      </div>

      {/* =========================================================================
          MAIN LAYOUT: SIDEBAR FILTERS (LEFT) & PRODUCT CATALOG GRID (RIGHT)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =====================================================================
              LEFT SIDEBAR: FILTERS CARD (EXACT REPLICA OF REFERENCE IMAGE 1)
             ===================================================================== */}
          <aside className={`
            lg:col-span-3 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-6
            ${mobileFilterOpen ? "fixed inset-0 z-50 overflow-y-auto m-0 rounded-none p-6" : "hidden lg:block"}
          `}>
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Filter Products</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* In-Catalog Keyword Search Box */}
            <div className="relative">
              <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${brandDisplayName}...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* ---------------- 1. Category Accordion ---------------- */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <button
                onClick={() => toggleSection("category")}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
              >
                <span>Category</span>
                {openSections.category ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>

              {openSections.category && (
                <div className="space-y-2 pt-1 text-xs text-slate-600">
                  {[
                    { id: "all", label: "All Categories" },
                    { id: "smartphones", label: "Smartphones & Flagships" },
                    { id: "tablets", label: "Tablets & iPads" },
                    { id: "watches", label: "Smart Watches & Bands" },
                    { id: "audio", label: "Headphones & Audio" },
                    { id: "special", label: "Special Offers" },
                  ].map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (cat.id === "all") {
                              setSelectedCategories(["all"]);
                            } else {
                              const withoutAll = selectedCategories.filter((c) => c !== "all");
                              if (isChecked) {
                                setSelectedCategories(withoutAll.filter((c) => c !== cat.id));
                              } else {
                                setSelectedCategories([...withoutAll, cat.id]);
                              }
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className={`text-xs ${isChecked ? "font-bold text-slate-950" : "font-medium"}`}>
                          {cat.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---------------- 2. Price Range (Dual inputs + interactive slider) ---------------- */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
              >
                <span>Price Range</span>
                {openSections.price ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>

              {openSections.price && (
                <div className="space-y-3 pt-1">
                  
                  {/* Dual Inputs from Image 1: $ [ 5 ] - $ [ 1 000 ] */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1.5">AED</span>
                      <input
                        type="number"
                        min={0}
                        max={maxPrice}
                        value={minPrice}
                        onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <span className="text-slate-300 font-bold">—</span>

                    <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1.5">AED</span>
                      <input
                        type="number"
                        min={minPrice}
                        max={10000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Math.min(10000, Number(e.target.value)))}
                        className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Dual Range Track Slider (Visual match to Image 1) */}
                  <div className="relative pt-2 pb-1">
                    <input
                      type="range"
                      min={0}
                      max={8000}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                      <span>AED 0</span>
                      <span>AED {maxPrice.toLocaleString()}</span>
                      <span>AED 8,000+</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: "Under 1.5k", min: 0, max: 1500 },
                      { label: "1.5k - 3k", min: 1500, max: 3000 },
                      { label: "3k - 5k", min: 3000, max: 5000 },
                      { label: "All Prices", min: 0, max: 8000 },
                    ].map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setMinPrice(preset.min);
                          setMaxPrice(preset.max);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer ${
                          minPrice === preset.min && maxPrice === preset.max
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                </div>
              )}
            </div>

            {/* ---------------- 3. Switch Brand Accordion ---------------- */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <button
                onClick={() => toggleSection("brand")}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
              >
                <span>Brand</span>
                {openSections.brand ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </button>

              {openSections.brand && (
                <div className="space-y-1.5 pt-1 text-xs">
                  {allBrands.map((b) => {
                    const bSlug = (b.slug || b.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const isCurrent = currentSlug === bSlug || brandDisplayName.toLowerCase() === b.name.toLowerCase();
                    const count = products.filter(
                      (p) =>
                        p.brand?.toLowerCase() === b.name.toLowerCase() ||
                        (p.brandRef && typeof p.brandRef === "object" && (p.brandRef._id === b.id || p.brandRef._id === b._id))
                    ).length;

                    return (
                      <Link
                        key={String(b.id || b._id)}
                        href={`/buy-phones/brand/${encodeURIComponent(bSlug)}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                          isCurrent
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-slate-300"}`} />
                          <span>{b.name}</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          isCurrent ? "bg-blue-700/80 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {count}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---------------- 4. Condition Filter (Pristine, Grade A, Grade B) ---------------- */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <button
                onClick={() => toggleSection("condition")}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
              >
                <span>Condition</span>
                {openSections.condition ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>

              {openSections.condition && (
                <div className="space-y-2 pt-1 text-xs text-slate-600">
                  {[
                    { id: "Pristine", label: "Pristine (Like New)", badge: "Flawless" },
                    { id: "Grade A", label: "Grade A (Excellent)", badge: "Micro signs" },
                    { id: "Grade B", label: "Grade B (Good Value)", badge: "Light wear" },
                  ].map((cond) => {
                    const isChecked = selectedConditions.includes(cond.id);
                    return (
                      <label
                        key={cond.id}
                        className="flex items-center justify-between cursor-pointer hover:text-slate-900 select-none group"
                      >
                        <span className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedConditions(selectedConditions.filter((c) => c !== cond.id));
                              } else {
                                setSelectedConditions([...selectedConditions, cond.id]);
                              }
                            }}
                            className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`text-xs ${isChecked ? "font-bold text-slate-950" : "font-medium"}`}>
                            {cond.label}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-medium">
                          {cond.badge}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---------------- 5. Storage Capacity ---------------- */}
            {availableStorages.length > 0 && (
              <div className="border-b border-slate-100 pb-5 space-y-3">
                <button
                  onClick={() => toggleSection("storage")}
                  className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
                >
                  <span>Storage Capacity</span>
                  {openSections.storage ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>

                {openSections.storage && (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    {availableStorages.map((st) => {
                      const isChecked = selectedStorages.includes(st);
                      return (
                        <button
                          key={st}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedStorages(selectedStorages.filter((s) => s !== st));
                            } else {
                              setSelectedStorages([...selectedStorages, st]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition cursor-pointer text-center ${
                            isChecked
                              ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ---------------- 6. Color Checkboxes with Swatches ---------------- */}
            <div className="border-b border-slate-100 pb-5 space-y-3">
              <button
                onClick={() => toggleSection("color")}
                className="w-full flex items-center justify-between text-xs font-extrabold text-slate-900 cursor-pointer"
              >
                <span>Color</span>
                {openSections.color ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>

              {openSections.color && (
                <div className="space-y-2 pt-1 text-xs text-slate-600">
                  {[
                    "All",
                    "Blue",
                    "Black",
                    "White",
                    "Silver",
                    "Gold",
                    "Titanium",
                  ].map((colorName) => {
                    const isChecked = selectedColors.includes(colorName);
                    return (
                      <label
                        key={colorName}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (colorName === "All") {
                              setSelectedColors(isChecked ? [] : ["All"]);
                            } else {
                              const withoutAll = selectedColors.filter((c) => c !== "All");
                              if (isChecked) {
                                setSelectedColors(withoutAll.filter((c) => c !== colorName));
                              } else {
                                setSelectedColors([...withoutAll, colorName]);
                              }
                            }
                          }}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        {colorName !== "All" && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-block shadow-2xs"
                            style={{ backgroundColor: getColorHex(colorName) }}
                          />
                        )}
                        <span className={`text-xs ${isChecked ? "font-bold text-slate-950" : "font-medium"}`}>
                          {colorName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ---------------- 7. Only in Stock Toggle ---------------- */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-extrabold text-slate-900">Only in Stock</span>
              
              <button
                type="button"
                role="switch"
                aria-checked={onlyInStock}
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  onlyInStock ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    onlyInStock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* ---------------- 8. Action Buttons (Direct from Image 1) ---------------- */}
            <div className="flex items-center gap-3 pt-2">
              {/* Blue Primary Button with Item Count: "1 984 items" / "{count} items" */}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-101 active:scale-99 cursor-pointer text-center"
              >
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </button>

              {/* Clear Button */}
              <button
                onClick={handleClearFilters}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
              >
                Clear
              </button>
            </div>

          </aside>

          {/* =====================================================================
              RIGHT PRODUCT GRID (FAITHFULLY REPRODUCED FROM IMAGE 1 & 2)
             ===================================================================== */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Active Filters Pill Bar */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider pl-1">
                  Active Filters:
                </span>

                {selectedCategories.filter((c) => c !== "all").map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100"
                  >
                    <span>{cat}</span>
                    <button
                      onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== cat))}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {(minPrice > 0 || maxPrice < 8000) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                    <span>AED {minPrice} - AED {maxPrice}</span>
                    <button
                      onClick={() => {
                        setMinPrice(0);
                        setMaxPrice(8000);
                      }}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedConditions.map((cond) => (
                  <span
                    key={cond}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100"
                  >
                    <span>{cond}</span>
                    <button
                      onClick={() => setSelectedConditions(selectedConditions.filter((c) => c !== cond))}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {selectedColors.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100"
                  >
                    <span>{col}</span>
                    <button
                      onClick={() => setSelectedColors(selectedColors.filter((c) => c !== col))}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {selectedStorages.map((st) => (
                  <span
                    key={st}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100"
                  >
                    <span>{st}</span>
                    <button
                      onClick={() => setSelectedStorages(selectedStorages.filter((s) => s !== st))}
                      className="hover:text-blue-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                {onlyInStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                    <span>In Stock Only</span>
                    <button onClick={() => setOnlyInStock(false)} className="hover:text-emerald-950">
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 underline ml-auto cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Loading Spinner */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-500">Loading {brandDisplayName} devices...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty Catalog State */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Package size={28} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  No {brandDisplayName} devices match your current filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the price range slider or clearing some of the attribute filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                >
                  <RotateCcw size={14} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div>
                {/* ===================================================================
                    MOBILE-ONLY VIEW: HORIZONTALLY ALIGNED CARDS (Clean & Professional)
                   =================================================================== */}
                {/* ===================================================================
                    MOBILE-ONLY VIEW: PROPER CLEAN 2-COLUMN GRID (2 Cards in One Row)
                   =================================================================== */}
                <div className="sm:hidden grid grid-cols-2 gap-2.5">
                  {filteredProducts.map((product) => {
                    const prodId = String(product.id || product._id);
                    const isFavorited = !!wishlist[prodId];
                    const discountPercent = product.originalPrice && product.originalPrice > product.price
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : null;
                    const isSpecial = product.isFeatured || (discountPercent && discountPercent >= 30);
                    const frontImg = product.images?.frontView || "/products/iphone-pro-max.jpg";

                    return (
                      <div
                        key={`mob-brand-grid-${prodId}`}
                        className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-2.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                      >
                        {/* Image stage */}
                        <Link
                          href={`/buy-phones/${prodId}`}
                          className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 group-hover:from-blue-50/30 transition-colors"
                        >
                          {discountPercent ? (
                            <span className="absolute top-2 left-2 z-10 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                              -{discountPercent}%
                            </span>
                          ) : isSpecial ? (
                            <span className="absolute top-2 left-2 z-10 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                              Special
                            </span>
                          ) : null}

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleWishlist(prodId, product.title);
                            }}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 flex items-center justify-center shadow-2xs transition active:scale-90 border border-slate-200/60"
                          >
                            <Heart size={13} className={isFavorited ? "text-rose-500 fill-rose-500" : ""} />
                          </button>

                          <div className="relative w-full h-full flex items-center justify-center p-1">
                            <Image
                              src={frontImg}
                              alt={product.title}
                              fill
                              className="object-contain p-1 group-hover:scale-106 transition-transform duration-300 ease-out"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="space-y-1 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase text-blue-600 tracking-wider block">
                              {product.brand}
                            </span>
                            <Link
                              href={`/buy-phones/${prodId}`}
                              className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 block mt-0.5"
                              title={product.title}
                            >
                              {product.title}
                            </Link>
                            <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                              {product.condition} • {product.selectedStorage || product.storages?.[0]?.size || "128GB"}
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="pt-2">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs sm:text-sm font-black text-slate-950">
                                AED {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  AED {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-2">
                              <Link
                                href={`/buy-phones/${prodId}`}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] transition text-center shadow-2xs"
                              >
                                Buy
                              </Link>
                              <button
                                onClick={(e) => handleQuickAdd(product, e)}
                                className="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition active:scale-95"
                                title="Add to Shopping Bag"
                              >
                                <ShoppingBag size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ===================================================================
                    TABLET & DESKTOP: FULL 3-COLUMN CARD GRID (From Reference Image 1)
                   =================================================================== */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const prodId = String(product.id || product._id);
                  const isFavorited = !!wishlist[prodId];
                  const discountPercent = product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;
                  
                  const isSpecial = product.isFeatured || (discountPercent && discountPercent >= 30);
                  const frontImg = product.images?.frontView || "/products/iphone-pro-max.jpg";

                  return (
                    <div
                      key={prodId}
                      className="group relative bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      {/* Top Badges Row: Discount / Special Pill (Left) + Wishlist Heart (Right) */}
                      <div className="flex items-center justify-between mb-2">
                        {discountPercent ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-2xs tracking-tight">
                            -{discountPercent}%
                          </span>
                        ) : isSpecial ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-2xs tracking-tight">
                            Special
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Verified
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleWishlist(prodId, product.title)}
                          aria-label="Save to Wishlist"
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Heart
                            size={18}
                            className={isFavorited ? "text-rose-500 fill-rose-500" : "text-slate-400 group-hover:text-rose-500"}
                          />
                        </button>
                      </div>

                      {/* Product Photo Showcase */}
                      <Link
                        href={`/buy-phones/${prodId}`}
                        className="relative w-full h-48 sm:h-52 my-2 flex items-center justify-center overflow-hidden"
                      >
                        <Image
                          src={frontImg}
                          alt={product.title}
                          fill
                          className="object-contain p-2 group-hover:scale-106 transition-transform duration-400 ease-out drop-shadow-md"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>

                      {/* Product Information */}
                      <div className="space-y-1.5 pt-2">
                        <Link href={`/buy-phones/${prodId}`} className="block">
                          <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="text-[11px] text-slate-400 font-medium truncate">
                          {product.category || "Phones"} • {product.condition || "Like New"}
                        </div>

                        {/* Pricing Row */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-base sm:text-lg font-black text-slate-950">
                            AED {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through font-semibold">
                              AED {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Action Buttons: Prominent Blue CTA + Quick Cart Icon (Exact replica of Image 1!) */}
                      <div className="flex items-center gap-2 pt-4 mt-auto">
                        
                        {/* Blue Button: "Buy AED {price}" */}
                        <Link
                          href={`/buy-phones/${prodId}`}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm shadow-blue-600/20 transition-all hover:scale-102 active:scale-98 text-center flex items-center justify-center"
                        >
                          Buy AED {product.price.toLocaleString()}
                        </Link>

                        {/* Quick Add to Cart Basket Button [ 🛍️ ] */}
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          title="Add to Shopping Bag"
                          className="p-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
                        >
                          <ShoppingBag size={16} />
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
            ) : (
              /* =================================================================
                  LIST VIEW (FROM REFERENCE IMAGE 2)
                 ================================================================= */
              <div className="space-y-4">
                {filteredProducts.map((product) => {
                  const prodId = String(product.id || product._id);
                  const isFavorited = !!wishlist[prodId];
                  const frontImg = product.images?.frontView || "/products/iphone-pro-max.jpg";

                  return (
                    <div
                      key={prodId}
                      className="group bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 justify-between"
                    >
                      <Link
                        href={`/buy-phones/${prodId}`}
                        className="relative w-36 h-36 shrink-0 flex items-center justify-center"
                      >
                        <Image
                          src={frontImg}
                          alt={product.title}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <Link href={`/buy-phones/${prodId}`}>
                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start text-xs">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full">
                            Condition: {product.condition}
                          </span>
                          <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                            Warranty: {product.warranty || "12 Months"}
                          </span>
                          {product.batteryHealth && (
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                              Battery: {product.batteryHealth}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description || "Certified pre-owned phone, rigorously inspected with full hardware warranty."}
                        </p>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xl font-black text-slate-950">
                            AED {product.price.toLocaleString()}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-xs text-slate-400 line-through">
                              AED {product.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/buy-phones/${prodId}`}
                            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition"
                          >
                            Buy AED {product.price.toLocaleString()}
                          </Link>

                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="p-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                          >
                            <ShoppingBag size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Centered "Show More" Button (Direct from Image 1: "Show 145 More") */}
            {filteredProducts.length > 0 && (
              <div className="pt-8 text-center">
                <button
                  onClick={() => {
                    toast.info(`All ${filteredProducts.length} verified ${brandDisplayName} items are currently visible.`);
                  }}
                  className="px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs border border-slate-200 shadow-2xs transition-all hover:border-slate-300 cursor-pointer"
                >
                  Showing {filteredProducts.length} {brandDisplayName} Devices
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}
