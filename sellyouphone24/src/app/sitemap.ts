import { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SERVICE_SLUGS, MODEL_SLUGS, LOCATION_SLUGS } from "@/lib/seoData";

// Incremental Static Regeneration: revalidate sitemap once every 24 hours to prevent live database locks
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sellphonecash.com";

  // 1. Core Static Base Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/buy-phones`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/sell-any-device`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  // 2. Programmatic SEO Trade-In Pages (Deduplicated)
  const uniqueServiceSlugs = Array.from(new Set(SERVICE_SLUGS));
  const uniqueModelSlugs = Array.from(new Set(MODEL_SLUGS));
  const uniqueLocationSlugs = Array.from(new Set(LOCATION_SLUGS));

  const seoRoutes: MetadataRoute.Sitemap = [
    ...uniqueServiceSlugs.map((slug) => ({
      url: `${baseUrl}/sell/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...uniqueModelSlugs.map((slug) => ({
      url: `${baseUrl}/sell/model/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...uniqueLocationSlugs.map((slug) => ({
      url: `${baseUrl}/sell/location/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  // 3. Trade-In Categories (Clean Category Hubs Only — Zero Cartesian Product Ghost URLs)
  try {
    const categories = await api.getCategories();
    categories.forEach((cat) => {
      if (cat.slug) {
        dynamicRoutes.push({
          url: `${baseUrl}/services/${cat.slug.toLowerCase()}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    console.error("⚠️ Dynamic sitemap categories query failed:", error);
  }

  // 4. Trade-In Products Valuation Routes
  try {
    const products = await api.getProducts();
    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.id || p._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    dynamicRoutes = [...dynamicRoutes, ...productRoutes];
  } catch (error) {
    console.error("⚠️ Dynamic sitemap products query failed:", error);
  }

  // 5. Blog Articles Routes
  try {
    const blogs = await api.getBlogs();
    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.createdAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
  } catch (error) {
    console.error("⚠️ Dynamic sitemap blogs query failed:", error);
  }

  // 6. Certified Buy-Phones Resale Inventory Routes (Active Listings + Brand Archives)
  try {
    const buyProducts = await api.getBuyProducts({ status: "active" });
    const buyBrandsSeen = new Set<string>();

    buyProducts.forEach((bp) => {
      // Individual certified product detail page
      const id = bp.id || bp._id;
      if (id) {
        const lastMod = (bp as any).updatedAt || (bp as any).createdAt 
          ? new Date((bp as any).updatedAt || (bp as any).createdAt) 
          : new Date();

        dynamicRoutes.push({
          url: `${baseUrl}/buy-phones/${id}`,
          lastModified: lastMod,
          changeFrequency: "daily" as const,
          priority: 0.85,
        });
      }

      // Brand archive page
      const brandStr = typeof bp.brand === "string" ? bp.brand : (bp as any).brand?.name || "";
      const brandSlug = brandStr.toLowerCase().trim();
      if (brandSlug && !buyBrandsSeen.has(brandSlug)) {
        buyBrandsSeen.add(brandSlug);
        dynamicRoutes.push({
          url: `${baseUrl}/buy-phones/brand/${encodeURIComponent(brandSlug)}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.75,
        });
      }
    });
  } catch (error) {
    console.error("⚠️ Dynamic sitemap buy-phones query failed:", error);
  }

  return [...staticRoutes, ...seoRoutes, ...dynamicRoutes];
}
