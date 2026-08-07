"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingScreen from "./LoadingScreen";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Hide loader once the route transition has finished
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links pointing to internal routes
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      // Check if internal link and not anchor jump or external link
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        const targetUrl = new URL(href, window.location.origin);
        const targetPath = targetUrl.pathname + targetUrl.search;

        if (targetPath !== currentUrl) {
          setIsLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  if (!isLoading && !isPending) return null;

  return (
    <LoadingScreen
      message="Navigating..."
      subtext="Fast & Seamless Experience"
      fullScreen={true}
    />
  );
}
