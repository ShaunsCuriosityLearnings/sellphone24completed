"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { CategoryType, BrandType, ProductType } from "@/types";

export default function QuickEvaluationWidget() {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const [filteredBrands, setFilteredBrands] = useState<BrandType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, brandRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getProducts(),
        ]);
        setCategories(catRes);
        setBrands(brandRes);
        setProducts(prodRes);
      } catch (err) {
        console.error("Failed loading search data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter brands when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredBrands(brands);
    } else {
      const catObj = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);
      if (catObj) {
        const matchingBrands = brands.filter(b => {
          if (!b.categories || b.categories.length === 0) return true;
          return b.categories.some((c: any) => 
            (typeof c === "string" && (c === catObj.id || c === catObj._id)) ||
            (typeof c === "object" && (c._id === catObj.id || c._id === catObj._id))
          );
        });
        setFilteredBrands(matchingBrands.length > 0 ? matchingBrands : brands);
      } else {
        setFilteredBrands(brands);
      }
    }
    setSelectedBrand("");
    setSelectedProduct("");
  }, [selectedCategory, categories, brands]);

  // Filter products when category or brand changes
  useEffect(() => {
    let prods = products;
    if (selectedCategory) {
      prods = prods.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedBrand) {
      const bObj = brands.find(b => b.slug === selectedBrand || b.name.toLowerCase() === selectedBrand.toLowerCase());
      if (bObj) {
        prods = prods.filter(p => {
          if (typeof p.brand === "string") {
            return p.brand.toLowerCase() === bObj.name.toLowerCase() || p.brand === bObj.id || p.brand === bObj._id;
          } else if (p.brand && typeof p.brand === "object") {
            return (p.brand as any).name?.toLowerCase() === bObj.name.toLowerCase();
          }
          return true;
        });
      }
    }
    setFilteredProducts(prods);
  }, [selectedCategory, selectedBrand, products, brands]);

  const handleGetEvaluation = () => {
    if (selectedProduct) {
      router.push(`/products/${selectedProduct}`);
    } else if (selectedBrand || selectedCategory) {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedBrand) params.append("brand", selectedBrand);
      router.push(`/services?${params.toString()}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-4 md:p-6 shadow-2xl shadow-emerald-950/5 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs">
          <Zap size={16} />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
            Get Instant Evaluation Quote
          </h3>
          <p className="text-xs text-slate-500">Select category, brand & model to calculate live payout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* 1. Category Dropdown */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
            1. Select Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer pr-10"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 2. Brand Dropdown */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
            2. Select Brand
          </label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer pr-10"
            >
              <option value="">All Brands</option>
              {filteredBrands.map((b) => (
                <option key={b.id || b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Model Dropdown */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
            3. Select Model
          </label>
          <div className="relative">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition cursor-pointer pr-10"
            >
              <option value="">Select Exact Model</option>
              {filteredProducts.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            onClick={handleGetEvaluation}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-slate-950 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            <Search size={16} />
            Get Evaluation
          </button>
        </div>
      </div>
    </div>
  );
}
