"use client";

import { useEffect, useState, useMemo } from "react";
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
  BookOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  LogOut,
  ExternalLink
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
    state?: string;
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
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pickup_assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  inspected: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const STANDARD_STORAGES = [
  { size: "64GB", defaultBoost: 0 },
  { size: "128GB", defaultBoost: 100 },
  { size: "256GB", defaultBoost: 200 },
  { size: "512GB", defaultBoost: 400 },
  { size: "1TB", defaultBoost: 700 },
];

export default function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "add-product" | "brands" | "categories" | "blogs">("products");
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState<string>("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Expandable row state for order details
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Pagination for compact product table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;
      const query = (productSearch || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();
      const pBrand = (p.brand || "").toLowerCase();
      const pCategory = (p.category || "").toLowerCase();
      const pDesc = (p.shortDescription || "").toLowerCase();

      const matchesSearch = pName.includes(query) || pBrand.includes(query) || pDesc.includes(query);
      const matchesBrand = selectedBrandFilter === "all" || pBrand === (selectedBrandFilter || "").toLowerCase();
      const matchesCategory = selectedCategoryFilter === "all" || pCategory === (selectedCategoryFilter || "").toLowerCase();
      
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, productSearch, selectedBrandFilter, selectedCategoryFilter]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const filteredOrders = useMemo(() => {
    return selectedStatusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === selectedStatusFilter);
  }, [orders, selectedStatusFilter]);

  // Form state
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "smartphones",
    basePrice: 1500,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 200 },
      { size: "512GB", priceBoost: 400 }
    ],
    colors: "Black, Silver, Gold",
    description: "",
    shortDescription: "",
    images: {
      frontView: "" as string | File,
      sideView: "" as string | File,
      backView: "" as string | File,
    },
  });

  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", image: "" as string | File });
  const [newBrand, setNewBrand] = useState<{ name: string; slug: string; logo: string | File; categories: string[] }>({ name: "", slug: "", logo: "", categories: [] });
  const [editingBlogId, setEditingBlogId] = useState<string | number | null>(null);
  const [newBlog, setNewBlog] = useState({ title: "", slug: "", desc: "", content: "", img: "" as string | File, category: "Buying Guides", author: "Team SellYourPhone24" });

  const loadData = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const [fetchedOrders, fetchedProducts, fetchedCategories, fetchedBrands, fetchedBlogs] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getCategories(),
        api.getBrands(),
        api.getBlogs()
      ]);
      
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setBrands(fetchedBrands);
      setBlogs(fetchedBlogs);
    } catch (error) {
      toast.error("Failed to sync backend data.");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && (user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress === "shantanukamble.org@gmail.com")) {
      loadData(true);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center flex-col gap-3">
        <RefreshCw className="animate-spin text-emerald-500 w-6 h-6" />
        <p className="text-xs font-semibold text-slate-400">Loading session...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center mb-4">
          <h1 className="text-xl font-bold text-white tracking-tight">SellYourPhone24 Admin</h1>
          <p className="text-xs text-slate-400">Sign in to manage catalog, orders & brands.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress === "shantanukamble.org@gmail.com";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 text-center">
        <div className="border border-rose-500/20 bg-rose-500/5 rounded-2xl p-6 max-w-sm space-y-4">
          <h2 className="text-lg font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Account (<span className="text-emerald-400">{user?.primaryEmailAddress?.emailAddress}</span>) is not an administrator.
          </p>
          <SignOutButton>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await api.updateOrderStatus(id, newStatus, token || undefined);
      if (res.success) {
        toast.success(`Status updated`);
        setOrders(orders.map((o) => (o._id === id ? { ...o, status: newStatus as any } : o)));
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleEditProductClick = (product: ProductType) => {
    setEditingProductId(product.id || product._id || "");
    const brandDoc = brands.find((b) => (b.name || "").toLowerCase() === (product.brand || "").toLowerCase());
    
    setNewProduct({
      name: product.name,
      brand: brandDoc ? (brandDoc._id || brandDoc.id || "").toString() : "",
      category: product.category,
      basePrice: product.basePrice,
      storages: product.storages && product.storages.length > 0 ? product.storages : [{ size: "128GB", priceBoost: 0 }],
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      images: product.images || { frontView: "", sideView: "", backView: "" },
    });

    setActiveTab("add-product");
  };

  const handleCancelProductEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "",
      brand: "",
      category: categories[0]?.slug || "smartphones",
      basePrice: 1500,
      storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 200 }],
      colors: "Black, Silver, Gold",
      description: "",
      shortDescription: "",
      images: { frontView: "", sideView: "", backView: "" },
    });
    setActiveTab("products");
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.category || newProduct.basePrice <= 0) {
      toast.error("Required: Name, Brand, Category, Base Price");
      return;
    }

    setSubmittingProduct(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newProduct.name.trim());
      fd.append("brand", newProduct.brand);
      fd.append("category", newProduct.category.trim());
      fd.append("basePrice", newProduct.basePrice.toString());
      
      const validStorages = newProduct.storages.filter(s => s.size.trim() !== "");
      fd.append("storages", JSON.stringify(validStorages.length > 0 ? validStorages : [{ size: "Standard", priceBoost: 0 }]));
      
      const colorArray = newProduct.colors.split(",").map((c) => c.trim()).filter(Boolean);
      fd.append("colors", JSON.stringify(colorArray));
      
      fd.append("description", newProduct.description.trim());
      fd.append("shortDescription", newProduct.shortDescription.trim());
      
      if (newProduct.images.frontView instanceof File) fd.append("images[frontView]", newProduct.images.frontView);
      else if (newProduct.images.frontView) fd.append("images[frontView]", newProduct.images.frontView);

      if (newProduct.images.sideView instanceof File) fd.append("images[sideView]", newProduct.images.sideView);
      else if (newProduct.images.sideView) fd.append("images[sideView]", newProduct.images.sideView);

      if (newProduct.images.backView instanceof File) fd.append("images[backView]", newProduct.images.backView);
      else if (newProduct.images.backView) fd.append("images[backView]", newProduct.images.backView);

      if (editingProductId !== null) {
        await api.updateProduct(editingProductId, fd, token || undefined);
        toast.success("Product updated");
      } else {
        await api.createProduct(fd, token || undefined);
        toast.success("Product created");
      }

      handleCancelProductEdit();
      await loadData(false);
      setActiveTab("products");
    } catch (error: any) {
      toast.error(editingProductId !== null ? "Failed to update product" : "Failed to create product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm("Delete product?")) return;
    try {
      const token = await getToken();
      await api.deleteProduct(id, token || undefined);
      toast.success("Product deleted");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return;
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newCategory.name);
      fd.append("slug", newCategory.slug.toLowerCase().trim());
      fd.append("description", newCategory.description);
      if (newCategory.image instanceof File) fd.append("image", newCategory.image);
      else if (newCategory.image) fd.append("image", newCategory.image);

      await api.createCategory(fd, token || undefined);
      toast.success("Category created");
      setNewCategory({ name: "", slug: "", description: "", image: "" });
      await loadData(false);
    } catch (error: any) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm("Delete category?")) return;
    try {
      const token = await getToken();
      await api.deleteCategory(id, token || undefined);
      toast.success("Category deleted");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name) return;
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newBrand.name);
      fd.append("slug", newBrand.slug || newBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      if (newBrand.logo instanceof File) fd.append("logo", newBrand.logo);
      else if (newBrand.logo) fd.append("logo", newBrand.logo);
      fd.append("categories", JSON.stringify(newBrand.categories));

      await api.createBrand(fd, token || undefined);
      toast.success("Brand created");
      setNewBrand({ name: "", slug: "", logo: "", categories: [] });
      await loadData(false);
    } catch (error) {
      toast.error("Failed to create brand");
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    if (!confirm("Delete brand?")) return;
    try {
      const token = await getToken();
      await api.deleteBrand(id, token || undefined);
      toast.success("Brand deleted");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleDeleteBlog = async (id: string | number) => {
    if (!confirm("Delete blog post?")) return;
    try {
      const token = await getToken();
      await api.deleteBlog(id, token || undefined);
      toast.success("Blog deleted");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const handleAddStoragePreset = (preset: { size: string; defaultBoost: number }) => {
    const exists = newProduct.storages.some(s => s.size.toLowerCase() === preset.size.toLowerCase());
    if (!exists) {
      setNewProduct({
        ...newProduct,
        storages: [...newProduct.storages, { size: preset.size, priceBoost: preset.defaultBoost }]
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200 font-sans text-xs pb-16">
      
      {/* Top Header Bar */}
      <header className="bg-[#111827] border-b border-slate-800/80 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders size={16} className="text-emerald-500" />
              <span>SellYourPhone24 Admin</span>
            </h1>
            <span className="hidden sm:inline-block text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingProductId(null);
                setNewProduct({
                  name: "",
                  brand: brands[0]?.id?.toString() || brands[0]?._id?.toString() || "",
                  category: categories[0]?.slug || "smartphones",
                  basePrice: 1500,
                  storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 200 }],
                  colors: "Black, Silver, Gold",
                  description: "",
                  shortDescription: "",
                  images: { frontView: "", sideView: "", backView: "" },
                });
                setActiveTab("add-product");
              }}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => loadData(true)}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : ""} />
            </button>

            <SignOutButton>
              <button className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition" title="Sign Out">
                <LogOut size={14} />
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 space-y-4">
        
        {/* Compact Navigation Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto bg-[#111827] p-1 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveTab("products"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "products" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone size={13} /> Products <span className="text-[10px] opacity-75">({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("add-product")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "add-product" ? "bg-emerald-500 text-slate-950 shadow" : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <Plus size={13} /> {editingProductId !== null ? "Edit Product" : "New Product"}
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "orders" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <ClipboardList size={13} /> Orders <span className="text-[10px] opacity-75">({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("brands")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "brands" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <FolderOpen size={13} /> Brands <span className="text-[10px] opacity-75">({brands.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "categories" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers size={13} /> Categories <span className="text-[10px] opacity-75">({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "blogs" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen size={13} /> Blogs <span className="text-[10px] opacity-75">({blogs.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Workspace Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-emerald-500 w-4 h-4" />
            <span>Syncing database...</span>
          </div>
        ) : (
          <div>
            
            {/* PRODUCTS TAB (Compact Table View) */}
            {activeTab === "products" && (
              <div className="space-y-3">
                
                {/* Search & Filter Bar */}
                <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-2.5 top-2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search product by name, brand..."
                      value={productSearch}
                      onChange={(e) => { setProductSearch(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBrandFilter}
                      onChange={(e) => { setSelectedBrandFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-[#0b0f17] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">All Brands ({brands.length})</option>
                      {brands.map((b) => (
                        <option key={b.id || b._id} value={b.name}>{b.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => { setSelectedCategoryFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-[#0b0f17] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">All Categories ({categories.length})</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Data */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-medium">
                    No products match your filters.
                  </div>
                ) : (
                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            <th className="py-2.5 px-4 w-12 text-center">Image</th>
                            <th className="py-2.5 px-4">Device Product</th>
                            <th className="py-2.5 px-4">Brand</th>
                            <th className="py-2.5 px-4">Category</th>
                            <th className="py-2.5 px-4">Base Price</th>
                            <th className="py-2.5 px-4">Storages</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {paginatedProducts.map((product) => (
                            <tr key={product.id || product._id} className="hover:bg-slate-900/40 transition">
                              <td className="py-2 px-4 text-center">
                                <div className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden mx-auto flex items-center justify-center">
                                  {product.images?.frontView ? (
                                    <Image src={product.images.frontView} alt={product.name} fill className="object-contain p-0.5" />
                                  ) : (
                                    <Smartphone size={16} className="text-slate-600" />
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-4 font-semibold text-white">
                                <div>
                                  <p className="text-xs font-bold">{product.name}</p>
                                  {product.shortDescription && (
                                    <p className="text-[10px] text-slate-400 line-clamp-1 font-normal">{product.shortDescription}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
                                  {product.brand}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-slate-400 font-mono text-[11px]">
                                {product.category}
                              </td>
                              <td className="py-2 px-4 font-bold text-emerald-400">
                                AED {product.basePrice.toLocaleString()}
                              </td>
                              <td className="py-2 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {product.storages?.map((s, idx) => (
                                    <span key={idx} className="text-[9px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                                      {s.size}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right space-x-1">
                                <button
                                  onClick={() => handleEditProductClick(product)}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                                  title="Edit"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id || product._id || "")}
                                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 rounded border border-rose-900/50 transition"
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Compact Row View */}
                    <div className="sm:hidden divide-y divide-slate-800/60">
                      {paginatedProducts.map((product) => (
                        <div key={product.id || product._id} className="p-3 flex items-center justify-between gap-3">
                          <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.images?.frontView ? (
                              <Image src={product.images.frontView} alt={product.name} fill className="object-contain p-0.5" />
                            ) : (
                              <Smartphone size={16} className="text-slate-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-800 px-1 rounded">{product.brand}</span>
                              <h4 className="font-bold text-white text-xs truncate">{product.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-extrabold text-emerald-400 text-xs">AED {product.basePrice}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({product.category})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="p-1.5 bg-slate-800 text-slate-200 rounded border border-slate-700"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id || product._id || "")}
                              className="p-1.5 bg-rose-950/30 text-rose-400 rounded border border-rose-900/50"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                      <div className="border-t border-slate-800/80 p-2.5 bg-slate-900/40 flex justify-between items-center text-xs text-slate-400">
                        <span>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-2.5 py-1 bg-slate-800 disabled:opacity-40 rounded text-white font-semibold"
                          >
                            Prev
                          </button>
                          <span className="px-2 font-bold text-white">{currentPage} / {totalPages}</span>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-2.5 py-1 bg-slate-800 disabled:opacity-40 rounded text-white font-semibold"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* ADD / EDIT PRODUCT TAB */}
            {activeTab === "add-product" && (
              <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-6 space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    {editingProductId !== null ? <Pencil size={15} className="text-emerald-400" /> : <Plus size={15} className="text-emerald-400" />}
                    <span>{editingProductId !== null ? "Edit Device Product" : "Add New Buyback Product"}</span>
                  </h2>

                  <button
                    type="button"
                    onClick={handleCancelProductEdit}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. iPhone 15 Pro"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Brand *</label>
                      <select
                        required
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Category *</label>
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Base Price (AED) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="e.g. 1800"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-emerald-400 font-bold outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">Color Options (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Black, Silver, Gold"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Compact Storage Section */}
                  <div className="bg-[#0b0f17] border border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-white">Storage Capacity & Boosts</span>
                      <div className="flex flex-wrap gap-1">
                        {STANDARD_STORAGES.map((preset) => (
                          <button
                            key={preset.size}
                            type="button"
                            onClick={() => handleAddStoragePreset(preset)}
                            className="px-2 py-0.5 bg-slate-800 text-[10px] font-semibold text-slate-300 hover:text-emerald-400 rounded border border-slate-700"
                          >
                            + {preset.size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {newProduct.storages.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Size"
                            value={s.size}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].size = e.target.value;
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="w-1/3 bg-[#111827] border border-slate-800 rounded p-1.5 text-white"
                          />
                          <input
                            type="number"
                            placeholder="Price Boost"
                            value={s.priceBoost === 0 ? "" : s.priceBoost}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].priceBoost = Number(e.target.value);
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="w-1/3 bg-[#111827] border border-slate-800 rounded p-1.5 text-emerald-400 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newProduct.storages.filter((_, i) => i !== idx);
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="p-1 text-rose-400 hover:bg-rose-950/30 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Titanium design, A17 Pro chip..."
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg p-2 text-white outline-none"
                    />
                  </div>

                  {/* Image Upload Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Front Image *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, frontView: e.target.files[0] } });
                        }}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded p-1 text-[10px] text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Side Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, sideView: e.target.files[0] } });
                        }}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded p-1 text-[10px] text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Back Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, backView: e.target.files[0] } });
                        }}
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded p-1 text-[10px] text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelProductEdit}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg font-bold hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingProduct}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition cursor-pointer"
                    >
                      {submittingProduct ? "Saving..." : (editingProductId !== null ? "Update Product" : "Publish Product")}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* ORDERS TAB (Expandable Compact Table) */}
            {activeTab === "orders" && (
              <div className="space-y-3">
                <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-3">
                  <span className="font-bold text-white text-xs">Buyback Orders ({filteredOrders.length})</span>
                  
                  <div className="flex gap-1 overflow-x-auto">
                    {["all", "pending", "pickup_assigned", "inspected", "completed", "cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition ${
                          selectedStatusFilter === st ? "bg-slate-800 text-emerald-400 border border-slate-700" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 font-medium">
                    No orders match status filter.
                  </div>
                ) : (
                  <div className="bg-[#111827] border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/60">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order._id;
                      return (
                        <div key={order._id} className="transition">
                          
                          {/* Order Header Row */}
                          <div 
                            onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                            className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/40"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button className="text-slate-500">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              <div>
                                <p className="font-bold text-white text-xs">{order.customerDetails.name} <span className="text-slate-500 text-[10px] font-normal">({order.customerDetails.phone})</span></p>
                                <p className="text-[10px] text-slate-500 font-mono">{order._id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-emerald-400 text-xs">AED {order.totalPayout.toLocaleString()}</span>
                              
                              <select
                                value={order.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border bg-[#0b0f17] outline-none cursor-pointer ${statusColors[order.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="pickup_assigned">Assigned</option>
                                <option value="inspected">Inspected</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Expanded Order Details */}
                          {isExpanded && (
                            <div className="p-4 bg-[#0b0f17] border-t border-slate-800/60 space-y-3 text-xs text-slate-300">
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Customer Details</p>
                                  <p className="font-semibold text-white">{order.customerDetails.name}</p>
                                  <p>{order.customerDetails.phone}</p>
                                  <p className="text-slate-400">{order.customerDetails.email}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Doorstep Pickup</p>
                                  <p className="font-semibold text-white">{order.pickupSchedule.pickupDate}</p>
                                  <p>{order.pickupSchedule.pickupTime}</p>
                                  <p className="text-slate-400">{order.customerDetails.address}, {order.customerDetails.city}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Payment</p>
                                  <p className="font-bold text-emerald-400 capitalize">{order.paymentMethod} Payout</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Devices</p>
                                <div className="space-y-1">
                                  {order.devices.map((d, i) => (
                                    <div key={i} className="flex justify-between items-center bg-[#111827] p-2 rounded border border-slate-800">
                                      <span><strong>{d.name}</strong> ({d.brand} • {d.selectedStorage} • {d.selectedColor} • {d.selectedCondition})</span>
                                      <span className="font-bold text-emerald-400">AED {d.calculatedPrice}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* BRANDS TAB */}
            {activeTab === "brands" && (
              <div className="grid sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 bg-[#111827] border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white text-xs">Brands ({brands.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {brands.map((b) => (
                      <div key={b.id || b._id} className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded-lg flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-white text-xs truncate">{b.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{b.slug}</p>
                        </div>
                        <button onClick={() => handleDeleteBrand(b.id || b._id || "")} className="text-rose-400 p-1 hover:bg-rose-950/30 rounded">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-4 bg-[#111827] border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white text-xs">Add Brand</h3>
                  <form onSubmit={handleCreateBrand} className="space-y-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Brand name"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded p-2 text-white outline-none"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) setNewBrand({ ...newBrand, logo: e.target.files[0] }); }}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded p-1 text-[10px] text-slate-400"
                    />
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded">
                      Add Brand
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === "categories" && (
              <div className="grid sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 bg-[#111827] border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white text-xs">Categories ({categories.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((c) => (
                      <div key={c.slug} className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded-lg flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-white text-xs truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{c.slug}</p>
                        </div>
                        <button onClick={() => handleDeleteCategory(c.id || c._id || c.slug)} className="text-rose-400 p-1 hover:bg-rose-950/30 rounded">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-4 bg-[#111827] border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <h3 className="font-bold text-white text-xs">Add Category</h3>
                  <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded p-2 text-white outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Slug (e.g. laptops)"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded p-2 text-white outline-none"
                    />
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) setNewCategory({ ...newCategory, image: e.target.files[0] }); }}
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded p-1 text-[10px] text-slate-400"
                    />
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded">
                      Add Category
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blogs" && (
              <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-white text-xs">Blogs ({blogs.length})</h3>
                <div className="divide-y divide-slate-800/60">
                  {blogs.map((b) => (
                    <div key={b.slug} className="py-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{b.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{b.category} • {b.slug}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDeleteBlog(b.id || b._id || "")} className="text-rose-400 p-1 hover:bg-rose-950/30 rounded">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
