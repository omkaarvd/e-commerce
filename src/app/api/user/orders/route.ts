import { db } from "@/db";
import { productsTable, purchasesTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export const GET = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized! Please log in to continue", {
        status: 401,
      });
    }

    const orders = await db
      .select({
        orderId: purchasesTable.id,
        productId: purchasesTable.productId,
        quantity: purchasesTable.quantity,
        createdAt: purchasesTable.createdAt,
      })
      .from(purchasesTable)
      .where(eq(purchasesTable.userId, userId))
      .orderBy(desc(purchasesTable.createdAt));

    if (orders.length == 0) {
      return new Response(JSON.stringify({ orders: [] }), { status: 200 });
    }

    const ordersDetails = await Promise.all(
      orders.map(async ({ productId, quantity, createdAt, orderId }) => {
        const product = await db.query.productsTable.findFirst({
          where: eq(productsTable.id, productId),
          columns: {
            id: false,
            createdAt: false,
            updatedAt: false,
          },
        });

        if (!product) throw new Error(`Product not found: ${productId}`);

        return {
          productId,
          orderId,
          purchasedQuantity: quantity,
          createdAt,
          ...product,
        };
      })
    );

    return new Response(JSON.stringify({ orders: ordersDetails }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
