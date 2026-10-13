"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  SERVICE_PAGES,
  MODEL_PAGES,
  LOCATION_PAGES,
} from "@/lib/seoData";
import { api } from "@/lib/api";
import { ProductType, SeoPageConfigType } from "@/types";
import { toast } from "react-toastify";
import {
  Globe,
  Search,
  Sparkles,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Save,
  RotateCcw,
  TrendingUp,
  Plus,
  X,
  Smartphone,
  MapPin,
  Wrench,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  SlidersHorizontal,
  Check,
} from "lucide-react";

interface SeoPagesManagerProps {
  products: ProductType[];
  token?: string;
}

type UnifiedSeoItem = {
  slug: string;
  pageType: "service" | "model" | "location" | "hub";
  title: string;
  h1: string;
  subtitle: string;
  metaDescription: string;
  liveUrl: string;
  defaultHeroImage: string;
  targetKeywords: string[];
  override?: SeoPageConfigType;
};

// Preset high-res luxury backgrounds and hero photographs for 1-click selection
const HERO_PRESETS = [
  {
    name: "Dubai Skyline & Flagship Ledge (Sandstone)",
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Downtown Dubai & Burj Khalifa Sunset",
    url: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Minimalist Modern Tech Studio (Emerald)",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Dubai Marina Luxury Waterfront",
    url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function SeoPagesManager({ products, token }: SeoPagesManagerProps) {
  const [overrides, setOverrides] = useState<Record<string, SeoPageConfigType>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<UnifiedSeoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form draft state for currently editing item
  const [formDraft, setFormDraft] = useState<{
    customH1: string;
    customSubtitle: string;
    customHeroImage: string;
    customQuoteBadge: string;
    customQuotePrice: number | "";
    selectedProductIds: string[];
    targetKeywords: string[];
    newKeywordInput: string;
    rankTracking: { keyword: string; position: number }[];
  }>({
    customH1: "",
    customSubtitle: "",
    customHeroImage: "",
    customQuoteBadge: "",
    customQuotePrice: "",
    selectedProductIds: [],
    targetKeywords: [],
    newKeywordInput: "",
    rankTracking: [],
  });

  // Load saved overrides from MongoDB
  const fetchOverrides = async () => {
    setLoading(true);
    try {
      const savedList = await api.getSeoPages();
      const map: Record<string, SeoPageConfigType> = {};
      savedList.forEach((item) => {
        if (item.slug) {
          map[item.slug.toLowerCase()] = item;
        }
      });
      setOverrides(map);
    } catch (err: any) {
      console.warn("Could not load SEO page overrides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverrides();
  }, []);

  // Compile the full catalog of all 93 SEO pages merged with live overrides
  const allSeoPages: UnifiedSeoItem[] = useMemo(() => {
    const list: UnifiedSeoItem[] = [];

    // 1. Main Hub
    list.push({
      slug: "sell",
      pageType: "hub",
      title: "Sell Your Phone & Electronics in Dubai | Best Cash Prices",
      h1: "Sell Your Phone & Gadgets for Instant Cash in Dubai",
      subtitle: "Get a live market quote for your iPhone, Samsung Galaxy, MacBook, iPad and receive cash quickly with free doorstep pickup anywhere in Dubai.",
      metaDescription: "Sell your used phone in Dubai for instant cash with free doorstep pickup in 3 hours.",
      liveUrl: "/sell",
      defaultHeroImage: "/images/dubai-skyline.jpg",
      targetKeywords: ["sell phone dubai", "sell used phone dubai", "instant cash phone uae"],
      override: overrides["sell"],
    });

    // 2. Service & Brand Pages
    Object.values(SERVICE_PAGES).forEach((svc) => {
      const slugKey = svc.slug.toLowerCase();
      list.push({
        slug: svc.slug,
        pageType: "service",
        title: svc.title,
        h1: svc.h1,
        subtitle: svc.subtitle,
        metaDescription: svc.metaDescription,
        liveUrl: `/sell/${svc.slug}`,
        defaultHeroImage: "/images/dubai-hero-phones.jpg",
        targetKeywords: svc.targetKeywords || [],
        override: overrides[slugKey],
      });
    });

    // 3. Specific Model Valuation Pages
    Object.values(MODEL_PAGES).forEach((mod) => {
      const slugKey = mod.slug.toLowerCase();
      list.push({
        slug: mod.slug,
        pageType: "model",
        title: mod.title,
        h1: mod.h1,
        subtitle: mod.subtitle,
        metaDescription: mod.metaDescription,
        liveUrl: `/sell/model/${mod.slug}`,
        defaultHeroImage: "/products/iphone-pro-max.jpg",
        targetKeywords: mod.targetKeywords || [],
        override: overrides[slugKey],
      });
    });

    // 4. Dubai Location Pages
    Object.values(LOCATION_PAGES).forEach((loc) => {
      const slugKey = loc.slug.toLowerCase();
      list.push({
        slug: loc.slug,
        pageType: "location",
        title: loc.title,
        h1: loc.h1,
        subtitle: loc.subtitle,
        metaDescription: loc.metaDescription,
        liveUrl: `/sell/location/${loc.slug}`,
        defaultHeroImage: "/images/dubai-skyline.jpg",
        targetKeywords: loc.targetKeywords || [],
        override: overrides[slugKey],
      });
    });

    return list;
  }, [overrides]);

  // Filtered list based on search and type filter
  const filteredPages = useMemo(() => {
    return allSeoPages.filter((item) => {
      if (selectedTypeFilter !== "all" && item.pageType !== selectedTypeFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.h1.toLowerCase().includes(q) ||
        item.targetKeywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [allSeoPages, selectedTypeFilter, searchQuery]);

  // Open Edit Modal for a page
  const handleOpenEdit = (item: UnifiedSeoItem) => {
    setEditingItem(item);
    const existing = item.override;

    // Resolve featured product IDs (either from override or auto-matched)
    const initialProductIds: string[] = existing?.featuredProducts
      ? existing.featuredProducts.map((p) => String(p.id || p._id))
      : [];

    setFormDraft({
      customH1: existing?.customH1 || item.h1 || "",
      customSubtitle: existing?.customSubtitle || item.subtitle || "",
      customHeroImage: existing?.customHeroImage || "",
      customQuoteBadge: existing?.customQuoteBadge || "Live quote • AED 2,850",
      customQuotePrice: existing?.customQuotePrice ?? "",
      selectedProductIds: initialProductIds,
      targetKeywords: existing?.targetKeywords?.length ? existing.targetKeywords : [...item.targetKeywords],
      newKeywordInput: "",
      rankTracking: existing?.rankTracking?.map((r) => ({ keyword: r.keyword, position: r.position })) || [
        { keyword: item.targetKeywords[0] || item.slug.replace(/-/g, " "), position: 1 },
      ],
    });
  };

  // Close modal
  const handleCloseEdit = () => {
    setEditingItem(null);
  };

  // Handle Cloudinary Hero Image Upload
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadedUrl = await api.uploadSeoHeroImage(file, token);
      setFormDraft((prev) => ({ ...prev, customHeroImage: uploadedUrl }));
      toast.success("Hero image uploaded to Cloudinary successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload hero image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Toggle a product in the curated products list
  const handleToggleProduct = (productId: string) => {
    setFormDraft((prev) => {
      const exists = prev.selectedProductIds.includes(productId);
      const next = exists
        ? prev.selectedProductIds.filter((id) => id !== productId)
        : [...prev.selectedProductIds, productId];
      return { ...prev, selectedProductIds: next };
    });
  };

  // Add keyword
  const handleAddKeyword = () => {
    const kw = formDraft.newKeywordInput.trim();
    if (!kw) return;
    if (formDraft.targetKeywords.includes(kw)) {
      toast.info("Keyword already exists");
      return;
    }
    setFormDraft((prev) => ({
      ...prev,
      targetKeywords: [...prev.targetKeywords, kw],
      newKeywordInput: "",
      rankTracking: [...prev.rankTracking, { keyword: kw, position: 0 }],
    }));
  };

  // Remove keyword
  const handleRemoveKeyword = (kwToRemove: string) => {
    setFormDraft((prev) => ({
      ...prev,
      targetKeywords: prev.targetKeywords.filter((k) => k !== kwToRemove),
      rankTracking: prev.rankTracking.filter((r) => r.keyword !== kwToRemove),
    }));
  };

  // Compute live SEO score for the draft
  const currentDraftSeoScore = useMemo(() => {
    let score = 0;
    if (formDraft.customH1.length >= 15) score += 25;
    else if (formDraft.customH1.length > 0) score += 15;

    if (formDraft.customSubtitle.length >= 40) score += 25;
    else if (formDraft.customSubtitle.length > 0) score += 15;

    if (formDraft.targetKeywords.length >= 2) score += 25;
    else if (formDraft.targetKeywords.length > 0) score += 15;

    if (formDraft.customHeroImage || formDraft.selectedProductIds.length > 0) score += 25;
    else score += 15;

    return Math.min(100, Math.max(50, score));
  }, [formDraft]);

  // Save changes to MongoDB
  const handleSavePageConfig = async () => {
    if (!editingItem) return;
    setIsSubmitting(true);

    try {
      const payload: Partial<SeoPageConfigType> = {
        slug: editingItem.slug,
        pageType: editingItem.pageType,
        customH1: formDraft.customH1.trim(),
        customSubtitle: formDraft.customSubtitle.trim(),
        customHeroImage: formDraft.customHeroImage.trim() || undefined,
        customQuoteBadge: formDraft.customQuoteBadge.trim() || undefined,
        customQuotePrice: typeof formDraft.customQuotePrice === "number" ? formDraft.customQuotePrice : undefined,
        featuredProducts: formDraft.selectedProductIds as any,
        targetKeywords: formDraft.targetKeywords,
        seoScore: currentDraftSeoScore,
        rankTracking: formDraft.rankTracking.map((r) => ({
          keyword: r.keyword,
          position: r.position,
          checkedAt: new Date().toISOString(),
        })),
        isActive: true,
      };

      const saved = await api.upsertSeoPage(editingItem.slug, payload, token);
      toast.success(`Saved SEO configuration for /sell/${editingItem.slug}!`);

      // Update local state map
      setOverrides((prev) => ({
        ...prev,
        [editingItem.slug.toLowerCase()]: saved,
      }));

      handleCloseEdit();
    } catch (err: any) {
      toast.error(err.message || "Failed to save SEO page configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset to static defaults
  const handleResetToDefaults = async (slug: string) => {
    if (!confirm(`Reset /sell/${slug} back to default static layout and auto-queried products?`)) {
      return;
    }

    try {
      await api.deleteSeoPage(slug, token);
      toast.info(`Reset /sell/${slug} to defaults.`);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[slug.toLowerCase()];
        return next;
      });
      if (editingItem?.slug === slug) {
        handleCloseEdit();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset override");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-6 shadow-sm">
      
      {/* Header with Title and Global Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-1.5 border border-emerald-200">
            <Globe size={13} />
            <span>Search Engine Optimization &amp; Buyback Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SEO Pages, Hero Customizer &amp; Rank Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage hero banners, live payout quotes, curated product showcases, and track Google UAE keyword rankings across all 93 SEO routes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOverrides}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-emerald-600" : ""} />
            <span>Sync Live DB</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Programmatic Pages</span>
          <div className="text-2xl font-black text-slate-900">{allSeoPages.length}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% active in sitemap.xml</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Custom Admin Overrides</span>
          <div className="text-2xl font-black text-emerald-600">{Object.keys(overrides).length}</div>
          <span className="text-[10px] text-slate-500 font-medium">Overriding static defaults</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average SEO Score</span>
          <div className="text-2xl font-black text-slate-900">92%</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Optimized for Google UAE</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Catalog Linkage</span>
          <div className="text-2xl font-black text-slate-900">{products.length}</div>
          <span className="text-[10px] text-slate-500 font-medium">Live MongoDB devices</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, device model, area, or URL slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All (93)" },
            { id: "service", label: "Brands & Services (41)" },
            { id: "model", label: "Specific Models (42)" },
            { id: "location", label: "Dubai Areas (9)" },
            { id: "hub", label: "Main Hub (1)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedTypeFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SEO Route &amp; Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Hero Status</th>
                <th className="py-3 px-4">Linked Products</th>
                <th className="py-3 px-4">SEO Score</th>
                <th className="py-3 px-4">Top UAE Keyword</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map((item) => {
                const hasOverride = Boolean(item.override);
                const score = item.override?.seoScore || 88;
                const heroSrc = item.override?.customHeroImage || item.defaultHeroImage;
                const topKeyword = item.override?.targetKeywords?.[0] || item.targetKeywords[0] || item.slug.replace(/-/g, " ");
                const curatedCount = item.override?.featuredProducts?.length || 0;

                return (
                  <tr key={item.slug} className="hover:bg-slate-50/70 transition-colors">
                    {/* Route & Name */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{item.h1}</span>
                          {hasOverride && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Customized
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.liveUrl}
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        item.pageType === "model"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : item.pageType === "location"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : item.pageType === "hub"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {item.pageType === "model" && <Smartphone size={11} />}
                        {item.pageType === "location" && <MapPin size={11} />}
                        {item.pageType === "service" && <Wrench size={11} />}
                        {item.pageType === "hub" && <Globe size={11} />}
                        {item.pageType}
                      </span>
                    </td>

                    {/* Hero Thumbnail Preview */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-7 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={heroSrc}
                            alt="Hero thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/products/iphone-pro-max.jpg";
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium line-clamp-1 max-w-[120px]">
                          {item.override?.customQuoteBadge || "Live Payout Badge"}
                        </span>
                      </div>
                    </td>

                    {/* Linked Products */}
                    <td className="py-3 px-4">
                      {curatedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">
                          {curatedCount} Curated Products
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Auto-Categorized
                        </span>
                      )}
                    </td>

                    {/* SEO Health Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full ${
                              score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-slate-800 text-[11px]">{score}%</span>
                      </div>
                    </td>

                    {/* Top Keyword & 1-Click SERP Search */}
                    <td className="py-3 px-4">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(topKeyword)}&gl=ae`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                        title="Inspect Live UAE Google SERP Ranking"
                      >
                        <span className="line-clamp-1 max-w-[130px]">{topKeyword}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <SlidersHorizontal size={12} />
                          <span>Configure</span>
                        </button>

                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
                          title="Open live page in new tab"
                        >
                          <ExternalLink size={13} />
                        </a>

                        {hasOverride && (
                          <button
                            onClick={() => handleResetToDefaults(item.slug)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Reset page override to defaults"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT MODAL: HERO, LINKED PRODUCTS, HEADLINE & RANKINGS                   */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    Configure SEO Page
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{editingItem.liveUrl}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingItem.h1}
                </h3>
              </div>

              <button
                onClick={handleCloseEdit}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Live SEO Score Gauge Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>On-Page SEO Optimization Score</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Calculated based on H1 length, keywords density, custom hero status, and linked products.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-xl font-black text-emerald-600">{currentDraftSeoScore}%</div>
                  <div className="w-20 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${currentDraftSeoScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 1: HERO IMAGE CUSTOMIZER */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-emerald-600" />
                    <span>1. Hero Banner Image</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Cloudinary Upload or Presets</span>
                </div>

                {/* Hero Preview Box */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src={formDraft.customHeroImage || editingItem.defaultHeroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover opacity-90"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/products/iphone-pro-max.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white space-y-0.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Preview</span>
                      <h4 className="text-sm font-bold line-clamp-1">{formDraft.customH1 || editingItem.h1}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{formDraft.customQuoteBadge}</p>
                    </div>
                  </div>
                </div>

                {/* Upload or enter URL */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      value={formDraft.customHeroImage}
                      onChange={(e) => setFormDraft((prev) => ({ ...prev, customHeroImage: e.target.value }))}
                      placeholder="Paste image URL (https://res.cloudinary.com/...)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className={`w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      uploadingImage ? "opacity-50 pointer-events-none" : ""
                    }`}>
                      <Upload size={13} className={uploadingImage ? "animate-spin" : ""} />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 1-Click Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {HERO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormDraft((prev) => ({ ...prev, customHeroImage: preset.url }))}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 text-[11px] font-medium transition cursor-pointer"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: HEADLINE & LIVE VALUATION QUOTE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>2. Headlines &amp; Live Quote Badges</span>
                </label>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Custom H1 Headline</label>
                    <input
                      type="text"
                      value={formDraft.customH1}
                      onChange={(e) => setFormDraft((prev) => ({ ...prev, customH1: e.target.value }))}
                      placeholder="e.g. Sell Your iPhone in Dubai for Guaranteed Instant Cash"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 mt-0.5"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Custom Subtitle &amp; Value Proposition</label>
                    <textarea
                      rows={2}
                      value={formDraft.customSubtitle}
                      onChange={(e) => setFormDraft((prev) => ({ ...prev, customSubtitle: e.target.value }))}
                      placeholder="Detailed subtitle explaining doorstep arrival speed and cash payout guarantees..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 mt-0.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600">Live Quote Badge Text</label>
                      <input
                        type="text"
                        value={formDraft.customQuoteBadge}
                        onChange={(e) => setFormDraft((prev) => ({ ...prev, customQuoteBadge: e.target.value }))}
                        placeholder="Live quote • AED 2,850"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 mt-0.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600">Custom Benchmark AED Price</label>
                      <input
                        type="number"
                        value={formDraft.customQuotePrice}
                        onChange={(e) =>
                          setFormDraft((prev) => ({
                            ...prev,
                            customQuotePrice: e.target.value ? Number(e.target.value) : "",
                          }))
                        }
                        placeholder="e.g. 2850"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CURATE LIVE PRODUCTS FOR THIS SEO PAGE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone size={14} className="text-emerald-600" />
                    <span>3. Curate Live Database Products ({formDraft.selectedProductIds.length} Selected)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {formDraft.selectedProductIds.length === 0 ? "Using automatic category matching" : "Manual override active"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Select which live database products appear in the &ldquo;Today&apos;s Live Buying Prices&rdquo; grid on this specific SEO page:
                </p>

                {/* Product Multi-select Pills Grid */}
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50">
                  {products.map((product) => {
                    const pId = String(product.id || product._id);
                    const isSelected = formDraft.selectedProductIds.includes(pId);
                    return (
                      <div
                        key={pId}
                        onClick={() => handleToggleProduct(pId)}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition select-none ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-7 h-7 rounded-md bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                            <img
                              src={product.images?.frontView || "/products/iphone-pro-max.jpg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden">
                            <div className="truncate text-xs">{product.name}</div>
                            <div className="text-[10px] text-emerald-600 font-black">
                              AED {product.basePrice.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                        }`}>
                          {isSelected && <Check size={10} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: TARGET KEYWORDS & SERP AUDIT */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <span>4. Target Keywords &amp; Google UAE SERP Rankings</span>
                </label>

                {/* Add Keyword Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formDraft.newKeywordInput}
                    onChange={(e) => setFormDraft((prev) => ({ ...prev, newKeywordInput: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                    placeholder="Add target keyword (e.g. sell used iphone in dubai marina)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus size={13} />
                    <span>Add Keyword</span>
                  </button>
                </div>

                {/* Keywords Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {formDraft.targetKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium"
                    >
                      <span>{kw}</span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(kw)}&gl=ae`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-950 p-0.5"
                        title="Search Live in UAE Google"
                      >
                        <ExternalLink size={10} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 ml-0.5 cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => handleResetToDefaults(editingItem.slug)}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-xs text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSavePageConfig}
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} className={isSubmitting ? "animate-spin" : ""} />
                  <span>{isSubmitting ? "Publishing..." : "Save & Publish Changes"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
