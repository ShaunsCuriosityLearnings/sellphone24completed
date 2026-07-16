"use client";

import Link from "next/link";
import Image from "next/image";
import { BlogType } from "@/types";
import { Calendar, User, Eye, ArrowRight } from "lucide-react";

const BlogCard = ({ post }: { post: BlogType }) => {
  const formattedDate = new Date(post.createdAt || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-slate-200/60 last:border-0 last:pb-0">
      {/* Blog Image */}
      {post.img && (
        <Link href={`/blogs/${post.slug}`} className="block relative w-full md:w-1/3 aspect-[16/10] md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 group">
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      {/* Blog Details */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
            {post.category}
          </span>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{post.author}</span>
          </div>
          {post.views && (
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{post.views} views</span>
            </div>
          )}
        </div>

        <Link href={`/blogs/${post.slug}`} className="block group">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-emerald-500 transition-colors leading-snug">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {post.desc}
        </p>

        <Link
          href={`/blogs/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-600 hover:underline transition"
        >
          Read Full Article
          <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
