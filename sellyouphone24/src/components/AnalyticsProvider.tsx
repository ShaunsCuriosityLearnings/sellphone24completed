"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/analytics";
import DynamicNudgeModal from "./DynamicNudgeModal";

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

  return (
    <>
      {children}
      <DynamicNudgeModal />
    </>
  );
}
