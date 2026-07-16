"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const mainCategories = [
  {
    name: "Dresses",
    slug: "dresses",
  },
  {
    name: "Home Interiors",
    slug: "home-interiors",
  },
  {
    name: "Bathroom",
    slug: "bathroom",
  },
];

const MainCategories = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedMainCategory = searchParams.get("mainCategory") || "dresses";

  const handleChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("mainCategory", slug);
    params.delete("category");

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-8 lg:gap-14">
        {mainCategories.map((category) => {
          const isActive = selectedMainCategory === category.slug;

          return (
            <button
              key={category.slug}
              onClick={() => handleChange(category.slug)}
              className="group relative flex items-center gap-2 cursor-pointer"
            >
              {/* Category Name */}
              <span
                className={`uppercase tracking-[0.25em] text-[13px] font-medium transition-all duration-300 ${
                  isActive
                    ? "text-[#EAF3DE]"
                    : "text-white/80 group-hover:text-white"
                }`}
              >
                {category.name}
              </span>

              {/* Dropdown Icon */}
              <ChevronDown
                size={14}
                className={`transition-all duration-300 ${
                  isActive
                    ? "text-[#C0DD97] rotate-180"
                    : "text-white/70 group-hover:text-[#C0DD97]"
                }`}
              />

              {/* Underline */}
              <span
                className={`absolute -bottom-3 left-0 h-[1px] bg-[#C0DD97] transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MainCategories;
