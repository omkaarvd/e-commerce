import { db } from "@/db";
import { productsTable, SelectProduct } from "@/db/schema";
import { ProductFilterValidator } from "@/lib/validators/product-validator";
import { vectorize } from "@/lib/vectorize";
import { Index } from "@upstash/vector";
import { and, asc, between, desc, inArray, sql, SQL } from "drizzle-orm";
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
      filters.push(
        // sql`to_tsvector(${productsTable.name}) @@ plainto_tsquery(${params})`
        sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || ${
          productsTable.description
        })) @@ to_tsquery('simple', lower(${params
          .trim()
          .split(" ")
          .join(" & ")}))`
      );
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

    if (params && products.length < 3) {
      // search products with semantic similarity
      const vector = await vectorize(params);

      const res = await index.query({
        topK: 5,
        vector,
        includeMetadata: true,
      });

      const vectorProducts = res
        .filter((prod) => {
          if (products.some((p) => p.id === prod.id)) {
            return false;
          } else return true;
        })
        .map(({ metadata }) => metadata!);

      // merge both results
      products.push(...vectorProducts);
    }

    return new Response(JSON.stringify(products));
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
