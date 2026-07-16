import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar, Tag, Share2, Bookmark, Heart, Mail } from "lucide-react";
import { api } from "@/lib/api";
// Import comments client handler
import CommentsSection from "./CommentsSection";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const blogSlug = (await params).slug;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellyourphone24.ae";
  try {
    const blog = await api.getBlogBySlug(blogSlug);
    const title = `${blog.title} | SellYourPhone24 Tech Blog`;
    const description = blog.desc;
    const pageUrl = `${baseUrl}/blogs/${blogSlug}`;
    const imageUrl = blog.img 
      ? (blog.img.startsWith("http") ? blog.img : `${baseUrl}${blog.img}`)
      : `${baseUrl}/products/iphone 17 pro max 💖.jpg`;

    return {
      title,
      description,
      keywords: [
        blog.category,
        "SellYourPhone24",
        "UAE phone recycling",
        "Used mobile valuation Dubai",
        blog.title,
        "E-waste UAE",
      ],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "SellYourPhone24",
        type: "article",
        publishedTime: blog.createdAt,
        authors: [blog.author || "Team SellYourPhone24"],
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: blog.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: "Blog Not Found | SellYourPhone24" };
  }
};

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const blogSlug = (await params).slug;
  let blog;
  try {
    blog = await api.getBlogBySlug(blogSlug);
  } catch (error) {
    notFound();
  }

  // Get related articles (all blogs except the current one)
  const allBlogs = await api.getBlogs();
  const relatedArticles = allBlogs.filter((b) => b.slug !== blog.slug).slice(0, 2);

  const formattedDate = new Date(blog.createdAt || new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumb & Back */}
      <div>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition"
        >
          <ArrowLeft size={14} />
          Back to Blogs Feed
        </Link>
      </div>

      {/* Main Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Article Body & Related Posts */}
        <div className="lg:col-span-8 space-y-10 bg-white border border-slate-100 rounded-[40px] p-6 md:p-10 shadow-sm">
          
          {/* Header Title & Description */}
          <div className="space-y-4">
            <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
              {blog.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold border-b border-slate-100 pb-6">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
            
            <p className="text-sm md:text-base font-medium text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
              {blog.desc}
            </p>
          </div>

          {/* Featured Image */}
          {blog.img && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-50 border">
              <Image src={blog.img} alt={blog.title} fill className="object-contain p-6" />
            </div>
          )}

          {/* HTML Raw Body Content */}
          <div
            className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-slate-100 pt-10 space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                    className="group flex flex-col gap-4 border border-slate-100 rounded-3xl p-5 bg-slate-50/30 hover:bg-white hover:shadow-lg hover:border-emerald-500/25 transition-all duration-300 cursor-pointer h-full"
                  >
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100">
                      <Image src={article.img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-emerald-500">{article.category}</span>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-emerald-500 transition-colors">
                          {article.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">{new Date(article.createdAt || new Date()).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Replicated Comments Component */}
          <div className="border-t border-slate-100 pt-10">
            <CommentsSection postId={blog.id} />
          </div>

        </div>

        {/* Right Column: Sticky Sidebar matching Bollywood Blink's layout */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          
          {/* Author Card Details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto font-bold shadow-inner">
              ✍️
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">Team SellYourPhone24</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tech Recycling Division</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">
              We are a team of tech experts and circular economy researchers dedicated to helping consumers unlock the maximum value from their pre-owned electronics, ensuring zero e-waste reaches landfills.
            </p>
            
            {/* Social SVGs */}
            <div className="flex justify-center gap-3 pt-2 text-slate-400 border-t border-slate-50 mt-4">
              <a href="#" className="hover:text-emerald-500 p-2.5 bg-slate-50 rounded-xl transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-slate-500 hover:fill-emerald-500" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h2.72l.42-3H12V6.5c0-.77.16-1.12 1.11-1.12H15V2h-2.85C9.74 2 8.5 3.32 8.5 5.5V8z" />
                </svg>
              </a>
              <a href="#" className="hover:text-emerald-500 p-2.5 bg-slate-50 rounded-xl transition flex items-center justify-center">
                <svg className="w-4 h-4 fill-slate-500 hover:fill-emerald-500" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-emerald-500 p-2 bg-slate-50 rounded-xl transition">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Actions</h3>
            <div className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
              <button className="flex items-center gap-2 py-2 hover:text-emerald-500 transition w-full text-left">
                <Share2 size={16} />
                <span>Share this Article</span>
              </button>
              <button className="flex items-center gap-2 py-2 hover:text-emerald-500 transition w-full text-left">
                <Bookmark size={16} />
                <span>Bookmark for Later</span>
              </button>
              <button className="flex items-center gap-2 py-2 hover:text-emerald-500 transition w-full text-left">
                <Heart size={16} />
                <span>Like ({blog.likes || 0})</span>
              </button>
            </div>
          </div>

          {/* Tag Shortcuts */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Tags</h3>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/blogs?cat=buying-guides" className="text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-full transition uppercase">
                Buying Guides
              </Link>
              <Link href="/blogs?cat=recycling-tips" className="text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-full transition uppercase">
                Recycling Tips
              </Link>
              <Link href="/blogs?cat=price-analysis" className="text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-full transition uppercase">
                Price Trends
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
