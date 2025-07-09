"use server";

import { db } from "@/db";
import { cartTable, productsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
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

export async function cleanCart() {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.warn("Error in cleaning cart. Invalid Request!");
      return;
    }

    const cart = await db.query.cartTable.findFirst({
      where: eq(cartTable.userId, userId),
    });

    if (!cart) {
      console.warn("Error in cleaning cart. No cart found!");
      return;
    }

    await db
      .update(cartTable)
      .set({ items: sql`'[]'::jsonb` })
      .where(eq(cartTable.userId, userId));

    console.log("Cart cleaned successfully");
  } catch (err) {
    console.log("Failed to clean the Cart:", err);
  }
}
