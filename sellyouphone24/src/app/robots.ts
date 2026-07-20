import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellyourphone24.ae";
  
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

  // When moved to the main domain, allow full indexing and link the sitemap
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/cart/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
