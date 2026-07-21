"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CategoryType, ProductType, BrandType, BlogType } from "@/types";
import { toast } from "react-toastify";
import { useUser, useAuth, SignIn, SignOutButton } from "@clerk/nextjs";
import { 
  ClipboardList, 
  Smartphone, 
  Layers, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  User, 
  Sliders, 
  CheckCircle,
  FolderOpen,
  Pencil,
  XCircle,
  Search,
  BookOpen
} from "lucide-react";
import Image from "next/image";

type OrderType = {
  _id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
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
    quantity: number;
  }[];
  paymentMethod: string;
  totalPayout: number;
  status: "pending" | "pickup_assigned" | "inspected" | "completed" | "cancelled";
  createdAt: string;
};

const statusColors = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  pickup_assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  inspected: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "categories" | "brands" | "blogs">("orders");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState<string>("");

  const filteredOrders = selectedStatusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === selectedStatusFilter);

  const filteredProducts = products.filter((p) => {
    const query = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query)
    );
  });

  // Form states
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "", // Will hold Brand ID
    category: "",
    basePrice: 0,
    storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 150 }, { size: "512GB", priceBoost: 350 }],
    colors: "Black, Silver, Gold",
    description: "",
    shortDescription: "",
    images: {
      frontView: "" as string | File,
      sideView: "" as string | File,
      backView: "" as string | File,
    },
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    image: "" as string | File,
  });

  const [newBrand, setNewBrand] = useState<{
    name: string;
    slug: string;
    logo: string | File;
    categories: string[];
  }>({
    name: "",
    slug: "",
    logo: "📱",
    categories: [],
  });

  const [editingBlogId, setEditingBlogId] = useState<string | number | null>(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    desc: "",
    content: "",
    img: "" as string | File,
    category: "Buying Guides",
    author: "Team SellYourPhone24",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await api.getOrders();
      const fetchedProducts = await api.getProducts();
      const fetchedCategories = await api.getCategories();
      const fetchedBrands = await api.getBrands();
      const fetchedBlogs = await api.getBlogs();
      
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setBrands(fetchedBrands);
      setBlogs(fetchedBlogs);
    } catch (error) {
      toast.error("Failed to load backend dynamic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && (user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress === "shantanukamble.org@gmail.com")) {
      loadData();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center flex-col gap-3">
        <RefreshCw className="animate-spin text-emerald-500 w-8 h-8" />
        <p className="text-sm font-semibold text-slate-400">Verifying session...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6 text-center mb-6">
          <div className="flex justify-center">
            <Sliders className="text-emerald-500 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">SellYourPhone24 Admin</h1>
          <p className="text-xs text-slate-400">Please sign in to access the administrator command center.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress === "shantanukamble.org@gmail.com";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="border border-red-500/20 bg-red-500/5 rounded-3xl p-8 max-w-md space-y-6 shadow-xl shadow-red-500/5">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20 text-3xl">
            🚫
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Your account (<span className="text-emerald-400">{user?.primaryEmailAddress?.emailAddress}</span>) 
              is not authorized as an administrator.
            </p>
          </div>
          <div className="pt-2">
            <SignOutButton>
              <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer">
                Sign Out / Switch Account
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await api.updateOrderStatus(id, newStatus, token || undefined);
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map((o) => (o._id === id ? { ...o, status: newStatus as any } : o)));
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("Error communicating with backend.");
    }
  };

  const handleEditProductClick = (product: ProductType) => {
    setEditingProductId(product.id || product._id || "");
    // Find the Brand ObjectId matching the brand name
    const brandDoc = brands.find((b) => b.name === product.brand);
    setNewProduct({
      name: product.name,
      brand: brandDoc ? (brandDoc._id || brandDoc.id || "").toString() : "",
      category: product.category,
      basePrice: product.basePrice,
      storages: product.storages.length > 0 ? product.storages : [{ size: "128GB", priceBoost: 0 }],
      colors: product.colors.join(", "),
      description: product.description,
      shortDescription: product.shortDescription,
      images: product.images,
    });
    // Scroll to the product form top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelProductEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "",
      brand: "",
      category: "",
      basePrice: 0,
      storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 150 }, { size: "512GB", priceBoost: 350 }],
      colors: "Black, Silver, Gold",
      description: "",
      shortDescription: "",
      images: {
        frontView: "",
        sideView: "",
        backView: "",
      },
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.category || newProduct.basePrice <= 0) {
      toast.error("Please fill in all required product fields");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newProduct.name);
      fd.append("brand", newProduct.brand);
      fd.append("category", newProduct.category);
      fd.append("basePrice", newProduct.basePrice.toString());
      fd.append("storages", JSON.stringify(newProduct.storages.filter(s => s.size.trim() !== "")));
      fd.append("colors", JSON.stringify(newProduct.colors.split(",").map((c) => c.trim())));
      fd.append("description", newProduct.description);
      fd.append("shortDescription", newProduct.shortDescription);
      
      if (newProduct.images.frontView instanceof File) fd.append("images[frontView]", newProduct.images.frontView);
      else if (newProduct.images.frontView) fd.append("images[frontView]", newProduct.images.frontView);

      if (newProduct.images.sideView instanceof File) fd.append("images[sideView]", newProduct.images.sideView);
      else if (newProduct.images.sideView) fd.append("images[sideView]", newProduct.images.sideView);

      if (newProduct.images.backView instanceof File) fd.append("images[backView]", newProduct.images.backView);
      else if (newProduct.images.backView) fd.append("images[backView]", newProduct.images.backView);

      if (editingProductId !== null) {
        await api.updateProduct(editingProductId, fd, token || undefined);
        toast.success("Product updated successfully!");
        setEditingProductId(null);
      } else {
        await api.createProduct(fd, token || undefined);
        toast.success("Product created successfully!");
      }

      setNewProduct({
        name: "",
        brand: "",
        category: "",
        basePrice: 0,
        storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 150 }, { size: "512GB", priceBoost: 350 }],
        colors: "Black, Silver, Gold",
        description: "",
        shortDescription: "",
        images: {
          frontView: "",
          sideView: "",
          backView: "",
        },
      });
      loadData();
    } catch (error) {
      toast.error(editingProductId !== null ? "Failed to update product" : "Failed to create product");
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = await getToken();
      await api.deleteProduct(id, token || undefined);
      toast.success("Product deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newCategory.name);
      fd.append("slug", newCategory.slug);
      fd.append("description", newCategory.description);
      if (newCategory.image instanceof File) {
        fd.append("image", newCategory.image);
      } else if (newCategory.image) {
        fd.append("image", newCategory.image);
      }

      await api.createCategory(fd, token || undefined);
      toast.success("Category created successfully!");
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        image: "",
      });
      loadData();
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = await getToken();
      await api.deleteCategory(id, token || undefined);
      toast.success("Category deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.logo) {
      toast.error("Brand name and logo emoji/path are required");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newBrand.name);
      fd.append("slug", newBrand.slug);
      if (newBrand.logo instanceof File) {
        fd.append("logo", newBrand.logo);
      } else if (newBrand.logo) {
        fd.append("logo", newBrand.logo);
      }
      fd.append("categories", JSON.stringify(newBrand.categories));

      await api.createBrand(fd, token || undefined);
      toast.success("Brand created successfully!");
      setNewBrand({
        name: "",
        slug: "",
        logo: "📱",
        categories: [],
      });
      loadData();
    } catch (error) {
      toast.error("Failed to create brand");
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const token = await getToken();
      console.log("🔑 Frontend: Attempting to delete brand. Retrieved token length:", token ? token.length : 0);
      await api.deleteBrand(id, token || undefined);
      toast.success("Brand deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleEditBlogClick = (blog: BlogType) => {
    setEditingBlogId(blog.id || blog._id || "");
    setNewBlog({
      title: blog.title,
      slug: blog.slug,
      desc: blog.desc,
      content: blog.content,
      img: blog.img,
      category: blog.category,
      author: blog.author,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelBlogEdit = () => {
    setEditingBlogId(null);
    setNewBlog({
      title: "",
      slug: "",
      desc: "",
      content: "",
      img: "",
      category: "Buying Guides",
      author: "Team SellYourPhone24",
    });
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.slug || !newBlog.desc || !newBlog.content) {
      toast.error("Please fill in all required blog fields");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("title", newBlog.title);
      fd.append("slug", newBlog.slug);
      fd.append("desc", newBlog.desc);
      fd.append("content", newBlog.content);
      fd.append("category", newBlog.category);
      fd.append("author", newBlog.author);
      if (newBlog.img instanceof File) {
        fd.append("img", newBlog.img);
      } else if (newBlog.img) {
        fd.append("img", newBlog.img);
      }

      if (editingBlogId !== null) {
        await api.updateBlog(editingBlogId, fd, token || undefined);
        toast.success("Blog post updated successfully!");
        setEditingBlogId(null);
      } else {
        await api.createBlog(fd, token || undefined);
        toast.success("Blog post created successfully!");
      }

      setNewBlog({
        title: "",
        slug: "",
        desc: "",
        content: "",
        img: "",
        category: "Buying Guides",
        author: "Team SellYourPhone24",
      });
      loadData();
    } catch (error) {
      toast.error(editingBlogId !== null ? "Failed to update blog" : "Failed to create blog");
    }
  };

  const handleDeleteBlog = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const token = await getToken();
      await api.deleteBlog(id, token || undefined);
      toast.success("Blog post deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const handleToggleBrandCategory = (catId: string) => {
    const updatedCats = newBrand.categories.includes(catId)
      ? newBrand.categories.filter((id) => id !== catId)
      : [...newBrand.categories, catId];
    
    setNewBrand({ ...newBrand, categories: updatedCats });
  };

  const handleBulkDeleteProducts = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} products?`)) return;
    try {
      const token = await getToken();
      await Promise.all(selectedProductIds.map(id => api.deleteProduct(id, token || undefined)));
      toast.success("Products deleted successfully");
      setSelectedProductIds([]);
      loadData();
    } catch (error) { toast.error("Failed to delete some products"); }
  };

  const handleBulkDeleteCategories = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedCategoryIds.length} categories?`)) return;
    try {
      const token = await getToken();
      await Promise.all(selectedCategoryIds.map(id => api.deleteCategory(id, token || undefined)));
      toast.success("Categories deleted successfully");
      setSelectedCategoryIds([]);
      loadData();
    } catch (error) { toast.error("Failed to delete some categories"); }
  };

  const handleBulkDeleteBrands = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedBrandIds.length} brands?`)) return;
    try {
      const token = await getToken();
      await Promise.all(selectedBrandIds.map(id => api.deleteBrand(id, token || undefined)));
      toast.success("Brands deleted successfully");
      setSelectedBrandIds([]);
      loadData();
    } catch (error) { toast.error("Failed to delete some brands"); }
  };

  const handleBulkDeleteBlogs = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedBlogIds.length} blogs?`)) return;
    try {
      const token = await getToken();
      await Promise.all(selectedBlogIds.map(id => api.deleteBlog(id, token || undefined)));
      toast.success("Blogs deleted successfully");
      setSelectedBlogIds([]);
      loadData();
    } catch (error) { toast.error("Failed to delete some blogs"); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sliders className="text-emerald-500 w-8 h-8" />
            SellYourPhone24 <span className="text-emerald-500 font-normal text-xl">Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Signed in as <span className="text-emerald-400 font-bold">{user?.primaryEmailAddress?.emailAddress}</span>. Manage buyback catalog, brands, categories, and doorstep valuation orders. | <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">🗺️ View dynamic sitemap.xml</a>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-xl text-xs font-bold transition hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-500" : ""} />
            Sync Data
          </button>
          <SignOutButton>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-xl text-xs font-bold transition hover:text-white cursor-pointer">
              🚪 Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-900 w-fit">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "orders" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <ClipboardList size={14} />
          Valuation Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "products" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Smartphone size={14} />
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("brands")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "brands" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <FolderOpen size={14} />
          Brands ({brands.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "categories" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers size={14} />
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "blogs" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen size={14} />
          Blogs ({blogs.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-semibold flex items-center justify-center gap-3">
          <RefreshCw className="animate-spin text-emerald-500 w-5 h-5" />
          Synchronizing with Mongoose Database...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-900 pb-4">
                <h2 className="text-xl font-bold text-white">Buyback Valuation Orders</h2>
                
                {/* Status sub-tabs */}
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/40 border border-slate-900/80 rounded-xl">
                  {[
                    { value: "all", label: "All", count: orders.length },
                    { value: "pending", label: "Pending", count: orders.filter(o => o.status === "pending").length },
                    { value: "pickup_assigned", label: "Courier Assigned", count: orders.filter(o => o.status === "pickup_assigned").length },
                    { value: "inspected", label: "Inspected", count: orders.filter(o => o.status === "inspected").length },
                    { value: "completed", label: "Completed", count: orders.filter(o => o.status === "completed").length },
                    { value: "cancelled", label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setSelectedStatusFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedStatusFilter === tab.value
                          ? "bg-slate-800 text-emerald-400 border border-emerald-500/20 shadow-sm"
                          : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      {tab.label} <span className="ml-0.5 opacity-60 font-bold">({tab.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 border border-slate-900 bg-slate-900/30 rounded-3xl space-y-3">
                  <ClipboardList className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-sm text-slate-500 font-semibold">
                    {selectedStatusFilter === "all"
                      ? "No valuation requests have been submitted yet."
                      : `No orders match the status filter "${selectedStatusFilter}".`}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-slate-900 bg-slate-900/40 rounded-3xl p-6 shadow-sm hover:border-slate-800/80 transition-all flex flex-col gap-6"
                    >
                      {/* Order top line */}
                      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-800 pb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</p>
                          <p className="font-mono text-xs font-bold text-emerald-400">{order._id}</p>
                          <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Payout Amount</p>
                            <p className="text-xl font-black text-emerald-400">AED {order.totalPayout.toLocaleString()}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Update Status</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`border rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none bg-slate-950 ${statusColors[order.status]}`}
                            >
                              <option value="pending">Pending Review</option>
                              <option value="pickup_assigned">Courier Assigned</option>
                              <option value="inspected">Device Inspected</option>
                              <option value="completed">Payout Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-400">
                        {/* Customer */}
                        <div className="space-y-2.5 bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <User size={12} className="text-emerald-500" />
                            Customer Details
                          </h4>
                          <div className="space-y-1 leading-relaxed">
                            <p className="font-semibold text-slate-200">{order.customerDetails.name}</p>
                            <p>{order.customerDetails.phone}</p>
                            <p className="break-all">{order.customerDetails.email}</p>
                          </div>
                        </div>

                        {/* Schedule & Pickup */}
                        <div className="space-y-2.5 bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <Calendar size={12} className="text-emerald-500" />
                            Doorstep Pickup Schedule
                          </h4>
                          <div className="space-y-1 leading-relaxed">
                            <p className="font-semibold text-slate-200">{order.pickupSchedule.pickupDate}</p>
                            <p>{order.pickupSchedule.pickupTime}</p>
                            <p className="flex items-center gap-1 mt-1 text-slate-300">
                              <MapPin size={10} className="text-emerald-500" />
                              {order.customerDetails.address}, {order.customerDetails.city}
                            </p>
                          </div>
                        </div>

                        {/* Payout */}
                        <div className="space-y-2.5 bg-slate-900/20 p-4 rounded-2xl border border-slate-900/40">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <CheckCircle size={12} className="text-emerald-500" />
                            Payout Method
                          </h4>
                          <div className="space-y-1">
                            <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 capitalize">
                              {order.paymentMethod}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-2">Cash paid instantly upon courier inspection.</p>
                          </div>
                        </div>
                      </div>

                      {/* Device List */}
                      <div className="border-t border-slate-800/60 pt-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Device to Buy</p>
                        {order.devices.map((device, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs bg-slate-950 p-4 rounded-2xl border border-slate-900">
                            <div>
                              <p className="font-bold text-slate-200 text-sm">{device.name}</p>
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                                <span>{device.brand}</span>
                                <span>•</span>
                                <span>{device.selectedStorage}</span>
                                <span>•</span>
                                <span>{device.selectedColor}</span>
                                <span>•</span>
                                <span className="text-emerald-500">{device.selectedCondition}</span>
                              </div>
                            </div>
                            <p className="font-extrabold text-emerald-500">AED {device.calculatedPrice.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Product Catalog List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">Buyback Catalog ({filteredProducts.length})</h2>
                    {selectedProductIds.length > 0 && (
                      <button onClick={handleBulkDeleteProducts} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                        <Trash2 size={12} /> Delete Selected ({selectedProductIds.length})
                      </button>
                    )}
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search catalog..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-8 text-xs text-white outline-none transition"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch("")}
                        className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 hover:text-white"
                        type="button"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 border border-slate-900 bg-slate-900/10 rounded-2xl">
                    <p className="text-sm text-slate-500 font-semibold">No products found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-slate-900 bg-slate-900/30 rounded-2xl p-4 flex gap-4 hover:border-slate-800 transition relative"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes((product.id || product._id || "").toString())}
                        onChange={(e) => {
                          const id = (product.id || product._id || "").toString();
                          if (e.target.checked) setSelectedProductIds([...selectedProductIds, id]);
                          else setSelectedProductIds(selectedProductIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 cursor-pointer"
                      />
                      <div className="relative w-16 h-20 bg-slate-950 rounded-xl flex-shrink-0 flex items-center justify-center p-2 border border-slate-900 ml-6">
                        <Image
                          src={product.images.frontView}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{product.brand}</p>
                          <h3 className="font-bold text-slate-200 text-sm truncate">{product.name}</h3>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{product.shortDescription}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <p className="text-xs font-extrabold text-emerald-400">AED {product.basePrice}</p>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/20 transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id || product._id || "")}
                              className="p-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={12} />
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                )}
              </div>

              {/* Add/Edit Product Form */}
              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4 h-fit">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                    {editingProductId !== null ? (
                      <>
                        <Pencil className="text-emerald-500 w-5 h-5" />
                        Edit Product
                      </>
                    ) : (
                      <>
                        <Plus className="text-emerald-500 w-5 h-5" />
                        Add New Product
                      </>
                    )}
                  </h3>
                  {editingProductId !== null && (
                    <button
                      onClick={handleCancelProductEdit}
                      className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Device Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-400">Brand</label>
                      <select
                        required
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-400">Category Slug</label>
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Base Price (AED)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 3200"
                      value={newProduct.basePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-slate-400">Storage Options & Price Boosts</label>
                    {newProduct.storages.map((storage, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Size (e.g. 128GB)"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                          value={storage.size}
                          onChange={(e) => {
                            const newStorages = [...newProduct.storages];
                            newStorages[idx].size = e.target.value;
                            setNewProduct({ ...newProduct, storages: newStorages });
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Boost (AED)"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                          value={storage.priceBoost === 0 ? "" : storage.priceBoost}
                          onChange={(e) => {
                            const newStorages = [...newProduct.storages];
                            newStorages[idx].priceBoost = Number(e.target.value);
                            setNewProduct({ ...newProduct, storages: newStorages });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newStorages = newProduct.storages.filter((_, i) => i !== idx);
                            setNewProduct({ ...newProduct, storages: newStorages });
                          }}
                          className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition"
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setNewProduct({
                          ...newProduct,
                          storages: [...newProduct.storages, { size: "", priceBoost: 0 }]
                        });
                      }}
                      className="text-emerald-500 text-sm font-semibold text-left mt-1 hover:text-emerald-400"
                    >
                      + Add another storage option
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Color Options (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Black Titanium, Space Gray"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Titanium body, A17 Pro Chip..."
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Full Description</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed features, specifications..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-400">Front View</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewProduct({ ...newProduct, images: { ...newProduct.images, frontView: e.target.files[0] } });
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-400">Side View</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewProduct({ ...newProduct, images: { ...newProduct.images, sideView: e.target.files[0] } });
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-400">Back View</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewProduct({ ...newProduct, images: { ...newProduct.images, backView: e.target.files[0] } });
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Google SEO Preview */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Google Search Preview</span>
                      <a
                        href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://sellyourphone24.ae/products/${editingProductId || "preview"}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        🔍 Test on Google SEO Validator
                      </a>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-950 font-sans text-xs space-y-1">
                      <p className="text-[10px] text-slate-500 truncate">https://sellyourphone24.ae/products/{editingProductId || "preview"}</p>
                      <h4 className="text-[#1a0dab] text-sm hover:underline font-medium truncate leading-tight">
                        Sell Your {brands.find(b => (b.id || b._id)?.toString() === newProduct.brand)?.name || "Brand"} {newProduct.name || "Product Name"} | Instant Cash Valuation UAE
                      </h4>
                      <p className="text-[#4d5156] text-[10px] leading-snug line-clamp-2">
                        Get an instant valuation up to {newProduct.basePrice || 0} AED for your used {brands.find(b => (b.id || b._id)?.toString() === newProduct.brand)?.name || "Brand"} {newProduct.name || "Product"} on SellYourPhone24. Free doorstep pickup & cash on the spot in Dubai & Abu Dhabi.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {editingProductId !== null ? "Update Product" : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* BRANDS TAB */}
          {activeTab === "brands" && (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Brand List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white">Buyback Brands</h2>
                  {selectedBrandIds.length > 0 && (
                    <button onClick={handleBulkDeleteBrands} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                      <Trash2 size={12} /> Delete Selected ({selectedBrandIds.length})
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {brands.map((brand) => (
                    <div
                      key={brand.id || brand._id}
                      className="border border-slate-900 bg-slate-900/30 rounded-2xl p-5 flex flex-col items-center text-center justify-between gap-4 relative"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrandIds.includes((brand.id || brand._id || "").toString())}
                        onChange={(e) => {
                          const id = (brand.id || brand._id || "").toString();
                          if (e.target.checked) setSelectedBrandIds([...selectedBrandIds, id]);
                          else setSelectedBrandIds(selectedBrandIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 cursor-pointer"
                      />
                      <div className="w-16 h-16 bg-slate-950 rounded-full flex-shrink-0 flex items-center justify-center text-3xl border border-slate-900">
                        {brand.logo.startsWith("/") || brand.logo.startsWith("http") ? (
                          <div className="relative w-10 h-10">
                            <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                          </div>
                        ) : (
                          brand.logo
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-200 text-sm">{brand.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{brand.slug}</p>
                        
                        {/* Tagged categories display */}
                        {brand.categories && brand.categories.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 pt-1.5">
                            {brand.categories.map((c: any, idx) => (
                              <span key={idx} className="text-[8px] font-semibold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                                {typeof c === "object" ? c.name : c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteBrand(brand.id || brand._id || "")}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-[10px] font-bold cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Brand Form */}
              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  <Plus className="text-emerald-500 w-5 h-5" />
                  Add New Brand
                </h3>

                <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Brand Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Slug (e.g. apple)</label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate"
                      value={newBrand.slug}
                      onChange={(e) => setNewBrand({ ...newBrand, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Logo (Image Upload or URL)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewBrand({ ...newBrand, logo: e.target.files[0] });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  {/* Categories Multi-Select List */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-semibold text-slate-400">Tag to Main Categories</label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-slate-800 p-3 rounded-xl bg-slate-950">
                      {categories.map((cat) => {
                        const catId = (cat._id || cat.id || "").toString();
                        const isChecked = newBrand.categories.includes(catId);
                        return (
                          <label key={catId} className="flex items-center gap-2 text-[10px] text-slate-300 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleBrandCategory(catId)}
                              className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0"
                            />
                            {cat.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Add Brand
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === "categories" && (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Category list */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white">Buyback Categories</h2>
                  {selectedCategoryIds.length > 0 && (
                    <button onClick={handleBulkDeleteCategories} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                      <Trash2 size={12} /> Delete Selected ({selectedCategoryIds.length})
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {categories.map((category) => (
                    <div
                      key={category.slug}
                      className="border border-slate-900 bg-slate-900/30 rounded-2xl p-5 flex flex-col items-center text-center justify-between gap-4 relative"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes((category.id || category._id || category.slug).toString())}
                        onChange={(e) => {
                          const id = (category.id || category._id || category.slug).toString();
                          if (e.target.checked) setSelectedCategoryIds([...selectedCategoryIds, id]);
                          else setSelectedCategoryIds(selectedCategoryIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 cursor-pointer"
                      />
                      <div className="relative w-16 h-16 bg-slate-950 rounded-full flex-shrink-0 flex items-center justify-center p-2 border border-slate-900">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-200 text-sm">{category.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{category.slug}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(category.id || category._id || category.slug)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-[10px] font-bold cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Category Form */}
              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  <Plus className="text-emerald-500 w-5 h-5" />
                  Add New Category
                </h3>

                <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Laptops"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Slug (Unique url label)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. laptops"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Category Image</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewCategory({ ...newCategory, image: e.target.files[0] });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Category overview..."
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Add Category
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* BLOGS TAB */}
          {activeTab === "blogs" && (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Blog posts list */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white">Tech & Recycling Blogs Feed</h2>
                  {selectedBlogIds.length > 0 && (
                    <button onClick={handleBulkDeleteBlogs} className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                      <Trash2 size={12} /> Delete Selected ({selectedBlogIds.length})
                    </button>
                  )}
                </div>

                <div className="grid gap-4">
                  {blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="border border-slate-900 bg-slate-900/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative"
                    >
                      <div className="flex items-start gap-4 sm:pl-8">
                        <input
                          type="checkbox"
                          checked={selectedBlogIds.includes((blog.id || blog._id || "").toString())}
                          onChange={(e) => {
                            const id = (blog.id || blog._id || "").toString();
                            if (e.target.checked) setSelectedBlogIds([...selectedBlogIds, id]);
                            else setSelectedBlogIds(selectedBlogIds.filter(i => i !== id));
                          }}
                          className="absolute top-5 left-5 z-10 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 cursor-pointer sm:top-auto sm:left-4"
                        />
                        <div className="relative w-16 h-16 bg-slate-950 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-900">
                          {blog.img ? (
                            <Image
                              src={blog.img}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-2xl">📝</span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-200 text-sm leading-snug line-clamp-1">{blog.title}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{blog.category}</p>
                          <p className="text-[9px] text-slate-500 font-mono">views: {blog.views || 0} | likes: {blog.likes || 0}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBlogClick(blog)}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/20 text-emerald-400 border border-emerald-950/40 hover:bg-emerald-950/40 transition text-[10px] font-bold cursor-pointer"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id || blog._id || "")}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-[10px] font-bold cursor-pointer"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add/Edit Blog Form */}
              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-bold text-base text-white flex items-center gap-1.5">
                  <Plus className="text-emerald-500 w-5 h-5" />
                  {editingBlogId !== null ? "Edit Blog Post" : "Add New Blog"}
                </h3>

                <form onSubmit={handleCreateBlog} className="space-y-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How to sell your phone"
                      value={newBlog.title}
                      onChange={(e) => {
                        const titleVal = e.target.value;
                        const slugVal = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        setNewBlog({
                          ...newBlog,
                          title: titleVal,
                          // Auto-generate slug if not currently editing a specific custom slug
                          slug: editingBlogId !== null ? newBlog.slug : slugVal,
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Slug (Unique URL label)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. how-to-sell-phone"
                      value={newBlog.slug}
                      onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 cursor-pointer"
                    >
                      <option value="Buying Guides">Buying Guides</option>
                      <option value="Recycling Tips">Recycling Tips</option>
                      <option value="Price Analysis">Price Analysis</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Image Asset</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewBlog({ ...newBlog, img: e.target.files[0] });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">Short Description</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter short snippet..."
                      value={newBlog.desc}
                      onChange={(e) => setNewBlog({ ...newBlog, desc: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-400">HTML Rich Content</label>
                    <textarea
                      rows={8}
                      required
                      placeholder="<p>Enter HTML content...</p>"
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-200 font-mono"
                    />
                  </div>

                  {/* Google SEO Preview */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Google Search Preview</span>
                      <a
                        href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(`https://sellyourphone24.ae/blogs/${newBlog.slug || "preview"}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        🔍 Test on Google SEO Validator
                      </a>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-950 font-sans text-xs space-y-1">
                      <p className="text-[10px] text-slate-500 truncate">https://sellyourphone24.ae/blogs/{newBlog.slug || "preview"}</p>
                      <h4 className="text-[#1a0dab] text-sm hover:underline font-medium truncate leading-tight">
                        {newBlog.title || "Blog Post Title"} | SellYourPhone24 Tech Blog
                      </h4>
                      <p className="text-[#4d5156] text-[10px] leading-snug line-clamp-2">
                        {newBlog.desc || "Enter blog description to preview Google Search snippet..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      {editingBlogId !== null ? "Update" : "Publish"}
                    </button>
                    {editingBlogId !== null && (
                      <button
                        type="button"
                        onClick={handleCancelBlogEdit}
                        className="px-4 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
