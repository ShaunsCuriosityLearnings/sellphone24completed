"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, Zap } from "lucide-react";
import { ProductType } from "@/types";

const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Product Image Cover */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-50 p-4">
        
        {/* Primary Image (Front View) */}
        <div className={`absolute inset-4 transition-opacity duration-500 z-10 ${product.images.backView ? 'group-hover:opacity-0' : ''}`}>
          <Image
            src={product.images.frontView}
            alt={product.name}
            fill
            sizes="(max-width:768px) 33vw, (max-width:1200px) 25vw, 20vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          />
        </div>

        {/* Secondary Image (Back View) */}
        {product.images.backView && (
          <div className="absolute inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <Image
              src={product.images.backView}
              alt={`${product.name} Back`}
              fill
              sizes="(max-width:768px) 33vw, (max-width:1200px) 25vw, 20vw"
              className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            />
          </div>
        )}

        {/* Floating Quick Tag */}
        <div className="absolute top-2 left-2 z-30 bg-emerald-500 text-slate-950 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Zap size={8} />
          Top Value
        </div>
      </Link>

      {/* Card Content details */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {product.brand}
          </p>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-emerald-500 transition-colors line-clamp-1" style={{ fontFamily: "var(--font-poppins)" }}>
              {product.name}
            </h3>
          </Link>

          {/* Quick Specifications Badges */}
          <div className="flex flex-wrap gap-1 pt-1">
            {product.storages.slice(0, 2).map((st) => (
              <span key={st} className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                {st}
              </span>
            ))}
            {product.storages.length > 2 && (
              <span className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                +{product.storages.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer pricing & link */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-semibold">Get up to</p>
            <p className="text-sm font-extrabold text-emerald-600" style={{ fontFamily: "var(--font-poppins)" }}>
              AED {product.basePrice.toLocaleString()}
            </p>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white text-[10px] font-semibold px-2 py-1.5 rounded-lg transition duration-300"
          >
            Sell
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
