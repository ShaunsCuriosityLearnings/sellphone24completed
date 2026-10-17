"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BuyCartItemType } from "@/types";

export type BuyCartStoreStateType = {
  cart: BuyCartItemType[];
  hasHydrated: boolean;
};

export type BuyCartStoreActionsType = {
  addToCart: (item: BuyCartItemType) => void;
  updateQuantity: (item: BuyCartItemType, newQty: number) => void;
  removeFromCart: (item: BuyCartItemType) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
};

const useBuyCartStore = create<BuyCartStoreStateType & BuyCartStoreActionsType>()(
  persist(
    (set, get) => ({
      cart: [],
      hasHydrated: false,

      addToCart: (item) =>
        set((state) => {
          const existingIdx = state.cart.findIndex(
            (p) =>
              p.id === item.id &&
              p.selectedStorage === item.selectedStorage &&
              p.selectedColor === item.selectedColor &&
              p.condition === item.condition
          );

          if (existingIdx >= 0) {
            const updated = [...state.cart];
            const maxStock = item.stock || 10;
            const newQty = Math.min(updated[existingIdx].quantity + (item.quantity || 1), maxStock);
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: newQty,
            };
            return { cart: updated };
          }

          return { cart: [...state.cart, { ...item, quantity: item.quantity || 1 }] };
        }),

      updateQuantity: (item, newQty) =>
        set((state) => {
          if (newQty <= 0) {
            return {
              cart: state.cart.filter(
                (p) =>
                  !(
                    p.id === item.id &&
                    p.selectedStorage === item.selectedStorage &&
                    p.selectedColor === item.selectedColor &&
                    p.condition === item.condition
                  )
              ),
            };
          }

          const maxStock = item.stock || 10;
          const cappedQty = Math.min(newQty, maxStock);

          return {
            cart: state.cart.map((p) =>
              p.id === item.id &&
              p.selectedStorage === item.selectedStorage &&
              p.selectedColor === item.selectedColor &&
              p.condition === item.condition
                ? { ...p, quantity: cappedQty }
                : p
            ),
          };
        }),

      removeFromCart: (item) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              !(
                p.id === item.id &&
                p.selectedStorage === item.selectedStorage &&
                p.selectedColor === item.selectedColor &&
                p.condition === item.condition
              )
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),

      getSubtotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: "buy-cart", // Completely distinct key from "sell-list"
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useBuyCartStore;
