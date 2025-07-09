"use server";

import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProductById = async (slug: string) => {
  const result = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, slug))
    .limit(1);

  return result[0] || null;
};
