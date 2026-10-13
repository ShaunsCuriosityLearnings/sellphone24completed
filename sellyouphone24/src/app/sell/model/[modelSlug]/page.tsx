import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  MODEL_PAGES,
  MODEL_SLUGS,
  LOCATION_PAGES,
  SERVICE_PAGES,
  resolveModelPage,
} from "@/lib/seoData";
import { api } from "@/lib/api";
import { ProductType } from "@/types";
import ProductCard from "@/components/ProductCard";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import SeoCtaBanner from "@/components/SeoCtaBanner";
import SeoFaqSection from "@/components/SeoFaqSection";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import TrustStatsBar from "@/components/TrustStatsBar";
import WhyPeopleChooseSection from "@/components/WhyPeopleChooseSection";
import ModelValuationWidget from "@/components/ModelValuationWidget";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Banknote,
  Cpu,
  HelpCircle,
  Zap,
  Flame,
  Star,
  Layers,
  Award,
  Check,
  X,
} from "lucide-react";

interface Props {
  params: Promise<{ modelSlug: string }>;
}

export async function generateStaticParams() {
  return MODEL_SLUGS.map((slug) => ({
    modelSlug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { modelSlug } = await params;
  const page = resolveModelPage(modelSlug);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  const canonicalUrl = `${baseUrl}/sell/model/${page.slug}`;

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

export default async function ModelPage({ params }: Props) {
  const { modelSlug } = await params;
  const page = resolveModelPage(modelSlug);

  // Fetch live product from MongoDB via slug or fuzzy match
  let matchedProduct: ProductType | null = null;
  let relatedProducts: ProductType[] = [];
  let pageOverride = null;

  try {
    const [p, override] = await Promise.all([
      api.getProductById(modelSlug).catch(() => null),
      api.getSeoPageBySlug(page.slug).catch(() => null),
    ]);
    matchedProduct = p;
    pageOverride = override;
  } catch (e) {
    console.warn("Direct lookup for product or override failed:", e);
  }

  try {
    const allProducts = await api.getProducts();
    const brandLower = page.brand.toLowerCase();

    if (!matchedProduct) {
      matchedProduct =
        allProducts.find((p) => p.name.toLowerCase().includes(page.modelName.toLowerCase())) ||
        allProducts.find((p) => (p.brand || "").toLowerCase().includes(brandLower)) ||
        allProducts[0] ||
        null;
    }

    // Filter related products from MongoDB (respecting curated admin products if present)
    if (pageOverride?.featuredProducts && pageOverride.featuredProducts.length > 0) {
      relatedProducts = pageOverride.featuredProducts.slice(0, 4);
    } else {
      relatedProducts = allProducts
        .filter((p) => {
          const pBrand = (p.brand || "").toLowerCase();
          const isSameBrand = pBrand.includes(brandLower) || brandLower.includes(pBrand);
          const isNotSame = String(p.id || p._id) !== String(matchedProduct?.id || matchedProduct?._id);
          return isSameBrand && isNotSame;
        })
        .slice(0, 4);

      if (relatedProducts.length < 4) {
        const fillers = allProducts
          .filter((p) => String(p.id || p._id) !== String(matchedProduct?.id || matchedProduct?._id))
          .slice(0, 4 - relatedProducts.length);
        relatedProducts = [...relatedProducts, ...fillers];
      }
    }
  } catch (err) {
    console.warn("Could not load products for model page:", err);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // Schema.org Product / Buyback Offer JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${page.brand} ${page.modelName}`,
    "description": page.metaDescription,
    "brand": {
      "@type": "Brand",
      "name": page.brand,
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AED",
      "lowPrice": matchedProduct ? Math.round(matchedProduct.basePrice * 0.45) : 500,
      "highPrice": matchedProduct ? Math.round(matchedProduct.basePrice * 1.0) : 4500,
      "offerCount": "4",
      "priceValidUntil": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      "seller": {
        "@type": "Organization",
        "name": "SellPhoneCash",
        "url": baseUrl,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-0.5 sm:px-4 lg:px-8 py-0.5 sm:py-4 space-y-2.5 sm:space-y-6 lg:space-y-8">
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb Navigation - Compact on mobile */}
      <div className="px-0.5 sm:px-0">
        <SeoBreadcrumb
          items={[
            { name: "Sell Hub", url: "/sell" },
            { name: `${page.brand} Trade-In`, url: page.catalogLink },
            { name: `Sell ${page.modelName}`, url: `/sell/model/${page.slug}` },
          ]}
        />
      </div>

      {/* 1. HERO SECTION WITH EMBEDDED LIVE VALUATION WIDGET */}
      {matchedProduct ? (
        <ModelValuationWidget
          product={matchedProduct}
          modelName={page.modelName}
          brand={page.brand}
        />
      ) : (
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 text-white p-3.5 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl space-y-2 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>{page.heroBadge}</span>
            </span>
            <h1 className="text-xl sm:text-5xl font-black text-white">{page.h1}</h1>
            <p className="text-slate-300 text-xs sm:text-base">{page.subtitle}</p>
          </div>
        </section>
      )}

      {/* 2. TRUST STATS BAR */}
      <TrustStatsBar />

      {/* 3. CONDITION PAYOUT BREAKDOWN TABLE (2-CARDS VISIBLE ON MOBILE) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xs space-y-2 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Award size={13} />
              <span>Condition Grading Matrix</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
              How We Value Your {page.modelName}
            </h2>
          </div>
          <span className="sm:hidden text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
            Swipe →
          </span>
        </div>

        {/* 2 Cards visible at once on mobile, horizontal scroll */}
        <div className="flex overflow-x-auto pb-1.5 snap-x snap-mandatory gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-3.5 no-scrollbar">
          {page.conditionPrices.map((cp, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={idx}
                className={`w-[calc(50%-4px)] min-w-[calc(50%-4px)] max-w-[calc(50%-4px)] sm:w-auto sm:min-w-0 sm:max-w-none shrink-0 snap-start rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border flex flex-col justify-between space-y-2 transition ${
                  isTop
                    ? "bg-emerald-50/40 border-emerald-500/40 shadow-xs"
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-900">
                      {cp.condition}
                    </span>
                    {isTop && (
                      <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        Max
                      </span>
                    )}
                  </div>
                  <div className="text-base sm:text-2xl font-black text-emerald-600">
                    {cp.estimate}
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-snug line-clamp-2 sm:line-clamp-none">{cp.notes}</p>
                </div>

                <div className="pt-1.5 sm:pt-2 border-t border-slate-200/70 text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                  <span>Free pickup &amp; wipe</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY PEOPLE CHOOSE (EXACTLY 2 CARDS VISIBLE + HORIZONTAL SWIPE) */}
      <WhyPeopleChooseSection />

      {/* 4. WHY SELLPHONE CASH VS ALTERNATIVES */}
      <section className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-slate-800 shadow-lg space-y-2 sm:space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            Fair Buyout Guarantee
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            Why Dubai Chooses SellPhoneCash for {page.modelName}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Compare our verified instant doorstep service with traditional selling options.
          </p>
        </div>

        {/* Mobile View: Horizontal Scroll Comparison Cards (2 visible side-by-side) */}
        <div className="flex sm:hidden overflow-x-auto pb-1.5 snap-x snap-mandatory gap-2 no-scrollbar">
          {[
            {
              feature: "Payment Method",
              us: "Instant Cash or Direct Wire",
              others: "Dubizzle: Fake note risks | Shops: Cheques / delays",
            },
            {
              feature: "Doorstep Pickup",
              us: "Free 3-Hour Pickup Across Dubai",
              others: "Dubizzle: Meet strangers | Shops: Drive in traffic",
            },
            {
              feature: "Price Guarantee",
              us: "7-Day Price Lock (Zero Haggle)",
              others: "Dubizzle: Lowball chats | Shops: Haggle upon arrival",
            },
            {
              feature: "Data Security",
              us: "100% Certified DoD Data Wipe",
              others: "Dubizzle: Self wipe | Shops: Factory reset only",
            },
          ].map((item, i) => (
            <div key={i} className="w-[calc(50%-4px)] min-w-[calc(50%-4px)] max-w-[calc(50%-4px)] shrink-0 snap-start bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 flex flex-col justify-between space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.feature}
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 text-[11px] font-bold text-emerald-400 flex items-start gap-1">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">SellPhoneCash:</strong> {item.us}</span>
              </div>
              <div className="text-[10px] text-slate-400 pl-0.5 leading-tight">
                {item.others}
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop: Full Comparison Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-emerald-400 font-bold bg-emerald-500/10 rounded-t-xl">
                  SellPhoneCash
                </th>
                <th className="py-3 px-4">Classifieds (Dubizzle)</th>
                <th className="py-3 px-4">Offline Street Shops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Payment Method</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-500/5">
                  Instant Cash or Bank Transfer
                </td>
                <td className="py-3.5 px-4 text-slate-400">Cash (High Risk of Fake Notes)</td>
                <td className="py-3.5 px-4 text-slate-400">Cash (Often below quote)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Doorstep Pickup</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-500/5">
                  Free 3-Hour Pickup Across Dubai
                </td>
                <td className="py-3.5 px-4 text-slate-400">You must travel & meet strangers</td>
                <td className="py-3.5 px-4 text-slate-400">You travel to shop in traffic</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Price Haggling</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-500/5">
                  Zero (7-Day Locked Price)
                </td>
                <td className="py-3.5 px-4 text-slate-400">Aggressive endless lowballing</td>
                <td className="py-3.5 px-4 text-slate-400">Haggling upon arrival</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Certified Data Wipe</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-500/5">
                  100% Military-Grade DoD Wipe
                </td>
                <td className="py-3.5 px-4 text-slate-400">None (Your responsibility)</td>
                <td className="py-3.5 px-4 text-slate-400">Basic reset only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. RELATED LIVE PRODUCTS (REAL DATABASE CARDS) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                More Live Models
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Related {page.brand} Devices We Buy
              </h2>
            </div>
            <Link
              href={page.catalogLink}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <span>View All {page.brand} Models</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 6. FAQ ACCORDION SECTION */}
      <SeoFaqSection
        faqs={page.faqs}
        title={`Frequently Asked Questions About Selling ${page.modelName}`}
        subtitle="Clear answers on valuation, doorstep pickup, data wiping, and payment timelines."
      />

      {/* 7. HIGH CONVERTING CTA BANNER */}
      <SeoCtaBanner
        heading={`Ready to Turn Your ${page.modelName} Into Cash Today?`}
        subheading="Get a transparent valuation locked for 7 days. Free courier collection anywhere in Dubai within 3 hours."
        quoteButtonText={`Lock Price for ${page.modelName}`}
        quoteLink={matchedProduct ? `/products/${matchedProduct.id || matchedProduct._id}` : page.catalogLink}
        whatsappMessage={`Hi SellPhoneCash! I want to sell my ${page.brand} ${page.modelName} in Dubai. Please provide an instant trade-in quote.`}
        deviceName={page.modelName}
      />

      {/* 8. CROSS-LINKING INTERNAL NETWORK */}
      <SeoInternalLinks
        selectedLocations={page.relatedLocations}
        selectedServices={["iphone-dubai", "samsung-dubai", "phone-buyback-dubai", "broken-phone-dubai"]}
        selectedModels={page.relatedModels}
      />
    </div>
  );
}
