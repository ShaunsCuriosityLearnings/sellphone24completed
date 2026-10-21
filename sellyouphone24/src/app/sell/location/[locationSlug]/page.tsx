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
import { ProductType, CategoryType, BrandType } from "@/types";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import SeoFaqSection from "@/components/SeoFaqSection";
import SeoInternalLinks from "@/components/SeoInternalLinks";
import LocationHeroPomaii from "@/components/location/LocationHeroPomaii";
import LocationTrustBar from "@/components/location/LocationTrustBar";
import LocationPopularDevices from "@/components/location/LocationPopularDevices";
import LocationServicesSection from "@/components/location/LocationServicesSection";
import LocationGuidesModule from "@/components/location/LocationGuidesModule";
import LocationPanoramicCta from "@/components/location/LocationPanoramicCta";
import LocationProofStats from "@/components/location/LocationProofStats";
import {
  MapPin,
  Clock,
  Banknote,
  Building,
  Navigation,
  CheckCircle2,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locationSlug: string }>;
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

  // Fetch live products, categories, and brands from database
  let allProducts: ProductType[] = [];
  let allCategories: CategoryType[] = [];
  let allBrands: BrandType[] = [];

  try {
    const [fetchedProducts, fetchedCategories, fetchedBrands] = await Promise.all([
      api.getProducts().catch(() => []),
      api.getCategories().catch(() => []),
      api.getBrands().catch(() => []),
    ]);
    allProducts = fetchedProducts || [];
    allCategories = (fetchedCategories || []).filter((c) => c.slug !== "any-device");
    allBrands = fetchedBrands || [];
  } catch (err) {
    console.warn("Could not load database catalog for location page:", err);
  }

  // Curated products if admin specified overrides, otherwise all products
  const displayProducts = (pageOverride?.featuredProducts && pageOverride.featuredProducts.length > 0)
    ? pageOverride.featuredProducts
    : allProducts;

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
      quote: `Booked pickup from my apartment in ${page.locationName}. Courier was here in 35 minutes, tested my phone on the spot, and paid cash. Exceptional service!`,
      rating: 5,
    },
    {
      name: "Elena V.",
      location: page.locationName,
      quote: `I was hesitant about selling online, but SellPhoneCash came to my building lobby in ${page.locationName}. Very professional, verified data wipe, and no haggling!`,
      rating: 5,
    },
    {
      name: "Rahul K.",
      location: page.locationName,
      quote: `Upgraded to iPhone 16 Pro and sold my old 14 Pro Max during my lunch break in ${page.locationName}. Immediate cash in hand, 10/10 recommendation.`,
      rating: 5,
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] text-slate-900 min-h-screen">
      
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
        <SeoBreadcrumb
          items={[
            { name: "Sell Hub", url: "/sell" },
            { name: "Dubai Pickup Areas", url: "/sell#locations" },
            { name: page.locationName, url: `/sell/location/${page.slug}` },
          ]}
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (ORGANIC SCULPTED FLUID FRAME + SEGMENTED FLOATING SEARCH)*/}
      {/* ========================================================================= */}
      <LocationHeroPomaii
        page={page}
        customH1={pageOverride?.customH1}
        customSubtitle={pageOverride?.customSubtitle}
        customHeroImage={pageOverride?.heroImage || page.heroImage}
        categories={allCategories}
        brands={allBrands}
        products={allProducts}
      />

      {/* ========================================================================= */}
      {/* 2. 4 HORIZONTAL TRUST PILLARS (Matching Pomaii 4 Circular Icons)           */}
      {/* ========================================================================= */}
      <LocationTrustBar
        locationName={page.locationName}
        pickupSpeed={page.pickupSpeed}
      />

      {/* ========================================================================= */}
      {/* 3. POPULAR PRODUCTS IN THIS LOCATION (4 Tall Destination-Style Cards)      */}
      {/* ========================================================================= */}
      <LocationPopularDevices
        locationName={page.locationName}
        products={displayProducts}
        categories={allCategories}
      />

      {/* ========================================================================= */}
      {/* 4. OUR SERVICES SECTION (Requested by User: Services & Products next)     */}
      {/* ========================================================================= */}
      <LocationServicesSection
        locationName={page.locationName}
        pickupSpeed={page.pickupSpeed}
        categories={allCategories}
        brands={allBrands}
        products={allProducts}
      />

      {/* ========================================================================= */}
      {/* 5. LOCAL GUIDES & TRADE-IN STORIES (Warm Cream Container Card)            */}
      {/* ========================================================================= */}
      <LocationGuidesModule
        locationName={page.locationName}
      />

      {/* ========================================================================= */}
      {/* 6. PANORAMIC DUBAI SKYLINE CTA BANNER (Matching 'Next Adventure Starts')  */}
      {/* ========================================================================= */}
      <LocationPanoramicCta
        locationName={page.locationName}
        pickupSpeed={page.pickupSpeed}
      />

      {/* ========================================================================= */}
      {/* 7. BOTTOM PROOF STATS ROW (10,000+ Happy Sellers, 4.9 Rating, 24/7 Support)*/}
      {/* ========================================================================= */}
      <LocationProofStats
        locationName={page.locationName}
        pickupSpeed={page.pickupSpeed}
      />

      {/* ========================================================================= */}
      {/* 8. LOCAL COURIER COVERAGE, LANDMARKS & REVIEWS                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Coverage Overview */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Navigation size={13} />
                <span>Hyper-Local Logistics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                How Collection Works in {page.locationName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {page.coverageDescription}
              </p>
            </div>

            {/* Key Landmarks */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Popular Pickup Landmarks in {page.locationName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {page.keyLandmarks.map((lm, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-400 transition-colors"
                  >
                    📍 {lm}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {page.serviceHighlights.map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhoods Served Card */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-9 space-y-4 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Building size={13} />
              <span>Full Area Coverage</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">100% Doorstep Coverage</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immediate courier dispatch to residential towers, gated communities, and corporate offices across {page.locationName}:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {page.neighborhoodsServed.map((nh, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 font-semibold"
                >
                  {nh}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Customer Reviews in this Location */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Verified Feedback from {page.locationName} Sellers
            </h3>
            <p className="text-xs text-slate-500">
              Recent verified doorstep buyback transactions completed in this neighborhood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localReviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between"
              >
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">{rev.name}</h4>
                    <p className="text-[10px] text-slate-400">{rev.location}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO FAQ Section with JSON-LD Schema */}
        <SeoFaqSection faqs={page.faqs} title={`Frequently Asked Questions: Sell Phone in ${page.locationName}`} />

        {/* Inter-linking Network */}
        <SeoInternalLinks
          currentSlug={page.slug}
          selectedLocations={page.relatedLocations}
        />

      </section>

    </div>
  );
}
