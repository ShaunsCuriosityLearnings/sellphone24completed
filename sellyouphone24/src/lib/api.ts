import { CategoryType, BrandType, ProductType, BlogType, CartItemType } from "@/types";
import { products as mockProducts, categories as mockCategories, brands as mockBrands, blogs as mockBlogs } from "@/data/mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper to handle API requests and fall back to mock data on failure
async function safeFetch<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const isFormData = options?.body instanceof FormData;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    return await res.json() as T;
  } catch (error) {
    console.warn(`⚠️ API Request failed for ${url}. Error: ${(error as Error).message}. Using fallback data.`);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export const api = {
  // --- CATEGORIES ---
  async getCategories(): Promise<CategoryType[]> {
    return safeFetch<CategoryType[]>(`${API_BASE}/categories`, { method: "GET" }, mockCategories);
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
  async getBrands(params?: { category?: string }): Promise<BrandType[]> {
    const fallback = mockBrands;
    try {
      const url = params?.category
        ? `${API_BASE}/brands?category=${params.category}`
        : `${API_BASE}/brands`;
      return await safeFetch<BrandType[]>(url, { method: "GET" });
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

  async deleteBrand(id: string | number, token?: string): Promise<{ message: string }> {
    return safeFetch<{ message: string }>(`${API_BASE}/brands/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });
  },

  // --- PRODUCTS ---
  async getProducts(params?: { category?: string; brand?: string; search?: string }): Promise<ProductType[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.brand) query.append("brand", params.brand);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString();
    const url = `${API_BASE}/products${queryString ? `?${queryString}` : ""}`;

    // Map MongoDB products returned to match frontend ProductType schema
    // Specifically, ensuring ID mapping (mapping _id string to id number/string)
    const dbProducts = await safeFetch<any[]>(url, { method: "GET" }, mockProducts);
    return dbProducts.map((p) => ({
      ...p,
      id: p._id || p.id,
      storages: Array.isArray(p.storages) && p.storages.length > 0 && typeof p.storages[0] === "object"
        ? p.storages.map((s: any) => s.size)
        : p.storages,
    })) as ProductType[];
  },

  async getProductById(id: string | number): Promise<ProductType> {
    // If ID looks like a local mock number, find it in mock data
    const mockProduct = mockProducts.find((p) => p.id === Number(id));
    
    try {
      const p = await safeFetch<any>(`${API_BASE}/products/${id}`, { method: "GET" });
      return {
        ...p,
        id: p._id || p.id,
        storages: Array.isArray(p.storages) && p.storages.length > 0 && typeof p.storages[0] === "object"
          ? p.storages.map((s: any) => s.size)
          : p.storages,
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
    
    const storagePriceBoosts: Record<string, number> = {
      "16GB": 0, "64GB": 0, "128GB": 0, "256GB": 150, "512GB": 350, "1TB": 700,
    };
    const formattedStorages = product.storages.map((st: any) => ({
      size: st,
      priceBoost: storagePriceBoosts[st] || 0,
    }));

    return safeFetch<any>(`${API_BASE}/products`, {
      method: "POST",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify({
        ...product,
        storages: formattedStorages,
      }),
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

    const storagePriceBoosts: Record<string, number> = {
      "16GB": 0, "64GB": 0, "128GB": 0, "256GB": 150, "512GB": 350, "1TB": 700,
    };
    
    let formattedStorages;
    if (product.storages) {
      formattedStorages = product.storages.map((st: any) => ({
        size: st,
        priceBoost: storagePriceBoosts[st] || 0,
      }));
    }

    return safeFetch<any>(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
      body: JSON.stringify({
        ...product,
        ...(formattedStorages ? { storages: formattedStorages } : {}),
      }),
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
};
