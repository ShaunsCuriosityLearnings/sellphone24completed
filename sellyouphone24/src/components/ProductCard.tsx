"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Zap } from "lucide-react";
import { ProductType } from "@/types";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image Cover */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-slate-50 border-b border-slate-50">
        <Image
          src={product.images.frontView}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Floating Quick Tag */}
        <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Zap size={10} />
          Top Value
        </div>
      </Link>

      {/* Card Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-800 text-base md:text-lg group-hover:text-emerald-500 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {product.shortDescription}
          </p>

          {/* Quick Specifications Badges */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {product.storages.slice(0, 3).map((st) => (
              <span key={st} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {st}
              </span>
            ))}
            {product.storages.length > 3 && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                +{product.storages.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer pricing & link */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Get up to</p>
            <p className="text-lg font-extrabold text-emerald-600">
              AED {product.basePrice.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-300"
          >
            Sell Now
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
