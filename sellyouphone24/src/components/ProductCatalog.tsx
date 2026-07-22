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

  // Read initial brand from URL if it exists (e.g. ?brand=apple)
  const initialBrandQuery = searchParams.get("brand");

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrandQuery ? [initialBrandQuery.toLowerCase()] : []
  );
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter products by selected brands first to compute dynamic storage & color options
  const brandFilteredProducts = useMemo(() => {
    if (!selectedBrands || selectedBrands.length === 0) return initialProducts || [];
    const selectedLower = selectedBrands.map(b => (b || "").toLowerCase());
    return (initialProducts || []).filter(p => {
      if (!p) return false;
      const pBrand = (p.brand || "").toLowerCase();
      return selectedLower.some(sb => pBrand.includes(sb) || sb.includes(pBrand));
    });
  }, [initialProducts, selectedBrands]);

  // Dynamically extract available storages and colors based on selected brand(s)
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

  // Clean up active filter selections if they are not in the new brand options
  useEffect(() => {
    setSelectedStorages(prev => prev.filter(s => availableStorages.includes(s)));
    setSelectedColors(prev => prev.filter(c => availableColors.includes(c)));
  }, [availableStorages, availableColors]);

  // Sync URL with selected brands (optional but good for sharing links)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedBrands.length === 1) {
      params.set("brand", selectedBrands[0]);
    } else {
      params.delete("brand");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedBrands, pathname, router]);

  // Filter products based on selected states
  const filteredProducts = useMemo(() => {
    return (initialProducts || []).filter(product => {
      if (!product) return false;
      const pName = (product.name || "").toLowerCase();
      const pBrand = (product.brand || "").toLowerCase();

      // Search filter
      if (searchQuery && !pName.includes((searchQuery || "").toLowerCase())) {
        return false;
      }
      // Brand filter (fuzzy & case-insensitive matching)
      if (selectedBrands.length > 0) {
        const selectedBrandsLower = selectedBrands.map(b => (b || "").toLowerCase());
        const matchesBrand = selectedBrandsLower.some(sb => pBrand.includes(sb) || sb.includes(pBrand));
        if (!matchesBrand) return false;
      }
      // Storage filter (product must have AT LEAST ONE of the selected storages)
      if (selectedStorages.length > 0) {
        const selectedStoragesLower = selectedStorages.map(s => (s || "").toLowerCase());
        const hasStorage = product.storages?.some(s => s?.size && selectedStoragesLower.includes(s.size.toLowerCase()));
        if (!hasStorage) return false;
      }
      // Color filter (product must have AT LEAST ONE of the selected colors)
      if (selectedColors.length > 0) {
        const selectedColorsLower = selectedColors.map(c => (c || "").toLowerCase());
        const hasColor = product.colors?.some(c => c && selectedColorsLower.includes(c.toLowerCase()));
        if (!hasColor) return false;
      }
      return true;
    });
  }, [initialProducts, searchQuery, selectedBrands, selectedStorages, selectedColors]);

  const toggleBrand = (brandName: string) => {
    const name = (brandName || "").toLowerCase();
    setSelectedBrands(prev => 
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <span className="font-bold text-slate-700 text-sm">{filteredProducts.length} Devices Found</span>
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`
        fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-transform duration-300 lg:static lg:bg-transparent lg:p-0 lg:overflow-visible lg:block lg:w-64 flex-shrink-0 lg:z-auto
        ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex justify-between items-center mb-6 lg:mb-4">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-emerald-500" /> Filters
          </h3>
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="lg:hidden p-2 bg-slate-100 rounded-full text-slate-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search ${categoryName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-medium focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          {/* Brands Filter */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Brands</h4>
            <div className="grid grid-cols-2 gap-2">
              {brands.map(brand => {
                const isSelected = brand?.name ? selectedBrands.includes(brand.name.toLowerCase()) : false;
                return (
                  <button
                    key={brand.id}
                    onClick={() => toggleBrand(brand.name)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                      isSelected 
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-500/10" 
                        : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-2xl">
                      {(brand.logo && (brand.logo.startsWith("/") || brand.logo.startsWith("http"))) ? (
                        <div className="relative w-full h-full">
                          <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                        </div>
                      ) : (
                        <span>{brand.logo || "📱"}</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? "text-emerald-700" : "text-slate-600"}`}>
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storage Filter */}
          {availableStorages.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Storage Capacity</h4>
              <div className="flex flex-wrap gap-2">
                {availableStorages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => toggleStorage(storage)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedStorages.includes(storage) 
                        ? "bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-800/20" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
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
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Color</h4>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedColors.includes(color) 
                        ? "bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-800/20" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600"
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
              className="w-full py-2.5 rounded-xl bg-red-50 text-red-500 font-bold text-xs hover:bg-red-100 transition"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content (Product Grid) */}
      <div className="flex-1">
        <div className="hidden lg:flex justify-between items-end mb-6">
          <p className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> devices
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Devices Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find any devices matching your selected filters. Try removing some filters to see more results.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
