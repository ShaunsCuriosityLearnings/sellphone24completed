"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Star, 
  ShoppingBag, 
  Zap, 
  ChevronRight, 
  ArrowLeft, 
  Battery, 
  Award, 
  Lock, 
  PhoneCall, 
  RotateCcw, 
  Minus, 
  Plus, 
  Check, 
  Info,
  Clock,
  Sparkles
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import useBuyCartStore from "@/app/stores/buyCartStore";
import { BuyProductType } from "@/types";

export default function BuyProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [product, setProduct] = useState<BuyProductType | null>(null);
  const [allProducts, setAllProducts] = useState<BuyProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [activeImageKey, setActiveImageKey] = useState<"frontView" | "sideView" | "backView">("frontView");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useBuyCartStore();

  useEffect(() => {
    async function fetchPhoneData() {
      if (!id) return;
      setLoading(true);
      try {
        const [foundProduct, catalog] = await Promise.all([
          api.getBuyProductById(id),
          api.getBuyProducts().catch(() => []),
        ]);

        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedStorage(foundProduct.selectedStorage || foundProduct.storages?.[0]?.size || "128GB");
          setSelectedColor(foundProduct.colors?.[0] || "Natural Titanium");
          setSelectedCondition(foundProduct.condition || "Pristine (Like New)");
        }
        setAllProducts(catalog);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhoneData();
  }, [id]);

  // Pricing calculation
  const calculatedPrice = useMemo(() => {
    if (!product) return 0;
    const base = product.price;
    const storageObj = product.storages?.find((s) => s.size === selectedStorage);
    const boost = storageObj?.priceBoost || 0;
    return base + boost;
  }, [product, selectedStorage]);

  const savings = useMemo(() => {
    if (!product?.originalPrice) return null;
    return Math.max(0, product.originalPrice - calculatedPrice);
  }, [product, calculatedPrice]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => String(p.id || p._id) !== String(product.id || product._id) && p.brand === product.brand)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: String(product.id || product._id),
      _id: String(product._id || product.id),
      title: product.title,
      brand: product.brand,
      model: product.model || product.title,
      price: calculatedPrice,
      originalPrice: product.originalPrice,
      selectedStorage,
      selectedColor,
      condition: selectedCondition,
      quantity,
      image: product.images?.[activeImageKey] || product.images?.frontView || "/products/iphone-pro-max.jpg",
      stock: product.stock,
      warranty: product.warranty,
      batteryHealth: product.batteryHealth,
    });
    toast.success(`Added ${product.title} (${selectedStorage}) to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/buy-phones/checkout");
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const text = encodeURIComponent(
      `Hello SellPhoneCash! 👋\n\nI want to buy this phone:\n📱 Model: ${product.title}\n💾 Storage: ${selectedStorage}\n🎨 Color: ${selectedColor}\n✨ Condition: ${selectedCondition}\n💰 Price: AED ${calculatedPrice.toLocaleString()}\n\nPlease confirm availability for express delivery.`
    );
    window.open(`https://wa.me/971555549817?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading certified device specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Phone Listing Not Found</h2>
        <p className="text-xs text-slate-500">The device you are looking for may have been sold out or unlisted.</p>
        <Link
          href="/buy-phones"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft size={14} /> Back to Buy Phones Catalog
        </Link>
      </div>
    );
  }

  const currentImage = product.images?.[activeImageKey] || product.images?.frontView || "/products/iphone-pro-max.jpg";

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-28 sm:pb-8 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold overflow-x-auto">
        <Link href="/" className="hover:text-slate-900 transition">Home</Link>
        <ChevronRight size={12} className="text-slate-400" />
        <Link href="/buy-phones" className="hover:text-slate-900 transition">Buy Phones</Link>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-slate-700 font-bold">{product.brand}</span>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-emerald-600 font-extrabold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* 2. Main Two-Column Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery & 3-Angle Switcher */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="relative w-full h-80 sm:h-96 md:h-[430px] bg-white rounded-3xl border border-slate-200/90 p-6 flex items-center justify-center overflow-hidden shadow-xs">
            
            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                {product.condition}
              </span>
              {savings && savings > 0 && (
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-2xs">
                  Save AED {savings.toLocaleString()}
                </span>
              )}
            </div>

            {/* Main Center Image */}
            <div className="relative w-full h-64 sm:h-80 transition-transform duration-300 hover:scale-105 flex items-center justify-center">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                className="object-contain drop-shadow-xl"
              />
            </div>

            {/* Bottom Certification Pill */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-slate-700 bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Passed 32-Point UAE Diagnostic Inspection</span>
              </span>
            </div>

          </div>

          {/* 3-Angle View Thumbnails Strip */}
          <div className="flex items-center justify-center gap-3">
            {[
              { key: "frontView" as const, label: "Front View" },
              { key: "sideView" as const, label: "Side Profile" },
              { key: "backView" as const, label: "Back View" },
            ].map(({ key, label }) => {
              const imgUrl = product.images?.[key] || product.images?.frontView;
              const isActive = activeImageKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveImageKey(key)}
                  className={`flex items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <Image src={imgUrl || "/products/iphone-pro-max.jpg"} alt={label} fill className="object-contain" />
                  </div>
                  <span className={`text-xs font-bold pr-2 ${isActive ? "text-emerald-800" : "text-slate-600"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Trust Guarantees Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 space-y-1">
              <Truck size={18} className="text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-900">Free Express Delivery</div>
              <div className="text-[10px] text-slate-500">Across Dubai & UAE</div>
            </div>
            <div className="p-2 space-y-1 border-x border-slate-100">
              <ShieldCheck size={18} className="text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-900">12 Months Warranty</div>
              <div className="text-[10px] text-slate-500">Store Guarantee</div>
            </div>
            <div className="p-2 space-y-1">
              <RotateCcw size={18} className="text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-900">7-Day Return</div>
              <div className="text-[10px] text-slate-500">Hassle-Free Policy</div>
            </div>
          </div>

        </div>

        {/* Right Column: Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {product.brand} Certified
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <div className="flex text-amber-400">{"★".repeat(5)}</div>
                <span className="text-slate-900 font-black">{product.rating || 4.9}</span>
                <span className="text-slate-400 text-[11px]">({product.reviewCount || 42} verified UAE reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {product.title}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {product.description || `Certified pre-owned ${product.title} with 100% original OEM display, battery health tested, clean IMEI, and 1-year store warranty.`}
            </p>
          </div>

          {/* Pricing Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div>
              <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                Special Selling Price
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-black text-emerald-400">AED</span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {calculatedPrice.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > calculatedPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    AED {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
                ⚡ In Stock ({product.stock} units)
              </span>
              <div className="text-[10px] text-slate-400 mt-1">Inclusive of all UAE taxes</div>
            </div>
          </div>

          {/* Condition Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Device Condition Grade:</span>
              <span className="text-[11px] font-extrabold text-emerald-600">{selectedCondition}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Pristine (Like New)", "Grade A (Excellent)", "Grade B (Good Value)"].map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setSelectedCondition(cond)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    selectedCondition === cond
                      ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-extrabold text-xs text-slate-900 truncate">
                    {cond.split(" ")[0]} {cond.split(" ")[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {cond.includes("Pristine") ? "Flawless screen" : cond.includes("Grade A") ? "Micro signs" : "Great value"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Capacity Selector */}
          {product.storages && product.storages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Select Storage:</span>
                <span className="text-xs font-black text-slate-900">{selectedStorage}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.storages.map((s) => {
                  const isSelected = selectedStorage === s.size;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedStorage(s.size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span>{s.size}</span>
                      {s.priceBoost > 0 && (
                        <span className={`text-[10px] ${isSelected ? "text-emerald-300" : "text-emerald-600 font-extrabold"}`}>
                          +AED {s.priceBoost}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Select Color:</span>
                <span className="text-xs font-black text-slate-900">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-emerald-600" />}
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Technical Badges */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <Battery size={16} className="text-emerald-600 shrink-0" />
                <span>Battery: <strong>{product.batteryHealth || "98% (Original OEM)"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Award size={16} className="text-emerald-600 shrink-0" />
                <span>Warranty: <strong>12 Months Included</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Lock size={16} className="text-emerald-600 shrink-0" />
                <span>IMEI: <strong>Clean &amp; Factory Unlocked</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <Clock size={16} className="text-emerald-600 shrink-0" />
                <span>Delivery: <strong>24-48h UAE Doorstep</strong></span>
              </div>
            </div>
          </div>

          {/* Quantity Stepper & Action Buttons */}
          <div className="space-y-3 pt-2">
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-black text-xs text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 5, q + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Main Purchasing Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag size={15} />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Zap size={15} />
                <span>Buy Now (Express)</span>
              </button>
            </div>

            {/* WhatsApp Direct Order Hotline */}
            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall size={14} className="text-emerald-600" />
              <span>Instant WhatsApp Inquiry (+971 55 554 9817)</span>
            </button>

          </div>

        </div>

      </div>

      {/* 3. Detailed Specifications & Inspection Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-950">Technical Specifications &amp; Quality Guarantee</h2>
          <p className="text-xs text-slate-500">Every phone is individually checked, wiped, and repackaged with genuine accessories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h3 className="font-extrabold text-emerald-700 uppercase tracking-wider text-[11px]">Hardware Verification</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Original Display: 100% OEM TrueTone Active, Zero Dead Pixels</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Battery Tested: Verified {product.batteryHealth || "95%+"} Peak Performance Capacity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Cameras Tested: Multi-lens autofocus, optical zoom, and 4K video recording</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Biometrics: Face ID / Fingerprint sensor fully functional</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-emerald-700 uppercase tracking-wider text-[11px]">Security &amp; Inclusions</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Clean History: Factory reset, iCloud / Google account completely unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Network: Global Unlocked (Supports du, Etisalat, Virgin UAE &amp; Global SIMs)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Box Contents: Smartphone, Fast Charging Cable, Store Warranty Certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Payment: Cash on Delivery or Card on Delivery supported upon inspection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Related Certified Devices */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">More {product.brand} Devices You May Like</h3>
            <Link href="/buy-phones" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Phones →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id || rel._id}
                href={`/buy-phones/${rel.id || rel._id}`}
                className="bg-white rounded-2xl border border-slate-200 p-3 hover:border-emerald-400 hover:shadow-md transition group"
              >
                <div className="relative w-full h-36 bg-slate-50 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                  <Image
                    src={rel.images?.frontView || "/products/iphone-pro-max.jpg"}
                    alt={rel.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-xs font-black text-slate-900 truncate">{rel.title}</div>
                <div className="text-[11px] font-extrabold text-emerald-600 mt-1">AED {rel.price.toLocaleString()}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* 5. Sticky Mobile Purchase Bar (Always within thumb's reach on mobile screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] text-slate-500 font-semibold truncate">{product.title}</div>
          <div className="text-base font-black text-slate-900">AED {calculatedPrice.toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-800 bg-slate-50 active:bg-slate-100 transition flex items-center justify-center cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
}
