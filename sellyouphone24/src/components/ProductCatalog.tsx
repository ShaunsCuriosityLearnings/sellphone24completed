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

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden w-full flex gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search device models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-500"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="px-4 py-3 bg-slate-900 text-white font-bold text-sm rounded-2xl flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`w-full lg:w-64 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
          {isMobileFiltersOpen && (
            <button onClick={() => setIsMobileFiltersOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="hidden lg:block">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Search Model</label>
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

        {/* Brand Filter */}
        {brands && brands.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Brands</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => {
                const isSelected = selectedBrands.includes(brand.slug.toLowerCase());
                return (
                  <button
                    key={brand.id || brand.slug}
                    onClick={() => toggleBrand(brand.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected 
                        ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20" 
                        : "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300"
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
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Storage Capacity</h4>
            <div className="flex flex-wrap gap-2">
              {availableStorages.map(storage => (
                <button
                  key={storage}
                  onClick={() => toggleStorage(storage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedStorages.includes(storage) 
                      ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20" 
                      : "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300"
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
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Available Colors</h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedColors.includes(color) 
                      ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20" 
                      : "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(selectedBrands.length > 0 || selectedStorages.length > 0 || selectedColors.length > 0 || searchQuery) && (
          <button 
            onClick={clearAllFilters}
            className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Main Content (Product Grid - 5 Cards per row on Desktop) */}
      <div className="flex-1 w-full">
        <div className="hidden lg:flex justify-between items-end mb-6">
          <p className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-extrabold">{filteredProducts.length}</span> devices
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Devices Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              We couldn&apos;t find any devices matching your selected filters. Try removing some filters to see more results.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Desktop: 5 Cards in a row (grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5) */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
