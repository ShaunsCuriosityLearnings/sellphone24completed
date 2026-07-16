import { MetadataRoute } from "next";
import { api } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sellyourphone24.ae";

  // 1. Static base pages
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/services",
    "/blogs",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // 2. Fetch categories & brands for service pages
    const categories = await api.getCategories();
    const brands = await api.getBrands();

    categories.forEach((cat) => {
      const catSlug = cat.slug.toLowerCase();
      // Category services pages (e.g. /services/smartphones)
      dynamicRoutes.push({
        url: `${baseUrl}/services/${catSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });

      // Category + Brand service pages (e.g. /services/smartphones/apple)
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

  return [...staticRoutes, ...dynamicRoutes];
}
