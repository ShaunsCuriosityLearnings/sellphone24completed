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
  BookOpen,
  TrendingUp,
  DollarSign,
  PackageCheck,
  Tag,
  Upload,
  Eye,
  Sparkles,
  ArrowRight,
  Filter
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
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STANDARD_STORAGES = [
  { size: "64GB", defaultBoost: 0 },
  { size: "128GB", defaultBoost: 100 },
  { size: "256GB", defaultBoost: 250 },
  { size: "512GB", defaultBoost: 450 },
  { size: "1TB", defaultBoost: 750 },
  { size: "2TB", defaultBoost: 1100 },
];

export default function AdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "add-product" | "brands" | "categories" | "blogs">("orders");
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

  const filteredOrders = selectedStatusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === selectedStatusFilter);

  const filteredProducts = products.filter((p) => {
    const query = productSearch.toLowerCase();
    const matchesSearch = (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.shortDescription || "").toLowerCase().includes(query)
    );
    const matchesBrand = selectedBrandFilter === "all" || p.brand.toLowerCase() === selectedBrandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  // Form states
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "", // Will hold Brand ID
    category: "smartphones",
    basePrice: 1500,
    storages: [
      { size: "128GB", priceBoost: 0 },
      { size: "256GB", priceBoost: 200 },
      { size: "512GB", priceBoost: 450 }
    ],
    colors: "Black Titanium, Natural Titanium, White Titanium",
    description: "",
    shortDescription: "",
    images: {
      frontView: "" as string | File,
      sideView: "" as string | File,
      backView: "" as string | File,
    },
  });

  // Preview images for uploaded files
  const [imagePreviews, setImagePreviews] = useState({
    frontView: "",
    sideView: "",
    backView: "",
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

  // Silent load option prevents full-screen reloads
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
      toast.error("Failed to load backend dynamic data.");
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

  // Calculate Metrics
  const totalPayoutValue = orders.reduce((acc, o) => acc + (o.totalPayout || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

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
    const brandDoc = brands.find((b) => b.name.toLowerCase() === product.brand.toLowerCase());
    
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

    setImagePreviews({
      frontView: typeof product.images?.frontView === "string" ? product.images.frontView : "",
      sideView: typeof product.images?.sideView === "string" ? product.images.sideView : "",
      backView: typeof product.images?.backView === "string" ? product.images.backView : "",
    });

    setActiveTab("add-product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelProductEdit = () => {
    setEditingProductId(null);
    setNewProduct({
      name: "",
      brand: "",
      category: categories[0]?.slug || "smartphones",
      basePrice: 1500,
      storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 200 }],
      colors: "Black Titanium, Natural Titanium",
      description: "",
      shortDescription: "",
      images: { frontView: "", sideView: "", backView: "" },
    });
    setImagePreviews({ frontView: "", sideView: "", backView: "" });
    setActiveTab("products");
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brand || !newProduct.category || newProduct.basePrice <= 0) {
      toast.error("Please fill in all required product fields (Name, Brand, Category, Base Price)");
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
        toast.success("Product updated successfully!");
      } else {
        await api.createProduct(fd, token || undefined);
        toast.success("New product added to buyback catalog!");
      }

      handleCancelProductEdit();
      await loadData(false); // Background update without full-page loading spinner
      setActiveTab("products");
    } catch (error: any) {
      toast.error(editingProductId !== null ? "Failed to update product" : "Failed to create product");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = await getToken();
      await api.deleteProduct(id, token || undefined);
      toast.success("Product deleted successfully");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) {
      toast.error("Category name and slug are required");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newCategory.name);
      fd.append("slug", newCategory.slug.toLowerCase().trim());
      fd.append("description", newCategory.description);
      if (newCategory.image instanceof File) {
        fd.append("image", newCategory.image);
      } else if (newCategory.image) {
        fd.append("image", newCategory.image);
      }

      await api.createCategory(fd, token || undefined);
      toast.success("Category created successfully!");
      setNewCategory({ name: "", slug: "", description: "", image: "" });
      await loadData(false);
    } catch (error: any) {
      const errMsg = error?.message || "";
      if (errMsg.includes("already exists")) {
        toast.error("That slug is already in use. Please choose a unique slug.");
      } else {
        toast.error("Failed to create category");
      }
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = await getToken();
      await api.deleteCategory(id, token || undefined);
      toast.success("Category deleted successfully");
      await loadData(false);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name || !newBrand.logo) {
      toast.error("Brand name and logo are required");
      return;
    }

    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newBrand.name);
      fd.append("slug", newBrand.slug || newBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      if (newBrand.logo instanceof File) {
        fd.append("logo", newBrand.logo);
      } else if (newBrand.logo) {
        fd.append("logo", newBrand.logo);
      }
      fd.append("categories", JSON.stringify(newBrand.categories));

      await api.createBrand(fd, token || undefined);
      toast.success("Brand created successfully!");
      setNewBrand({ name: "", slug: "", logo: "📱", categories: [] });
      await loadData(false);
    } catch (error) {
      toast.error("Failed to create brand");
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const token = await getToken();
      await api.deleteBrand(id, token || undefined);
      toast.success("Brand deleted successfully");
      await loadData(false);
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
    setActiveTab("blogs");
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
      await loadData(false);
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
      await loadData(false);
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

  const handleAddStoragePreset = (preset: { size: string; defaultBoost: number }) => {
    const exists = newProduct.storages.some(s => s.size.toLowerCase() === preset.size.toLowerCase());
    if (!exists) {
      setNewProduct({
        ...newProduct,
        storages: [...newProduct.storages, { size: preset.size, priceBoost: preset.defaultBoost }]
      });
    }
  };

  const handleFileChange = (field: "frontView" | "sideView" | "backView", file: File | null) => {
    if (!file) return;
    setNewProduct({
      ...newProduct,
      images: {
        ...newProduct.images,
        [field]: file
      }
    });

    const objectUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({ ...prev, [field]: objectUrl }));
  };

  const selectedBrandDoc = brands.find(b => (b.id || b._id)?.toString() === newProduct.brand);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-12 space-y-8 font-sans">
      
      {/* Title & Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
              <Sliders size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                SellYourPhone24 <span className="text-emerald-400 font-medium text-lg">Executive Console</span>
              </h1>
              <p className="text-xs text-slate-400">
                Administrator: <span className="text-emerald-400 font-semibold">{user?.primaryEmailAddress?.emailAddress}</span> | Direct Mongoose Engine Sync
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              setEditingProductId(null);
              setNewProduct({
                name: "",
                brand: brands[0]?.id?.toString() || brands[0]?._id?.toString() || "",
                category: categories[0]?.slug || "smartphones",
                basePrice: 1500,
                storages: [{ size: "128GB", priceBoost: 0 }, { size: "256GB", priceBoost: 200 }],
                colors: "Black Titanium, Natural Titanium",
                description: "",
                shortDescription: "",
                images: { frontView: "", sideView: "", backView: "" },
              });
              setImagePreviews({ frontView: "", sideView: "", backView: "" });
              setActiveTab("add-product");
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus size={16} />
            Add New Product
          </button>
          
          <button
            onClick={() => loadData(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-800 hover:border-slate-700 bg-slate-900/80 rounded-xl text-xs font-bold transition hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : ""} />
            Sync Database
          </button>

          <SignOutButton>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-800 hover:border-red-500/30 bg-slate-900/80 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition cursor-pointer">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Buyback Payout</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">AED {totalPayoutValue.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">Total customer payout generated</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Products</span>
            <Smartphone className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{products.length}</p>
          <p className="text-[10px] text-slate-500">Live products in buyback store</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Brands</span>
            <Tag className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{brands.length}</p>
          <p className="text-[10px] text-slate-500">Registered manufacturers</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <PackageCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingOrdersCount}</p>
          <p className="text-[10px] text-slate-500">Awaiting courier pickup / review</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "orders" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          <ClipboardList size={15} />
          Valuation Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "products" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          <Smartphone size={15} />
          Products Catalog ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("add-product")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            activeTab === "add-product" ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/30" : "text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
          }`}
        >
          <Plus size={15} />
          {editingProductId !== null ? "Edit Product" : "➕ Add Product"}
        </button>

        <button
          onClick={() => setActiveTab("brands")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "brands" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          <FolderOpen size={15} />
          Brands ({brands.length})
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "categories" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers size={15} />
          Categories ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === "blogs" ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen size={15} />
          Blogs ({blogs.length})
        </button>
      </div>

      {/* Main Workspace Content */}
      {loading ? (
        <div className="py-24 text-center text-slate-500 font-semibold flex flex-col items-center justify-center gap-3 bg-slate-900/20 border border-slate-900 rounded-3xl">
          <RefreshCw className="animate-spin text-emerald-400 w-8 h-8" />
          <p className="text-sm font-semibold">Synchronizing with MongoDB / Mongoose backend...</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* DEDICATED ADD / EDIT PRODUCT WORKSPACE */}
          {activeTab === "add-product" && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                    {editingProductId !== null ? (
                      <>
                        <Pencil className="text-emerald-400 w-6 h-6" />
                        Edit Product Details
                      </>
                    ) : (
                      <>
                        <Sparkles className="text-emerald-400 w-6 h-6" />
                        Add New Device to Buyback Catalog
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in device specifications, base valuation price, storage boosts, and images.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancelProductEdit}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400 hover:text-white transition flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    Cancel
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-8">
                
                {/* Basic Details Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Smartphone size={14} className="text-emerald-400" /> Device Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm text-white transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Tag size={14} className="text-emerald-400" /> Brand *
                    </label>
                    <select
                      required
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm text-white transition cursor-pointer"
                    >
                      <option value="">Select Manufacturer Brand</option>
                      {brands.map((b) => (
                        <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers size={14} className="text-emerald-400" /> Category *
                    </label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm text-white transition cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Pricing & Description */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-400" /> Base Buyback Price (AED) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="e.g. 2800"
                      value={newProduct.basePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm font-extrabold text-emerald-400 transition"
                    />
                    <p className="text-[10px] text-slate-500">Base quote price for standard storage & good condition.</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-300">Color Variants (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Natural Titanium, Black Titanium, White Titanium"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-sm text-slate-200 transition"
                    />
                  </div>

                </div>

                {/* Storage Capacity & Price Boost Calculator */}
                <div className="space-y-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                        💾 Storage Options & Valuation Price Boosts
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Click preset capacity chips to add options or enter custom sizes and price boosts.
                      </p>
                    </div>

                    {/* Preset Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {STANDARD_STORAGES.map((preset) => (
                        <button
                          key={preset.size}
                          type="button"
                          onClick={() => handleAddStoragePreset(preset)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 transition text-slate-300"
                        >
                          + {preset.size} (+{preset.defaultBoost} AED)
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {newProduct.storages.map((storage, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <div className="w-1/3">
                          <input
                            type="text"
                            placeholder="Storage Size (e.g. 256GB)"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-xs font-bold text-white"
                            value={storage.size}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].size = e.target.value;
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                          />
                        </div>
                        <div className="w-1/3">
                          <input
                            type="number"
                            placeholder="Price Boost (AED)"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-xs font-bold text-emerald-400"
                            value={storage.priceBoost === 0 ? "" : storage.priceBoost}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].priceBoost = Number(e.target.value);
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 font-semibold w-1/4">
                          Total: <span className="text-emerald-400 font-bold">AED {(newProduct.basePrice + (storage.priceBoost || 0)).toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newProduct.storages.filter((_, i) => i !== idx);
                            setNewProduct({ ...newProduct, storages: updated });
                          }}
                          className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition flex-shrink-0"
                          title="Remove Storage Option"
                        >
                          <Trash2 size={14} />
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
                      className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      + Add custom storage row
                    </button>
                  </div>
                </div>

                {/* Short & Full Descriptions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Short Description (Badge / Subtitle)</label>
                    <input
                      type="text"
                      placeholder="e.g. Titanium build, A17 Pro chip, 48MP camera system"
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-xs text-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Full Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed features & specifications..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-xs text-slate-200 resize-none"
                    />
                  </div>
                </div>

                {/* Image Upload Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Upload size={14} className="text-emerald-400" /> Device Product Images
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Front View */}
                    <div className="border border-slate-800 bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Front View *</span>
                      
                      {imagePreviews.frontView || (typeof newProduct.images.frontView === "string" && newProduct.images.frontView) ? (
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-slate-800">
                          <Image
                            src={imagePreviews.frontView || (newProduct.images.frontView as string)}
                            alt="Front view"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600">
                          <Smartphone size={24} />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("frontView", e.target.files?.[0] || null)}
                        className="w-full text-[10px] text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-1.5 cursor-pointer"
                      />
                    </div>

                    {/* Side View */}
                    <div className="border border-slate-800 bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Side View</span>
                      
                      {imagePreviews.sideView || (typeof newProduct.images.sideView === "string" && newProduct.images.sideView) ? (
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-slate-800">
                          <Image
                            src={imagePreviews.sideView || (newProduct.images.sideView as string)}
                            alt="Side view"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600">
                          <Smartphone size={24} />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("sideView", e.target.files?.[0] || null)}
                        className="w-full text-[10px] text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-1.5 cursor-pointer"
                      />
                    </div>

                    {/* Back View */}
                    <div className="border border-slate-800 bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 relative">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Back View</span>
                      
                      {imagePreviews.backView || (typeof newProduct.images.backView === "string" && newProduct.images.backView) ? (
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-slate-800">
                          <Image
                            src={imagePreviews.backView || (newProduct.images.backView as string)}
                            alt="Back view"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-slate-600">
                          <Smartphone size={24} />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("backView", e.target.files?.[0] || null)}
                        className="w-full text-[10px] text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-1.5 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>

                {/* Google SEO Live Rich Result Preview Card */}
                <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye size={14} className="text-emerald-400" /> Google Search SERP Rich Result Preview
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      SEO Optimized
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-950 font-sans text-xs space-y-1 shadow-sm">
                    <p className="text-[11px] text-slate-500 truncate">
                      https://sellyourphone24.ae/products/{editingProductId || "preview-slug"}
                    </p>
                    <h4 className="text-[#1a0dab] text-base hover:underline font-medium truncate leading-tight">
                      Sell Your {selectedBrandDoc?.name || "Device"} {newProduct.name || "Product Name"} | Instant Cash Valuation UAE
                    </h4>
                    <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-2">
                      Get an instant valuation up to {newProduct.basePrice} AED for your used {selectedBrandDoc?.name || ""} {newProduct.name} on SellYourPhone24. Free doorstep pickup & instant cash in Dubai & Abu Dhabi.
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={handleCancelProductEdit}
                    className="px-6 py-3 rounded-xl text-xs font-bold border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    {submittingProduct ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        {editingProductId !== null ? "Update Product Catalog Entry" : "Publish Product to Catalog"}
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* PRODUCTS CATALOG LIST TAB */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {/* Header Filters & Action bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Buyback Products Catalog ({filteredProducts.length})</h2>
                  {selectedProductIds.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedProductIds.length} products?`)) return;
                        const token = await getToken();
                        await Promise.all(selectedProductIds.map(id => api.deleteProduct(id, token || undefined)));
                        toast.success("Products deleted successfully");
                        setSelectedProductIds([]);
                        await loadData(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Selected ({selectedProductIds.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Brand Selector */}
                  <select
                    value={selectedBrandFilter}
                    onChange={(e) => setSelectedBrandFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 outline-none transition"
                  >
                    <option value="all">All Brands ({brands.length})</option>
                    {brands.map((b) => (
                      <option key={b.id || b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>

                  {/* Search bar */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search product catalog..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl py-2 pl-9 pr-8 text-xs text-white outline-none transition"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch("")}
                        className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                        type="button"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 border border-slate-900 bg-slate-900/20 rounded-3xl space-y-3">
                  <Smartphone className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-sm text-slate-500 font-semibold">No products match your active search or brand filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id || product._id}
                      className="border border-slate-800/80 bg-slate-900/30 rounded-3xl p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition relative overflow-hidden group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes((product.id || product._id || "").toString())}
                        onChange={(e) => {
                          const id = (product.id || product._id || "").toString();
                          if (e.target.checked) setSelectedProductIds([...selectedProductIds, id]);
                          else setSelectedProductIds(selectedProductIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 cursor-pointer"
                      />

                      <div className="relative w-full h-40 bg-slate-950 rounded-2xl flex items-center justify-center p-3 border border-slate-900 mt-5">
                        {product.images?.frontView ? (
                          <Image
                            src={product.images.frontView}
                            alt={product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <Smartphone size={40} className="text-slate-700" />
                        )}
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{product.category}</span>
                        </div>

                        <h3 className="font-extrabold text-white text-base truncate">{product.name}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{product.shortDescription || "No short description"}</p>

                        {/* Storage badges */}
                        {product.storages && product.storages.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {product.storages.map((s, idx) => (
                              <span key={idx} className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                {s.size}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 mt-auto">
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Base Value</p>
                          <p className="text-sm font-black text-emerald-400">AED {product.basePrice.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditProductClick(product)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/30 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id || product._id || "")}
                            className="p-2 rounded-xl bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white">Buyback Valuation Orders</h2>
                
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedStatusFilter === tab.value
                          ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm"
                          : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      {tab.label} <span className="ml-0.5 opacity-60 font-mono">({tab.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 border border-slate-900 bg-slate-900/20 rounded-3xl space-y-3">
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
                      className="border border-slate-800/80 bg-slate-900/30 rounded-3xl p-6 shadow-sm hover:border-slate-700 transition flex flex-col gap-6"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-800/80 pb-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</p>
                          <p className="font-mono text-xs font-bold text-emerald-400">{order._id}</p>
                          <p className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Payout Amount</p>
                            <p className="text-2xl font-black text-emerald-400">AED {order.totalPayout.toLocaleString()}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-500 uppercase">Update Status</label>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`border rounded-xl text-xs font-bold px-3 py-2 focus:outline-none bg-slate-950 cursor-pointer ${statusColors[order.status]}`}
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

                      <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-400">
                        <div className="space-y-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <User size={12} className="text-emerald-400" /> Customer Contact
                          </h4>
                          <div className="space-y-1 leading-relaxed">
                            <p className="font-bold text-white text-sm">{order.customerDetails.name}</p>
                            <p className="font-mono text-slate-300">{order.customerDetails.phone}</p>
                            <p className="break-all text-slate-400">{order.customerDetails.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <Calendar size={12} className="text-emerald-400" /> Doorstep Collection
                          </h4>
                          <div className="space-y-1 leading-relaxed">
                            <p className="font-bold text-slate-200">{order.pickupSchedule.pickupDate}</p>
                            <p className="text-slate-400">{order.pickupSchedule.pickupTime}</p>
                            <p className="flex items-center gap-1 mt-1 text-slate-300 font-semibold">
                              <MapPin size={12} className="text-emerald-400 flex-shrink-0" />
                              {order.customerDetails.address}, {order.customerDetails.city}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5 bg-slate-950 p-4 rounded-2xl border border-slate-800/60">
                          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                            <CheckCircle size={12} className="text-emerald-400" /> Payout Method
                          </h4>
                          <div className="space-y-1">
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/20 capitalize">
                              {order.paymentMethod} Payout
                            </span>
                            <p className="text-[10px] text-slate-500 mt-2">Cash handed instantly upon doorstep courier device check.</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Itemized Devices</p>
                        <div className="space-y-2">
                          {order.devices.map((device, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                              <div>
                                <p className="font-bold text-white text-sm">{device.name}</p>
                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                                  <span>Brand: <strong className="text-slate-200">{device.brand}</strong></span>
                                  <span>•</span>
                                  <span>Storage: <strong className="text-slate-200">{device.selectedStorage}</strong></span>
                                  <span>•</span>
                                  <span>Color: <strong className="text-slate-200">{device.selectedColor}</strong></span>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-bold">Condition: {device.selectedCondition}</span>
                                </div>
                              </div>
                              <p className="font-black text-emerald-400 text-sm">AED {device.calculatedPrice.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* BRANDS TAB */}
          {activeTab === "brands" && (
            <div className="grid lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white">Buyback Brands ({brands.length})</h2>
                  {selectedBrandIds.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedBrandIds.length} brands?`)) return;
                        const token = await getToken();
                        await Promise.all(selectedBrandIds.map(id => api.deleteBrand(id, token || undefined)));
                        toast.success("Brands deleted successfully");
                        setSelectedBrandIds([]);
                        await loadData(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Selected ({selectedBrandIds.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id || brand._id}
                      className="border border-slate-800/80 bg-slate-900/30 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-4 relative"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrandIds.includes((brand.id || brand._id || "").toString())}
                        onChange={(e) => {
                          const id = (brand.id || brand._id || "").toString();
                          if (e.target.checked) setSelectedBrandIds([...selectedBrandIds, id]);
                          else setSelectedBrandIds(selectedBrandIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 cursor-pointer"
                      />

                      <div className="w-16 h-16 bg-slate-950 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl border border-slate-800 mt-2">
                        {brand.logo && (brand.logo.startsWith("/") || brand.logo.startsWith("http")) ? (
                          <div className="relative w-10 h-10">
                            <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                          </div>
                        ) : (
                          brand.logo || "📱"
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-sm">{brand.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{brand.slug}</p>

                        {brand.categories && brand.categories.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 pt-1">
                            {brand.categories.map((c: any, idx) => (
                              <span key={idx} className="text-[8px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                {typeof c === "object" ? c.name : c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteBrand(brand.id || brand._id || "")}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-xs font-bold cursor-pointer"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <Plus className="text-emerald-400 w-5 h-5" /> Add New Brand
                </h3>

                <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple, Samsung, Google"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Brand Slug</label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate"
                      value={newBrand.slug}
                      onChange={(e) => setNewBrand({ ...newBrand, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Logo File or Emoji</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setNewBrand({ ...newBrand, logo: e.target.files[0] });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Tag Categories</label>
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
                              className="rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0"
                            />
                            {cat.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
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
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white">Buyback Categories ({categories.length})</h2>
                  {selectedCategoryIds.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedCategoryIds.length} categories?`)) return;
                        const token = await getToken();
                        await Promise.all(selectedCategoryIds.map(id => api.deleteCategory(id, token || undefined)));
                        toast.success("Categories deleted successfully");
                        setSelectedCategoryIds([]);
                        await loadData(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Selected ({selectedCategoryIds.length})
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.slug}
                      className="border border-slate-800/80 bg-slate-900/30 rounded-3xl p-5 flex flex-col items-center text-center justify-between gap-4 relative"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes((category.id || category._id || category.slug).toString())}
                        onChange={(e) => {
                          const id = (category.id || category._id || category.slug).toString();
                          if (e.target.checked) setSelectedCategoryIds([...selectedCategoryIds, id]);
                          else setSelectedCategoryIds(selectedCategoryIds.filter(i => i !== id));
                        }}
                        className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 cursor-pointer"
                      />

                      <div className="relative w-16 h-16 bg-slate-950 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 border border-slate-800 mt-2">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <Layers size={28} className="text-slate-600" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-sm">{category.name}</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{category.slug}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCategory(category.id || category._id || category.slug)}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-xs font-bold cursor-pointer"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <Plus className="text-emerald-400 w-5 h-5" /> Add New Category
                </h3>

                <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tablets, Laptops, Smartwatches"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Unique Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. tablets, laptops"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Category Image Asset *</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setNewCategory({ ...newCategory, image: e.target.files[0] });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Overview..."
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
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
              
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <h2 className="text-xl font-bold text-white">Blogs & Articles ({blogs.length})</h2>
                  {selectedBlogIds.length > 0 && (
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${selectedBlogIds.length} blogs?`)) return;
                        const token = await getToken();
                        await Promise.all(selectedBlogIds.map(id => api.deleteBlog(id, token || undefined)));
                        toast.success("Blogs deleted successfully");
                        setSelectedBlogIds([]);
                        await loadData(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete Selected ({selectedBlogIds.length})
                    </button>
                  )}
                </div>

                <div className="grid gap-4">
                  {blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="border border-slate-800/80 bg-slate-900/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative"
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
                          className="absolute top-5 left-5 z-10 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 cursor-pointer sm:top-auto sm:left-4"
                        />

                        <div className="relative w-16 h-16 bg-slate-950 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                          {blog.img ? (
                            <Image src={blog.img} alt={blog.title} fill className="object-cover" />
                          ) : (
                            <span className="text-2xl">📝</span>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h3 className="font-extrabold text-white text-sm leading-snug line-clamp-1">{blog.title}</h3>
                          <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">{blog.category}</p>
                          <p className="text-[9px] text-slate-500 font-mono">slug: {blog.slug}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBlogClick(blog)}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition text-xs font-bold cursor-pointer"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id || blog._id || "")}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/20 text-red-400 border border-red-950/40 hover:bg-red-950/40 transition text-xs font-bold cursor-pointer"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <Plus className="text-emerald-400 w-5 h-5" />
                  {editingBlogId !== null ? "Edit Article" : "Add New Blog Article"}
                </h3>

                <form onSubmit={handleCreateBlog} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Top 5 Tips for Selling Your Used iPhone"
                      value={newBlog.title}
                      onChange={(e) => {
                        const titleVal = e.target.value;
                        const slugVal = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                        setNewBlog({
                          ...newBlog,
                          title: titleVal,
                          slug: editingBlogId !== null ? newBlog.slug : slugVal,
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">URL Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. top-5-tips-selling-iphone"
                      value={newBlog.slug}
                      onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Blog Category</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-white cursor-pointer"
                    >
                      <option value="Buying Guides">Buying Guides</option>
                      <option value="Recycling Tips">Recycling Tips</option>
                      <option value="Price Analysis">Price Analysis</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Cover Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setNewBlog({ ...newBlog, img: e.target.files[0] });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 outline-none focus:border-emerald-500 text-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Short Snippet *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief excerpt..."
                      value={newBlog.desc}
                      onChange={(e) => setNewBlog({ ...newBlog, desc: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-slate-200 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Full Content Markdown *</label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Full markdown article content..."
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 text-slate-200 resize-none font-mono text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-extrabold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    {editingBlogId !== null ? "Update Blog Post" : "Publish Blog Post"}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
