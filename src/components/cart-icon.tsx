"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { cartItems, openCart } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={openCart}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span
          className={cn(
            "absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center"
          )}
        >
          {itemCount}
        </span>
      )}
    </Button>
  );
}
