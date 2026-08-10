"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ProductType } from "@/types";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Product Image Cover */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50/60 border-b border-slate-100 p-2 sm:p-3">
        
        {/* Primary Image (Front View) */}
        <div className={`absolute inset-2 sm:inset-3 transition-opacity duration-500 z-10 ${product.images.backView ? 'group-hover:opacity-0' : ''}`}>
          <Image
            src={product.images.frontView}
            alt={product.name}
            fill
            sizes="(max-width:768px) 33vw, (max-width:1200px) 25vw, 20vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Secondary Image (Back View) */}
        {product.images.backView && (
          <div className="absolute inset-2 sm:inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <Image
              src={product.images.backView}
              alt={`${product.name} Back`}
              fill
              sizes="(max-width:768px) 33vw, (max-width:1200px) 25vw, 20vw"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Floating Quick Tag */}
        <div className="absolute top-1.5 left-1.5 z-30 bg-emerald-500 text-slate-950 text-[7px] sm:text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5 shadow-xs">
          <Zap size={8} />
          Top Value
        </div>
      </Link>

      {/* Card Content details */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div className="space-y-0.5">
          <p className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-800 text-[10px] sm:text-xs md:text-sm group-hover:text-emerald-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Quick Specifications Badges */}
          <div className="flex flex-wrap gap-0.5 pt-0.5">
            {product.storages.slice(0, 2).map((st) => (
              <span key={st.size} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] sm:text-[9px] font-semibold">
                {st.size}
              </span>
            ))}
            {product.storages.length > 2 && (
              <span className="text-[8px] font-medium bg-slate-100 text-slate-500 px-1 py-0.5 rounded">
                +{product.storages.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer pricing & link */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
          <div>
            <p className="text-[7px] sm:text-[8px] text-slate-400 uppercase font-bold leading-none">Get up to</p>
            <p className="text-[11px] sm:text-xs md:text-sm font-black text-emerald-600">
              AED {product.basePrice.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-0.5 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-1 rounded-md transition duration-300 shrink-0"
          >
            Sell
            <ArrowRight size={9} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
