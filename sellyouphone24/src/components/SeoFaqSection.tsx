"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface SeoFaqItem {
  question: string;
  answer: string;
}

interface SeoFaqSectionProps {
  faqs: SeoFaqItem[];
  title?: string;
  subtitle?: string;
}

export default function SeoFaqSection({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about selling your device in Dubai",
}: SeoFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-2 sm:my-8 py-1 sm:py-4">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <HelpCircle size={13} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-base pr-3">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200 text-slate-600 dark:text-slate-300 ${
                      isOpen ? "rotate-180 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" : ""
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5 text-[11px] sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 bg-slate-50/50 dark:bg-slate-900/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
