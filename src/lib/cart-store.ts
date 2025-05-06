"use client";

import { create } from "zustand";

export interface CartItem {
  id: string;
  imageURL: string;
  name: string;
  size: string;
  color: string;
  price: number;
  available: number;
  quantity: number;
}

interface CartStore {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  decreaseQuantity: (item: CartItem) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartStore>((set) => ({
  cartItems: [],
  isCartOpen: false,

  addToCart: (newItem) =>
    set((state) => {
      // Check if the item already exists in the cart (same id, size, and color)
      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex !== -1) {
        // If item exists, increase its quantity
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return { cartItems: updatedItems };
      } else {
        // If item doesn't exist, add it to the cart
        return { cartItems: [...state.cartItems, newItem] };
      }
    }),

  removeFromCart: (itemToRemove) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.size === itemToRemove.size &&
            item.color === itemToRemove.color
          )
      ),
    })),

  increaseQuantity: (item) =>
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
    }),

  decreaseQuantity: (item) =>
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
    }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
