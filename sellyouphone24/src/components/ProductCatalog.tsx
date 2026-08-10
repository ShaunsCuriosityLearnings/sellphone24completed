"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductType, BrandType } from "@/types";
import ProductCard from "./ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface ProductCatalogProps {
  initialProducts: ProductType[];
  brands: BrandType[];
  categoryName: string;
}

const ProductCatalog = ({ initialProducts, brands, categoryName }: ProductCatalogProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialBrandQuery = searchParams.get("brand");

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrandQuery ? [initialBrandQuery.toLowerCase()] : []
  );
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const brandFilteredProducts = useMemo(() => {
    if (!selectedBrands || selectedBrands.length === 0) return initialProducts || [];
    const selectedLower = selectedBrands.map(b => (b || "").toLowerCase());
    return (initialProducts || []).filter(p => {
      if (!p) return false;
      const pBrand = (p.brand || "").toLowerCase();
      return selectedLower.some(sb => pBrand.includes(sb) || sb.includes(pBrand));
    });
  }, [initialProducts, selectedBrands]);

  const availableStorages = useMemo(() => {
    const storages = new Set<string>();
    brandFilteredProducts.forEach(p => p.storages?.forEach(s => {
      if (s?.size) storages.add(s.size);
    }));
    return Array.from(storages).sort();
  }, [brandFilteredProducts]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    brandFilteredProducts.forEach(p => p.colors?.forEach(c => {
      if (c) colors.add(c);
    }));
    return Array.from(colors).sort();
  }, [brandFilteredProducts]);

  useEffect(() => {
    setSelectedStorages(prev => prev.filter(s => availableStorages.includes(s)));
    setSelectedColors(prev => prev.filter(c => availableColors.includes(c)));
  }, [availableStorages, availableColors]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedBrands.length === 1) {
      params.set("brand", selectedBrands[0]);
    } else {
      params.delete("brand");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedBrands, pathname, router]);

  const filteredProducts = useMemo(() => {
    return (initialProducts || []).filter(product => {
      if (!product) return false;
      const pName = (product.name || "").toLowerCase();
      const pBrand = (product.brand || "").toLowerCase();

      if (searchQuery && !pName.includes((searchQuery || "").toLowerCase())) {
        return false;
      }
      if (selectedBrands.length > 0) {
        const selectedBrandsLower = selectedBrands.map(b => (b || "").toLowerCase());
        const matchesBrand = selectedBrandsLower.some(sb => pBrand.includes(sb) || sb.includes(pBrand));
        if (!matchesBrand) return false;
      }
      if (selectedStorages.length > 0) {
        const selectedStoragesLower = selectedStorages.map(s => (s || "").toLowerCase());
        const hasStorage = product.storages?.some(s => s?.size && selectedStoragesLower.includes(s.size.toLowerCase()));
        if (!hasStorage) return false;
      }
      if (selectedColors.length > 0) {
        const selectedColorsLower = selectedColors.map(c => (c || "").toLowerCase());
        const hasColor = product.colors?.some(c => c && selectedColorsLower.includes(c.toLowerCase()));
        if (!hasColor) return false;
      }

      return true;
    });
  }, [initialProducts, searchQuery, selectedBrands, selectedStorages, selectedColors]);

  const toggleBrand = (brandSlug: string) => {
    const lower = brandSlug.toLowerCase();
    setSelectedBrands(prev => 
      prev.includes(lower) ? prev.filter(b => b !== lower) : [...prev, lower]
    );
  };

  const toggleStorage = (storage: string) => {
    setSelectedStorages(prev => 
      prev.includes(storage) ? prev.filter(s => s !== storage) : [...prev, storage]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedStorages([]);
    setSelectedColors([]);
    setSearchQuery("");
  };

  const activeFilterCount = selectedBrands.length + selectedStorages.length + selectedColors.length + (searchQuery ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      
      {/* Mobile Filter Trigger & Search Bar */}
      <div className="lg:hidden w-full flex gap-2.5 mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search device models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
        </div>
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="px-3.5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 active:scale-95 transition cursor-pointer shadow-xs"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* DESKTOP Sidebar Filters */}
      <div className="hidden lg:block w-64 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 shrink-0">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">Filters</h3>
        </div>

        {/* Search */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Search Model</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Filter */}
        {brands && brands.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Brands</h4>
            <div className="flex flex-wrap gap-1.5">
              {brands.map(brand => {
                const isSelected = selectedBrands.includes(brand.slug.toLowerCase());
                return (
                  <button
                    key={brand.id || brand.slug}
                    onClick={() => toggleBrand(brand.slug)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                      isSelected 
                        ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-xs" 
                        : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <span>{brand.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Storage Filter */}
        {availableStorages.length > 0 && (
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Storage Capacity</h4>
            <div className="flex flex-wrap gap-1.5">
              {availableStorages.map(storage => (
                <button
                  key={storage}
                  onClick={() => toggleStorage(storage)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    selectedStorages.includes(storage) 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Filter */}
        {availableColors.length > 0 && (
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Available Colors</h4>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    selectedColors.includes(color) 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                      : "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button 
            onClick={clearAllFilters}
            className="w-full py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* MOBILE BOTTOM DRAWER FILTER FEATURE */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Bottom Sheet Modal Container */}
          <div className="relative z-10 bg-white rounded-t-3xl border-t border-slate-200/80 p-5 shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col justify-between space-y-5 animate-in slide-in-from-bottom duration-300 w-full">
            
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto shrink-0 mb-1" />

            {/* Sheet Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Filter Devices</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)} 
                className="p-1 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sheet Options */}
            <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-1">
              
              {/* Search */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Search Model</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. iPhone 15 Pro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                </div>
              </div>

              {/* Brands */}
              {brands && brands.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Brands</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.map(brand => {
                      const isSelected = selectedBrands.includes(brand.slug.toLowerCase());
                      return (
                        <button
                          key={brand.id || brand.slug}
                          onClick={() => toggleBrand(brand.slug)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            isSelected 
                              ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-xs" 
                              : "bg-slate-50 text-slate-700 border-slate-200/80"
                          }`}
                        >
                          {brand.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storage */}
              {availableStorages.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Storage Capacity</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableStorages.map(storage => (
                      <button
                        key={storage}
                        onClick={() => toggleStorage(storage)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          selectedStorages.includes(storage) 
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                            : "bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {availableColors.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Available Colors</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          selectedColors.includes(color) 
                            ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                            : "bg-slate-50 text-slate-700 border-slate-200/80"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sheet Footer Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Show {filteredProducts.length} Results</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Content (Product Grid - 2 Cards per row on Mobile, 4 Cards per row on Desktop) */}
      <div className="flex-1 w-full">
        <div className="hidden lg:flex justify-between items-end mb-4">
          <p className="text-xs font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-extrabold">{filteredProducts.length}</span> devices
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-xs">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="text-slate-400 w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No Devices Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              We couldn&apos;t find any devices matching your selected filters. Try removing some filters to see more results.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Mobile: 2 Cards per row (grid-cols-2), Desktop: 4 Cards per row (lg:grid-cols-4 xl:grid-cols-4) */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductCatalog;
