import { api } from "@/lib/api";
import { products as mockProducts } from "@/data/mockData";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import ProductCatalog from "@/components/ProductCatalog";

const resolveCanonicalCategory = (categories: any[], requestedSlug: string) => {
  const reqLower = requestedSlug.toLowerCase().trim();

  // 1. Check exact match in DB
  let matched = categories.find((c) => c.slug?.toLowerCase() === reqLower);
  if (matched) return matched;

  // 2. Check alias match in DB
  const aliasMap: Record<string, string[]> = {
    smartphones: ["mobile", "smartphones", "phones"],
    mobile: ["mobile", "smartphones", "phones"],
    laptops: ["laptops", "macbooks"],
    macbooks: ["laptops", "macbooks"],
    smartwatches: ["smartwatches", "watches"],
    watches: ["smartwatches", "watches"],
    tablets: ["tablets", "ipads"],
    ipads: ["tablets", "ipads"],
  };

  const possibleAliases = aliasMap[reqLower] || [reqLower];
  matched = categories.find((c) => possibleAliases.includes(c.slug?.toLowerCase()));
  if (matched) return matched;

  // 3. Fallback: Default to standard database category names
  if (reqLower === "smartphones" || reqLower === "phones") {
    return {
      id: "mobile",
      _id: "mobile",
      name: "Mobile",
      slug: "mobile",
      description: "Sell your used mobile phones for top value instantly in UAE.",
      image: "/products/apple logo.jpg"
    };
  }

  if (reqLower === "macbooks") {
    return {
      id: "laptops",
      _id: "laptops",
      name: "Laptops",
      slug: "laptops",
      description: "Sell your used MacBooks and laptops for top value instantly.",
      image: "/products/apple logo.jpg"
    };
  }

  const formattedName = requestedSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    id: requestedSlug,
    _id: requestedSlug,
    name: formattedName,
    slug: requestedSlug,
    description: `Sell your used ${formattedName} for instant cash in UAE.`,
    image: "/products/apple logo.jpg"
  };
};

export const generateMetadata = async ({ params }: { params: Promise<{ category: string }> }) => {
  const categorySlug = (await params).category;
  const categories = await api.getCategories();
  const category = resolveCanonicalCategory(categories, categorySlug);

  return {
    title: `Sell Used ${category.name} in Dubai & UAE`,
    description: `Sell your used ${category.name.toLowerCase()} in Dubai & UAE. Get instant valuations for Apple, Samsung, Google, and more with free 30-min doorstep pickup.`,
    alternates: {
      canonical: `/services/${categorySlug.toLowerCase()}`,
    },
  };
};

const CategoryPage = async ({ params }: { params: Promise<{ category: string }> }) => {
  const categorySlug = (await params).category;

  if (categorySlug.toLowerCase() === "any-device" || categorySlug.toLowerCase() === "sell-any-device") {
    redirect("/sell-any-device");
  }

  const categories = await api.getCategories();
  
  const category = resolveCanonicalCategory(categories, categorySlug);

  let categoryBrands = await api.getBrands({ category: category.slug });
  if (!categoryBrands || categoryBrands.length === 0) {
    categoryBrands = await api.getBrands();
  }

  let categoryProducts = await api.getProducts({ category: category.slug });
  if (!categoryProducts || categoryProducts.length === 0) {
    const aliasMap: Record<string, string> = {
      smartphones: "mobile",
      mobile: "smartphones",
      laptops: "macbooks",
      macbooks: "laptops",
      smartwatches: "watches",
      tablets: "ipads"
    };
    const fallbackSlug = aliasMap[categorySlug.toLowerCase()];
    if (fallbackSlug) {
      categoryProducts = await api.getProducts({ category: fallbackSlug });
    }
  }

  if (!categoryProducts || categoryProducts.length === 0) {
    categoryProducts = mockProducts.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const slug = (categorySlug || "").toLowerCase();
      return cat === slug || (slug === "smartphones" && cat === "mobile");
    });
    if (categoryProducts.length === 0) {
      categoryProducts = mockProducts;
    }
  }

  // Lightweight projection for catalog display to slash serialized RSC payload
  const catalogProducts: any = (categoryProducts || []).map((p) => ({
    id: p.id || (p as any)._id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    basePrice: p.basePrice || 0,
    images: {
      frontView: p.images?.frontView || "/products/apple logo.jpg",
      backView: p.images?.backView || "",
      sideView: p.images?.sideView || "",
    },
    storages: p.storages || [],
    colors: p.colors || [],
    description: "",
    shortDescription: p.shortDescription || "",
    isPopular: p.isPopular,
    isLivePrice: p.isLivePrice,
    slug: p.slug,
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.sellphonecash.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://www.sellphonecash.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `https://www.sellphonecash.com/services/${categorySlug.toLowerCase()}`,
      },
    ],
  };

  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Schema Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Back button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 transition"
        >
          <ArrowLeft size={14} />
          Back to Categories
        </Link>
      </div>

      {/* Header section */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight">
          Sell Your <span className="text-emerald-500">{category.name}</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl">
          We buy high-value used {category.name.toLowerCase()} from leading global manufacturers. Select your device brand to get started.
        </p>
      </div>

      {/* Product Catalog with Sidebar Filters */}
      <ProductCatalog 
        initialProducts={catalogProducts} 
        brands={categoryBrands} 
        categoryName={category.name} 
      />

      {/* Valuation Tip */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex items-start gap-4 shadow-sm max-w-3xl">
        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
          <Zap size={20} />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-slate-800 text-sm">How to get the highest price?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Device values degrade rapidly in the technology cycle. Lock in your valuation today. Our quotes are guaranteed for 7 days, giving you ample time to backup your data and prepare your device for collection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
