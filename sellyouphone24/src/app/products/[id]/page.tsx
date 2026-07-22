import { api } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductInteraction from "@/components/ProductInteraction";
import { Truck, ShieldCheck, RefreshCcw, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Dynamic SEO metadata generator
export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const productId = (await params).id;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellyourphone24.ae";
  try {
    const product = await api.getProductById(productId);
    const title = `Sell Your ${product.brand} ${product.name} | Instant Cash Valuation UAE`;
    const description = `Get an instant valuation up to ${product.basePrice} AED for your used ${product.brand} ${product.name} on SellYourPhone24. Free doorstep pickup & cash on the spot in Dubai & Abu Dhabi.`;
    const pageUrl = `${baseUrl}/products/${productId}`;
    const imageUrl = product.images?.frontView 
      ? (product.images.frontView.startsWith("http") ? product.images.frontView : `${baseUrl}${product.images.frontView}`)
      : `${baseUrl}/products/iphone 17 pro max 💖.jpg`;

    return {
      title,
      description,
      keywords: [
        `Sell ${product.name}`,
        `Used ${product.name} resale price`,
        `Sell ${product.brand} phone Dubai`,
        `Trade in ${product.name} UAE`,
        "SellYourPhone24",
        "Phone valuation Dubai",
      ],
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "SellYourPhone24",
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
    return { title: "Product Not Found | SellYourPhone24" };
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
  
  let product;
  try {
    product = await api.getProductById(productId);
  } catch (err) {
    notFound();
  }

  if (!product) {
    notFound();
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
    ipads: "Tablets"
  };

  const rawCategory = (product.category || "mobile").toLowerCase();
  const categoryName = categoryDisplayNames[rawCategory] || (rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1));
  const brandSlug = (product.brand || "").toLowerCase().trim();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Interactive Breadcrumbs & Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto py-1">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
          <Link href="/services" className="hover:text-emerald-600 transition">
            Services
          </Link>
          <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
          <Link 
            href={`/services/${rawCategory}`} 
            className="hover:text-emerald-600 transition font-semibold text-slate-700"
          >
            {categoryName}
          </Link>
          <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
          <Link 
            href={`/services/${rawCategory}?brand=${brandSlug}`} 
            className="hover:text-emerald-600 transition font-semibold text-slate-700 capitalize"
          >
            {product.brand}
          </Link>
          <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
          <span className="font-bold text-emerald-600 truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <Link
            href={`/services/${rawCategory}?brand=${brandSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs"
          >
            <ArrowLeft size={14} />
            Back to {product.brand} {categoryName}
          </Link>
        </div>
      </div>

      {/* Main product box */}
      <div className="flex flex-col lg:flex-row gap-12 bg-white border border-slate-100 rounded-[40px] p-6 md:p-10 shadow-sm">
        {/* LEFT COLUMN: IMAGES */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-8">
            <Image
              src={product.images[selectedView]}
              alt={product.name}
              fill
              priority
              className="object-contain p-6 hover:scale-102 transition-all duration-500 drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
            />
          </div>

          {/* THUMBNAILS WITH QUERY PARAMS */}
          <div className="grid grid-cols-3 gap-3">
            <Link
              href={`/products/${product.id}?view=frontView`}
              className={`relative aspect-[4/5] rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50/50 ${
                selectedView === "frontView" ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200"
              }`}
            >
              <Image src={product.images.frontView} alt="Front View" fill className="object-contain p-2" />
            </Link>

            <Link
              href={`/products/${product.id}?view=sideView`}
              className={`relative aspect-[4/5] rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50/50 ${
                selectedView === "sideView" ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200"
              }`}
            >
              <Image src={product.images.sideView} alt="Side View" fill className="object-contain p-2" />
            </Link>

            <Link
              href={`/products/${product.id}?view=backView`}
              className={`relative aspect-[4/5] rounded-2xl overflow-hidden border p-2 flex items-center justify-center bg-slate-50/50 ${
                selectedView === "backView" ? "border-emerald-500 ring-2 ring-emerald-500/10" : "border-slate-200"
              }`}
            >
              <Image src={product.images.backView} alt="Back View" fill className="object-contain p-2" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: VALUATION AND INTERACTION */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          <div className="space-y-2">
            <p className="uppercase text-xs font-bold tracking-[0.2em] text-emerald-600">
              {product.brand} Buyback Program
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{product.name}</h1>

            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-bold">★★★★★</span>
              <span className="text-xs text-slate-400 font-medium">100% Secure UAE recycling process</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>

          <hr className="border-slate-100" />

          {/* Interactive options & calculated price */}
          <ProductInteraction product={product} />

          <hr className="border-slate-100" />

          {/* Value Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl">
              <Truck size={18} className="text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Free Home Pickup</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Across UAE Emirates</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl">
              <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Data Sanitization</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">100% Secured Erasure</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl">
              <RefreshCcw size={18} className="text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800">Depreciation Lock</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Price Locked for 7 Days</p>
              </div>
            </div>
          </div>

          {/* Highlight Bullets */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-800">What to do before handing over?</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Backup all photos, messages, and files to iCloud or Google Drive.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Sign out of iCloud / Google accounts and remove any device locks.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                Charge the device to at least 20% battery for easy courier testing.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
