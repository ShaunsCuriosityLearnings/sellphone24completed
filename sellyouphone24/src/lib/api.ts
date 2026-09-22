import { CategoryType, BrandType, ProductType, BlogType, CartItemType, TestimonialType } from "@/types";
import { products as mockProducts, categories as mockCategories, brands as mockBrands, blogs as mockBlogs } from "@/data/mockData";

let API_BASE = "/api";
if (typeof window === "undefined") {
  // Server-side (SSR)
  API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
} else {
  // Client-side (Browser) - ALWAYS use relative path to avoid CORS and localhost issues
  API_BASE = "/api";
}

// Helper to handle API requests and fall back to mock data on failure
async function safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const isFormData = options?.body instanceof FormData;
    const reqHeaders: Record<string, string> = !isFormData ? { "Content-Type": "application/json" } : {};

    if (options?.headers) {
      const rawHeaders = options.headers as Record<string, string>;
      Object.entries(rawHeaders).forEach(([key, val]) => {
        if (val && typeof val === "string" && !val.includes("undefined") && !val.includes("null") && val.trim() !== "Bearer") {
          reqHeaders[key] = val;
        }
      });
    }

    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: reqHeaders,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let cleanMessage = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.message) cleanMessage = parsed.message;
      } catch (e) {}
      throw new Error(cleanMessage || `HTTP Error ${res.status}`);
    }

    return await res.json() as T;
  } catch (error) {
    if (fallback !== undefined) {
      console.warn(`⚠️ API Request failed for ${url}. Error: ${(error as Error).message}. Using fallback data.`);
      return fallback;
    }
    throw error;
  }
}

const normalizeProductImages = (img: any) => {
  const fallback = "/products/iphone-pro-max.jpg";
  if (!img) {
    return { frontView: fallback, sideView: fallback, backView: fallback };
  }
  if (typeof img === "string") {
    const clean = img.trim() || fallback;
    return { frontView: clean, sideView: clean, backView: clean };
  }
  if (typeof img === "object") {
    const front = img.frontView || img.main || img.url || fallback;
    const side = img.sideView || front;
    const back = img.backView || front;
    return { frontView: front, sideView: side, backView: back };
  }
  return { frontView: fallback, sideView: fallback, backView: fallback };
};

