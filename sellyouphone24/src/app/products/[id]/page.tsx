import { api } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductInteraction from "@/components/ProductInteraction";
import ProductSpecificationTabs from "@/components/ProductSpecificationTabs";
import DeviceCategoryCards from "@/components/DeviceCategoryCards";
import ProductCard from "@/components/ProductCard";
import SeoFaqSection from "@/components/SeoFaqSection";
import { resolveModelPage } from "@/lib/seoData";
import { 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  ArrowLeft, 
  ChevronRight, 
  Star, 
  CreditCard, 
  Headphones, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { ProductType } from "@/types";

// Dynamic SEO metadata generator
export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";
  try {
    const product = await api.getProductById(productId);
    const title = `Sell Your ${product.brand} ${product.name} | Instant Cash Valuation UAE`;
    const description = `Get an instant valuation up to ${product.basePrice} AED for your used ${product.brand} ${product.name} on SellPhoneCash. Free doorstep pickup & cash on the spot in Dubai & Abu Dhabi.`;
    const pageUrl = `${baseUrl}/products/${productId}`;
    const imageUrl = product.images?.frontView 
      ? (product.images.frontView.startsWith("http") ? product.images.frontView : `${baseUrl}${product.images.frontView}`)
      : `${baseUrl}/products/iphone-pro-max.jpg`;

    return {
      title,
      description,
      keywords: [
        `Sell ${product.name}`,
        `Used ${product.name} resale price dubai`,
        `Sell ${product.brand} phone Dubai`,
        `Trade in ${product.name} UAE`,
        `SellPhoneCash ${product.name}`,
        `${product.name} valuation Dubai`,
        `Cash for ${product.name} UAE`
      ],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "SellPhoneCash",
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: `Sell Your ${product.brand} ${product.name}`,
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
  } catch (err) {
    return { title: "Product Not Found | SellPhoneCash" };
  }
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    view?: string;
  }>;
}) => {
  const productId = (await params).id;
  
  let product: ProductType | null = null;
  let relatedProducts: ProductType[] = [];

  try {
    product = await api.getProductById(productId);
  } catch (err) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Load related devices from same category
  try {
    const categoryProducts = await api.getProducts({ category: product.category });
    relatedProducts = categoryProducts
      .filter((p) => String(p.id || p._id) !== String(product?.id || product?._id))
      .slice(0, 4);
  } catch (err) {
    console.warn("Failed to fetch related products:", err);
  }

  const { view } = await searchParams;
  const selectedView = view === "sideView" || view === "backView" ? view : "frontView";

  const categoryDisplayNames: Record<string, string> = {
    mobile: "Mobile",
    smartphones: "Mobile",
    laptops: "Laptops",
    macbooks: "Laptops",
    smartwatches: "Smartwatches",
    watches: "Smartwatches",
    tablets: "Tablets",
    ipads: "Tablets",
  };

  const rawCategory = (product.category || "mobile").toLowerCase();
  const categoryName = categoryDisplayNames[rawCategory] || (rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1));
  const brandSlug = (product.brand || "").toLowerCase().trim();

  // Dynamically resolve keyword-rich model FAQs based on product name
  const modelSeoInfo = resolveModelPage(product.name.toLowerCase().replace(/\s+/g, "-"));
  const faqs = modelSeoInfo.faqs || [];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // Product Schema.org JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.brand} ${product.name}`,
    "description": product.description || `Sell your ${product.brand} ${product.name} in Dubai for instant cash valuation.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand,
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AED",
      "lowPrice": Math.round(product.basePrice * 0.45),
      "highPrice": product.basePrice,
      "offerCount": "4",
      "seller": {
        "@type": "Organization",
        "name": "SellPhoneCash",
        "url": baseUrl,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Interactive Breadcrumbs & Back button matching Reference Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto py-1">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          <Link href="/services" className="hover:text-emerald-600 transition">
            Shop &amp; Services
          </Link>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          <Link 
            href={`/services/${rawCategory}`} 
            className="hover:text-emerald-600 transition font-semibold text-slate-700"
          >
            {categoryName}
          </Link>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          <Link 
            href={`/services/${rawCategory}?brand=${brandSlug}`} 
            className="hover:text-emerald-600 transition font-semibold text-slate-700 capitalize"
          >
            {product.brand}
          </Link>
          <ChevronRight size={12} className="text-slate-400 shrink-0" />
          <span className="font-bold text-emerald-600 truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div>
          <Link
            href={`/services/${rawCategory}?brand=${brandSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Back to {product.brand} {categoryName}</span>
          </Link>
        </div>
      </div>

      {/* Main Product Box - Clean 2-Column Hero matching Reference Image */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white border border-slate-200/90 rounded-3xl p-6 md:p-10 shadow-sm">
        
        {/* LEFT COLUMN: PRODUCT IMAGES & THUMBNAIL STRIP */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-8 group">
            <div className="absolute top-3.5 left-3.5 z-10 bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles size={11} />
              <span>Official Buyback</span>
            </div>

            <Image
              src={product.images[selectedView]}
              alt={product.name}
              fill
              priority
              className="object-contain p-6 hover:scale-105 transition-all duration-500 drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
            />
          </div>

          {/* THUMBNAIL SELECTOR STRIP */}
          <div className="grid grid-cols-3 gap-3">
            <Link
              href={`/products/${product.id}?view=frontView`}
              className={`relative aspect-square rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50 transition ${
                selectedView === "frontView" ? "border-emerald-500 ring-2 ring-emerald-500/15 bg-white" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image src={product.images.frontView} alt="Front View" fill className="object-contain p-2" />
            </Link>

            {product.images?.sideView && (
              <Link
                href={`/products/${product.id}?view=sideView`}
                className={`relative aspect-square rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50 transition ${
                  selectedView === "sideView" ? "border-emerald-500 ring-2 ring-emerald-500/15 bg-white" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Image src={product.images.sideView} alt="Side View" fill className="object-contain p-2" />
              </Link>
            )}

            {product.images?.backView && (
              <Link
                href={`/products/${product.id}?view=backView`}
                className={`relative aspect-square rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50 transition ${
                  selectedView === "backView" ? "border-emerald-500 ring-2 ring-emerald-500/15 bg-white" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Image src={product.images.backView} alt="Back View" fill className="object-contain p-2" />
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: VALUATION AND INTERACTION */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="uppercase text-[11px] font-extrabold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                {product.brand} Buyback Program
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">{categoryName}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{product.name}</h1>

            {/* Rating Stars using Lucide Star icons */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">4.9</span>
              <span className="text-xs text-slate-400">(258+ Verified UAE Reviews)</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">{product.description}</p>
          </div>

          <hr className="border-slate-100" />

          {/* Interactive options & calculated price */}
          <ProductInteraction product={product} />

          <hr className="border-slate-100" />

          {/* Value Highlights Grid matching Reference Trust Perks with Lucide Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={17} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Free Home Pickup</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">3-Hour collection across UAE</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard size={17} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Instant Payments</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Cash in hand or direct bank wire</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={17} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Certified Data Wipe</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">100% Secured DoD Erasure</p>
              </div>
            </div>
          </div>

          {/* Preparation Checklist */}
          <div className="space-y-2.5 pt-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">What to do before handover?</h3>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Backup all photos, messages, and files to iCloud or Google Drive.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Sign out of iCloud / Google accounts and remove device passcodes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Charge the device to at least 20% battery for easy courier testing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. TABBED SPECIFICATIONS & ADDITIONAL INFORMATION (MATCHING REFERENCE IMAGE) */}
      <ProductSpecificationTabs
        modelName={product.name}
        brand={product.brand}
        category={product.category}
        description={product.description}
        faqs={faqs}
      />

      {/* 3. RELATED DEVICES WE BUY (MATCHING REFERENCE 'RELATED POSTS' SECTION) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                More Devices
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Related {product.brand} Devices We Buy
              </h2>
            </div>
            <Link
              href={`/services/${rawCategory}?brand=${brandSlug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id || relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}

      {/* 4. MORE DEVICE CATEGORIES CARDS SECTION (MATCHING USER REQUIREMENT) */}
      <DeviceCategoryCards currentCategory={product.category} />

      {/* 5. PRODUCT-SPECIFIC FAQS SECTION */}
      {faqs.length > 0 && (
        <SeoFaqSection
          faqs={faqs}
          title={`Frequently Asked Questions About Selling ${product.name}`}
          subtitle={`Verified guidelines on selling your ${product.brand} ${product.name} in Dubai & UAE.`}
        />
      )}
    </div>
  );
};

export default ProductPage;
