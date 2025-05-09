"use server";

import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MinifiedCartItem } from "./cart-api";
import { CartItem } from "./cart-store";

export async function getCartProducts(
  items: MinifiedCartItem[]
): Promise<CartItem[] | []> {
  try {
    const allProducts = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await db.query.productsTable.findFirst({
          where: eq(productsTable.id, productId),
          columns: {
            description: false,
            createdAt: false,
            updatedAt: false,
            embedding: false,
          },
        });

        if (!product) throw new Error(`Product not found: ${productId}`);

        return { ...product, quantity };
      })
    );

    return allProducts;
  } catch (err) {
    console.log("Failed to get all items:", err);

    return [];
  }
}
