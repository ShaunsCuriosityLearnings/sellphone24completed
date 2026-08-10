import { api } from "@/lib/api";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types";

const ProductList = async ({
  category,
  brand,
  params,
}: {
  category?: string;
  brand?: string;
  params: "homepage" | "products" | "brandpage";
}) => {
  let displayProducts: ProductType[] = [];

  if (params === "homepage") {
    const popularProducts = await api.getProducts({ isPopular: true });
    if (popularProducts && popularProducts.length > 0) {
      displayProducts = popularProducts.slice(0, 8);
    } else {
      const allProducts = await api.getProducts({ category, brand });
      displayProducts = allProducts.slice(0, 8);
    }
  } else {
    displayProducts = await api.getProducts({ category, brand });
  }

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
        <p className="text-slate-500 font-medium text-xs">No devices found in this category.</p>
        <Link href="/services" className="mt-3 inline-block text-emerald-600 underline font-bold text-xs">
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 3 cards per row on mobile (grid-cols-3), 4 cards per row on desktop (lg:grid-cols-4 xl:grid-cols-4) */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

      {params === "homepage" && (
        <div className="flex justify-center pt-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold rounded-xl transition shadow-md cursor-pointer text-xs"
          >
            Browse All Devices & Get Quote
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
