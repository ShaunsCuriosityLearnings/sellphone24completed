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
      displayProducts = popularProducts.slice(0, 10);
    } else {
      const allProducts = await api.getProducts({ category, brand });
      displayProducts = allProducts.slice(0, 10);
    }
  } else {
    displayProducts = await api.getProducts({ category, brand });
  }

  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <p className="text-slate-500 font-medium">No devices found in this category.</p>
        <Link href="/services" className="mt-4 inline-block text-emerald-500 underline font-semibold text-sm">
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid container: 5 items per row on large screens (xl:grid-cols-5) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {displayProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

      {params === "homepage" && (
        <div className="flex justify-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-semibold rounded-full transition shadow-lg shadow-slate-900/10 cursor-pointer text-sm"
          >
            Browse All Devices & Get Quote
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
