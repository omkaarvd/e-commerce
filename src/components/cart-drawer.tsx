"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";
import { capetalizeFirstLetter } from "@/lib/utils";
import axios from "axios";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartDrawer() {
  const {
    initCart,
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  useEffect(() => {
    initCart();
  }, [initCart]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const response = await axios.post("/api/products/checkout", {
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      if (response.status == 401) {
        alert("Unauthorized. Please log in to proceed.");
      }

      if (response.status == 200) {
        router.push(response.data.url);
        closeCart();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(
        error.response?.data?.message || "An error occurred during checkout."
      );
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 my-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex gap-4 border-b pb-4"
              >
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageURL}
                    alt={item.name}
                    className="size-full object-center object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {item.size}, Color:{" "}
                    {capetalizeFirstLetter(item.color)}
                  </p>
                  <p className="text-sm text-gray-600">
                    In Stock: {item.available}
                  </p>
                  <p className="font-medium">₹{item.price.toFixed(2)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => decreaseQuantity(item)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => increaseQuantity(item)}
                      disabled={item.quantity >= item.available}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="flex-col sm:flex-col gap-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
