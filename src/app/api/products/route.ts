import { db } from "@/db";
import { productsTable, SelectProduct } from "@/db/schema";
import { ProductFilterValidator } from "@/lib/product-validator";
import { and, asc, between, desc, inArray, sql, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

const RequestBodyValidator = z.object({
  filter: ProductFilterValidator,
  query: z.string().nullable(),
  page: z.string().nullable(),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedBody = RequestBodyValidator.parse(body);

    const { color, price, size, sort } = validatedBody.filter;
    const params = validatedBody.query;
    const page = parseInt(validatedBody.page || "1");

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

    if (params) {
      /* Full text search */
      filters.push(
        sql`(
          setweight(to_tsvector('english', ${productsTable.name}), 'A') ||
          setweight(to_tsvector('english', ${
            productsTable.description
          }), 'B') ||
          setweight(to_tsvector('english', ${productsTable.color}), 'B')
          ) @@ to_tsquery('english', ${params.trim().split(" ").join(" & ")})`
      );
    }

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(and(...filters))
      .then((res) => res[0].count || 0);

    const limit = 9;

    const query = db
      .select()
      .from(productsTable)
      .where(and(...filters))
      .limit(limit)
      .offset(Math.abs(page - 1) * limit);

    if (sort === "price-asc") {
      query.orderBy(asc(productsTable.price));
    } else if (sort === "price-desc") {
      query.orderBy(desc(productsTable.price));
    }

    const data: SelectProduct[] = await query;

    return new Response(JSON.stringify({ data, count }));
  } catch (err) {
    console.error(err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ message: "Invalid request data", errors: err.errors }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
