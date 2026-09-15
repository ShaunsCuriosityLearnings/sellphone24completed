"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogType } from "@/types";
import { Calendar, User, Clock, ArrowRight, Bookmark } from "lucide-react";

interface BlogCardProps {
  post: BlogType;
  variant?: "horizontal" | "grid";
}

const BlogCard = ({ post, variant = "grid" }: BlogCardProps) => {
  const formattedDate = new Date(post.createdAt || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const estimateReadTime = (content?: string) => {
    if (!content) return "4 min read";
    const words = content.split(/\s+/).length;
    const mins = Math.max(2, Math.ceil(words / 150));
    return `${mins} min read`;
  };

  if (variant === "horizontal") {
    return (
      <article className="flex flex-col sm:flex-row gap-6 items-start pb-8 border-b border-slate-100 last:border-0 last:pb-0 group">
        {post.img && (
          <Link href={`/blogs/${post.slug}`} className="block relative w-full sm:w-5/12 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
            <Image
              src={post.img}
              alt={post.title}
              fill
              sizes="(max-width:768px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-emerald-100">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{estimateReadTime(post.content)}</span>
            </div>
          </div>

          <Link href={`/blogs/${post.slug}`} className="block">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
            {post.desc}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <User size={12} />
              {post.author || "Team SellPhoneCash"}
            </span>

            <Link
              href={`/blogs/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
            >
              <span>Read Story</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Default Vertical Grid Card
  return (
    <article className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group h-full">
      {post.img && (
        <Link href={`/blogs/${post.slug}`} className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden block">
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {post.category}
          </div>
        </Link>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link href={`/blogs/${post.slug}`}>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition leading-snug line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {post.desc}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-700 text-xs truncate">{post.author || "Team SellPhoneCash"}</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{estimateReadTime(post.content)}</span>
            </div>
          </div>

          <Link
            href={`/blogs/${post.slug}`}
            className="p-2 rounded-xl bg-slate-50 group-hover:bg-emerald-500 text-slate-600 group-hover:text-slate-950 transition shrink-0"
            aria-label="Read story"
          >
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
