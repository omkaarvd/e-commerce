"use client";

import { Button } from "@/components/ui/button";
import { SelectProduct } from "@/db/schema";
import { useCart } from "@/lib/cart-store";
import { ShoppingCart } from "lucide-react";

type ProductWithoutMeta = Omit<
  SelectProduct,
  "createdAt" | "updatedAt" | "embedding"
>;

export default function ProductDisplay({
  product,
}: {
  product: ProductWithoutMeta;
}) {
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      imageURL: product.imageURL,
      name: product.name,
      size: product.size,
      color: product.color,
      price: product.price,
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
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>

        <div>
          <h2 className="text-lg font-medium mb-2">{`Size: ${product.size}`}</h2>
          <h2 className="text-lg font-medium mb-2">{`Color: ${
            product.color.charAt(0).toUpperCase() + product.color.slice(1)
          }`}</h2>
        </div>

        {/* Add to Cart Button */}
        <Button size="lg" onClick={handleAddToCart} className="mt-4">
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
