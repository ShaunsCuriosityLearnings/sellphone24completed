import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar, Clock, Tag, Zap, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import CommentsSection from "./CommentsSection";
import { ArticleActions } from "./ArticleActions";
import { parseMarkdownToHtml, extractTableOfContents } from "@/lib/markdown";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const blogSlug = (await params).slug;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  try {
    const blog = await api.getBlogBySlug(blogSlug);
    const title = `${blog.title} | SellPhoneCash Tech Blog`;
    const description = blog.desc || `Read about ${blog.title} on SellPhoneCash. Get top device valuation and e-waste recycling tips in Dubai, UAE.`;
    const pageUrl = `${baseUrl}/blogs/${blogSlug}`;
    const imageUrl = blog.img 
      ? (blog.img.startsWith("http") ? blog.img : `${baseUrl}${blog.img}`)
      : `${baseUrl}/products/iphone 17 pro max 💖.jpg`;

    return {
      title,
      description,
      keywords: [
        blog.category || "Tech Blog",
        "SellPhoneCash",
        "Sell iPhone Dubai",
        "UAE phone valuation",
        "Used mobile price Dubai",
        blog.title,
        "E-waste recycling UAE",
      ],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "SellPhoneCash",
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt || blog.createdAt,
        authors: [blog.author || "Team SellPhoneCash"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
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
    return { title: "Blog Article | SellPhoneCash" };
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

  // Calculate estimated reading time
  const wordCount = (blog.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Extract Table of Contents headings
  const tocHeadings = extractTableOfContents(blog.content || "");

  // Convert Markdown or raw text content to clean structured HTML
  const parsedContentHtml = parseMarkdownToHtml(blog.content || "");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  const pageUrl = `${baseUrl}/blogs/${blog.slug}`;
  const imageUrl = blog.img 
    ? (blog.img.startsWith("http") ? blog.img : `${baseUrl}${blog.img}`)
    : `${baseUrl}/products/iphone 17 pro max 💖.jpg`;

  // JSON-LD Structured Schema Markup for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.desc,
    "image": imageUrl,
    "datePublished": blog.createdAt || new Date().toISOString(),
    "dateModified": blog.updatedAt || blog.createdAt || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    "author": {
      "@type": "Organization",
      "name": blog.author || "Team SellPhoneCash",
      "url": baseUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "SellPhoneCash",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
      },
    },
    "articleSection": blog.category || "Technology",
    "wordCount": wordCount,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition">
          Home
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href="/blogs" className="hover:text-emerald-600 transition">
          Blogs
        </Link>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-md font-bold">
          {blog.title}
        </span>
      </nav>

      {/* Main Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Article Body */}
        <article className="lg:col-span-8 space-y-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          
          {/* Header Meta Header */}
          <header className="space-y-5 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/10 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-emerald-500/20">
                {blog.category || "Buying Guides"}
              </span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Clock size={12} className="text-emerald-600" />
                {readingTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Author & Published Info Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <User size={14} className="text-emerald-600" />
                <span className="text-slate-800 font-bold">{blog.author || "Team SellPhoneCash"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <Calendar size={14} className="text-emerald-600" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Brief Excerpt Quote Block */}
            {blog.desc && (
              <div className="bg-emerald-50/60 border-l-4 border-emerald-500 p-4 sm:p-5 rounded-r-2xl text-slate-700 font-medium text-sm sm:text-base italic leading-relaxed">
                "{blog.desc}"
              </div>
            )}
          </header>

          {/* Featured Hero Image */}
          {blog.img && (
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
              <Image 
                src={blog.img} 
                alt={blog.title} 
                fill 
                priority 
                className="object-contain p-4 sm:p-6" 
              />
            </div>
          )}

          {/* Key Value Badges Banner */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 text-center text-xs">
            <div className="space-y-0.5">
              <span className="text-emerald-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1">
                <Zap size={14} /> Instant Cash
              </span>
              <p className="text-[10px] text-slate-400">Guaranteed Valuation</p>
            </div>
            <div className="space-y-0.5 border-x border-slate-800">
              <span className="text-emerald-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1">
                <ShieldCheck size={14} /> 100% Data Wipe
              </span>
              <p className="text-[10px] text-slate-400">Safe & Certified</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-emerald-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1">
                <CheckCircle2 size={14} /> Free Pickup
              </span>
              <p className="text-[10px] text-slate-400">Doorstep across UAE</p>
            </div>
          </div>

          {/* Formatted Article Body Content */}
          <div
            className="article-content max-w-none pt-2"
            dangerouslySetInnerHTML={{ __html: parsedContentHtml }}
          />

          {/* Trade-In Call To Action Widget embedded in article */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="space-y-1">
              <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
                Ready to Sell Your Device?
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Get an Instant Cash Quote for Your Used Phone in 60 Seconds
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                No hassle, no long listings. We offer doorstep pickup anywhere in Dubai, Abu Dhabi, Sharjah & UAE with instant cash payment.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-md"
            >
              <Zap size={16} className="text-emerald-400" />
              Calculate My Device Value Now
            </Link>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-slate-100 pt-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-800">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                    className="group flex flex-col gap-4 border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 h-full"
                  >
                    {article.img && (
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-white border border-slate-100">
                        <Image src={article.img} alt={article.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold text-emerald-600">{article.category}</span>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {article.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {new Date(article.createdAt || new Date()).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Component */}
          <div className="border-t border-slate-100 pt-8">
            <CommentsSection postId={blog.id} />
          </div>

        </article>

        {/* Right Column: Sticky Sidebar with TOC & Actions */}
        <aside className="lg:col-span-4 sticky top-24 space-y-6">
          {/* Interactive Actions & Table of Contents */}
          <ArticleActions
            title={blog.title}
            initialLikes={blog.likes || 0}
            headings={tocHeadings}
          />

          {/* Author / Organization Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center text-2xl mx-auto font-black shadow-inner">
              ⚡
            </div>
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-slate-800 text-sm">{blog.author || "Team SellPhoneCash"}</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Tech Recycling Division</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-justify">
              We help consumers across the UAE turn pre-owned smartphones, laptops & tablets into instant cash while reducing electronic waste.
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
