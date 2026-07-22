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
  FolderOpen,
  Pencil,
  XCircle,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  LogOut,
  Laptop,
  Watch,
  Tablet,
  Cpu
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
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  pickup_assigned: "bg-blue-50 text-blue-700 border-blue-200",
  inspected: "bg-purple-50 text-purple-700 border-purple-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

// Device category spec presets for quick 1-click variant creation
const CATEGORY_SPEC_PRESETS: Record<string, Array<{ size: string; defaultBoost: number }>> = {
  smartphones: [
    { size: "64GB", defaultBoost: 0 },
    { size: "128GB", defaultBoost: 100 },
    { size: "256GB", defaultBoost: 200 },
    { size: "512GB", defaultBoost: 400 },
    { size: "1TB", defaultBoost: 700 },
    { size: "6GB RAM / 128GB", defaultBoost: 100 },
    { size: "8GB RAM / 128GB", defaultBoost: 150 },
    { size: "8GB RAM / 256GB", defaultBoost: 250 },
    { size: "12GB RAM / 256GB", defaultBoost: 350 },
    { size: "12GB RAM / 512GB", defaultBoost: 500 },
    { size: "16GB RAM / 1TB", defaultBoost: 800 },
  ],
  mobile: [
    { size: "64GB", defaultBoost: 0 },
    { size: "128GB", defaultBoost: 100 },
    { size: "256GB", defaultBoost: 200 },
    { size: "8GB RAM / 128GB", defaultBoost: 150 },
    { size: "8GB RAM / 256GB", defaultBoost: 250 },
    { size: "12GB RAM / 256GB", defaultBoost: 350 },
    { size: "12GB RAM / 512GB", defaultBoost: 500 },
  ],
  laptops: [
    { size: "8GB RAM / 256GB SSD", defaultBoost: 0 },
    { size: "16GB RAM / 512GB SSD", defaultBoost: 300 },
    { size: "16GB RAM / 1TB SSD", defaultBoost: 550 },
    { size: "32GB RAM / 1TB SSD", defaultBoost: 850 },
    { size: "64GB RAM / 2TB SSD", defaultBoost: 1500 },
  ],
  macbooks: [
    { size: "8GB RAM / 256GB SSD", defaultBoost: 0 },
    { size: "16GB RAM / 512GB SSD", defaultBoost: 350 },
    { size: "16GB RAM / 1TB SSD", defaultBoost: 600 },
    { size: "32GB RAM / 1TB SSD", defaultBoost: 950 },
    { size: "64GB RAM / 2TB SSD", defaultBoost: 1600 },
  ],
  smartwatches: [
    { size: "40mm GPS", defaultBoost: 0 },
    { size: "41mm GPS", defaultBoost: 50 },
    { size: "44mm GPS", defaultBoost: 100 },
    { size: "45mm GPS + Cellular", defaultBoost: 250 },
    { size: "49mm Ultra Cellular", defaultBoost: 600 },
  ],
  watches: [
    { size: "40mm GPS", defaultBoost: 0 },
    { size: "41mm GPS", defaultBoost: 50 },
    { size: "44mm GPS", defaultBoost: 100 },
    { size: "45mm GPS + Cellular", defaultBoost: 250 },
    { size: "49mm Ultra Cellular", defaultBoost: 600 },
  ],
  tablets: [
    { size: "64GB Wi-Fi", defaultBoost: 0 },
    { size: "128GB Wi-Fi", defaultBoost: 100 },
    { size: "256GB Wi-Fi + Cellular", defaultBoost: 250 },
    { size: "512GB Wi-Fi + Cellular", defaultBoost: 450 },
    { size: "1TB Wi-Fi + Cellular", defaultBoost: 750 },
  ],
};

