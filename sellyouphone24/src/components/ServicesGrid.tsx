import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

const ServicesGrid = () => {
  return (
    <section className="space-y-6 mb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Our Services</h2>
          <p className="text-sm text-slate-500">Choose a category to start selling</p>
        </div>
        <Link href="/services" className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
          View All Services
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.slug === 'any-device' ? '/sell-any-device' : `/services/${category.slug}`}
            className="group flex flex-col items-center bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-500/30 rounded-[24px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative w-24 h-24 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Image 
                src={category.image} 
                alt={category.name} 
                fill 
                className="object-contain drop-shadow-md"
              />
            </div>
            
            {/* Title */}
            <h3 className="font-bold text-slate-800 group-hover:text-emerald-500 transition-colors text-center text-sm">
              Sell {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
