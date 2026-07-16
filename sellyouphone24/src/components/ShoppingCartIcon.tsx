"use client";
import useCartStore from "@/app/stores/cartStore";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

const ShoppingCartIcon = () => {
  const { cart, hasHydrated } = useCartStore();
  
  if (!hasHydrated) {
    return (
      <Link href="/cart" className="relative p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
        <ClipboardList className="w-5 h-5" />
      </Link>
    );
  }

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link 
      href="/cart" 
      className="relative p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition flex items-center gap-1 group"
      title="View Sell List / Get Paid"
    >
      <ClipboardList className="w-5 h-5 group-hover:scale-105 transition-transform" />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default ShoppingCartIcon;