const DEFAULT_PRESETS = [
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

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
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

  // Form states
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

  // RAM & Custom Spec Builder state
  const [customRam, setCustomRam] = useState<string>("");
  const [customSize, setCustomSize] = useState<string>("");
  const [customBoost, setCustomBoost] = useState<number>(0);

  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "", image: "" as string | File });
  const [editingBrandId, setEditingBrandId] = useState<string | number | null>(null);
  const [newBrand, setNewBrand] = useState<{ name: string; slug: string; logo: string | File; categories: string[] }>({ name: "", slug: "", logo: "", categories: [] });
  
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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center flex-col gap-3">
        <RefreshCw className="animate-spin text-emerald-500 w-6 h-6" />
        <p className="text-xs font-semibold text-slate-500">Loading session...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center mb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">SellYourPhone24 Admin</h1>
          <p className="text-xs text-slate-500">Sign in to manage catalog, orders & brands.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === "admin" || user?.primaryEmailAddress?.emailAddress === "shantanukamble.org@gmail.com";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 text-center">
        <div className="border border-rose-200 bg-white rounded-2xl p-6 max-w-sm space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Account (<span className="text-emerald-600 font-semibold">{user?.primaryEmailAddress?.emailAddress}</span>) is not an administrator.
          </p>
          <SignOutButton>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition">
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

  const openAddProductForCategory = (catSlug: string) => {
    setEditingProductId(null);
    const presets = CATEGORY_SPEC_PRESETS[catSlug.toLowerCase()] || DEFAULT_PRESETS;
    setNewProduct({
      name: "",
      brand: brands[0]?.id?.toString() || brands[0]?._id?.toString() || "",
      category: catSlug,
      basePrice: catSlug.includes("laptop") ? 3000 : 1500,
      storages: presets.slice(0, 4).map(p => ({ size: p.size, priceBoost: p.defaultBoost })),
      colors: "Black, Silver, Space Gray",
      description: "",
      shortDescription: "",
      images: { frontView: "", sideView: "", backView: "" },
    });
    setActiveTab("add-product");
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

  const handleToggleBrandCategory = (catId: string) => {
    const updatedCats = newBrand.categories.includes(catId)
      ? newBrand.categories.filter((id) => id !== catId)
      : [...newBrand.categories, catId];
    setNewBrand({ ...newBrand, categories: updatedCats });
  };

  const handleEditBrandClick = (brand: BrandType) => {
    const brandId = brand.id || brand._id || "";
    setEditingBrandId(brandId);
    const catIds = (brand.categories || []).map((c: any) => typeof c === "object" ? (c._id || c.id || "").toString() : c.toString());
    setNewBrand({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo || "",
      categories: catIds,
    });
  };

  const handleCancelBrandEdit = () => {
    setEditingBrandId(null);
    setNewBrand({ name: "", slug: "", logo: "", categories: [] });
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

      if (editingBrandId) {
        await api.updateBrand(editingBrandId, fd, token || undefined);
        toast.success("Brand updated & service categories allocated!");
      } else {
        await api.createBrand(fd, token || undefined);
        toast.success("Brand created & service categories allocated!");
      }

      handleCancelBrandEdit();
      await loadData(false);
    } catch (error) {
      toast.error(editingBrandId ? "Failed to update brand" : "Failed to create brand");
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    if (!confirm("Delete brand?")) return;
    try {
      const token = await getToken();
      await api.deleteBrand(id, token || undefined);
      toast.success("Brand deleted");
      if (editingBrandId === id) handleCancelBrandEdit();
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
      author: blog.author || "Team SellYourPhone24",
    });
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
      toast.error("Required: Title, Slug, Description, Content");
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
        toast.success("Blog post updated");
        setEditingBlogId(null);
      } else {
        await api.createBlog(fd, token || undefined);
        toast.success("Blog post created");
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

  const handleAddCustomSpec = () => {
    if (!customSize.trim() && !customRam) {
      toast.error("Enter RAM or Size spec");
      return;
    }
    const fullSpecStr = customRam ? (customSize.trim() ? `${customRam} / ${customSize.trim()}` : customRam) : customSize.trim();
    const exists = newProduct.storages.some(s => s.size.toLowerCase() === fullSpecStr.toLowerCase());
    if (exists) {
      toast.error("Variant already exists in list");
      return;
    }
    setNewProduct({
      ...newProduct,
      storages: [...newProduct.storages, { size: fullSpecStr, priceBoost: Number(customBoost) || 0 }]
    });
    setCustomSize("");
    setCustomBoost(0);
  };

  // Dynamic category presets based on selected category
  const activeCategoryPresets = CATEGORY_SPEC_PRESETS[newProduct.category.toLowerCase()] || DEFAULT_PRESETS;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-xs pb-16">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sliders size={16} className="text-emerald-500" />
              <span>SellYourPhone24 Admin</span>
            </h1>
            <span className="hidden sm:inline-block text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Quick Category Add Shortcuts */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => openAddProductForCategory("smartphones")}
                className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded text-[11px] font-bold text-slate-700 transition flex items-center gap-1 shadow-sm"
              >
                <Smartphone size={12} className="text-emerald-500" /> + Mobile
              </button>
              <button
                onClick={() => openAddProductForCategory("laptops")}
                className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded text-[11px] font-bold text-slate-700 transition flex items-center gap-1 shadow-sm"
              >
                <Laptop size={12} className="text-emerald-500" /> + Laptop
              </button>
              <button
                onClick={() => openAddProductForCategory("tablets")}
                className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded text-[11px] font-bold text-slate-700 transition flex items-center gap-1 shadow-sm"
              >
                <Tablet size={12} className="text-emerald-500" /> + Tablet
              </button>
              <button
                onClick={() => openAddProductForCategory("smartwatches")}
                className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded text-[11px] font-bold text-slate-700 transition flex items-center gap-1 shadow-sm"
              >
                <Watch size={12} className="text-emerald-500" /> + Watch
              </button>
            </div>

            <button
              onClick={() => openAddProductForCategory("smartphones")}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Product</span>
            </button>

            <button
              onClick={() => loadData(true)}
              className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-emerald-500" : ""} />
            </button>

            <SignOutButton>
              <button className="p-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 transition" title="Sign Out">
                <LogOut size={14} />
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 space-y-4">
        
        {/* Compact Navigation Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveTab("products"); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "products" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Smartphone size={13} /> Products <span className="text-[10px] opacity-75">({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("add-product")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "add-product" ? "bg-slate-900 text-white shadow-sm" : "text-emerald-600 hover:bg-emerald-50 font-bold"
              }`}
            >
              <Plus size={13} /> {editingProductId !== null ? "Edit Product" : "New Product"}
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "orders" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ClipboardList size={13} /> Orders <span className="text-[10px] opacity-75">({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("brands")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "brands" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FolderOpen size={13} /> Brands <span className="text-[10px] opacity-75">({brands.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "categories" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers size={13} /> Categories <span className="text-[10px] opacity-75">({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === "blogs" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
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
            
            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="space-y-3">
                
                {/* Search & Filter Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search product by name, brand..."
                      value={productSearch}
                      onChange={(e) => { setProductSearch(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBrandFilter}
                      onChange={(e) => { setSelectedBrandFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer focus:bg-white"
                    >
                      <option value="all">All Brands ({brands.length})</option>
                      {brands.map((b) => (
                        <option key={b.id || b._id} value={b.name}>{b.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => { setSelectedCategoryFilter(e.target.value); setCurrentPage(1); }}
                      className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none cursor-pointer focus:bg-white"
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
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-medium shadow-sm">
                    No products match your filters.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    
                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                            <th className="py-2.5 px-4 w-12 text-center">Image</th>
                            <th className="py-2.5 px-4">Device Product</th>
                            <th className="py-2.5 px-4">Brand</th>
                            <th className="py-2.5 px-4">Category</th>
                            <th className="py-2.5 px-4">Base Price</th>
                            <th className="py-2.5 px-4">Specs & Variants</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedProducts.map((product) => (
                            <tr key={product.id || product._id} className="hover:bg-slate-50/80 transition">
                              <td className="py-2 px-4 text-center">
                                <div className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden mx-auto flex items-center justify-center">
                                  {product.images?.frontView ? (
                                    <Image src={product.images.frontView} alt={product.name} fill className="object-contain p-0.5" />
                                  ) : (
                                    <Smartphone size={16} className="text-slate-400" />
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-4 font-semibold text-slate-900">
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{product.name}</p>
                                  {product.shortDescription && (
                                    <p className="text-[10px] text-slate-500 line-clamp-1 font-normal">{product.shortDescription}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                                  {product.brand}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-slate-600 font-mono text-[11px]">
                                {product.category}
                              </td>
                              <td className="py-2 px-4 font-bold text-emerald-600">
                                AED {product.basePrice.toLocaleString()}
                              </td>
                              <td className="py-2 px-4">
                                <div className="flex flex-wrap gap-1">
                                  {product.storages?.map((s, idx) => (
                                    <span key={idx} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                      {s.size}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-2 px-4 text-right space-x-1">
                                <button
                                  onClick={() => handleEditProductClick(product)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition"
                                  title="Edit"
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id || product._id || "")}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-200 transition"
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
                    <div className="sm:hidden divide-y divide-slate-100">
                      {paginatedProducts.map((product) => (
                        <div key={product.id || product._id} className="p-3 flex items-center justify-between gap-3">
                          <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {product.images?.frontView ? (
                              <Image src={product.images.frontView} alt={product.name} fill className="object-contain p-0.5" />
                            ) : (
                              <Smartphone size={16} className="text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1 rounded">{product.brand}</span>
                              <h4 className="font-bold text-slate-900 text-xs truncate">{product.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-extrabold text-emerald-600 text-xs">AED {product.basePrice}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({product.category})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditProductClick(product)}
                              className="p-1.5 bg-slate-100 text-slate-700 rounded border border-slate-200"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id || product._id || "")}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded border border-rose-200"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                      <div className="border-t border-slate-200 p-2.5 bg-slate-50 flex justify-between items-center text-xs text-slate-600">
                        <span>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-2.5 py-1 bg-white border border-slate-200 disabled:opacity-40 rounded font-semibold text-slate-700 shadow-sm"
                          >
                            Prev
                          </button>
                          <span className="px-2 font-bold text-slate-800">{currentPage} / {totalPages}</span>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-2.5 py-1 bg-white border border-slate-200 disabled:opacity-40 rounded font-semibold text-slate-700 shadow-sm"
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
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-6 shadow-sm">
                
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {editingProductId !== null ? <Pencil size={15} className="text-emerald-500" /> : <Plus size={15} className="text-emerald-500" />}
                    <span>{editingProductId !== null ? "Edit Device Product" : "Add New Buyback Product"}</span>
                  </h2>

                  <button
                    type="button"
                    onClick={handleCancelProductEdit}
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                </div>

                {/* Device Category Section Selector Bar */}
                <div className="bg-slate-100/90 border border-slate-200 p-2 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} className="text-emerald-500" />
                    <span>Select Creation Category Section:</span>
                  </span>
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => openAddProductForCategory("smartphones")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        newProduct.category.toLowerCase().includes("phone") || newProduct.category.toLowerCase().includes("mobile")
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <Smartphone size={13} className="text-emerald-500" />
                      <span>📱 Mobile Section</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAddProductForCategory("laptops")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        newProduct.category.toLowerCase().includes("laptop") || newProduct.category.toLowerCase().includes("macbook")
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <Laptop size={13} className="text-emerald-500" />
                      <span>💻 Laptops Section</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAddProductForCategory("tablets")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        newProduct.category.toLowerCase().includes("tablet") || newProduct.category.toLowerCase().includes("ipad")
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <Tablet size={13} className="text-emerald-500" />
                      <span>📱 Tablets Section</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAddProductForCategory("smartwatches")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        newProduct.category.toLowerCase().includes("watch")
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      <Watch size={13} className="text-emerald-500" />
                      <span>⌚ Smartwatches Section</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder={
                          newProduct.category.includes("laptop") ? "e.g. MacBook Pro M3 / Dell XPS 15" :
                          newProduct.category.includes("watch") ? "e.g. Apple Watch Ultra 2 / Galaxy Watch 6" :
                          newProduct.category.includes("tablet") ? "e.g. iPad Pro 12.9 / Galaxy Tab S9" :
                          "e.g. Galaxy S24 Ultra / iPhone 15 Pro"
                        }
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brand *</label>
                      <select
                        required
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 outline-none focus:border-emerald-500 cursor-pointer focus:bg-white"
                      >
                        <option value="">Select Brand</option>
                        {brands.map((b) => (
                          <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category *</label>
                      <select
                        required
                        value={newProduct.category}
                        onChange={(e) => {
                          const catSlug = e.target.value;
                          const presets = CATEGORY_SPEC_PRESETS[catSlug.toLowerCase()] || DEFAULT_PRESETS;
                          setNewProduct({
                            ...newProduct,
                            category: catSlug,
                            storages: presets.slice(0, 4).map(p => ({ size: p.size, priceBoost: p.defaultBoost }))
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 outline-none focus:border-emerald-500 cursor-pointer focus:bg-white font-bold"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Base Valuation Price (AED) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="e.g. 1800"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-emerald-600 font-bold outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Color Variants (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Titanium Black, Titanium Violet"
                        value={newProduct.colors}
                        onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Flexible Specifications & RAM / Storage / UOM Customizer */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <Cpu size={14} className="text-emerald-500" />
                          <span>Specifications & Variants (RAM / Storage / Size)</span>
                        </span>
                        <p className="text-[10px] text-slate-500">Select quick presets or create custom RAM, SSD, or Watch Case specs below.</p>
                      </div>
                    </div>

                    {/* Quick Category Presets */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category Quick Presets ({newProduct.category})</span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
                        {activeCategoryPresets.map((preset) => (
                          <button
                            key={preset.size}
                            type="button"
                            onClick={() => handleAddStoragePreset(preset)}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[10px] font-semibold text-slate-700 rounded border border-slate-200 transition"
                          >
                            + {preset.size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Spec Builder */}
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-2">
                      <span className="text-[10px] font-bold text-slate-700 block uppercase">Create Custom RAM & Storage / UOM Spec</span>
                      <div className="grid sm:grid-cols-12 gap-2 items-center">
                        
                        <div className="sm:col-span-3">
                          <select
                            value={customRam}
                            onChange={(e) => setCustomRam(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 outline-none"
                          >
                            <option value="">RAM (Optional)</option>
                            <option value="4GB RAM">4GB RAM</option>
                            <option value="6GB RAM">6GB RAM</option>
                            <option value="8GB RAM">8GB RAM</option>
                            <option value="12GB RAM">12GB RAM</option>
                            <option value="16GB RAM">16GB RAM</option>
                            <option value="32GB RAM">32GB RAM</option>
                            <option value="64GB RAM">64GB RAM</option>
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Storage / Size (e.g. 256GB / 512GB SSD / 45mm GPS)"
                            value={customSize}
                            onChange={(e) => setCustomSize(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            placeholder="Price Boost (AED)"
                            value={customBoost === 0 ? "" : customBoost}
                            onChange={(e) => setCustomBoost(Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-emerald-600 font-bold outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={handleAddCustomSpec}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded text-[11px] transition shadow-sm"
                          >
                            + Add Spec
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Added Spec Variants List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-600 block">Active Specification Variants ({newProduct.storages.length})</span>
                      {newProduct.storages.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Spec / Variant Name"
                            value={s.size}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].size = e.target.value;
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="w-1/2 bg-white border border-slate-200 rounded p-1.5 text-slate-900 font-semibold"
                          />
                          <input
                            type="number"
                            placeholder="Price Boost (AED)"
                            value={s.priceBoost === 0 ? "" : s.priceBoost}
                            onChange={(e) => {
                              const updated = [...newProduct.storages];
                              updated[idx].priceBoost = Number(e.target.value);
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="w-1/3 bg-white border border-slate-200 rounded p-1.5 text-emerald-600 font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newProduct.storages.filter((_, i) => i !== idx);
                              setNewProduct({ ...newProduct, storages: updated });
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200"
                            title="Remove Variant"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Snapdragon 8 Gen 3, Dynamic LTPO AMOLED 2X, Titanium Frame..."
                      value={newProduct.shortDescription}
                      onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Front Image *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, frontView: e.target.files[0] } });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Side Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, sideView: e.target.files[0] } });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Back Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setNewProduct({ ...newProduct, images: { ...newProduct.images, backView: e.target.files[0] } });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelProductEdit}
                      className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-200"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submittingProduct}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition shadow-sm cursor-pointer"
                    >
                      {submittingProduct ? "Saving..." : (editingProductId !== null ? "Update Product" : "Publish Product")}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-sm">
                  <span className="font-bold text-slate-900 text-xs">Buyback Orders ({filteredOrders.length})</span>
                  
                  <div className="flex gap-1 overflow-x-auto">
                    {["all", "pending", "pickup_assigned", "inspected", "completed", "cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStatusFilter(st)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition ${
                          selectedStatusFilter === st ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {st.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 font-medium shadow-sm">
                    No orders match status filter.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order._id;
                      return (
                        <div key={order._id} className="transition">
                          
                          <div 
                            onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                            className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button className="text-slate-400">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                              <div>
                                <p className="font-bold text-slate-900 text-xs">{order.customerDetails.name} <span className="text-slate-500 text-[10px] font-normal">({order.customerDetails.phone})</span></p>
                                <p className="text-[10px] text-slate-500 font-mono">{order._id} • {new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-emerald-600 text-xs">AED {order.totalPayout.toLocaleString()}</span>
                              
                              <select
                                value={order.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border outline-none cursor-pointer ${statusColors[order.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="pickup_assigned">Assigned</option>
                                <option value="inspected">Inspected</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs text-slate-700">
                              <div className="grid sm:grid-cols-3 gap-3">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Details</p>
                                  <p className="font-semibold text-slate-900">{order.customerDetails.name}</p>
                                  <p>{order.customerDetails.phone}</p>
                                  <p className="text-slate-500">{order.customerDetails.email}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Doorstep Pickup</p>
                                  <p className="font-semibold text-slate-900">{order.pickupSchedule.pickupDate}</p>
                                  <p>{order.pickupSchedule.pickupTime}</p>
                                  <p className="text-slate-500">{order.customerDetails.address}, {order.customerDetails.city}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Payment</p>
                                  <p className="font-bold text-emerald-600 capitalize">{order.paymentMethod} Payout</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Devices</p>
                                <div className="space-y-1">
                                  {order.devices.map((d, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                      <span><strong className="text-slate-900">{d.name}</strong> ({d.brand} • {d.selectedStorage} • {d.selectedColor} • {d.selectedCondition})</span>
                                      <span className="font-bold text-emerald-600">AED {d.calculatedPrice}</span>
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
                <div className="sm:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs">Brands & Category Allocations ({brands.length})</h3>
                    <p className="text-[10px] text-slate-400">Click Pencil icon to Edit & Allocate Categories</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {brands.map((b) => (
                      <div key={b.id || b._id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col justify-between gap-2 hover:border-emerald-300 transition">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{b.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">{b.slug}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditBrandClick(b)}
                              className="text-emerald-600 p-1 hover:bg-emerald-50 rounded cursor-pointer"
                              title="Edit Brand & Allocate Categories"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(b.id || b._id || "")}
                              className="text-rose-600 p-1 hover:bg-rose-50 rounded cursor-pointer"
                              title="Delete Brand"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {b.categories && b.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 border-t border-slate-200 pt-1.5">
                            {b.categories.map((c: any, idx) => (
                              <span key={idx} className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                                {typeof c === "object" ? c.name : c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="border-t border-slate-200 pt-1">
                            <span className="text-[8px] text-amber-600 font-medium">⚠️ No categories allocated</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {editingBrandId ? "Edit Brand & Allocations" : "Add New Brand"}
                    </h3>
                    {editingBrandId && (
                      <button
                        onClick={handleCancelBrandEdit}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCreateBrand} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brand Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apple, Samsung, Google"
                        value={newBrand.name}
                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Brand Slug</label>
                      <input
                        type="text"
                        placeholder="Leave blank to auto-generate"
                        value={newBrand.slug}
                        onChange={(e) => setNewBrand({ ...newBrand, slug: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Logo File or Emoji</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setNewBrand({ ...newBrand, logo: e.target.files[0] }); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Allocate to Service Categories</label>
                      <p className="text-[10px] text-slate-400 mb-1.5">Select which service categories this brand belongs to (e.g. Mobile, Laptops, Tablets, Smartwatches):</p>
                      <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto border border-slate-200 p-2.5 rounded bg-slate-50">
                        {categories.map((cat) => {
                          const catId = (cat._id || cat.id || "").toString();
                          const isChecked = newBrand.categories.includes(catId);
                          return (
                            <label key={catId} className="flex items-center gap-1.5 text-[10px] text-slate-700 cursor-pointer select-none font-medium hover:text-emerald-600">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleBrandCategory(catId)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                              {cat.name}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {editingBrandId && (
                        <button
                          type="button"
                          onClick={handleCancelBrandEdit}
                          className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className={`${editingBrandId ? "w-2/3" : "w-full"} bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded transition shadow-sm cursor-pointer`}
                      >
                        {editingBrandId ? "Save Allocations" : "Add Brand"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === "categories" && (
              <div className="grid sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs">Categories ({categories.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((c) => (
                      <div key={c.slug} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{c.slug}</p>
                        </div>
                        <button onClick={() => handleDeleteCategory(c.id || c._id || c.slug)} className="text-rose-600 p-1 hover:bg-rose-50 rounded">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs">Add New Category</h3>
                  <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Laptops"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Slug *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. laptops"
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category Image *</label>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setNewCategory({ ...newCategory, image: e.target.files[0] }); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        placeholder="Overview..."
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none resize-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded transition shadow-sm cursor-pointer">
                      Add Category
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === "blogs" && (
              <div className="grid sm:grid-cols-12 gap-4">
                
                {/* Blog Post List */}
                <div className="sm:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs">Blogs & Articles ({blogs.length})</h3>
                  {blogs.length === 0 ? (
                    <p className="text-slate-500 text-[11px] text-center py-6">No blog articles published yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {blogs.map((b) => (
                        <div key={b.slug} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{b.title}</h4>
                            <p className="text-[10px] text-emerald-600 font-semibold">{b.category} <span className="text-slate-400 font-mono">({b.slug})</span></p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditBlogClick(b)}
                              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded border border-slate-200"
                              title="Edit Article"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id || b._id || "")}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded border border-rose-200"
                              title="Delete Article"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add / Edit Blog Form */}
                <div className="sm:col-span-5 bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {editingBlogId !== null ? "Edit Blog Post" : "Add New Blog Article"}
                    </h3>
                    {editingBlogId !== null && (
                      <button onClick={handleCancelBlogEdit} className="text-[10px] text-rose-600 hover:underline">
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCreateBlog} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. How to sell your phone safely"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">URL Slug *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. how-to-sell-phone"
                        value={newBlog.slug}
                        onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none font-mono focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category</label>
                      <select
                        value={newBlog.category}
                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none cursor-pointer focus:bg-white"
                      >
                        <option value="Buying Guides">Buying Guides</option>
                        <option value="Recycling Tips">Recycling Tips</option>
                        <option value="Price Analysis">Price Analysis</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Cover Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { if (e.target.files?.[0]) setNewBlog({ ...newBlog, img: e.target.files[0] }); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Short Excerpt / Snippet *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Brief summary..."
                        value={newBlog.desc}
                        onChange={(e) => setNewBlog({ ...newBlog, desc: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none resize-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Content (Markdown) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Markdown content..."
                        value={newBlog.content}
                        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-900 outline-none resize-none font-mono text-[11px] focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded transition shadow-sm cursor-pointer">
                      {editingBlogId !== null ? "Update Blog Post" : "Publish Article"}
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
