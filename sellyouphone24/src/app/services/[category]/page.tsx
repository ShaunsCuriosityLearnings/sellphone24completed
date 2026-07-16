import { api } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";

export const generateMetadata = async ({ params }: { params: Promise<{ category: string }> }) => {
  const categorySlug = (await params).category;
  const categories = await api.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  
  if (!category) return { title: "Category Not Found" };
  
  return {
    title: `Sell ${category.name} | SellYourPhone24`,
    description: `Sell your used ${category.name.toLowerCase()} in Dubai & UAE. Get instant valuations for Apple, Samsung, Google, and more.`,
  };
};

const CategoryPage = async ({ params }: { params: Promise<{ category: string }> }) => {
  const categorySlug = (await params).category;
  const categories = await api.getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const categoryBrands = await api.getBrands({ category: categorySlug });

  return (
    <div className="space-y-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Grid container of brands */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {categoryBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/services/${categorySlug}/${brand.slug}`}
            className="bg-white border border-slate-100 hover:border-emerald-500/20 hover:shadow-xl rounded-3xl p-8 flex flex-col items-center text-center justify-center transition-all duration-300 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-4xl mb-4 group-hover:bg-emerald-50 transition-colors">
              {brand.logo}
            </div>
            <h2 className="text-lg font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">
              {brand.name}
            </h2>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider flex items-center gap-1">
              Select Brand
              <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        ))}
      </div>

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
