"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBag, 
  Smartphone, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  RefreshCw, 
  ArrowDownToLine, 
  ExternalLink, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Package, 
  DollarSign, 
  Truck, 
  FileSpreadsheet, 
  ArrowLeftRight, 
  Layers, 
  Sparkles,
  Eye,
  LogOut,
  Sliders,
  Send,
  Laptop,
  Tablet,
  Watch,
  Gamepad2,
  FolderPlus,
  SlidersHorizontal,
  Pencil,
  Tag,
  ChevronRight
} from "lucide-react";
import { useUser, useAuth, SignIn, SignOutButton } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { BuyProductType, BuyOrderType, ProductType, BuyProductConditionType, BuyProductStatusType, BrandType, CategoryType } from "@/types";

export default function BuyPhonesAdminPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [activeTab, setActiveTab] = useState<"products" | "categories" | "brands" | "orders" | "sheets">("products");
  const [loading, setLoading] = useState(true);

  // Products state & filters
  const [buyProducts, setBuyProducts] = useState<BuyProductType[]>([]);
  const [tradeInProducts, setTradeInProducts] = useState<ProductType[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  // Orders state
  const [orders, setOrders] = useState<BuyOrderType[]>([]);
  const [orderSearchFilter, setOrderSearchFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<BuyOrderType | null>(null);
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  // Categories CRUD state
  const [categoriesList, setCategoriesList] = useState<CategoryType[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    slug: string;
    description: string;
    image: string | File;
  }>({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  // Brands CRUD state
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [newBrand, setNewBrand] = useState<{
    name: string;
    slug: string;
    logo: string | File;
    categories: string[];
    isFeaturedOnFrontpage: boolean;
    frontpageDisplayName: string;
    displayOrder: number;
  }>({
    name: "",
    slug: "",
    logo: "",
    categories: [],
    isFeaturedOnFrontpage: false,
    frontpageDisplayName: "",
    displayOrder: 0,
  });

  // Modal / Product Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formSource, setFormSource] = useState<"custom" | "import">("custom");
  const [selectedTradeInProduct, setSelectedTradeInProduct] = useState("");

  // Product Form Fields (Cascading Hierarchy: Category -> Brand -> Specs)
  const [brandsList, setBrandsList] = useState<BrandType[]>([]);
  const [brandId, setBrandId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [category, setCategory] = useState("smartphones");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number>(3499);
  const [condition, setCondition] = useState<BuyProductConditionType>("Pristine (Like New)");
  const [status, setStatus] = useState<BuyProductStatusType>("published");
  const [batteryHealth, setBatteryHealth] = useState("98% (Original OEM)");
  const [warranty, setWarranty] = useState("12 Months Comprehensive Store Warranty");
  const [stock, setStock] = useState<number>(3);
  const [frontImage, setFrontImage] = useState<string | File>("/products/iphone-pro-max.jpg");
  const [sideImage, setSideImage] = useState<string | File>("/products/iphone (1).jpg");
  const [backImage, setBackImage] = useState<string | File>("/products/iphone (2).jpg");
  const [storageInput, setStorageInput] = useState("128GB, 256GB, 512GB");
  const [colorsInput, setColorsInput] = useState("Natural Titanium, Black Titanium");
  const [isFeatured, setIsFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const getPreviewUrl = (imgSrc: string | File): string => {
    if (!imgSrc) return "";
    if (imgSrc instanceof File) {
      try {
        return URL.createObjectURL(imgSrc);
      } catch (e) {
        return "";
      }
    }
    return imgSrc;
  };

  const allowedAdminEmails = [
    "shantanukamble.org@gmail.com",
    "ibrahimmwn2012@gmail.com",
    "sellphone24phone@gmail.com",
    "mesouq2@gmail.com"
  ];

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  const isAdmin = user?.publicMetadata?.role === "admin" || allowedAdminEmails.includes(userEmail);

  // Load initial data
  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const token = await getToken();
      const [prods, tradeIns, ords, brands, cats] = await Promise.all([
        api.getBuyProducts({ includeDrafts: true }),
        api.getProducts().catch(() => []),
        api.getBuyOrders(token || undefined).catch(() => []),
        api.getBrands().catch(() => []),
        api.getCategories().catch(() => []),
      ]);
      setBuyProducts(prods);
      setTradeInProducts(tradeIns);
      setOrders(ords);
      setBrandsList(brands);
      if (cats && cats.length > 0) {
        setCategoriesList(cats);
      } else {
        setCategoriesList([
          { id: "smartphones", name: "Smartphones", slug: "smartphones", description: "Certified Flagships & Smartphones", image: "/products/iphone-pro-max.jpg" },
          { id: "laptops", name: "Laptops", slug: "laptops", description: "MacBooks & Windows Laptops", image: "/products/macbook-pro.webp" },
          { id: "tablets", name: "Tablets", slug: "tablets", description: "iPads & Galaxy Tabs", image: "/products/ipad-pro-m4.webp" },
          { id: "smartwatches", name: "Smartwatches", slug: "smartwatches", description: "Apple Watch & Wearables", image: "/products/apple-watch-ultra.webp" },
          { id: "games", name: "Gaming & Consoles", slug: "games", description: "PlayStation, Xbox & Nintendo Consoles", image: "/products/gaming-console.webp" },
        ]);
      }
    } catch (err: any) {
      toast.error("Failed to sync Buy Phones data");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && isAdmin) {
      loadData(true);
    }
  }, [isLoaded, isSignedIn, isAdmin]);

  // Hierarchical cascading helper: checks if a brand belongs to a selected category
  const matchBrandToCategory = (b: BrandType, catSlug: string): boolean => {
    if (!catSlug || catSlug === "all") return true;
    const s = catSlug.toLowerCase().trim();
    
    // 1. Direct check in brand.categories array
    if (Array.isArray(b.categories) && b.categories.length > 0) {
      const matched = b.categories.some((c: any) => {
        if (!c) return false;
        if (typeof c === "string") {
          const cLower = c.toLowerCase().trim();
          return cLower === s ||
            (s === "smartphones" && (cLower === "mobile" || cLower === "phones")) ||
            (s === "laptops" && (cLower === "macbooks" || cLower === "computers")) ||
            (s === "tablets" && cLower === "ipads") ||
            (s === "smartwatches" && cLower === "watches") ||
            (s === "games" && (cLower === "gaming" || cLower === "consoles"));
        }
        if (typeof c === "object") {
          const slug = (c.slug || "").toLowerCase().trim();
          const name = (c.name || "").toLowerCase().trim();
          return slug === s || name === s ||
            (s === "smartphones" && (slug === "mobile" || slug === "phones")) ||
            (s === "laptops" && (slug === "macbooks" || slug === "computers")) ||
            (s === "tablets" && slug === "ipads") ||
            (s === "smartwatches" && slug === "watches") ||
            (s === "games" && (slug === "gaming" || slug === "consoles"));
        }
        return false;
      });
      if (matched) return true;
    }

    // 2. Intelligent domain defaults based on brand name
    const bName = (b.name || "").toLowerCase().trim();
    if (bName.includes("apple")) {
      return ["smartphones", "laptops", "tablets", "smartwatches"].includes(s);
    }
    if (bName.includes("samsung")) {
      return ["smartphones", "tablets", "smartwatches"].includes(s);
    }
    if (bName.includes("dell") || bName.includes("hp") || bName.includes("lenovo") || bName.includes("asus") || bName.includes("acer")) {
      return s === "laptops";
    }
    if (bName.includes("sony") || bName.includes("nintendo") || bName.includes("xbox") || bName.includes("playstation")) {
      return s === "games" || s === "gaming";
    }
    if (bName.includes("google") || bName.includes("oneplus") || bName.includes("xiaomi") || bName.includes("huawei") || bName.includes("oppo") || bName.includes("vivo")) {
      return s === "smartphones" || s === "tablets";
    }
    if (bName.includes("garmin")) {
      return s === "smartwatches";
    }
    return true;
  };

  // Filtered brands for modal based on selected category
  const filteredBrandsForSelectedCategory = useMemo(() => {
    const matching = brandsList.filter(b => matchBrandToCategory(b, category));
    return matching.length > 0 ? matching : brandsList;
  }, [brandsList, category]);

  // Handle category change in product form modal
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const matching = brandsList.filter(b => matchBrandToCategory(b, newCat));
    if (matching.length > 0 && !matching.some(b => b.name.toLowerCase() === brand.toLowerCase())) {
      setBrand(matching[0].name);
      setBrandId(String(matching[0].id || matching[0]._id || ""));
    }
  };

  // Helper for category badge visual icon
  const getCategoryIcon = (slug?: string) => {
    const s = (slug || "").toLowerCase();
    if (s.includes("laptop") || s.includes("macbook")) return <Laptop size={13} className="text-blue-500" />;
    if (s.includes("tablet") || s.includes("ipad")) return <Tablet size={13} className="text-purple-500" />;
    if (s.includes("watch")) return <Watch size={13} className="text-amber-500" />;
    if (s.includes("game") || s.includes("playstation") || s.includes("console")) return <Gamepad2 size={13} className="text-rose-500" />;
    return <Smartphone size={13} className="text-emerald-500" />;
  };

  // Filtered lists (defined at top to satisfy React Rules of Hooks)
  const filteredProducts = useMemo(() => {
    return buyProducts.filter((p) => {
      const q = searchFilter.toLowerCase().trim();
      const matchesSearch = !q || 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || (p.category || "smartphones").toLowerCase() === categoryFilter.toLowerCase();
      const matchesBrand = brandFilter === "all" || p.brand.toLowerCase() === brandFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
    });
  }, [buyProducts, searchFilter, statusFilter, categoryFilter, brandFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = orderSearchFilter.toLowerCase().trim();
      const matchesSearch = !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerDetails.name.toLowerCase().includes(q) ||
        o.customerDetails.phone.includes(q) ||
        o.customerDetails.city.toLowerCase().includes(q);
      const matchesStatus = orderStatusFilter === "all" || o.orderStatus === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchFilter, orderStatusFilter]);

  // Aggregate Metrics
  const totalStockUnits = buyProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryValue = buyProducts.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // Auth Guard
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-3">
        <RefreshCw className="animate-spin text-emerald-500 w-6 h-6" />
        <p className="text-xs font-semibold text-slate-500">Verifying administrator session...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4 text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Buy Phones Admin Portal</h1>
          <p className="text-xs text-slate-500">Sign in to manage retail smartphone inventory, orders & Google Sheets.</p>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="border border-rose-200 bg-white rounded-2xl p-6 max-w-sm space-y-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Account (<span className="text-emerald-600 font-semibold">{user?.primaryEmailAddress?.emailAddress}</span>) does not have administrator privileges for the Buy Phones Portal.
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

  // 1-Click Import Handler
  const handleSelectTradeInToImport = (productId: string) => {
    setSelectedTradeInProduct(productId);
    const found = tradeInProducts.find((p) => String(p.id) === productId || String(p._id) === productId);
    if (!found) return;

    setTitle(found.name);
    setBrand(found.brand || "Apple");
    setCategory(found.category || "smartphones");
    const matchedBrand = brandsList.find(
      (b) => b.name.toLowerCase() === (found.brand || "").toLowerCase()
    );
    if (matchedBrand) {
      setBrandId(String(matchedBrand.id || matchedBrand._id));
      setBrand(matchedBrand.name);
    } else {
      setBrandId("");
    }
    setModel(found.name);
    // Set 30% retail markup over trade-in valuation price
    const baseTradePrice = found.basePrice || 2000;
    setPrice(Math.round(baseTradePrice * 1.3));
    setOriginalPrice(Math.round(baseTradePrice * 1.8));
    setFrontImage(found.images?.frontView || "/products/iphone-pro-max.jpg");
    setSideImage(found.images?.sideView || found.images?.frontView || "/products/iphone (1).jpg");
    setBackImage(found.images?.backView || found.images?.frontView || "/products/iphone (2).jpg");
    setDescription(found.description || found.shortDescription || "");
    setStatus("published");
    setBatteryHealth("98% (Original OEM)");
    setWarranty("12 Months Comprehensive Store Warranty");
    setStock(3);
    setSeoTitle(`Buy Certified Pre-Owned ${found.name} in Dubai - 12M Warranty`);
    setSeoDescription(`Buy certified pre-owned ${found.name} with 12 months warranty, tested 32-point inspection, and instant free delivery in UAE.`);

    if (found.storages && found.storages.length > 0) {
      setStorageInput(found.storages.map((s) => s.size).join(", "));
    }
    if (found.colors && found.colors.length > 0) {
      setColorsInput(found.colors.join(", "));
    }
  };

  const handleOpenAddForm = (source: "custom" | "import" = "custom") => {
    setEditingId(null);
    setFormSource(source);
    setSelectedTradeInProduct("");
    setTitle("");
    const initialCategory = "smartphones";
    setCategory(initialCategory);
    const matchingBrands = brandsList.filter(b => matchBrandToCategory(b, initialCategory));
    const defaultBrand = matchingBrands[0]?.name || brandsList[0]?.name || "Apple";
    const defaultBrandId = matchingBrands[0] 
      ? String(matchingBrands[0].id || matchingBrands[0]._id) 
      : (brandsList[0] ? String(brandsList[0].id || brandsList[0]._id) : "");
    setBrand(defaultBrand);
    setBrandId(defaultBrandId);
    setModel("");
    setPrice(2499);
    setOriginalPrice(3499);
    setCondition("Pristine (Like New)");
    setStatus("published");
    setBatteryHealth("98% (Original OEM)");
    setWarranty("12 Months Comprehensive Store Warranty");
    setStock(3);
    setFrontImage("/products/iphone-pro-max.jpg");
    setSideImage("/products/iphone (1).jpg");
    setBackImage("/products/iphone (2).jpg");
    setStorageInput("128GB, 256GB, 512GB");
    setColorsInput("Natural Titanium, Black Titanium");
    setIsFeatured(false);
    setDescription("");
    setSeoTitle("");
    setSeoDescription("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: BuyProductType) => {
    setEditingId(String(item.id || item._id));
    setFormSource("custom");
    setTitle(item.title);
    setBrand(item.brand);
    setCategory(item.category || "smartphones");
    const refId = typeof item.brandRef === "object" ? item.brandRef?._id || item.brandRef?.id : item.brandRef;
    if (refId) {
      setBrandId(String(refId));
    } else {
      const matched = brandsList.find((b) => b.name.toLowerCase() === (item.brand || "").toLowerCase());
      setBrandId(matched ? String(matched.id || matched._id) : "");
    }
    setModel(item.model || item.title);
    setPrice(item.price);
    setOriginalPrice(item.originalPrice || Math.round(item.price * 1.3));
    setCondition(item.condition);
    setStatus(item.status || "published");
    setBatteryHealth(item.batteryHealth || "95%+");
    setWarranty(item.warranty || "12 Months Comprehensive Store Warranty");
    setStock(item.stock ?? 1);
    setFrontImage(item.images?.frontView || "/products/iphone-pro-max.jpg");
    setSideImage(item.images?.sideView || item.images?.frontView || "/products/iphone (1).jpg");
    setBackImage(item.images?.backView || item.images?.frontView || "/products/iphone (2).jpg");
    setStorageInput((item.storages || []).map((s) => s.size).join(", ") || "128GB, 256GB");
    setColorsInput((item.colors || []).join(", ") || "Natural Titanium");
    setIsFeatured(!!item.isFeatured);
    setDescription(item.description || "");
    setSeoTitle(item.seoMetadata?.metaTitle || "");
    setSeoDescription(item.seoMetadata?.metaDescription || "");
    setIsFormOpen(true);
  };

  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const storagesParsed = storageInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((size, idx) => ({
          size,
          priceBoost: idx * 250,
        }));

      const colorsParsed = colorsInput.split(",").map((c) => c.trim()).filter(Boolean);

      // Build FormData for multipart upload
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("brand", brand.trim());
      if (brandId) {
        fd.append("brandRef", brandId);
        fd.append("brandId", brandId);
      }
      fd.append("model", (model || title).trim());
      fd.append("category", (category || "smartphones").trim());
      fd.append("price", String(price));
      fd.append("originalPrice", String(originalPrice));
      fd.append("condition", condition);
      fd.append("status", status);
      fd.append("batteryHealth", batteryHealth);
      fd.append("warranty", warranty);
      fd.append("stock", String(stock));
      fd.append("isAvailable", String(status === "published" && Number(stock) > 0));
      fd.append("isFeatured", String(isFeatured));
      fd.append("description", description.trim());
      fd.append("storages", JSON.stringify(storagesParsed.length > 0 ? storagesParsed : [{ size: "128GB", priceBoost: 0 }]));
      fd.append("colors", JSON.stringify(colorsParsed.length > 0 ? colorsParsed : ["Standard"]));
      fd.append("seoMetadata", JSON.stringify({
        metaTitle: seoTitle.trim(),
        metaDescription: seoDescription.trim(),
        keywords: [brand, model, category, "buy phone dubai", "certified pre-owned"],
      }));

      // Append 3 image slots (File objects or existing URLs)
      if (frontImage instanceof File) {
        fd.append("images[frontView]", frontImage);
      } else if (typeof frontImage === "string" && frontImage) {
        fd.append("frontView", frontImage);
      }

      if (sideImage instanceof File) {
        fd.append("images[sideView]", sideImage);
      } else if (typeof sideImage === "string" && sideImage) {
        fd.append("sideView", sideImage);
      }

      if (backImage instanceof File) {
        fd.append("images[backView]", backImage);
      } else if (typeof backImage === "string" && backImage) {
        fd.append("backView", backImage);
      }

      if (editingId) {
        // STRICT SCHEMA ISOLATION: Updates exclusively the BuyProduct record in buyproducts collection.
        // Trade-in products and pricing in the products collection are NEVER touched.
        await api.updateBuyProduct(editingId, fd, token || undefined);
        toast.success("Buy Phone listing updated (Sell Phones catalog remains untouched)");
      } else {
        // STRICT SCHEMA ISOLATION: Creates exclusively in buyproducts collection.
        await api.createBuyProduct(fd, token || undefined);
        toast.success("New phone published to /buy-phones catalog");
      }

      setIsFormOpen(false);
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save product listing");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const token = await getToken();
      await api.deleteBuyProduct(String(id), token || undefined);
      toast.success("Product deleted");
      await loadData(false);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // =========================================================================
  // CATEGORIES CRUD OPERATIONS
  // =========================================================================
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.slug.trim()) {
      toast.error("Category name and slug are required");
      return;
    }
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newCategory.name.trim());
      fd.append("slug", newCategory.slug.toLowerCase().trim());
      fd.append("description", newCategory.description.trim());
      if (newCategory.image instanceof File) fd.append("image", newCategory.image);
      else if (newCategory.image) fd.append("image", newCategory.image);

      if (editingCategoryId) {
        await api.updateCategory(editingCategoryId, fd, token || undefined);
        toast.success("Main Category updated successfully!");
      } else {
        await api.createCategory(fd, token || undefined);
        toast.success("New Main Category created successfully!");
      }
      handleCancelCategoryEdit();
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleEditCategoryClick = (cat: CategoryType) => {
    const catId = String(cat.id || cat._id || cat.slug);
    setEditingCategoryId(catId);
    setNewCategory({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
    });
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setNewCategory({ name: "", slug: "", description: "", image: "" });
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this category? Devices in this category will remain in the database.")) return;
    try {
      const token = await getToken();
      await api.deleteCategory(id, token || undefined);
      toast.success("Category deleted");
      if (editingCategoryId === String(id)) handleCancelCategoryEdit();
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  // =========================================================================
  // BRANDS CRUD OPERATIONS & MULTI-CATEGORY MAPPINGS
  // =========================================================================
  const handleToggleBrandCategory = (catId: string) => {
    const updated = newBrand.categories.includes(catId)
      ? newBrand.categories.filter((id) => id !== catId)
      : [...newBrand.categories, catId];
    setNewBrand({ ...newBrand, categories: updated });
  };

  const handleEditBrandClick = (b: BrandType) => {
    const bId = String(b.id || b._id || "");
    setEditingBrandId(bId);
    const catIds = (b.categories || []).map((c: any) =>
      typeof c === "object" ? String(c._id || c.id || c.slug) : String(c)
    );
    setNewBrand({
      name: b.name,
      slug: b.slug,
      logo: b.logo || "",
      categories: catIds,
      isFeaturedOnFrontpage: Boolean(b.isFeaturedOnFrontpage),
      frontpageDisplayName: b.frontpageDisplayName || "",
      displayOrder: b.displayOrder || 0,
    });
  };

  const handleCancelBrandEdit = () => {
    setEditingBrandId(null);
    setNewBrand({
      name: "",
      slug: "",
      logo: "",
      categories: [],
      isFeaturedOnFrontpage: false,
      frontpageDisplayName: "",
      displayOrder: 0,
    });
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", newBrand.name.trim());
      fd.append("slug", newBrand.slug || newBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      if (newBrand.logo instanceof File) fd.append("logo", newBrand.logo);
      else if (newBrand.logo) fd.append("logo", newBrand.logo);
      fd.append("categories", JSON.stringify(newBrand.categories));
      fd.append("isFeaturedOnFrontpage", String(newBrand.isFeaturedOnFrontpage));
      fd.append("frontpageDisplayName", newBrand.frontpageDisplayName.trim());
      fd.append("displayOrder", String(newBrand.displayOrder));

      if (editingBrandId) {
        await api.updateBrand(editingBrandId, fd, token || undefined);
        toast.success("Brand updated & category mappings saved!");
      } else {
        await api.createBrand(fd, token || undefined);
        toast.success("Brand created & allocated to categories!");
      }
      handleCancelBrandEdit();
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save brand");
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const token = await getToken();
      await api.deleteBrand(id, token || undefined);
      toast.success("Brand deleted");
      if (editingBrandId === String(id)) handleCancelBrandEdit();
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete brand");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await getToken();
      const res = await api.updateBuyOrderStatus(orderId, { orderStatus: newStatus }, token || undefined);
      if (res.success) {
        toast.success(`Order #${res.order.orderNumber} updated to ${newStatus}`);
        setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
        if (selectedOrder?._id === orderId) setSelectedOrder(res.order);
      }
    } catch (err: any) {
      toast.error("Failed to update order status");
    }
  };

  const handleRetryGoogleSheets = async (orderId: string) => {
    setSyncingOrderId(orderId);
    try {
      const token = await getToken();
      const res = await api.retryBuyOrderSheetsSync(orderId, token || undefined);
      if (res.success) {
        toast.success("Synced to Google Sheets successfully!");
      } else {
        toast.warn("Sync attempted: " + res.message);
      }
      await loadData(false);
    } catch (err: any) {
      toast.error("Google Sheets retry failed");
    } finally {
      setSyncingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans text-xs pb-16">
      
      {/* Top Header Bar with Portal Switcher */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">Buy Phones Admin</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Retail Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Certified Pre-Owned Inventory & Customer Purchases</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Switcher Button to Sell Phones Admin */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200"
              title="Switch to trade-in sell inquiries portal"
            >
              <Sliders size={13} className="text-emerald-600" />
              <span>Switch to Sell Phones Admin</span>
            </Link>

            <a
              href="/buy-phones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition border border-emerald-200"
            >
              <ExternalLink size={13} />
              <span>View Live Store</span>
            </a>

            <button
              onClick={() => loadData(true)}
              className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-emerald-500" : ""} />
            </button>

            <SignOutButton>
              <button className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 transition" title="Sign Out">
                <LogOut size={14} />
              </button>
            </SignOutButton>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 space-y-5">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === "products"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Smartphone size={14} />
              <span>Catalog & Inventory ({buyProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === "categories"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FolderPlus size={14} className="text-blue-500" />
              <span>Main Categories ({categoriesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("brands")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === "brands"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Layers size={14} className="text-purple-500" />
              <span>Brands & Allocations ({brandsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === "orders"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag size={14} />
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("sheets")}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 text-xs cursor-pointer ${
                activeTab === "sheets"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileSpreadsheet size={14} className="text-emerald-500" />
              <span>Google Sheets Integration</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "products" && (
              <>
                <button
                  onClick={() => handleOpenAddForm("import")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowDownToLine size={13} />
                  <span>1-Click Import from Trade-In</span>
                </button>
                <button
                  onClick={() => handleOpenAddForm("custom")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Certified Device</span>
                </button>
              </>
            )}
            {activeTab === "categories" && (
              <button
                onClick={() => {
                  handleCancelCategoryEdit();
                  const formEl = document.getElementById("category-form-section");
                  if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Main Category</span>
              </button>
            )}
            {activeTab === "brands" && (
              <button
                onClick={() => {
                  handleCancelBrandEdit();
                  const formEl = document.getElementById("brand-form-section");
                  if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Brand</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: PRODUCTS & INVENTORY
           ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-4">
            
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Total Listings</div>
                  <div className="text-2xl font-black text-slate-900">{buyProducts.length}</div>
                </div>
                <Smartphone className="w-8 h-8 text-emerald-500 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Available Units in Stock</div>
                  <div className="text-2xl font-black text-slate-900">{totalStockUnits}</div>
                </div>
                <Package className="w-8 h-8 text-teal-500 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Total Inventory Value</div>
                  <div className="text-2xl font-black text-slate-900">AED {totalInventoryValue.toLocaleString()}</div>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600 opacity-80" />
              </div>
            </div>

            {/* Filter Row: Search + Department + Brand + Status */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search listings by title, model, or brand..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Department / Category Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Department:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setBrandFilter("all");
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">All Departments ({categoriesList.length})</option>
                  {categoriesList.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter (Dynamically filtered by Category) */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Brand:</span>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">All Brands</option>
                  {brandsList
                    .filter((b) => categoryFilter === "all" || matchBrandToCategory(b, categoryFilter))
                    .map((b) => (
                      <option key={String(b.id || b._id)} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="unavailable">Unavailable / Sold Out</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Device & Department</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4">Selling Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id || p._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                              <Image
                                src={p.images?.frontView || "/products/iphone-pro-max.jpg"}
                                alt={p.title}
                                fill
                                className="object-contain p-0.5"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-sm">{p.title}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {getCategoryIcon(p.category)}
                                  <span className="capitalize">{p.category || "smartphones"}</span>
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                <strong className="text-slate-600">{p.brand}</strong> • {p.batteryHealth || "95%+ Tested"} • {p.warranty?.split(" ")[0]} {p.warranty?.split(" ")[1]}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.condition.includes("Pristine")
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.condition.includes("Grade A")
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {p.condition}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">AED {p.price.toLocaleString()}</div>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <div className="text-[10px] text-slate-400 line-through">AED {p.originalPrice.toLocaleString()}</div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`font-bold ${p.stock > 0 ? "text-slate-900" : "text-rose-600"}`}>
                            {p.stock} units
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.status === "draft"
                              ? "bg-slate-100 text-slate-600 border border-slate-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}>
                            {p.status === "published" ? "● Published" : p.status === "draft" ? "Draft" : "Unavailable"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/buy-phones/${p.id || p._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                              title="Preview on Store"
                            >
                              <Eye size={14} />
                            </a>
                            <button
                              onClick={() => handleOpenEditForm(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                              title="Edit Listing"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id || p._id!)}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB: MAIN CATEGORIES CRUD MANAGEMENT
           ========================================================================= */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Categories List & Metrics */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <FolderPlus size={16} className="text-blue-500" />
                    <span>Main Categories ({categoriesList.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hardware departments that organize all certified inventory and brand associations.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                  Top-Level Schema
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoriesList.map((cat) => {
                  const productCount = buyProducts.filter(
                    (p) => (p.category || "smartphones").toLowerCase() === cat.slug.toLowerCase()
                  ).length;
                  const brandCount = brandsList.filter((b) =>
                    matchBrandToCategory(b, cat.slug)
                  ).length;

                  return (
                    <div
                      key={cat.slug}
                      className="bg-slate-50 border border-slate-200 hover:border-blue-300 p-3.5 rounded-2xl flex flex-col justify-between gap-3 transition group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                            {getCategoryIcon(cat.slug)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-900 text-xs truncate">{cat.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEditCategoryClick(cat)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id || cat._id || cat.slug)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-500 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {cat.description && (
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}

                      {/* Department Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-[10px]">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Package size={11} className="text-emerald-500" />
                          <span>{productCount} Products</span>
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Layers size={11} className="text-purple-500" />
                          <span>{brandCount} Brands</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Add / Edit Category Form */}
            <div id="category-form-section" className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  {editingCategoryId ? <Pencil size={14} className="text-blue-500" /> : <Plus size={14} className="text-blue-500" />}
                  <span>{editingCategoryId ? "Edit Main Category" : "Add New Main Category"}</span>
                </h3>
                {editingCategoryId && (
                  <button
                    onClick={handleCancelCategoryEdit}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laptops, Gaming & Consoles"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                      setNewCategory((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug && editingCategoryId ? prev.slug : slug,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. laptops, games"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category Banner / Icon Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setNewCategory({ ...newCategory, image: e.target.files[0] });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] text-slate-600 cursor-pointer"
                  />
                  {newCategory.image && typeof newCategory.image === "string" && (
                    <div className="mt-1 text-[10px] text-slate-400 truncate">
                      Current: {newCategory.image}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description for customer browsing and SEO overview..."
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  {editingCategoryId && (
                    <button
                      type="button"
                      onClick={handleCancelCategoryEdit}
                      className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`${editingCategoryId ? "w-2/3" : "w-full"} bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2.5 rounded-xl transition shadow-xs cursor-pointer`}
                  >
                    {editingCategoryId ? "Save Category Changes" : "Create Main Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: BRANDS & CATEGORY LINKS CRUD MANAGEMENT
           ========================================================================= */}
        {activeTab === "brands" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Brands List & Category Linkages */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Layers size={16} className="text-purple-500" />
                    <span>Brands & Category Allocations ({brandsList.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Brands can be linked to multiple departments (e.g. Apple $\to$ Smartphones, Laptops, Tablets, Watches).
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  Multi-Category Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brandsList.map((b) => (
                  <div
                    key={String(b.id || b._id)}
                    className="bg-slate-50 border border-slate-200 hover:border-purple-300 p-3.5 rounded-2xl flex flex-col justify-between gap-3 transition group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                          {b.logo ? (
                            <Image src={b.logo} alt={b.name} fill className="object-contain p-1" />
                          ) : (
                            <Tag size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-xs truncate">{b.name}</h4>
                            {b.isFeaturedOnFrontpage && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.2 rounded border border-amber-300">
                                🏠 Frontpage
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">/{b.slug}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEditBrandClick(b)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 transition cursor-pointer"
                          title="Edit Brand & Category Allocations"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(b.id || b._id || "")}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-500 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Brand"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Allocated Categories Badges */}
                    <div className="border-t border-slate-200/70 pt-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Allocated Categories:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(b.categories) && b.categories.length > 0 ? (
                          b.categories.map((c: any, idx: number) => {
                            const catName = typeof c === "object" ? c.name : c;
                            const catSlug = typeof c === "object" ? c.slug : c;
                            return (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[9px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded-md border border-purple-200 shadow-xs"
                              >
                                {getCategoryIcon(catSlug)}
                                <span>{catName}</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[9px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ⚠️ Auto-inherited (Domain Default)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Add / Edit Brand Form */}
            <div id="brand-form-section" className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  {editingBrandId ? <Pencil size={14} className="text-purple-500" /> : <Plus size={14} className="text-purple-500" />}
                  <span>{editingBrandId ? "Edit Brand & Allocations" : "Add New Brand"}</span>
                </h3>
                {editingBrandId && (
                  <button
                    onClick={handleCancelBrandEdit}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateBrand} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple, Dell, Sony"
                    value={newBrand.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                      setNewBrand((prev) => ({
                        ...prev,
                        name,
                        slug: prev.slug && editingBrandId ? prev.slug : slug,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Slug
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if left blank"
                    value={newBrand.slug}
                    onChange={(e) => setNewBrand({ ...newBrand, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setNewBrand({ ...newBrand, logo: e.target.files[0] });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] text-slate-600 cursor-pointer"
                  />
                </div>

                {/* Multi-Category Checkbox Grid */}
                <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-purple-950">
                      Allocate to Main Categories:
                    </label>
                    <span className="text-[10px] text-purple-700 font-bold">
                      {newBrand.categories.length} selected
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Check which departments this brand manufactures devices for:
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-white border border-purple-100 p-2.5 rounded-xl">
                    {categoriesList.map((cat) => {
                      const catId = String(cat._id || cat.id || cat.slug);
                      const isChecked = newBrand.categories.includes(catId) || newBrand.categories.includes(cat.slug);
                      return (
                        <label
                          key={cat.slug}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none font-semibold text-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleBrandCategory(catId)}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer w-3.5 h-3.5"
                          />
                          <span className="flex items-center gap-1 text-[11px]">
                            {getCategoryIcon(cat.slug)}
                            <span>{cat.name}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Frontpage Curation */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBrand.isFeaturedOnFrontpage}
                      onChange={(e) => setNewBrand({ ...newBrand, isFeaturedOnFrontpage: e.target.checked })}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer w-4 h-4"
                    />
                    <span className="font-bold text-slate-900 text-xs">
                      🏠 Feature on Frontpage Brands Section
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  {editingBrandId && (
                    <button
                      type="button"
                      onClick={handleCancelBrandEdit}
                      className="w-1/3 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`${editingBrandId ? "w-2/3" : "w-full"} bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-2.5 rounded-xl transition shadow-xs cursor-pointer`}
                  >
                    {editingBrandId ? "Save Brand & Allocations" : "Add Brand"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CUSTOMER ORDERS MANAGEMENT
           ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Total Orders</div>
                  <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                </div>
                <ShoppingBag className="w-8 h-8 text-emerald-500 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Gross Sales Revenue</div>
                  <div className="text-2xl font-black text-slate-900">AED {totalRevenue.toLocaleString()}</div>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600 opacity-80" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase">Pending Fulfillment</div>
                  <div className="text-2xl font-black text-amber-600">
                    {orders.filter((o) => o.orderStatus === "pending").length}
                  </div>
                </div>
                <Truck className="w-8 h-8 text-amber-500 opacity-80" />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={orderSearchFilter}
                  onChange={(e) => setOrderSearchFilter(e.target.value)}
                  placeholder="Search orders by order #, customer name, phone or city..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total Value</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sheets Sync</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {ord.orderNumber}
                          <div className="text-[10px] font-normal text-slate-400 font-sans">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-slate-900">{ord.customerDetails.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {ord.customerDetails.phone} • {ord.customerDetails.city}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-700">
                            {ord.items.length} {ord.items.length === 1 ? "device" : "devices"}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {ord.items[0]?.title}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-extrabold text-slate-950 text-sm">
                          AED {ord.totalAmount.toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                              ord.orderStatus === "delivered"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : ord.orderStatus === "dispatched"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : ord.orderStatus === "confirmed"
                                ? "bg-teal-50 text-teal-800 border-teal-200"
                                : ord.orderStatus === "cancelled"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          {ord.googleSheetsSync?.isSynced ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 size={11} /> Synced
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRetryGoogleSheets(ord._id)}
                              disabled={syncingOrderId === ord._id}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                              title="Click to retry Google Sheets Sync"
                            >
                              <RefreshCw size={10} className={syncingOrderId === ord._id ? "animate-spin" : ""} /> Retry Sync
                            </button>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: GOOGLE SHEETS SYNC STATUS
           ========================================================================= */}
        {activeTab === "sheets" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Google Sheets Operational Sync</h2>
                <p className="text-xs text-slate-500">Live operational data logging dedicated strictly to Buy Phones customer orders.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Target Sheet Tab:</div>
                <div className="font-mono text-sm font-extrabold text-emerald-600">"Buy Phones Orders"</div>
                <p className="text-[11px] text-slate-500">
                  Customer purchase records are synchronized to this dedicated tab without interfering with Sell Phones trade-in inquiries.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">Local Operational Log:</div>
                <div className="font-mono text-xs text-slate-600 truncate">backend/backups/google_sheets_buy_orders_log.json</div>
                <p className="text-[11px] text-slate-500">
                  Every order is permanently backed up locally even if Google network connections drop.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <h3 className="font-bold text-emerald-900 text-xs">Configuration Options in backend/.env:</h3>
              <div className="font-mono text-[11px] text-slate-800 bg-white/80 p-3 rounded-xl border border-emerald-100 space-y-1">
                <div># Option 1: Google Apps Script Webhook (Recommended & Instant)</div>
                <div>GOOGLE_SHEET_BUY_ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec</div>
                <div className="pt-2"># Option 2: Service Account Sheet ID</div>
                <div>GOOGLE_SHEET_ID=your_spreadsheet_id</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          ORDER DETAILS MODAL
         ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Purchase Order Details</div>
              <h3 className="text-xl font-black text-slate-900">Order #{selectedOrder.orderNumber}</h3>
              <p className="text-xs text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Customer & Delivery Info</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">Name:</span> <strong className="text-slate-900">{selectedOrder.customerDetails.name}</strong></div>
                <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-900">{selectedOrder.customerDetails.phone}</strong></div>
                <div><span className="text-slate-500">Email:</span> <strong className="text-slate-900">{selectedOrder.customerDetails.email}</strong></div>
                <div><span className="text-slate-500">Emirate:</span> <strong className="text-slate-900">{selectedOrder.customerDetails.city}</strong></div>
                <div className="col-span-2">
                  <span className="text-slate-500">Address:</span> <strong className="text-slate-900">{selectedOrder.customerDetails.address}, {selectedOrder.customerDetails.building} {selectedOrder.customerDetails.apartment}</strong>
                </div>
                {selectedOrder.customerDetails.notes && (
                  <div className="col-span-2 text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                    Notes: {selectedOrder.customerDetails.notes}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Items Purchased</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <Image src={it.image || "/products/iphone-pro-max.jpg"} alt={it.title} fill className="object-contain p-0.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{it.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {it.selectedStorage} • {it.selectedColor} • {it.condition} • Qty: {it.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">AED {(it.price * it.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-800">Payment ({selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Card on Delivery"}):</div>
                <div className="text-[11px] text-emerald-700">Status: {selectedOrder.paymentStatus.toUpperCase()}</div>
              </div>
              <div className="text-xl font-black text-emerald-950">
                AED {selectedOrder.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT ADD / EDIT MODAL
         ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmitProductForm} className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingId ? "Edit Buy Phone Listing" : "Add Phone to /buy-phones"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure the device pricing, condition tier, warranty, and publication status.
                </p>
              </div>

              {/* 1-Click Import Dropdown */}
              {!editingId && formSource === "import" && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-teal-900">
                      Select Device from Existing Trade-In Catalog:
                    </label>
                    <span className="text-[10px] bg-teal-200/80 text-teal-950 font-black px-2 py-0.5 rounded-full">
                      Safe Catalog Clone
                    </span>
                  </div>
                  <select
                    value={selectedTradeInProduct}
                    onChange={(e) => handleSelectTradeInToImport(e.target.value)}
                    className="w-full bg-white border border-teal-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="">-- Choose a model to import with 30% markup --</option>
                    {tradeInProducts.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name} ({p.brand}) - Base Trade-In: AED {p.basePrice}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    🛡️ <strong>Strict Database Separation:</strong> Importing clones this product into the Buy Phones database. Any edits to prices, specs, or photos apply <u>exclusively</u> to the <strong>Buy Phones Store</strong>. The original trade-in price on Sell Phone Cash will <u>never</u> be affected.
                  </p>
                </div>
              )}

              {/* Step 1 & 2: Cascading Category -> Brand Hierarchy */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers size={13} className="text-emerald-500" />
                    <span>Hierarchy Sequence: 1. Main Category &rarr; 2. Linked Brand</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Cascading Filter Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Step 1: Main Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Department / Main Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Linked Brand (Cascading) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        2. Linked Brand ({filteredBrandsForSelectedCategory.length}) *
                      </label>
                      <span className="text-[10px] text-slate-400">Filtered by {category}</span>
                    </div>
                    <select
                      value={brandId || brand}
                      onChange={(e) => {
                        const val = e.target.value;
                        const found = brandsList.find(b => String(b.id || b._id) === val || b.name === val);
                        if (found) {
                          setBrandId(String(found.id || found._id));
                          setBrand(found.name);
                        } else {
                          setBrandId("");
                          setBrand(val);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                    >
                      <option value="">-- Select Linked Brand --</option>
                      {filteredBrandsForSelectedCategory.map((b) => (
                        <option key={String(b.id || b._id)} value={String(b.id || b._id)}>
                          {b.name}
                        </option>
                      ))}
                      {!filteredBrandsForSelectedCategory.some(b => b.name === brand) && brand && (
                        <option value={brand}>{brand}</option>
                      )}
                    </select>
                    {brand && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Active: <span className="font-bold text-slate-800">{brand}</span> {brandId && <span className="text-emerald-600 font-mono text-[9px]">(ID: {brandId})</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Listing Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. MacBook Pro 16 M3 Max / iPhone 16 Pro Max"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Device Model *</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. MacBook Pro 16 / iPhone 16 Pro Max"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Resale Price (AED) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Retail Strikethrough Price (AED)</label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Physical Condition *</label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pristine (Like New)">✨ Pristine (Like New - Flawless)</option>
                    <option value="Grade A (Excellent)">💎 Grade A (Excellent - Micro Signs)</option>
                    <option value="Grade B (Good Value)">🏷️ Grade B (Good Value - Minor Wear)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Status *</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="published">● Published on /buy-phones</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="unavailable">Unavailable / Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Battery Health</label>
                  <input
                    type="text"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 3 IMAGE SLOTS (FILE UPLOADS & IMPORTED PREVIEWS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Product Angle Photos (3 File Slots) *
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Upload image files or use imported URLs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Slot 1: Front View */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-center flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-[11px] text-slate-900">1. Front View *</span>
                        {frontImage && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            {frontImage instanceof File ? "New File" : "Allocated"}
                          </span>
                        )}
                      </div>

                      {frontImage ? (
                        <div className="relative w-full h-28 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs group">
                          <img
                            src={getPreviewUrl(frontImage)}
                            alt="Front View"
                            className="w-full h-full object-contain p-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setFrontImage("")}
                            className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 transition shadow cursor-pointer"
                            title="Clear Image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-white/60 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1">
                          <Smartphone size={22} className="text-slate-300" />
                          <span className="text-[10px] font-semibold">No Front Image</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <label className="text-[10px] text-slate-600 font-semibold block text-left">
                        Upload Front File:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setFrontImage(e.target.files[0]);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] text-slate-700 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slot 2: Side View */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-center flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-[11px] text-slate-900">2. Side View</span>
                        {sideImage && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            {sideImage instanceof File ? "New File" : "Allocated"}
                          </span>
                        )}
                      </div>

                      {sideImage ? (
                        <div className="relative w-full h-28 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs group">
                          <img
                            src={getPreviewUrl(sideImage)}
                            alt="Side View"
                            className="w-full h-full object-contain p-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setSideImage("")}
                            className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 transition shadow cursor-pointer"
                            title="Clear Image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-white/60 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1">
                          <Smartphone size={22} className="text-slate-300" />
                          <span className="text-[10px] font-semibold">No Side Image</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <label className="text-[10px] text-slate-600 font-semibold block text-left">
                        Upload Side File:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSideImage(e.target.files[0]);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] text-slate-700 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Slot 3: Back View */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-center flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-[11px] text-slate-900">3. Back View</span>
                        {backImage && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            {backImage instanceof File ? "New File" : "Allocated"}
                          </span>
                        )}
                      </div>

                      {backImage ? (
                        <div className="relative w-full h-28 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs group">
                          <img
                            src={getPreviewUrl(backImage)}
                            alt="Back View"
                            className="w-full h-full object-contain p-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setBackImage("")}
                            className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 transition shadow cursor-pointer"
                            title="Clear Image"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-white/60 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1">
                          <Smartphone size={22} className="text-slate-300" />
                          <span className="text-[10px] font-semibold">No Back Image</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <label className="text-[10px] text-slate-600 font-semibold block text-left">
                        Upload Back File:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setBackImage(e.target.files[0]);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] text-slate-700 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Storage Variants (Comma Separated)</label>
                  <input
                    type="text"
                    value={storageInput}
                    onChange={(e) => setStorageInput(e.target.value)}
                    placeholder="128GB, 256GB, 512GB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Colors (Comma Separated)</label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="Natural Titanium, Black, White"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : editingId ? "Update Listing" : "Publish to Store"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
