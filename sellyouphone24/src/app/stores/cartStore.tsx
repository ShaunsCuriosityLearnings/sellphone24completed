"use client";

import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,

      addToCart: (product) =>
        set(() => ({
          cart: [product],
        })),

      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              !(
                p.id === product.id &&
                p.selectedStorage === product.selectedStorage &&
                p.selectedColor === product.selectedColor &&
                p.selectedCondition === product.selectedCondition
              ),
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),
    }),
    {
      name: "sell-list",

      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);

export default useCartStore;
