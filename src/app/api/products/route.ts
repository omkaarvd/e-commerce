import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { ProductFilterValidator } from "@/lib/validators/product-validator";
import { and, asc, between, desc, inArray, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = ProductFilterValidator.parse(
      body.filter
    );

    const filters: SQL[] = [];

    if (color.length) {
      filters.push(inArray(productsTable.color, color));
    }

    if (price.length === 2) {
      filters.push(between(productsTable.price, price[0], price[1]));
    }

    if (size.length) {
      filters.push(inArray(productsTable.size, size));
    }

    const query = db
      .select()
      .from(productsTable)
      .where(and(...filters));

    if (sort === "price-asc") {
      query.orderBy(asc(productsTable.price));
    } else if (sort === "price-desc") {
      query.orderBy(desc(productsTable.price));
    }

    const products = await query;

    return new Response(JSON.stringify(products));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
