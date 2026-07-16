import { api } from "@/lib/api";
import { brands } from "@/data/mockData";
import ProductList from "@/components/ProductList";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) => {
  const { category: categorySlug, brand: brandSlug } = await params;
  const categories = await api.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  const brand = brands.find((b) => b.slug === brandSlug);

  if (!category || !brand) return { title: "Brand Not Found" };

  return {
    title: `Sell Used ${brand.name} ${category.name} | SellYourPhone24`,
    description: `Get the best cash trade-in values for your used ${brand.name} ${category.name.toLowerCase()} in Dubai, Abu Dhabi, & UAE. Instant valuation.`,
  };
};

const BrandPage = async ({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) => {
  const { category: categorySlug, brand: brandSlug } = await params;
  
  const categories = await api.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  const brand = brands.find((b) => b.slug === brandSlug);

  if (!category || !brand) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/services" className="hover:text-emerald-500 transition">
          Services
        </Link>
        <ArrowRight size={12} className="text-slate-400" />
        <Link href={`/services/${categorySlug}`} className="hover:text-emerald-500 transition">
          {category.name}
        </Link>
        <ArrowRight size={12} className="text-slate-400" />
        <span className="text-slate-800">{brand.name}</span>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <span className="text-2xl">{brand.logo}</span>
            Sell Used {brand.name} {category.name}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Select your specific model from the list below to evaluate its condition and calculate your instant trade-in quote.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
          <Shield size={14} className="text-slate-500" />
          Secure UAE Buyback Platform
        </div>
      </div>

      {/* Filtered Product Listing */}
      <div className="pt-4">
        <ProductList category={categorySlug} brand={brand.name} params="brandpage" />
      </div>
    </div>
  );
};

export default BrandPage;
