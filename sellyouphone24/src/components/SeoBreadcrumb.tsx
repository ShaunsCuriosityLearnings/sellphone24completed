import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SeoBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function SeoBreadcrumb({ items }: SeoBreadcrumbProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // Build JSON-LD BreadcrumbList
  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-0.5 sm:py-2 px-0.5 text-[11px] sm:text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-500 transition-colors"
            >
              <Home size={13} className="shrink-0" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="text-slate-400 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
