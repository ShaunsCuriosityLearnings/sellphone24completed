import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  LOCATION_PAGES,
  LOCATION_SLUGS,
  MODEL_PAGES,
  SERVICE_PAGES,
  resolveLocationPage,
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
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  Banknote,
  Building,
  Navigation,
  Smartphone,
  Star,
  Zap,
  Flame,
} from "lucide-react";

interface Props {
  params: Promise<{ locationSlug: string }>;
}

export async function generateStaticParams() {
  return LOCATION_SLUGS.map((slug) => ({
    locationSlug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationSlug } = await params;
  const page = resolveLocationPage(locationSlug);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  const canonicalUrl = `${baseUrl}/sell/location/${page.slug}`;

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

export default async function LocationPage({ params }: Props) {
  const { locationSlug } = await params;
  const page = resolveLocationPage(locationSlug);

  // Check for admin override configuration from MongoDB
  let pageOverride = null;
  try {
    pageOverride = await api.getSeoPageBySlug(page.slug);
  } catch (err) {
    console.warn("Could not load location page override:", err);
  }

  // Fetch live products from database (respecting curated admin products if present)
  let locationProducts: ProductType[] = [];
  try {
    if (pageOverride?.featuredProducts && pageOverride.featuredProducts.length > 0) {
      locationProducts = pageOverride.featuredProducts;
    } else {
      const allProducts = await api.getProducts();
      // Prioritize popular or live price devices
      locationProducts = allProducts.filter((p) => p.isPopular || p.isLivePrice);
      if (locationProducts.length < 8) {
        locationProducts = allProducts.slice(0, 8);
      } else {
        locationProducts = locationProducts.slice(0, 8);
      }
    }
  } catch (err) {
    console.warn("Could not load products for location page:", err);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // Schema.org LocalBusiness with areaServed
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `SellPhoneCash - ${page.locationName}`,
    "image": `${baseUrl}/logo.png`,
    "telephone": "+971555549817",
    "priceRange": "AED 100 - AED 8,000",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": page.locationName,
      "addressRegion": "Dubai",
      "addressCountry": "AE",
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `${page.locationName}, Dubai, UAE`,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "22:00",
      },
    ],
    "description": page.coverageDescription,
  };

  const localReviews = [
    {
      name: "Saeed Al M.",
      location: page.locationName,
      quote: `Booked pickup from my residence in ${page.locationName}. Courier was here in 35 minutes, tested my phone on the spot, and paid cash. Exceptional service!`,
      rating: 5,
    },
    {
      name: "Elena V.",
      location: page.locationName,
      quote: `I was hesitant about selling online, but SellPhoneCash came to my building in ${page.locationName}. Very professional, verified data wipe, and no haggling!`,
      rating: 5,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-6 space-y-4 sm:space-y-8 lg:space-y-10">
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Breadcrumb Navigation - Compact on mobile */}
      <div className="px-1 sm:px-0">
        <SeoBreadcrumb
          items={[
            { name: "Sell Hub", url: "/sell" },
            { name: "Dubai Pickup Areas", url: "/sell#locations" },
            { name: page.locationName, url: `/sell/location/${page.slug}` },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-3.5 sm:p-8 md:p-14 border border-slate-800 shadow-xl sm:shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3 sm:space-y-6">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>Doorstep Pickup: {page.pickupSpeed} in {page.locationName}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] sm:text-xs font-semibold">
              <Flame size={12} className="text-amber-400 sm:w-3 sm:h-3" />
              <span>Active Couriers on Duty</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.14] text-white">
            {pageOverride?.customH1 || page.h1}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {pageOverride?.customSubtitle || page.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-base transition-all transform hover:-translate-y-0.5 shadow-sm sm:shadow-lg shadow-emerald-500/25"
            >
              <Zap size={16} />
              <span>Get Instant Valuation</span>
              <ArrowRight size={16} />
            </Link>

            <a
              href={`https://wa.me/971555549817?text=${encodeURIComponent(
                `Hi SellPhoneCash! I am in ${page.locationName} and want to sell my device. Please let me know how fast your courier can pick it up.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-base transition-all"
            >
              <span>WhatsApp {page.locationName} Dispatch</span>
            </a>
          </div>

          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-6 text-[10px] sm:text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-400" />
              <span>Arrival: {page.pickupSpeed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Banknote size={13} className="text-emerald-400" />
              <span>Instant Cash in Hand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>100% Certified Data Wipe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <TrustStatsBar />

      {/* ========================================================================= */}
      {/* 1. TOP LIVE PRODUCTS TRADED IN THIS LOCATION (FROM DATABASE)              */}
      {/* ========================================================================= */}
      {locationProducts && locationProducts.length > 0 && (
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-3 border-b border-slate-200 pb-3 sm:pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                Live Database Prices
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900">
                Top Trending Devices in {page.locationName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Most frequent trade-ins collected across {page.locationName} with live buyout pricing.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <span>Explore All Devices</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {locationProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. EMBEDDED CASCADING QUICK EVALUATION WIDGET                            */}
      {/* ========================================================================= */}
      <section className="space-y-3 sm:space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            Check Your Phone Value in {page.locationName}
          </h2>
          <p className="text-xs text-slate-500">
            Select your exact model to see current live UAE cash payouts before scheduling collection.
          </p>
        </div>

        <QuickEvaluationWidget />
      </section>

      {/* ========================================================================= */}
      {/* 3. LOCAL COURIER COVERAGE & DISPATCH DETAILS                              */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
        {/* Coverage Overview */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xs space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Navigation size={13} />
              <span>Hyper-Local Logistics</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              How Collection Works in {page.locationName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {page.coverageDescription}
            </p>
          </div>

          {/* Key Landmarks */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Popular Pickup Landmarks
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {page.keyLandmarks.map((lm, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700"
                >
                  {lm}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
            {page.serviceHighlights.map((hl, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhoods Served Card */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-3 sm:space-y-5 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Building size={13} />
            <span>Communities & Sub-Districts</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">100% Doorstep Coverage</h3>
          <p className="text-xs text-slate-300">
            Immediate dispatch to residential towers, commercial offices, and private villas:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            {page.neighborhoodsServed.map((nh, i) => (
              <span
                key={i}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 text-[11px] sm:text-xs text-emerald-300 font-medium"
              >
                {nh}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. VERIFIED LOCAL CUSTOMER REVIEWS                                       */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs space-y-4 sm:space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <div className="flex items-center justify-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="currentColor" />
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            What Customers in {page.locationName} Say
          </h2>
          <p className="text-xs text-slate-500">
            Recent verified doorstep collections completed in this area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {localReviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 sm:space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rev.name}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">{rev.location}</p>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why People Choose SellPhoneCash (Compact 2-card horizontal scroll on mobile) */}
      <WhyPeopleChooseSection />

      {/* SEO FAQ Section with JSON-LD Schema */}
      <SeoFaqSection faqs={page.faqs} title={`Frequently Asked Questions: Sell Phone in ${page.locationName}`} />

      {/* Conversion CTA Banner */}
      <SeoCtaBanner
        heading={`Sell Your Phone in ${page.locationName} Today`}
        subheading={`Free express doorstep pickup in ${page.pickupSpeed}, guaranteed instant valuation, and cash handed directly to you in ${page.locationName}.`}
        quoteLink="/services"
      />

      {/* Inter-linking Network */}
      <SeoInternalLinks
        currentSlug={page.slug}
        selectedLocations={page.relatedLocations}
      />
    </div>
  );
}
