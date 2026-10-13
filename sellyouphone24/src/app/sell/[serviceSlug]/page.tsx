import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  SERVICE_PAGES,
  SERVICE_SLUGS,
  LOCATION_PAGES,
  MODEL_PAGES,
  resolveServicePage,
} from "@/lib/seoData";
import { api } from "@/lib/api";
import { ProductType } from "@/types";
import ProductCard from "@/components/ProductCard";
import QuickEvaluationWidget from "@/components/QuickEvaluationWidget";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import SeoCtaBanner from "@/components/SeoCtaBanner";
import SeoFaqSection from "@/components/SeoFaqSection";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import TrustStatsBar from "@/components/TrustStatsBar";
import WhyPeopleChooseSection from "@/components/WhyPeopleChooseSection";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp,
  Banknote,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Star,
  Zap,
  Check,
  Award,
  Sparkles,
} from "lucide-react";

interface Props {
  params: Promise<{ serviceSlug: string }>;
}

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({
    serviceSlug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params;
  const page = resolveServicePage(serviceSlug);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  const canonicalUrl = `${baseUrl}/sell/${page.slug}`;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.targetKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: canonicalUrl,
      siteName: "SellPhoneCash",
      type: "website",
      locale: "en_AE",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { serviceSlug } = await params;
  const page = resolveServicePage(serviceSlug);

  const isIphone = serviceSlug.toLowerCase().includes("iphone");
  const isSamsung = serviceSlug.toLowerCase().includes("samsung");

  // Check for admin override configuration from MongoDB
  let pageOverride = null;
  try {
    pageOverride = (await api.getSeoPageBySlug(serviceSlug)) || (await api.getSeoPageBySlug(page.slug));
  } catch (err) {
    console.warn("Could not load SEO page override:", err);
  }

  // Fetch live products from database (respecting curated admin products if present)
  let liveProducts: ProductType[] = [];
  try {
    if (pageOverride?.featuredProducts && pageOverride.featuredProducts.length > 0) {
      liveProducts = pageOverride.featuredProducts;
    } else {
      const allProducts = await api.getProducts();
      if (isIphone) {
        liveProducts = allProducts.filter((p) => (p.brand || "").toLowerCase().includes("apple"));
      } else if (isSamsung) {
        liveProducts = allProducts.filter((p) => (p.brand || "").toLowerCase().includes("samsung"));
      } else {
        liveProducts = allProducts.filter((p) => p.isLivePrice || p.isPopular || p.category === "smartphones");
      }

      if (liveProducts.length === 0) {
        liveProducts = allProducts.slice(0, 8);
      } else {
        liveProducts = liveProducts.slice(0, 8);
      }
    }
  } catch (err) {
    console.warn("Could not load live products for SEO service page:", err);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // Schema.org Service JSON-LD
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": page.h1,
    "description": page.metaDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "SellPhoneCash",
      "url": baseUrl,
      "telephone": "+971555549817",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE",
      },
      "priceRange": "AED 100 - AED 8,000",
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Dubai, United Arab Emirates",
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "AED",
      "price": "0",
      "description": "Free doorstep inspection and pickup across Dubai",
    },
  };

  const customerReviews = [
    {
      name: "Tariq A.",
      location: "Dubai Marina",
      rating: 5,
      quote: "Sold my iPhone 15 Pro Max within 2 hours. Courier came right to my building lobby, inspected it in 2 minutes, and handed me physical cash.",
      device: "iPhone 15 Pro Max",
    },
    {
      name: "Mariam S.",
      location: "Downtown Dubai",
      rating: 5,
      quote: "Much better than dealing with lowballers on Dubizzle. The price quoted online was the exact amount I was paid at my doorstep.",
      device: "Galaxy S24 Ultra",
    },
    {
      name: "Vikram N.",
      location: "JLT Cluster O",
      rating: 5,
      quote: "Super convenient office desk pickup during my lunch break. Fast, safe, and 100% verified data wipe performed in front of me.",
      device: "MacBook Pro M2",
    },
  ];

  // 6 Categories matching the reference design
  const acceptedCategories = [
    {
      name: "iPhone",
      subtitle: "iPhone 11 – 16 Series",
      link: "/sell/sell-iphone-in-dubai",
      image: "/products/iphone-pro-max.jpg",
    },
    {
      name: "Samsung Galaxy",
      subtitle: "S Series, Z Fold, Z Flip",
      link: "/sell/sell-samsung-in-dubai",
      image: "/products/samsung (1).jpg",
    },
    {
      name: "Google Pixel",
      subtitle: "All Models",
      link: "/sell/google-pixel",
      image: "/images/google-pixel.jpg",
    },
    {
      name: "MacBook",
      subtitle: "Air, Pro, M1 – M4",
      link: "/sell/model/macbook-pro",
      image: "/products/macbook-pro.webp",
    },
    {
      name: "iPad",
      subtitle: "All Generations",
      link: "/sell/model/ipad-pro",
      image: "/products/ipad-air-m2.webp",
    },
    {
      name: "Other Devices",
      subtitle: "Smartwatches, AirPods & More",
      link: "/sell/model/apple-watch-ultra",
      image: "/products/apple-watch-ultra.webp",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-0.5 sm:px-4 lg:px-8 py-0.5 sm:py-4 space-y-2.5 sm:space-y-6 lg:space-y-8">
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Breadcrumb Navigation - Compact on mobile */}
      <div className="px-0.5 sm:px-0">
        <SeoBreadcrumb
          items={[
            { name: "Sell Hub", url: "/sell" },
            { name: page.h1.replace(" in Dubai", "").replace(" for Instant Cash", ""), url: `/sell/${page.slug}` },
          ]}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (COMPACT MOBILE WITH LUXURY WARM CREAM BACKDROP)         */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFE9DF] p-3 sm:p-6 lg:p-8 shadow-xs sm:shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Subtitle, CTAs, and Trust Checkmarks */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="text-emerald-800 font-extrabold text-[10px] sm:text-xs tracking-widest uppercase">
                Turn Your Phone Into Cash
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Live Dubai Market Rates</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.14]">
              {pageOverride?.customH1 || (isIphone ? (
                <>Your iPhone Is Worth <br className="hidden sm:inline" />More Than You Think.</>
              ) : isSamsung ? (
                <>Your Samsung Is Worth <br className="hidden sm:inline" />More Than You Think.</>
              ) : (
                <>Your Phone Is Worth <br className="hidden sm:inline" />More Than You Think.</>
              ))}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm sm:text-base leading-relaxed mt-1 sm:mt-2 max-w-xl">
              {pageOverride?.customSubtitle || (
                <>
                  Get a live market quote for your{" "}
                  <strong className="text-slate-900 font-semibold">
                    {isIphone ? "iPhone" : isSamsung ? "Samsung Galaxy" : "iPhone, Samsung Galaxy"}
                  </strong>{" "}
                  or other devices and receive cash quickly with free doorstep pickup anywhere in Dubai.
                </>
              )}
            </p>

            {/* Action Buttons: Snug and Thumb-Friendly on Mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
              <a
                href="#quick-eval"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-[#0f4a2d] hover:bg-[#0a3821] text-white font-bold text-xs sm:text-base shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Get My Cash Quote</span>
                <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </a>

              <a
                href={`https://wa.me/971555549817?text=${encodeURIComponent(
                  `Hi SellPhoneCash! I want to sell my device under "${page.h1}". Please provide an instant valuation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs sm:text-base shadow-xs transition-all"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.546 1.761.82 2.796.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.806-5.768-5.806zm3.385 8.212c-.144.405-.837.774-1.17.824-.312.045-.634.07-1.787-.394-1.233-.497-2.072-1.727-2.133-1.808-.061-.081-.497-.661-.497-1.261s.313-.895.424-1.018c.112-.123.243-.153.324-.153.082 0 .162.001.233.007.075.006.176-.028.275.21.102.246.353.864.385.928.032.064.053.139.01.222-.043.083-.064.135-.128.21-.064.075-.135.167-.193.225-.064.064-.131.134-.056.263.075.129.333.55 1.013 1.156.443.395.817.517.933.575.116.058.185.049.255-.032.07-.081.299-.348.379-.467.08-.119.16-.1.267-.06.107.04.68.321.796.379.116.058.193.087.222.135.029.048.029.279-.115.684z" />
                </svg>
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* 3 Checkmark Guarantee Points - Compact Row on Mobile */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-6 pt-1 text-[10px] sm:text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
                  ✓
                </span>
                <span>Free doorstep pickup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
                  ✓
                </span>
                <span>Same-day payment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
                  ✓
                </span>
                <span>Secure data wipe</span>
              </div>
            </div>
          </div>

          {/* Right Column: Flagship Photo on Sandstone with Dubai Skyline */}
          <div className="lg:col-span-6 relative flex items-center justify-center mt-1 sm:mt-0">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-xl border border-white/80 bg-slate-100">
              <img
                src={pageOverride?.customHeroImage || "/images/dubai-hero-phones.jpg"}
                alt={page.h1}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Live Quote Card (Top Right) */}
            <div className="absolute -top-2 sm:-top-5 right-2 sm:right-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-lg sm:shadow-xl z-10 transition-transform">
              <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live quote • AED
              </div>
              <div className="text-[11px] sm:text-sm font-extrabold text-slate-900 mt-0.5">
                {pageOverride?.customQuoteBadge || (isSamsung ? "Samsung Galaxy S24 Ultra" : "iPhone 16 Pro Max")}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                <span className="text-base sm:text-2xl font-black text-emerald-600">
                  {pageOverride?.customQuotePrice
                    ? `AED ${pageOverride.customQuotePrice.toLocaleString()}`
                    : (isSamsung ? "AED 2,850" : "AED 3,650")}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  <TrendingUp size={10} className="sm:w-3 sm:h-3" />
                  <span>Market High</span>
                </span>
              </div>
            </div>

            {/* Hand-Drawn Annotation Callout (Bottom Right) */}
            <div className="hidden sm:flex absolute -bottom-5 right-6 items-center gap-1.5 pointer-events-none z-10">
              <svg className="w-8 h-8 text-slate-800 -rotate-12" viewBox="0 0 50 50" fill="none">
                <path d="M8 38 Q 22 12 38 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M30 16 L 39 23 L 31 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-serif italic font-bold text-xs text-slate-800 tracking-wide bg-amber-50/95 px-2.5 py-1 rounded-lg border border-amber-200/80 shadow-xs">
                Same day cash in Dubai
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW IT WORKS (HORIZONTAL SCROLLABLE STEPS ON MOBILE)                  */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3.5 sm:p-8 shadow-xs space-y-3 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          
          {/* Left Title & Subtitle */}
          <div className="lg:col-span-4 space-y-1">
            <p className="text-emerald-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              How It Works
            </p>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
              Sell Your Device <br className="hidden sm:inline" />in <span className="text-emerald-600">3 Simple Steps.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              A fast, secure and convenient way to get cash for your used devices in Dubai.
            </p>
          </div>

          {/* Right 3 Step Cards Flow - Horizontal Swipe on Mobile */}
          <div className="lg:col-span-8 flex overflow-x-auto pb-1.5 snap-x snap-mandatory gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4 no-scrollbar">
            
            {/* Step 01 */}
            <div className="w-[72%] min-w-[200px] sm:w-auto sm:min-w-0 shrink-0 snap-start p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#EFE9DF] flex flex-col justify-between space-y-2.5 sm:space-y-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-4xl font-serif font-black text-slate-300">01</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Smartphone size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-base">
                  Choose your device
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                  Select your brand, model and condition to get a live quote.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="w-[72%] min-w-[200px] sm:w-auto sm:min-w-0 shrink-0 snap-start p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#EFE9DF] flex flex-col justify-between space-y-2.5 sm:space-y-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-4xl font-serif font-black text-slate-300">02</span>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Banknote size={18} className="sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-base">
                  Get your quote
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                  Receive an instant, no-obligation market-based price.
                </p>
              </div>
            </div>

            {/* Step 03 with Van Image */}
            <div className="w-[72%] min-w-[200px] sm:w-auto sm:min-w-0 shrink-0 snap-start p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#EFE9DF] flex flex-col justify-between space-y-2.5 sm:space-y-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-4xl font-serif font-black text-slate-300">03</span>
                <div className="relative w-14 h-8 sm:w-16 sm:h-10 rounded-md sm:rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                  <Image
                    src="/images/doorstep-van-pickup.jpg"
                    alt="Doorstep collection van"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-base">
                  We collect &amp; pay
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                  We pick up from your location in Dubai and pay on the spot.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT CAN YOU SELL? (2-CARD HORIZONTAL SWIPE ON MOBILE)                */}
      {/* ========================================================================= */}
      <section className="space-y-2.5 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-emerald-800 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
              What Can You Sell?
            </p>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              We Buy a Wide Range of Devices.
            </h2>
          </div>
          <span className="sm:hidden text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
            Swipe →
          </span>
        </div>

        {/* 2 Cards visible at once on mobile, smoothly scrollable horizontally */}
        <div className="flex overflow-x-auto pb-2 snap-x snap-mandatory gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4 no-scrollbar">
          {acceptedCategories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="w-[calc(50%-4px)] min-w-[calc(50%-4px)] sm:w-auto sm:min-w-0 shrink-0 snap-start group bg-white border border-slate-200/80 hover:border-emerald-500 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center space-y-1.5 sm:space-y-2.5 transition-all shadow-xs hover:shadow-md flex flex-col items-center justify-between"
            >
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden bg-slate-50 group-hover:scale-105 transition-transform">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-1.5 sm:p-2"
                />
              </div>

              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1">
                  {cat.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY PEOPLE CHOOSE (EXACTLY 2 CARDS VISIBLE + HORIZONTAL SWIPE)        */}
      {/* ========================================================================= */}
      <WhyPeopleChooseSection />

      {/* Trust Stats Bar - Compact on Mobile */}
      <TrustStatsBar />

      {/* ========================================================================= */}
      {/* 5. LIVE BUYING PRICES FROM MONGODB (COMPACT 2-COL CARDS)                 */}
      {/* ========================================================================= */}
      {liveProducts && liveProducts.length > 0 && (
        <section className="space-y-3 sm:space-y-5">
          <div className="flex flex-row justify-between items-end border-b border-slate-200 pb-2.5">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                Live Rates
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                Today&apos;s Live Buying Prices
              </h2>
            </div>

            <Link
              href={page.catalogLink}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          {/* 2-Columns on Mobile with compact gap */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {liveProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. EMBEDDED CASCADING QUICK EVALUATION WIDGET                            */}
      {/* ========================================================================= */}
      <section id="quick-eval" className="space-y-2 sm:space-y-4 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            Calculate Your Device Value in 10 Seconds
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Choose your device brand and model to see your live guaranteed buyout quote.
          </p>
        </div>

        <QuickEvaluationWidget />
      </section>

      {/* ========================================================================= */}
      {/* 7. CONDITION TRANSPARENCY (2-CARD HORIZONTAL SWIPE ON MOBILE)            */}
      {/* ========================================================================= */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-6 space-y-2 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Accepted Device Conditions
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              We purchase all conditions — from brand new sealed boxes to cracked screens.
            </p>
          </div>
          <div className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-extrabold text-[10px] sm:text-xs">
            Typical Payout: {page.priceRangeEstimate}
          </div>
        </div>

        {/* 2-Card Horizontal Swipe on Mobile */}
        <div className="flex overflow-x-auto pb-1.5 snap-x snap-mandatory gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3.5 no-scrollbar">
          {page.acceptedConditions.map((cond, idx) => (
            <div
              key={idx}
              className="w-[calc(50%-4px)] min-w-[calc(50%-4px)] max-w-[calc(50%-4px)] sm:w-auto sm:min-w-0 sm:max-w-none shrink-0 snap-start bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 space-y-1 shadow-xs hover:border-emerald-500/40 transition flex flex-col justify-between"
            >
              <div className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase tracking-wide w-fit">
                {cond.badge}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {cond.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-snug mt-0.5">
                  {cond.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. WHY SELLPHONECASH BEATS THE REST (COMPARISON TABLE)                   */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-3 sm:p-6 shadow-xs space-y-2 sm:space-y-4 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-emerald-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
            Clear Advantage
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            Why Sell to SellPhoneCash vs Alternatives
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Compare our direct doorstep cash service against classifieds and store vouchers.
          </p>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-[11px] sm:text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-2 sm:p-3 font-bold text-slate-700">Feature</th>
                <th className="p-2 sm:p-3 font-black text-emerald-600 bg-emerald-50/50">SellPhoneCash</th>
                <th className="p-2 sm:p-3 font-semibold text-slate-500">Classifieds (Dubizzle)</th>
                <th className="p-2 sm:p-3 font-semibold text-slate-500">Retail / Mall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-2 sm:p-3 font-medium">Payment Method</td>
                <td className="p-2 sm:p-3 font-bold text-emerald-600 bg-emerald-50/30">Instant Cash / Wire</td>
                <td className="p-2 sm:p-3 text-slate-500">Unsafe promises</td>
                <td className="p-2 sm:p-3 text-slate-500">Store Vouchers</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 font-medium">Pickup Convenience</td>
                <td className="p-2 sm:p-3 font-bold text-emerald-600 bg-emerald-50/30">Free 3-Hr Doorstep</td>
                <td className="p-2 sm:p-3 text-slate-500">Meet strangers</td>
                <td className="p-2 sm:p-3 text-slate-500">Visit store in person</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 font-medium">Price Guarantee</td>
                <td className="p-2 sm:p-3 font-bold text-emerald-600 bg-emerald-50/30">7-Day Locked Quote</td>
                <td className="p-2 sm:p-3 text-slate-500">Constant haggling</td>
                <td className="p-2 sm:p-3 text-slate-500">20-30% below market</td>
              </tr>
              <tr>
                <td className="p-2 sm:p-3 font-medium">Data Sanitization</td>
                <td className="p-2 sm:p-3 font-bold text-emerald-600 bg-emerald-50/30">100% Certified DoD</td>
                <td className="p-2 sm:p-3 text-slate-500">No guarantee</td>
                <td className="p-2 sm:p-3 text-slate-500">Basic factory reset</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. VERIFIED CUSTOMER REVIEWS (HORIZONTAL SWIPE ON MOBILE)                */}
      {/* ========================================================================= */}
      <section className="space-y-2 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Rated 4.9/5 Across Dubai
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Verified feedback from customers who sold devices this week.
            </p>
          </div>
          <span className="sm:hidden text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
            Swipe →
          </span>
        </div>

        {/* Horizontal Swipe on Mobile */}
        <div className="flex overflow-x-auto pb-2 snap-x snap-mandatory gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4 no-scrollbar">
          {customerReviews.map((rev, idx) => (
            <div
              key={idx}
              className="w-[82%] min-w-[250px] sm:w-auto sm:min-w-0 shrink-0 snap-start bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400">{rev.location}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                  {rev.device}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. POPULAR MODELS LISTING                                                */}
      {/* ========================================================================= */}
      {page.popularModels && page.popularModels.length > 0 && (
        <section className="space-y-3">
          <div className="flex justify-between items-end border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                Explore Top Models We Buy
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">Individual valuation guides for each edition</p>
            </div>
            <Link
              href={page.catalogLink}
              className="text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {page.popularModels.map((item) => (
              <Link
                key={item.slug}
                href={`/sell/model/${item.slug}`}
                className="group bg-white border border-slate-200/80 hover:border-emerald-500 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center space-y-1 transition-all shadow-xs hover:shadow-md"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 text-slate-700 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone size={16} className="text-emerald-500 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-[11px] sm:text-sm group-hover:text-emerald-500 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-black text-emerald-600">
                  From {item.startingPrice}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Editorial Intro - Snug and Responsive */}
      <section className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-lg sm:text-2xl font-black text-slate-900">
          Everything You Need to Know: {page.h1}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-600 leading-relaxed">
          {page.introText.map((p, i) => (
            <p key={i} className="border-l-2 border-emerald-500 pl-3 py-0.5">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* SEO FAQ Section with JSON-LD Schema */}
      <SeoFaqSection faqs={page.faqs} title={`Frequently Asked Questions: ${page.h1}`} />

      {/* Conversion CTA Banner */}
      <SeoCtaBanner
        heading={`Ready to Sell Under "${page.h1}"?`}
        subheading="Lock in your guaranteed online cash quote, schedule free 3-hour doorstep collection, and get paid instantly across Dubai."
        quoteLink={page.catalogLink}
        deviceName={page.h1.replace("Sell ", "").replace(" in Dubai", "")}
      />

      {/* Inter-linking Network */}
      <SeoInternalLinks
        currentSlug={page.slug}
        selectedLocations={page.relatedLocations}
        selectedServices={page.relatedServices}
      />
    </div>
  );
}
