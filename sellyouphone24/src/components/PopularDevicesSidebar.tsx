import Link from "next/link";
import Image from "next/image";
import { Zap, ChevronRight, TrendingUp, Search, Filter } from "lucide-react";
import { ProductType } from "@/types";

interface PopularDevicesSidebarProps {
  products: ProductType[];
  currentCat?: string;
  currentSort?: string;
  currentSearch?: string;
}

export default function PopularDevicesSidebar({
  products,
  currentCat = "all",
  currentSort = "newest",
  currentSearch = "",
}: PopularDevicesSidebarProps) {
  // Category Navigation list
  const categoriesList = [
    { name: "All Articles", slug: "all" },
    { name: "Buying Guides", slug: "buying-guides" },
    { name: "Recycling Tips", slug: "recycling-tips" },
    { name: "Price Analysis", slug: "price-analysis" },
  ];

  // Take top 5 products for the ranked sidebar
  const popularDevices = products && products.length > 0 ? products.slice(0, 5) : [
    {
      id: "iphone-16-pro-max",
      name: "iPhone 16 Pro Max",
      brand: "Apple",
      basePrice: 3800,
      images: { frontView: "/products/iphone-pro-max.jpg" },
    },
    {
      id: "samsung-s24-ultra",
      name: "Galaxy S24 Ultra",
      brand: "Samsung",
      basePrice: 3000,
      images: { frontView: "/products/samsung (1).jpg" },
    },
    {
      id: "macbook-pro-m3-max",
      name: "MacBook Pro 16 M3 Max",
      brand: "Apple",
      basePrice: 6500,
      images: { frontView: "/products/macbook-pro.webp" },
    },
    {
      id: "ipad-pro-13-m4",
      name: "iPad Pro 13 M4",
      brand: "Apple",
      basePrice: 3800,
      images: { frontView: "/products/ipad-pro-m4.webp" },
    },
    {
      id: "ps5-pro",
      name: "PlayStation 5 Pro",
      brand: "Sony",
      basePrice: 2600,
      images: { frontView: "/products/ps5-pro.webp" },
    },
  ];

  return (
    <aside className="space-y-8 sticky top-24">
      
      {/* ================= 1. POPULAR DEVICES WE BUY ================= */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Popular Devices We Buy</h3>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Live Prices
          </span>
        </div>

        {/* RANKED LIST 01 THROUGH 05 */}
        <div className="space-y-4">
          {popularDevices.map((device, index) => {
            const rankStr = `0${index + 1}`;
            const imgUrl =
              typeof device.images === "object" && device.images?.frontView
                ? device.images.frontView
                : typeof device.images === "string"
                ? device.images
                : "/products/iphone-pro-max.jpg";

            const deviceId = device.id || (device as any)._id || "services";

            return (
              <div
                key={device.id || (device as any)._id || index}
                className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
              >
                {/* Ranking Number */}
                <span className="font-black text-2xl text-slate-200 group-hover:text-emerald-500 transition w-8 text-center shrink-0">
                  {rankStr}
                </span>

                {/* Thumbnail Image */}
                <div className="relative w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-1 flex items-center justify-center">
                  <Image
                    src={imgUrl}
                    alt={device.name}
                    fill
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Model & Buyout Payout */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-800 group-hover:text-emerald-600 transition truncate">
                    {device.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Payout up to:</span>
                    <span className="text-xs font-black text-emerald-600">
                      AED {(device.basePrice || 1500).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Instant Quote Button */}
                <Link
                  href={`/products/${deviceId}`}
                  className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-500 text-slate-600 group-hover:text-slate-950 transition shrink-0"
                  aria-label={`Get quote for ${device.name}`}
                >
                  <Zap className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Devices Link */}
        <div className="pt-2">
          <Link
            href="/services"
            className="w-full py-3 px-4 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-md"
          >
            <span>Browse All Trade-in Devices</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ================= 2. JOURNAL CATEGORIES MENU ================= */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-500" />
          <span>Journal Categories</span>
        </h3>

        <div className="flex flex-col gap-1 text-xs font-semibold">
          {categoriesList.map((category) => {
            const isActive = currentCat === category.slug || (category.slug === "all" && !currentCat);
            return (
              <Link
                key={category.slug}
                href={`/blogs?${new URLSearchParams({ cat: category.slug, sort: currentSort, search: currentSearch }).toString()}`}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{category.name}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-emerald-500" : "text-slate-300"}`} />
              </Link>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
