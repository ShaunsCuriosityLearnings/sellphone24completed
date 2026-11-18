import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sellphonecash.com";
  
  // If the app URL contains "beta" (or another test subdomain), block indexing
  const isBeta = baseUrl.includes("beta");

  if (isBeta) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // Standard production crawl rules with explicit AI crawler access and sensitive route shielding
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/cart",
          "/cart/",
          "/buy-phones/cart",
          "/buy-phones/checkout",
          "/analytics",
          "/analytics/",
          "/api/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
          "Google-Extended",
          "CCBot",
        ],
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/cart",
          "/cart/",
          "/buy-phones/cart",
          "/buy-phones/checkout",
          "/analytics",
          "/analytics/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
