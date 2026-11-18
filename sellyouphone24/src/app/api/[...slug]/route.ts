import { NextRequest, NextResponse } from "next/server";
import { categories as mockCategories, brands as mockBrands, products as mockProducts } from "@/data/mockData";
import { mockBuyProducts } from "@/data/mockBuyProducts";

const mockBuyCategories = [
  { id: "smartphones", name: "Smartphones", slug: "smartphones", description: "Certified Pristine & Pre-Owned Flagships", image: "/products/iphone-pro-max.jpg" },
  { id: "laptops", name: "Laptops", slug: "laptops", description: "MacBooks & High-Performance Windows Laptops", image: "/products/macbook-pro.webp" },
  { id: "tablets", name: "Tablets", slug: "tablets", description: "iPads & Galaxy Tabs with Store Warranty", image: "/products/ipad-pro-m4.webp" },
  { id: "smartwatches", name: "Smartwatches", slug: "smartwatches", description: "Apple Watch & Galaxy Smart Wearables", image: "/products/apple-watch-ultra.webp" },
  { id: "games", name: "Gaming & Consoles", slug: "games", description: "PlayStation, Xbox & Nintendo Consoles", image: "/products/gaming-console.webp" },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = (slug || []).join("/");

  // STRICT DATA INTEGRITY GUARD:
  // Mock data is STRICTLY IMPOSSIBLE in production under all circumstances.
  // NEXT_PUBLIC_ENABLE_LOCAL_MOCK or any other runtime flag is completely ignored in production.
  const isProduction = process.env.NODE_ENV === "production";
  const isMockAllowed = !isProduction;

  // Try proxying to backend if running on dedicated port (default port 5000)
  const backendBase = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 600);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const authHeader = request.headers.get("authorization");
    if (authHeader) headers["Authorization"] = authHeader;

    const backendRes = await fetch(`${backendBase}/${path}`, {
      signal: controller.signal,
      headers
    });
    clearTimeout(timeout);
    if (backendRes.ok) {
      const data = await backendRes.json();
      return Response.json(data, { status: 200 });
    }
  } catch (_) {
    // Upstream backend offline or unreachable
  }

  // DATA INTEGRITY GUARD: In production, never silently serve fake mock data
  if (!isMockAllowed) {
    return Response.json(
      {
        success: false,
        error: "Service Unavailable",
        message: "Database / Inventory service is offline. Mock fallback is strictly prohibited in production to prevent data corruption."
      },
      { status: 503 }
    );
  }

  // Handle specific routes gracefully for local development and QA testing
  if (path === "categories") {
    return Response.json(mockCategories, { status: 200 });
  }

  if (path === "brands") {
    return Response.json(mockBrands, { status: 200 });
  }

  if (path === "buy-categories") {
    return Response.json(mockBuyCategories, { status: 200 });
  }

  if (path === "buy-brands") {
    return Response.json(mockBrands, { status: 200 });
  }

  if (path === "buy-products") {
    return Response.json(mockBuyProducts, { status: 200 });
  }

  if (path.startsWith("buy-products/")) {
    const id = path.replace("buy-products/", "").trim();
    const product = mockBuyProducts.find(
      (p) => String(p.id) === id || String(p.slug) === id || String((p as any)._id) === id
    ) || mockBuyProducts[0];
    return Response.json(product, { status: 200 });
  }

  if (path === "products") {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    let result = mockProducts;
    if (category) {
      const catLower = category.toLowerCase();
      result = result.filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        return pCat === catLower || (catLower === "smartphones" && pCat === "mobile");
      });
    }
    if (brand) {
      const brandLower = brand.toLowerCase();
      result = result.filter((p) => (p.brand || "").toLowerCase().includes(brandLower));
    }
    return Response.json(result, { status: 200 });
  }

  if (path.startsWith("products/")) {
    const id = path.replace("products/", "").trim();
    const product = mockProducts.find(
      (p) => String(p.id) === id || String(p.slug) === id || String((p as any)._id) === id
    ) || mockProducts[0];
    return Response.json(product, { status: 200 });
  }

  if (path === "testimonials") {
    return Response.json([], { status: 200 });
  }

  if (path === "blogs") {
    return Response.json([], { status: 200 });
  }

  return Response.json({ success: true, message: "OK", data: [] }, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = (slug || []).join("/");

  // STRICT DATA INTEGRITY GUARD:
  // Mock data is STRICTLY IMPOSSIBLE in production under all circumstances.
  const isProduction = process.env.NODE_ENV === "production";
  const isMockAllowed = !isProduction;

  const backendBase = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const body = await request.json().catch(() => ({}));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const authHeader = request.headers.get("authorization");
    if (authHeader) headers["Authorization"] = authHeader;

    const backendRes = await fetch(`${backendBase}/${path}`, {
      method: "POST",
      signal: controller.signal,
      headers,
      body: JSON.stringify(body)
    });
    clearTimeout(timeout);
    if (backendRes.ok) {
      const data = await backendRes.json();
      return Response.json(data, { status: 200 });
    }
  } catch (_) {
    // Upstream offline fallback
  }

  // DATA INTEGRITY GUARD: In production, reject transactions if database backend is down
  if (!isMockAllowed) {
    return Response.json(
      {
        success: false,
        error: "Service Unavailable",
        message: "Database service offline. Order and valuation submissions are halted in production to prevent lost transactions."
      },
      { status: 503 }
    );
  }

  // Graceful order/quote creation response for local testing
  return Response.json({
    success: true,
    message: "Request received and processed successfully (fallback mode)",
    order: { id: "ORD-" + Date.now(), createdAt: new Date().toISOString() }
  }, { status: 200 });
}
