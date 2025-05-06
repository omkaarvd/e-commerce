import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const product = await db
      .select({
        id: productsTable.id,
        imageURL: productsTable.imageURL,
        name: productsTable.name,
        size: productsTable.size,
        color: productsTable.color,
        price: productsTable.price,
        description: productsTable.description,
        available: productsTable.available,
      })
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (product.length === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ ...product[0] }));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
