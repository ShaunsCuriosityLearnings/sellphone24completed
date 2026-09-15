import { api } from "@/lib/api";
import Link from "next/link";
import BlogHeroBanner from "@/components/BlogHeroBanner";
import FeaturedBlogsGrid from "@/components/FeaturedBlogsGrid";
import PopularDevicesSidebar from "@/components/PopularDevicesSidebar";
import BlogCard from "@/components/BlogCard";
import { HelpCircle, Filter, ArrowUpDown, Sparkles } from "lucide-react";
import { ProductType } from "@/types";

export const metadata = {
  title: "Tech Journal & Resale Guides | SellPhoneCash UAE",
  description: "Read the latest news, market valuation guides, data security tips, and device recycling trends in Dubai & Abu Dhabi.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; search?: string }>;
}) {
  const { cat, sort, search } = await searchParams;

  // 1. Fetch live blogs & popular devices
  const [blogs, popularProducts] = await Promise.all([
    api.getBlogs({ cat, search }),
    api.getProducts({ isPopular: true }),
  ]);

  // 2. Filter & Sort logic
  let filteredBlogs = [...blogs];
  if (sort === "oldest") {
    filteredBlogs.sort(
      (a, b) => new Date(a.createdAt || new Date()).getTime() - new Date(b.createdAt || new Date()).getTime()
    );
  } else if (sort === "popular" || sort === "trending") {
    filteredBlogs.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // Default is newest
    filteredBlogs.sort(
      (a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
    );
  }

  // Categories list for filter tabs
  const categoriesList = [
    { name: "All Stories", slug: "all" },
    { name: "Buying Guides", slug: "buying-guides" },
    { name: "Recycling Tips", slug: "recycling-tips" },
    { name: "Price Analysis", slug: "price-analysis" },
  ];

  const activeCategorySlug = cat || "all";
  const activeSort = sort || "newest";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <BlogHeroBanner defaultSearch={search} />

      {/* 2. FEATURED STORIES 3-COLUMN GRID (Rendered when not actively filtering by search) */}
      {!search && blogs.length >= 3 && (
        <FeaturedBlogsGrid blogs={blogs} />
      )}

      {/* 3. MAIN SPLIT CONTENT GRID (LATEST POSTS + POPULAR DEVICES SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
        
        {/* ================= LEFT COLUMN: LATEST POSTS FEED (lg:col-span-8) ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* CATEGORY TABS & SORT FILTER BAR */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
              {categoriesList.map((category) => {
                const isActive = activeCategorySlug === category.slug;
                return (
                  <Link
                    key={category.slug}
                    href={`/blogs?${new URLSearchParams({
                      cat: category.slug,
                      sort: activeSort,
                      search: search || "",
                    }).toString()}`}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>

            {/* Sort Filter Selector */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Sort:</span>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
                <Link
                  href={`/blogs?${new URLSearchParams({
                    cat: activeCategorySlug,
                    sort: "newest",
                    search: search || "",
                  }).toString()}`}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeSort === "newest" ? "bg-white text-slate-900 shadow-xs font-bold" : "hover:text-slate-900"
                  }`}
                >
                  Latest
                </Link>
                <Link
                  href={`/blogs?${new URLSearchParams({
                    cat: activeCategorySlug,
                    sort: "popular",
                    search: search || "",
                  }).toString()}`}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    activeSort === "popular" ? "bg-white text-slate-900 shadow-xs font-bold" : "hover:text-slate-900"
                  }`}
                >
                  Popular
                </Link>
              </div>
            </div>

          </div>

          {/* ARTICLES GRID */}
          {filteredBlogs.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base">No articles found</h3>
                <p className="text-xs text-slate-500">Try adjusting your search criteria or category filter.</p>
              </div>
              <Link
                href="/blogs"
                className="inline-block bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              {filteredBlogs.map((post) => (
                <BlogCard key={post.id || post._id || post.slug} post={post} variant="grid" />
              ))}
            </div>
          )}

          {/* SPOTLIGHT BANNER AT BOTTOM OF FEED */}
          <div className="w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 pointer-events-none" />
            
            <div className="space-y-1.5 relative z-10 text-center sm:text-left">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Trade-in Instant Quote</span>
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                Ready to trade in your smartphone or laptop?
              </h3>
              <p className="text-xs text-slate-400">
                Get paid instant cash at your doorstep with free pickup across all UAE Emirates.
              </p>
            </div>

            <Link
              href="/services"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20 shrink-0 relative z-10 cursor-pointer"
            >
              Get Price Quote Now
            </Link>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: POPULAR DEVICES SIDEBAR (lg:col-span-4) ================= */}
        <div className="lg:col-span-4">
          <PopularDevicesSidebar
            products={popularProducts}
            currentCat={activeCategorySlug}
            currentSort={activeSort}
            currentSearch={search}
          />
        </div>

      </div>

    </div>
  );
}
