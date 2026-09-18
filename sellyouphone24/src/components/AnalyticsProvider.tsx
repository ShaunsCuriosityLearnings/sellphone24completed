"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/analytics";
import DynamicNudgeModal from "./DynamicNudgeModal";
import CookieConsentBanner from "./CookieConsentBanner";
import { cookieConsent } from "@/lib/cookieConsent";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollDepthsTracked = useRef<Set<number>>(new Set());

  // 1. Route Change & Page View Tracker
  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    analytics.track("page_view", "behaviour", { pageUrl: url });
    scrollDepthsTracked.current.clear();
  }, [pathname, searchParams]);

  // 2. Scroll Depth Monitor
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentScroll = window.scrollY;
      const scrollPercent = Math.round((currentScroll / scrollHeight) * 100);

      [25, 50, 75, 100].forEach((depth) => {
        if (scrollPercent >= depth && !scrollDepthsTracked.current.has(depth)) {
          scrollDepthsTracked.current.add(depth);
          analytics.track(`scroll_depth_${depth}`, "ux", { depthPercent: depth });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Plug-and-Play Script Injectors for Meta Pixel (GTM is loaded via root layout)
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    if (cookieConsent.hasMarketingConsent()) {
      // Inject Meta Pixel if configured
      if (pixelId && !document.getElementById("meta-pixel-script")) {
        const script = document.createElement("script");
        script.id = "meta-pixel-script";
        script.text = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
    }
  }, []);

  return (
    <>
      {children}
      <DynamicNudgeModal />
      <CookieConsentBanner />
    </>
  );
}