export const api = {
  // --- CATEGORIES ---
  async getCategories(): Promise<CategoryType[]> {
    const dbCategories = await safeFetch<any[]>(`${API_BASE}/categories`, { method: "GET" }, mockCategories);
    return dbCategories.map((c) => ({
      ...c,
      id: c._id || c.id,
    })) as CategoryType[];
  },

  async createCategory(category: any, token?: string): Promise<CategoryType> {
    return safeFetch<CategoryType>(`${API_BASE}/categories`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: category instanceof FormData ? category : JSON.stringify(category),
    });
  },

  async deleteCategory(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  // --- BRANDS ---
  async getBrands(params?: { category?: string; featured?: boolean }): Promise<BrandType[]> {
    const fallback = mockBrands;
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append("category", params.category);
      if (params?.featured) query.append("featured", "true");

      const queryString = query.toString();
      const url = `${API_BASE}/brands${queryString ? `?${queryString}` : ""}`;
      const dbBrands = await safeFetch<any[]>(url, { method: "GET" }, mockBrands);
      return dbBrands.map((b) => ({
        ...b,
        id: b._id || b.id,
      })) as BrandType[];
    } catch (err) {
      return fallback;
    }
  },

  async createBrand(brand: any, token?: string): Promise<BrandType> {
    return safeFetch<BrandType>(`${API_BASE}/brands`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: brand instanceof FormData ? brand : JSON.stringify(brand),
    });
  },

  async updateBrand(id: string | number, brand: any, token?: string): Promise<BrandType> {
    return safeFetch<BrandType>(`${API_BASE}/brands/${id}`, {
      method: "PUT",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: brand instanceof FormData ? brand : JSON.stringify(brand),
    });
  },

  async deleteBrand(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/brands/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  // --- PRODUCTS ---
  async getProducts(params?: { category?: string; brand?: string; search?: string; isPopular?: boolean; isLivePrice?: boolean }): Promise<ProductType[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.brand) query.append("brand", params.brand);
    if (params?.search) query.append("search", params.search);
    if (params?.isPopular) query.append("isPopular", "true");
    if (params?.isLivePrice) query.append("isLivePrice", "true");

    const queryString = query.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ""}`;

    const dbProducts = await safeFetch<any[]>(url, { method: "GET" }, mockProducts);
    return dbProducts.map((p) => ({
      ...p,
      id: p._id || p.id,
      images: normalizeProductImages(p.images),
      storages: Array.isArray(p.storages) ? p.storages : [],
    })) as ProductType[];
  },

  async getHeroProduct(): Promise<ProductType | null> {
    try {
      const p = await safeFetch<any>(`${API_BASE}/products/hero`, { method: "GET" });
      if (!p) return null;
      return {
        ...p,
        id: p._id || p.id,
        images: normalizeProductImages(p.images),
        storages: Array.isArray(p.storages) ? p.storages : [],
      } as ProductType;
    } catch (err) {
      return null;
    }
  },

  async setHeroProduct(id: string | number, token?: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/products/set-hero/${id}`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  async getProductById(id: string | number): Promise<ProductType> {
    const mockProduct = mockProducts.find((p) => p.id === Number(id));
    
    try {
      const p = await safeFetch<any>(`${API_BASE}/products/${id}`, { method: "GET" });
      return {
        ...p,
        id: p._id || p.id,
        images: normalizeProductImages(p.images),
        storages: Array.isArray(p.storages) ? p.storages : [],
      } as ProductType;
    } catch (err) {
      if (mockProduct) {
        return mockProduct;
      }
      throw err;
    }
  },

  async createProduct(product: any, token?: string): Promise<any> {
    if (product instanceof FormData) {
      return safeFetch<any>(`${API_BASE}/products`, {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: product,
      });
    }
    
    return safeFetch<any>(`${API_BASE}/products`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify(product),
    });
  },

  async deleteProduct(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  async updateProduct(id: string | number, product: any, token?: string): Promise<any> {
    if (product instanceof FormData) {
      return safeFetch<any>(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: product,
      });
    }

    return safeFetch<any>(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify(product),
    });
  },

  // --- ORDERS ---
  async createOrder(order: {
    customerDetails: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state?: string;
      pincode?: string;
    };
    pickupSchedule: {
      pickupDate: string;
      pickupTime: string;
    };
    devices: {
      productId: string;
      name: string;
      brand: string;
      category: string;
      selectedStorage: string;
      selectedColor: string;
      selectedCondition: string;
      calculatedPrice: number;
      quantity?: number;
    }[];
    paymentMethod: "cash";
    totalPayout: number;
    sessionId?: string;
    intentScoreAtBooking?: number;
    acquisitionChannel?: string;
    marketingAttribution?: any;
  }): Promise<{ success: boolean; message: string; order: any }> {
    return safeFetch<{ success: boolean; message: string; order: any }>(`${API_BASE}/orders`, {
      method: "POST",
      body: JSON.stringify(order),
    });
  },

  async getOrders(): Promise<any[]> {
    return safeFetch<any[]>(`${API_BASE}/orders`, { method: "GET" }, []);
  },

  async updateOrderStatus(id: string, status: string, token?: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify({ status }),
    });
  },

  // --- CUSTOM REQUESTS ---
  async submitCustomDeviceRequest(requestData: any): Promise<any> {
    return safeFetch<any>(`${API_BASE}/custom-requests`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  },

  // --- BLOGS ---
  async getBlogs(params?: { cat?: string; search?: string }): Promise<BlogType[]> {
    const fallback = mockBlogs;
    try {
      const query = new URLSearchParams();
      if (params?.cat) query.append("cat", params.cat);
      if (params?.search) query.append("search", params.search);
      const queryString = query.toString();
      const url = `${API_BASE}/blogs${queryString ? `?${queryString}` : ""}`;
      const dbBlogs = await safeFetch<any[]>(url, { method: "GET" }, mockBlogs);
      return dbBlogs.map((b) => ({
        ...b,
        id: b._id || b.id,
      })) as BlogType[];
    } catch (err) {
      return fallback;
    }
  },

  async getBlogBySlug(slug: string): Promise<BlogType> {
    const fallback = mockBlogs.find((b) => b.slug === slug);
    try {
      const b = await safeFetch<any>(`${API_BASE}/blogs/${slug}`, { method: "GET" });
      return {
        ...b,
        id: b._id || b.id,
      } as BlogType;
    } catch (err) {
      if (fallback) return fallback;
      throw err;
    }
  },

  async createBlog(blog: any, token?: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/blogs`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: blog instanceof FormData ? blog : JSON.stringify(blog),
    });
  },

  async updateBlog(id: string | number, blog: any, token?: string): Promise<any> {
    return safeFetch<any>(`${API_BASE}/blogs/${id}`, {
      method: "PUT",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: blog instanceof FormData ? blog : JSON.stringify(blog),
    });
  },

  async deleteBlog(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/blogs/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  // --- DATABASE BACKUP & RESTORE ---
  exportDatabaseUrl(): string {
    return `${API_BASE}/database/export`;
  },

  exportProductsUrl(): string {
    return `${API_BASE}/database/export/products`;
  },

  async restoreDatabase(backupPayload: any, token?: string): Promise<{ message: string; counts: any }> {
    return safeFetch<{ message: string; counts: any }>(`${API_BASE}/database/restore`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify(backupPayload),
    });
  },

  // --- TESTIMONIALS ---
  async getTestimonials(params?: { featured?: boolean }): Promise<TestimonialType[]> {
    const url = params?.featured ? `${API_BASE}/testimonials?featured=true` : `${API_BASE}/testimonials`;
    const fallback: TestimonialType[] = [
      {
        id: "t1",
        name: "Ahmed R.",
        location: "Dubai Marina",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        quote: "Got my iPhone 15 Pro Max picked up in 1 hour and received cash instantly.",
        rating: 5,
      },
      {
        id: "t2",
        name: "Sara K.",
        location: "Jumeirah",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        quote: "Best price in Dubai! Very professional and trustworthy team.",
        rating: 5,
      },
      {
        id: "t3",
        name: "Khalid M.",
        location: "Business Bay",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        quote: "Smooth and quick process. Highly recommended!",
        rating: 5,
      },
    ];

    try {
      const res = await safeFetch<any[]>(url, { method: "GET" }, fallback);
      return res.map(t => ({ ...t, id: t._id || t.id }));
    } catch (e) {
      return fallback;
    }
  },

  async createTestimonial(testimonial: any, token?: string): Promise<TestimonialType> {
    return safeFetch<TestimonialType>(`${API_BASE}/testimonials`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify(testimonial),
    });
  },

  async updateTestimonial(id: string | number, testimonial: any, token?: string): Promise<TestimonialType> {
    return safeFetch<TestimonialType>(`${API_BASE}/testimonials/${id}`, {
      method: "PUT",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify(testimonial),
    });
  },

  async deleteTestimonial(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/testimonials/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },
};
