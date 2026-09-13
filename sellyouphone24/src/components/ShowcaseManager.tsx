"use client";

import { useState } from "react";
import { ProductType } from "@/types";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { 
  Sparkles, 
  Star, 
  Zap, 
  Trash2, 
  Search, 
  LayoutGrid, 
  AlertCircle
} from "lucide-react";
import Image from "next/image";

interface ShowcaseManagerProps {
  products: ProductType[];
  token?: string;
  onRefreshData: () => Promise<void>;
}

export default function ShowcaseManager({ products, token, onRefreshData }: ShowcaseManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Helper to safely obtain product ID (handling _id vs id)
  const getPId = (p: ProductType): string => String(p._id || p.id || "");

  // Safe helper to extract front image
  const getProductFrontImage = (p?: ProductType | null): string => {
    if (!p) return "/products/iphone-pro-max.jpg";
    if (typeof p.images === "object" && p.images?.frontView) return p.images.frontView;
    if (typeof p.images === "string" && p.images) return p.images;
    return "/products/iphone-pro-max.jpg";
  };

  // Safe helper to get formatted price
  const getFormattedPrice = (price?: number): string => {
    return (price || 0).toLocaleString();
  };

  // Filtered lists
  const heroProduct = products.find(p => p.isHeroProduct);
  const popularProducts = products.filter(p => p.isPopular);
  const livePriceProducts = products.filter(p => p.isLivePrice);

  const filteredSearchProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof p.brand === "string" ? p.brand : (p.brand as any)?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { getToken } = useAuth();

  const getFreshToken = async (): Promise<string | undefined> => {
    try {
      const t = await getToken();
      return t || token || undefined;
    } catch (err) {
      return token || undefined;
    }
  };

  // Handlers
  const handleSetHero = async (product: ProductType) => {
    const id = getPId(product);
    if (!id) return;
    setLoadingAction(`hero_${id}`);
    try {
      const activeToken = await getFreshToken();
      await api.setHeroProduct(id, activeToken);
      toast.success(`"${product.name}" tagged as Featured Hero Product!`);
      await onRefreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update Hero Product.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTogglePopular = async (product: ProductType, setPopular: boolean) => {
    const id = getPId(product);
    if (!id) return;
    setLoadingAction(`pop_${id}`);
    try {
      const activeToken = await getFreshToken();
      await api.updateProduct(id, { isPopular: setPopular }, activeToken);
      toast.success(setPopular ? `Added "${product.name}" to Popular Devices` : `Removed "${product.name}" from Popular Devices`);
      await onRefreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update Popular status.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleLivePrice = async (product: ProductType, setLive: boolean) => {
    if (setLive && livePriceProducts.length >= 6) {
      toast.error("Maximum 6 devices allowed in Today's Live Buying Prices section. Remove an existing device first.");
      return;
    }

    const id = getPId(product);
    if (!id) return;
    setLoadingAction(`live_${id}`);
    try {
      const activeToken = await getFreshToken();
      await api.updateProduct(id, { isLivePrice: setLive }, activeToken);
      toast.success(setLive ? `Added "${product.name}" to Live Buying Prices` : `Removed "${product.name}" from Live Buying Prices`);
      await onRefreshData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update Live Price status.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8 w-full text-slate-800">
      
      {/* HEADER BAR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutGrid size={14} />
            Homepage Frontpage Manager
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Homepage Showcase & Section Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate the main Hero Section, Popular Devices We Buy, and Today's Live Buying Prices (Max 6 limit).
          </p>
        </div>
      </div>

      {/* 1. HERO SECTION FEATURED DEVICE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-500" />
              1. Hero Section Featured Device
            </h3>
            <p className="text-xs text-slate-500">The product main image and top payout tag rendered on the primary top hero section</p>
          </div>
          {heroProduct && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Active Hero Product Tagged
            </span>
          )}
        </div>

        {heroProduct ? (
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative rounded-xl bg-white p-2 border border-slate-200 shrink-0">
                <Image
                  src={getProductFrontImage(heroProduct)}
                  alt={heroProduct.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Featured Hero</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-1">{heroProduct.name}</h4>
                <p className="text-xs text-slate-500">Base Price: AED {getFormattedPrice(heroProduct.basePrice)}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">Select a new device in catalog table below to replace</span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No product specifically tagged as Hero. Falling back to default flagship iPhone hero graphic.
          </div>
        )}
      </div>

      {/* 2. TODAY'S LIVE BUYING PRICES (MAX 6 DEVICES LIMIT) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              2. Today's Live Buying Prices (Maximum 6 Devices)
            </h3>
            <p className="text-xs text-slate-500">Featured in the frontpage live buying prices grid</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              livePriceProducts.length >= 6 
                ? "bg-amber-50 border-amber-300 text-amber-800" 
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}>
              {livePriceProducts.length} / 6 Slots Filled
            </span>
          </div>
        </div>

        {livePriceProducts.length >= 6 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-800 font-semibold">
            <AlertCircle size={16} className="shrink-0 text-amber-600" />
            Maximum limit reached (6 devices). You must remove one device before adding a new live price device.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {livePriceProducts.map((p) => {
            const pId = getPId(p);
            return (
              <div key={pId} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded-xl bg-white p-1 border border-slate-200 shrink-0">
                    <Image src={getProductFrontImage(p)} alt={p.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                    <p className="text-[10px] text-slate-500">AED {getFormattedPrice(p.basePrice)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleLivePrice(p, false)}
                  disabled={loadingAction === `live_${pId}`}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            );
          })}
          {livePriceProducts.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-slate-400">
              No devices currently tagged for Today's Live Buying Prices. Select devices from catalog below.
            </div>
          )}
        </div>
      </div>

      {/* 3. POPULAR DEVICES WE BUY */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Star size={18} className="text-emerald-500" />
              3. Popular Devices We Buy ({popularProducts.length})
            </h3>
            <p className="text-xs text-slate-500">Trending popular devices featured on homepage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularProducts.map((p) => {
            const pId = getPId(p);
            return (
              <div key={pId} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded-xl bg-white p-1 border border-slate-200 shrink-0">
                    <Image src={getProductFrontImage(p)} alt={p.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{p.name}</h4>
                    <p className="text-[10px] text-slate-500">AED {getFormattedPrice(p.basePrice)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePopular(p, false)}
                  disabled={loadingAction === `pop_${pId}`}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            );
          })}
          {popularProducts.length === 0 && (
            <div className="col-span-full p-6 text-center text-xs text-slate-400">
              No popular devices currently tagged. Select devices from catalog table below.
            </div>
          )}
        </div>
      </div>

      {/* 4. PRODUCT CATALOG SEARCH & QUICK SHOWCASE ASSIGNMENT TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Catalog Showcase Selector</h3>
            <p className="text-xs text-slate-500">Search any product to tag for Hero, Popular, or Today's Live Buying Prices</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Base Price</th>
                <th className="p-3 text-center">Hero Product</th>
                <th className="p-3 text-center">Popular Device</th>
                <th className="p-3 text-center">Live Buying Price (Max 6)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSearchProducts.slice(0, 30).map((p) => {
                const pId = getPId(p);
                const isHero = Boolean(p.isHeroProduct);
                const isPop = Boolean(p.isPopular);
                const isLive = Boolean(p.isLivePrice);

                return (
                  <tr key={pId} className="hover:bg-slate-50 transition">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 relative rounded-lg bg-slate-100 p-0.5 border border-slate-200 shrink-0">
                        <Image src={getProductFrontImage(p)} alt={p.name} fill className="object-contain" />
                      </div>
                      <span className="font-bold text-slate-900">{p.name}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">AED {getFormattedPrice(p.basePrice)}</td>
                    
                    {/* Hero Tag Button */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleSetHero(p)}
                        disabled={loadingAction === `hero_${pId}` || isHero}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          isHero
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600"
                        }`}
                      >
                        {isHero ? "Hero Tagged" : "Set as Hero"}
                      </button>
                    </td>

                    {/* Popular Tag Toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleTogglePopular(p, !isPop)}
                        disabled={loadingAction === `pop_${pId}`}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          isPop
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isPop ? "Popular Tagged" : "+ Add Popular"}
                      </button>
                    </td>

                    {/* Live Buying Price Toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleLivePrice(p, !isLive)}
                        disabled={loadingAction === `live_${pId}` || (!isLive && livePriceProducts.length >= 6)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          isLive
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : livePriceProducts.length >= 6
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600"
                        }`}
                      >
                        {isLive ? "Live Tagged" : livePriceProducts.length >= 6 ? "Max 6 Reached" : "+ Add Live Price"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
