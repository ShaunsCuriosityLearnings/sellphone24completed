import Link from "next/link";
import { Smartphone, MapPin, Wrench, ArrowUpRight } from "lucide-react";
import { SERVICE_PAGES, MODEL_PAGES, LOCATION_PAGES } from "@/lib/seoData";

interface SeoInternalLinksProps {
  currentSlug?: string;
  showServices?: boolean;
  showModels?: boolean;
  showLocations?: boolean;
  limitServices?: number;
  limitModels?: number;
  limitLocations?: number;
  selectedServices?: string[];
  selectedModels?: string[];
  selectedLocations?: string[];
}

export default function SeoInternalLinks({
  currentSlug,
  showServices = true,
  showModels = true,
  showLocations = true,
  limitServices = 7,
  limitModels = 12,
  limitLocations = 9,
  selectedServices,
  selectedModels,
  selectedLocations,
}: SeoInternalLinksProps) {
  // Filter services
  const allServices = Object.values(SERVICE_PAGES);
  const filteredServices = (
    selectedServices
      ? selectedServices.map((s) => SERVICE_PAGES[s]).filter(Boolean)
      : allServices
  )
    .filter((s) => s.slug !== currentSlug)
    .slice(0, limitServices);

  // Filter models
  const allModels = Object.values(MODEL_PAGES);
  const filteredModels = (
    selectedModels
      ? selectedModels.map((m) => MODEL_PAGES[m]).filter(Boolean)
      : allModels
  )
    .filter((m) => m.slug !== currentSlug)
    .slice(0, limitModels);

  // Filter locations
  const allLocations = Object.values(LOCATION_PAGES);
  const filteredLocations = (
    selectedLocations
      ? selectedLocations.map((l) => LOCATION_PAGES[l]).filter(Boolean)
      : allLocations
  )
    .filter((l) => l.slug !== currentSlug)
    .slice(0, limitLocations);

  return (
    <section className="my-3 sm:my-8 pt-3 sm:pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3 sm:space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white">
          Explore Dubai Trade-In & Buyback Network
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 max-w-xl mx-auto">
          SellPhoneCash provides instant valuations, guaranteed payouts, and free 3-hour doorstep collection across the entire UAE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Service Guides */}
        {showServices && filteredServices.length > 0 && (
          <div className="space-y-2.5 sm:space-y-4 bg-slate-50 dark:bg-slate-900/50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-xs sm:text-sm">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Wrench size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4>Sell By Category</h4>
            </div>

            <ul className="space-y-1.5 text-xs">
              {filteredServices.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    href={`/sell/${svc.slug}`}
                    className="group flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all font-medium text-[11px] sm:text-xs"
                  >
                    <span>{svc.h1.replace(" in Dubai", "")} in Dubai</span>
                    <ArrowUpRight
                      size={13}
                      className="text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Model Guides */}
        {showModels && filteredModels.length > 0 && (
          <div className="space-y-2.5 sm:space-y-4 bg-slate-50 dark:bg-slate-900/50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-xs sm:text-sm">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Smartphone size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4>Popular Models</h4>
            </div>

            <ul className="space-y-1.5 text-xs">
              {filteredModels.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/sell/model/${m.slug}`}
                    className="group flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all font-medium text-[11px] sm:text-xs"
                  >
                    <span>Sell {m.modelName} Dubai</span>
                    <ArrowUpRight
                      size={13}
                      className="text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location Guides */}
        {showLocations && filteredLocations.length > 0 && (
          <div className="space-y-2.5 sm:space-y-4 bg-slate-50 dark:bg-slate-900/50 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-xs sm:text-sm">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MapPin size={14} className="sm:w-4 sm:h-4" />
              </div>
              <h4>Dubai Pickup Areas</h4>
            </div>

            <ul className="space-y-1.5 text-xs">
              {filteredLocations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/sell/location/${loc.slug}`}
                    className="group flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all font-medium text-[11px] sm:text-xs"
                  >
                    <span>Sell Phone {loc.locationName}</span>
                    <ArrowUpRight
                      size={13}
                      className="text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
