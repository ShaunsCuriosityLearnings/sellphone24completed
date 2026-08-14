"use client";

import { useState } from "react";
import { Share2, Bookmark, Heart, Check, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { TocHeading } from "@/lib/markdown";

interface ArticleActionsProps {
  title: string;
  initialLikes?: number;
  headings?: TocHeading[];
}

export function ArticleActions({ title, initialLikes = 0, headings = [] }: ArticleActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Read this article on SellPhoneCash: "${title}"`);
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`"${title}" via @SellPhoneCash`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      toast.success("Thank you for liking this article! ❤️");
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.info(bookmarked ? "Removed from bookmarks" : "Article saved to bookmarks! 📌");
  };

  return (
    <div className="space-y-6">
      {/* Table of Contents Widget (if headings exist) */}
      {headings.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-emerald-500 font-bold text-sm">📋</span>
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
              Table of Contents
            </h3>
          </div>
          <nav className="space-y-1.5 text-xs">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`block py-1 px-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/60 transition line-clamp-1 font-medium ${
                  h.level === 3 ? "ml-3 text-[11px] text-slate-500" : ""
                }`}
              >
                • {h.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2.5">
          Share & Interact
        </h3>
        
        <div className="flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-between py-2 px-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl border border-slate-200/60 transition w-full text-left"
          >
            <span className="flex items-center gap-2">
              <Share2 size={14} className="text-emerald-500" />
              <span>Copy Article Link</span>
            </span>
            {copied ? <Check size={14} className="text-emerald-600" /> : null}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition text-[11px] shadow-2xs"
            >
              <MessageCircle size={13} />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition text-[11px] shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleBookmark}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border text-[11px] transition ${
                bookmarked
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Bookmark size={13} fill={bookmarked ? "currentColor" : "none"} />
              <span>{bookmarked ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border text-[11px] transition ${
                hasLiked
                  ? "bg-rose-50 border-rose-300 text-rose-600"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Heart size={13} fill={hasLiked ? "currentColor" : "none"} className={hasLiked ? "text-rose-500" : ""} />
              <span>Like ({likes})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
