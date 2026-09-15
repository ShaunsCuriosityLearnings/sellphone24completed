import Link from "next/link";
import Image from "next/image";
import { BlogType } from "@/types";
import { Bookmark, Clock, User, Star } from "lucide-react";

interface FeaturedBlogsGridProps {
  blogs: BlogType[];
}

export default function FeaturedBlogsGrid({ blogs }: FeaturedBlogsGridProps) {
  if (!blogs || blogs.length === 0) return null;

  // Main Hero Post (Index 0)
  const mainPost = blogs[0];

  // Medium Stacked Posts (Indices 1 and 2)
  const mediumPosts = blogs.slice(1, 3);

  // Compact Stacked Posts (Indices 3, 4, 5)
  const compactPosts = blogs.slice(3, 6);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent Post";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recent Post";
    }
  };

  const estimateReadTime = (content?: string) => {
    if (!content) return "4 min read";
    const words = content.split(/\s+/).length;
    const mins = Math.max(2, Math.ceil(words / 150));
    return `${mins} min read`;
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Featured Stories</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        </h2>
        <span className="text-xs text-slate-400 font-medium">Editor's Choice & Market Reports</span>
      </div>

      {/* 3-COLUMN EDITORIAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ================= COLUMN 1: MAIN HERO CARD (lg:col-span-5) ================= */}
        {mainPost && (
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group">
            <Link href={`/blogs/${mainPost.slug}`} className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden block">
              <Image
                src={mainPost.img || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop"}
                alt={mainPost.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {mainPost.category}
              </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Link href={`/blogs/${mainPost.slug}`}>
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition leading-snug">
                    {mainPost.title}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {mainPost.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mainPost.author || "Team SellPhoneCash"}</span>
                    <span className="text-slate-300">in</span>
                    <span className="text-emerald-600 font-semibold">{mainPost.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{formatDate(mainPost.createdAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {estimateReadTime(mainPost.content)}
                    </span>
                  </div>
                </div>

                <button
                  aria-label="Bookmark article"
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= COLUMN 2: 2 MEDIUM CARDS STACKED (lg:col-span-4) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {mediumPosts.map((post) => (
            <div
              key={post.id || post._id || post.slug}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row gap-4 group flex-1"
            >
              <Link href={`/blogs/${post.slug}`} className="relative aspect-[4/3] sm:w-32 w-full shrink-0 rounded-2xl overflow-hidden bg-slate-100 block">
                <Image
                  src={post.img || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    {post.category}
                  </span>
                  <Link href={`/blogs/${post.slug}`}>
                    <h4 className="font-extrabold text-sm md:text-base text-slate-900 group-hover:text-emerald-600 transition leading-snug line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5 pt-2 border-t border-slate-50">
                  <p className="font-semibold text-slate-600 truncate">{post.author || "Team SellPhoneCash"}</p>
                  <div className="flex items-center gap-1.5">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>{estimateReadTime(post.content)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= COLUMN 3: 3 COMPACT CARDS STACKED (lg:col-span-3) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {compactPosts.map((post) => (
            <div
              key={post.id || post._id || post.slug}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs hover:shadow-md transition flex items-center gap-3.5 group flex-1"
            >
              <Link href={`/blogs/${post.slug}`} className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 block">
                <Image
                  src={post.img || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/blogs/${post.slug}`}>
                  <h5 className="font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition line-clamp-2 leading-snug">
                    {post.title}
                  </h5>
                </Link>

                <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1">
                  <span className="font-medium text-slate-500 truncate max-w-[90px]">{post.author || "Team"}</span>
                  <span>•</span>
                  <span>{estimateReadTime(post.content)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
