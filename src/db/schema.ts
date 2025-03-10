import { InferSelectModel } from "drizzle-orm";
import {
  pgTableCreator,
  text,
  doublePrecision,
  timestamp,
  vector,
  index,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `e_com_${name}`);

export const productsTable = createTable(
  "products",
  {
    id: text().notNull().primaryKey(),
    imageURL: text("image_url").notNull(),
    name: text("name").notNull(),
    size: text({ enum: ["S", "M", "L"] }).notNull(),
    color: text({
      enum: ["white", "beige", "blue", "green", "purple", "black"],
    }).notNull(),
    price: doublePrecision().notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    /**
     * before creating the table, you need to create the pgvector extension in your postgres database
     * CREATE EXTENSION pg_vector;
     */
    embedding: vector("embedding", { dimensions: 768 }),
  },
  (table) => [
    /**
     * The HNSW index type is particularly useful for vector similarity search operations and
     * is one of the index types supported by pgvector for optimizing vector similarity queries
     */
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = InferSelectModel<typeof productsTable>;
