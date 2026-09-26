import { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SERVICE_SLUGS, MODEL_SLUGS, LOCATION_SLUGS } from "@/lib/seoData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellphonecash.com";

  // 1. Static base pages
  const staticRoutes = [
    { route: "", priority: 1.0, changeFrequency: "daily" as const },
    { route: "/sell", priority: 0.95, changeFrequency: "daily" as const },
    { route: "/sell-any-device", priority: 0.9, changeFrequency: "daily" as const },
    { route: "/services", priority: 0.85, changeFrequency: "daily" as const },
    { route: "/products", priority: 0.85, changeFrequency: "daily" as const },
    { route: "/blogs", priority: 0.8, changeFrequency: "daily" as const },
    { route: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/privacy-policy", priority: 0.5, changeFrequency: "yearly" as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Programmatic SEO landing pages (Services, Models, Locations) - deduplicated with Set
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

  try {
    // 2. Fetch categories & brands for service pages
    const categories = await api.getCategories();
    const brands = await api.getBrands();

    categories.forEach((cat) => {
      const catSlug = cat.slug.toLowerCase();
      dynamicRoutes.push({
        url: `${baseUrl}/services/${catSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });

      brands.forEach((brand) => {
        const brandSlug = brand.slug.toLowerCase();
        dynamicRoutes.push({
          url: `${baseUrl}/services/${catSlug}/${brandSlug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      });
    });
  } catch (error) {
    console.error("⚠️ Dynamic sitemap categories/brands query failed:", error);
  }

  try {
    // 3. Fetch products for product evaluation pages
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

  try {
    // 4. Fetch blogs for blog article pages
    const blogs = await api.getBlogs();
    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.createdAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
  } catch (error) {
    console.error("⚠️ Dynamic sitemap blogs query failed:", error);
  }

  return [...staticRoutes, ...seoRoutes, ...dynamicRoutes];
}
