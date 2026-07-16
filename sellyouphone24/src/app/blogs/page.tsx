import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { HelpCircle, RefreshCcw, Search, Sparkles, Filter } from "lucide-react";
import { api } from "@/lib/api";

export const metadata = {
  title: "Tech & Recycling Blogs | SellYourPhone24",
  description: "Read the latest news, guides, and tips on device recycling, smartphone valuations, and tech comparisons in the UAE.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; search?: string }>;
}) {
  const { cat, sort, search } = await searchParams;

  // Fetch live blogs from MongoDB
  const blogs = await api.getBlogs({ cat, search });

  // Sorting logic
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

  // Categories list for the sidebar
  const categoriesList = [
    { name: "All", slug: "all" },
    { name: "Buying Guides", slug: "buying-guides" },
    { name: "Recycling Tips", slug: "recycling-tips" },
    { name: "Price Analysis", slug: "price-analysis" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
          Tech & Recycling Blogs
        </h1>
        <p className="text-sm text-slate-500">
          Learn about device security, data cleansing, recycling statistics, and UAE resale value movements.
        </p>
      </div>

      {/* Mock Ads/Partnership Banner to replicate Bollywood Blink's layout */}
      <div className="w-full bg-slate-900 text-white rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} />
            Spotlight Offer
          </span>
          <h3 className="font-extrabold text-base md:text-lg">Trade in your iPhone 15 today for an extra AED 150!</h3>
          <p className="text-xs text-slate-400">Lock in your valuation before the next generation iPhone release details drop.</p>
        </div>
        <Link
          href="/services/smartphones/apple"
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition z-10 whitespace-nowrap"
        >
          Check iPhone Value
        </Link>
      </div>

      {/* Main Split Content */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column - Articles Feed */}
        <div className="lg:col-span-8 space-y-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-bold">No articles found.</p>
              <Link href="/blogs" className="text-xs text-emerald-500 underline">
                Reset all filters
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-8">
              {filteredBlogs.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Sticky Sidebar matching Bollywood Blink's layout */}
        <div className="lg:col-span-4 sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-8">
          
          {/* SEARCH COMPONENT */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2">Search Articles</h3>
            <form className="relative flex items-center border border-slate-200 focus-within:border-emerald-500 rounded-xl p-2.5 bg-slate-50/50">
              <Search className="w-4 h-4 text-slate-400 ml-1.5" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search keywords..."
                className="w-full bg-transparent border-none outline-none py-1 px-3 text-xs text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white hover:bg-emerald-500 hover:text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-bold transition"
              >
                Go
              </button>
            </form>
          </div>

          {/* SORT FILTERS */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2">Sort By</h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
              {["newest", "oldest", "popular"].map((s) => {
                const isChecked = sort === s || (s === "newest" && !sort);
                return (
                  <Link
                    key={s}
                    href={`/blogs?${new URLSearchParams({ cat: cat || "all", sort: s, search: search || "" }).toString()}`}
                    className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={s}
                      defaultChecked={isChecked}
                      readOnly
                      className="text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300 cursor-pointer"
                    />
                    <span className="capitalize">{s === "popular" ? "Most Popular" : s}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CATEGORIES MENU */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2">Categories</h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
              {categoriesList.map((category) => {
                const isActive = cat === category.slug || (category.slug === "all" && !cat);
                return (
                  <Link
                    key={category.slug}
                    href={`/blogs?${new URLSearchParams({ cat: category.slug, sort: sort || "newest", search: search || "" }).toString()}`}
                    className={`flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 hover:text-emerald-500 transition ${
                      isActive ? "text-emerald-600 font-bold" : ""
                    }`}
                  >
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
