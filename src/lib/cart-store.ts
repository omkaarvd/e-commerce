"use client";

import { SelectProduct } from "@/db/schema";
import { create } from "zustand";
import {
  addItemToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "./cart-api";

export interface CartItem
  extends Omit<SelectProduct, "description" | "createdAt" | "updatedAt"> {
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  isCartOpen: boolean;
  initialized: boolean;
  initCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (item: CartItem) => Promise<void>;
  increaseQuantity: (item: CartItem) => Promise<void>;
  decreaseQuantity: (item: CartItem) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartStore>((set, get) => ({
  cartItems: [],
  isCartOpen: false,
  initialized: false,

  initCart: async () => {
    if (get().initialized) return;

    const products = await getCart();
    set({ cartItems: products, initialized: true });
  },

  addToCart: async (newItem) => {
    // Check if the item already exists in the cart (same id, size, and color)
    const existingItemIndex = get().cartItems.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.size === newItem.size &&
        item.color === newItem.color
    );

    if (existingItemIndex !== -1) {
      set((state) => {
        // If item exists, increase its quantity
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return { cartItems: updatedItems };
      });

      await updateCartItem({
        productId: newItem.id,
        quantity: newItem.quantity + 1,
      });
    } else {
      const products = await addItemToCart({
        productId: newItem.id,
        quantity: newItem.quantity,
      });

      // If item doesn't exist, add it to the cart
      set({ cartItems: products });
    }
  },

  removeFromCart: async (itemToRemove) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.size === itemToRemove.size &&
            item.color === itemToRemove.color
          )
      ),
    }));

    await deleteCartItem({ productId: itemToRemove.id });
  },

  increaseQuantity: async (item) => {
    if (item.quantity >= item.available) return;

    set((state) => {
      const updatedItems = state.cartItems.map((cartItem) => {
        if (
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
        ) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      return { cartItems: updatedItems };
    });

    await updateCartItem({ productId: item.id, quantity: item.quantity + 1 });
  },

  decreaseQuantity: async (item) => {
    if (item.quantity <= 1) return;

    set((state) => {
      const updatedItems = state.cartItems.map((cartItem) => {
        if (
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color &&
          cartItem.quantity > 1
        ) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
      return { cartItems: updatedItems };
    });

    await updateCartItem({ productId: item.id, quantity: item.quantity - 1 });
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
