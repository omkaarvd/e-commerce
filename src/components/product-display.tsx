"use client";

import { Button } from "@/components/ui/button";
import { SelectProduct } from "@/db/schema";
import { useCart } from "@/lib/cart-store";
import { WarningToast } from "@/lib/toast";
import { capetalizeFirstLetter, cn, formatPrice } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";

type ProductWithoutMeta = Omit<SelectProduct, "createdAt" | "updatedAt">;

export default function ProductDisplay({
  product,
}: {
  product: ProductWithoutMeta;
}) {
  const { isSignedIn } = useUser();
  const { addToCart, openCart, cartItems } = useCart();

  const handleAddToCart = () => {
    if (!isSignedIn) {
      WarningToast("Please, sign in to continue!");
      return;
    }

    if (product.available === 0) return;

    const currentCartItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
    );
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0;

    if (currentQuantity + 1 > product.available) {
      WarningToast("Cannot add more than available stock to cart.");
      return;
    }

    addToCart({
      id: product.id,
      imageURL: product.imageURL,
      name: product.name,
      size: product.size,
      color: product.color,
      price: product.price,
      available: product.available,
      quantity: 1,
    });

    openCart();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 py-8">
      {/* Product Image */}
      <div className="relative h-[500px] w-full rounded-lg overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageURL}
          alt={product.name}
          className="size-full object-center object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>

        <div>
          <h2 className="font-medium">{`Size: ${product.size}`}</h2>
          <h2 className="font-medium">{`Color: ${capetalizeFirstLetter(
            product.color
          )}`}</h2>
          <p
            className={cn({
              "text-green-500": product.available > 0,
              "text-red-500": product.available === 0,
            })}
          >
            {product.available > 0
              ? `In Stock: ${product.available}`
              : "Out of Stock"}
          </p>{" "}
        </div>

        {/* Add to Cart Button */}
        <Button
          size="lg"
          onClick={handleAddToCart}
          className="mt-4"
          disabled={product.available === 0}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>

        {/* Product Description */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
