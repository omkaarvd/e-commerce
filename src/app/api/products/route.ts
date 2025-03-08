import { db } from "@/db";
import { productsTable, SelectProduct } from "@/db/schema";
import { ProductFilterValidator } from "@/lib/product-validator";
import { vectorize } from "@/lib/vectorize";
import {
  and,
  asc,
  between,
  cosineDistance,
  desc,
  gt,
  inArray,
  sql,
  SQL,
} from "drizzle-orm";
import { NextRequest } from "next/server";

const index = new Index<SelectProduct>();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { color, price, size, sort } = ProductFilterValidator.parse(
      body.filter
    );

    const params = body.query as string;

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
      const embedding = await vectorize(params);
      const similarity = sql<number>`1 - (${cosineDistance(
        productsTable.embedding,
        embedding
      )})`;

      /* semantic search */
      filters.push(gt(similarity, 0.6));

      /* Full text search */
      // filters.push(
      //   // sql`to_tsvector(${productsTable.name}) @@ plainto_tsquery(${params})`
      //   sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
      //     productsTable.description
      //   })) @@ to_tsquery('simple', lower(${params
      //     .trim()
      //     .split(" ")
      //     .join(" & ")}))`
      // );
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

    const products: SelectProduct[] = await query;

    return new Response(JSON.stringify(products));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
