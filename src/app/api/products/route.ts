import { db } from "@/db";
import { productsTable, SelectProduct } from "@/db/schema";
import { ProductFilterValidator } from "@/lib/product-validator";
import { and, asc, between, desc, inArray, sql, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

const RequestBodyValidator = z.object({
  filter: ProductFilterValidator,
  query: z.string().optional(),
  page: z.string().optional(),
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
      // const embedding = await vectorize(params);
      // const similarity = sql<number>`1 - (${cosineDistance(
      //   productsTable.embedding,
      //   embedding
      // )})`;

      // /* semantic search */
      // filters.push(gt(similarity, 0.6));

      /* Full text search */
      filters.push(
        // sql`to_tsvector(${productsTable.name}) @@ plainto_tsquery(${params})`
        sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
          productsTable.color
        } || ' ' || ${
          productsTable.description
        })) @@ to_tsquery('simple', lower(${params
          .trim()
          .split(" ")
          .join(" & ")}))`
      );
    }

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

    const products: SelectProduct[] = await query;

    return new Response(JSON.stringify(products));
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

export const GET = async () => {
  try {
    const products = await db.select().from(productsTable);

    return new Response(JSON.stringify(products));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
