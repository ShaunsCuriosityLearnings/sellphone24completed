"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Smartphone, 
  Sparkles, 
  Save, 
  AlertCircle, 
  ArrowDownToLine, 
  Eye, 
  DollarSign, 
  Package, 
  Flame, 
  Layers, 
  Search,
  ExternalLink
} from "lucide-react";
import { api } from "@/lib/api";
import { BuyProductType, ProductType, BuyProductConditionType } from "@/types";

interface BuyProductManagerProps {
  products: ProductType[]; // Trade-in products from admin page for 1-click import
  token?: string;
}

export default function BuyProductManager({ products = [], token }: BuyProductManagerProps) {
  const [buyProducts, setBuyProducts] = useState<BuyProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formSource, setFormSource] = useState<"custom" | "import">("custom");
  const [selectedTradeInProduct, setSelectedTradeInProduct] = useState<string>("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [category, setCategory] = useState("smartphones");
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [model, setModel] = useState("");
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number>(3499);
  const [condition, setCondition] = useState<BuyProductConditionType>("Pristine (Like New)");
  const [batteryHealth, setBatteryHealth] = useState("98% (Original OEM)");
  const [warranty, setWarranty] = useState("12 Months Comprehensive Store Warranty");
  const [stock, setStock] = useState<number>(3);
  const [frontImage, setFrontImage] = useState("/products/iphone-pro-max.jpg");
  const [storageInput, setStorageInput] = useState("128GB, 256GB, 512GB");
  const [colorsInput, setColorsInput] = useState("Natural Titanium, Black Titanium");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadBuyProducts();
  }, []);

  const loadBuyProducts = async () => {
    setLoading(true);
    try {
      const [data, cats] = await Promise.all([
        api.getBuyProducts(),
        api.getCategories().catch(() => []),
      ]);
      setBuyProducts(data);
      if (cats && cats.length > 0) setCategoriesList(cats);
    } catch (err) {
      console.error("Error loading buy products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-population when selecting a product to import
  const handleSelectTradeInToImport = (productId: string) => {
    setSelectedTradeInProduct(productId);
    const found = products.find((p) => String(p.id) === productId || String(p._id) === productId);
    if (!found) return;

    setTitle(found.name);
    setBrand(found.brand || "Apple");
    setCategory(found.category || "smartphones");
    setModel(found.name);
    setPrice(Math.round((found.basePrice || 2000) * 1.3)); // 30% margin over trade-in
    setOriginalPrice(Math.round((found.basePrice || 2000) * 1.8));
    setFrontImage(found.images?.frontView || "/products/iphone-pro-max.jpg");
    setDescription(found.description || found.shortDescription || "");
    
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
    setBrand("Apple");
    setCategory("smartphones");
    setModel("");
    setPrice(2499);
    setOriginalPrice(3499);
    setCondition("Pristine (Like New)");
    setBatteryHealth("98% (Original OEM)");
    setWarranty("12 Months Comprehensive Store Warranty");
    setStock(3);
    setFrontImage("/products/iphone-pro-max.jpg");
    setStorageInput("128GB, 256GB, 512GB");
    setColorsInput("Natural Titanium, Black Titanium");
    setIsFeatured(false);
    setIsAvailable(true);
    setDescription("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: BuyProductType) => {
    setEditingId(String(item.id));
    setFormSource("custom");
    setTitle(item.title);
    setBrand(item.brand);
    setCategory(item.category || "smartphones");
    setModel(item.model || item.title);
    setPrice(item.price);
    setOriginalPrice(item.originalPrice || Math.round(item.price * 1.3));
    setCondition(item.condition);
    setBatteryHealth(item.batteryHealth || "95%+");
    setWarranty(item.warranty || "12 Months");
    setStock(item.stock || 1);
    setFrontImage(item.images?.frontView || "/products/iphone-pro-max.jpg");
    setStorageInput((item.storages || []).map((s) => s.size).join(", ") || "128GB, 256GB");
    setColorsInput((item.colors || []).join(", ") || "Black");
    setIsFeatured(!!item.isFeatured);
    setIsAvailable(item.isAvailable !== false);
    setDescription(item.description || "");
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const storagesParsed = storageInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((size, idx) => ({
          size,
          priceBoost: idx * 250, // incremental default boost
        }));

      const colorsParsed = colorsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const payload: Partial<BuyProductType> = {
        title: title.trim(),
        brand: brand.trim(),
        model: (model || title).trim(),
        category: (category || "smartphones").trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        condition,
        batteryHealth,
        warranty,
        stock: Number(stock),
        isAvailable,
        isFeatured,
        description: description.trim(),
        storages: storagesParsed.length > 0 ? storagesParsed : [{ size: "128GB", priceBoost: 0 }],
        colors: colorsParsed.length > 0 ? colorsParsed : ["Standard"],
        images: {
          frontView: frontImage || "/products/iphone-pro-max.jpg",
          sideView: frontImage || "/products/iphone-pro-max.jpg",
          backView: frontImage || "/products/iphone-pro-max.jpg",
        },
        features: [
          "32-Point Diagnostic Test Passed",
          "100% Genuine OEM Display",
          "Clean IMEI & Factory Reset",
          warranty,
        ],
        rating: 4.9,
      };

      if (editingId) {
        // Update existing
        try {
          await api.updateBuyProduct(editingId, payload, token);
        } catch {
          // If backend fails, update locally
        }
        setBuyProducts((prev) =>
          prev.map((item) => (String(item.id) === editingId ? ({ ...item, ...payload } as BuyProductType) : item))
        );
      } else {
        // Create new
        const newId = `buy-${Date.now()}`;
        const newProduct: BuyProductType = {
          ...(payload as any),
          id: newId,
          _id: newId,
          createdAt: new Date().toISOString(),
        };

        try {
          await api.createBuyProduct(newProduct, token);
        } catch {
          // If backend fails, keep local
        }
        setBuyProducts((prev) => [newProduct, ...prev]);
      }

      setIsFormOpen(false);
    } catch (err: any) {
      alert(`Error saving listing: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this phone listing from the /buy-phones store?")) return;
    try {
      await api.deleteBuyProduct(String(id), token);
    } catch {
      // ignore fallback error
    }
    setBuyProducts((prev) => prev.filter((p) => String(p.id) !== String(id) && String(p._id) !== String(id)));
  };

  const handleToggleAvailable = (id: string | number) => {
    setBuyProducts((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(id) || String(p._id) === String(id)) {
          const updated = { ...p, isAvailable: !p.isAvailable };
          api.updateBuyProduct(String(id), { isAvailable: updated.isAvailable }, token).catch(() => {});
          return updated;
        }
        return p;
      })
    );
  };

  const filteredBuyListings = buyProducts.filter((p) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.condition.toLowerCase().includes(q)
    );
  });

  const totalInventoryValue = buyProducts.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 1), 0);
  const totalStockUnits = buyProducts.reduce((acc, p) => acc + (p.stock || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* 1. TOP METRICS & ACTIONS BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
              <Sparkles size={13} />
              <span>Dedicated /buy-phones Inventory</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Resale & Refurbished Phone Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Manage all smartphones listed for public purchase on the new <strong>/buy-phones</strong> page.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/buy-phones"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <ExternalLink size={13} />
              <span>View Live /buy-phones</span>
            </a>

            <button
              onClick={() => handleOpenAddForm("import")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition"
            >
              <ArrowDownToLine size={14} />
              <span>1-Click Import from Catalog</span>
            </button>

            <button
              onClick={() => handleOpenAddForm("custom")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Custom Phone</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Total Listings</div>
              <div className="text-2xl font-black text-slate-900">{buyProducts.length}</div>
            </div>
            <Smartphone className="w-8 h-8 text-emerald-500 opacity-80" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Available Units in Stock</div>
              <div className="text-2xl font-black text-slate-900">{totalStockUnits}</div>
            </div>
            <Package className="w-8 h-8 text-teal-500 opacity-80" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase">Total Inventory Value</div>
              <div className="text-2xl font-black text-slate-900">AED {totalInventoryValue.toLocaleString()}</div>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600 opacity-80" />
          </div>
        </div>

        {/* Search bar */}
        <div className="pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search listings by model, brand, or condition..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

      </div>

      {/* 2. ADD / EDIT MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingId ? "Edit Refurbished Phone Listing" : "Add Phone to /buy-phones"}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the resale price, specs, warranty, and condition badge for this device.
                </p>
              </div>

              {/* 1-Click Import Dropdown */}
              {!editingId && formSource === "import" && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                  <label className="block text-xs font-bold text-teal-900">
                    Select Device from Existing Trade-In Catalog:
                  </label>
                  <select
                    value={selectedTradeInProduct}
                    onChange={(e) => handleSelectTradeInToImport(e.target.value)}
                    className="w-full bg-white border border-teal-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Choose a phone model to import --</option>
                    {products.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name} ({p.brand}) - Base Trade-In: AED {p.basePrice}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Department / Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tablets">Tablets</option>
                    <option value="smartwatches">Smartwatches</option>
                    <option value="games">Gaming & Consoles</option>
                    {categoriesList
                      .filter((c) => !["smartphones", "laptops", "tablets", "smartwatches", "games"].includes(c.slug))
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Dell">Dell</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="HP">HP</option>
                    <option value="Sony">Sony</option>
                    <option value="Nintendo">Nintendo</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selling Resale Price (AED) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Original Retail Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original New Retail Price (AED)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Physical Condition *
                  </label>
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

                {/* Battery Health */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Battery Health
                  </label>
                  <input
                    type="text"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    placeholder="e.g. 98% (Original OEM)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Warranty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Warranty Cover
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 12 Months Comprehensive Store Warranty"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Available Stock Units */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

              </div>

              {/* Front Image Path */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image (Front View URL or /products/...)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={frontImage}
                    onChange={(e) => setFrontImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  {frontImage && (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 relative shrink-0 overflow-hidden flex items-center justify-center">
                      <Image src={frontImage} alt="Preview" fill className="object-contain p-0.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Storages and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Storage Variants (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={storageInput}
                    onChange={(e) => setStorageInput(e.target.value)}
                    placeholder="128GB, 256GB, 512GB"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Colors (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    placeholder="Natural Titanium, Black, White"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-400 w-4 h-4"
                  />
                  <span>Active & Available for Purchase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-400 w-4 h-4"
                  />
                  <span>Feature in /buy-phones Top Deals</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : editingId ? "Update Listing" : "Publish to /buy-phones"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 3. LISTINGS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredBuyListings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  
                  {/* Device Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.images?.frontView || "/products/iphone-pro-max.jpg"}
                          alt={item.title}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.batteryHealth || "95%+ Tested"} • {item.warranty?.split(" ")[0]} {item.warranty?.split(" ")[1]}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Brand */}
                  <td className="py-3 px-4 font-bold text-slate-700">
                    {item.brand}
                  </td>

                  {/* Condition */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.condition.includes("Pristine")
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.condition.includes("Grade A")
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {item.condition}
                    </span>
                  </td>

                  {/* Selling Price */}
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">
                      AED {item.price.toLocaleString()}
                    </div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-[10px] text-slate-400 line-through">
                        Save AED {(item.originalPrice - item.price).toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`font-bold ${item.stock > 0 ? "text-slate-900" : "text-rose-600"}`}>
                      {item.stock} units
                    </span>
                  </td>

                  {/* Status toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailable(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                        item.isAvailable
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700"
                          : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {item.isAvailable ? "● Active on Store" : "○ Sold Out / Hidden"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditForm(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                        title="Edit Listing"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition"
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
  );
}
