import { db } from "@/db";
import { productsTable } from "@/db/schema";

export const POST = async () => {
  const products = await db.select().from(productsTable);

  return new Response(JSON.stringify(products));
};
