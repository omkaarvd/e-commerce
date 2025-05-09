import { InferSelectModel } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTableCreator,
  text,
  timestamp,
  vector,
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
    available: integer("available").notNull(),
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

export const usersTable = createTable("users", {
  id: text().notNull().primaryKey(),
  email: text("email").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = InferSelectModel<typeof usersTable>;

export const purchasesTable = createTable("purchases", {
  id: text().notNull().primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  productId: text("product_id")
    .references(() => productsTable.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertPurchase = typeof purchasesTable.$inferInsert;
export type SelectPurchase = InferSelectModel<typeof purchasesTable>;

export const cartTable = createTable("cart", {
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .primaryKey(),
  items: jsonb("items")
    .$type<
      {
        productId: string;
        quantity: number;
      }[]
    >()
    .default([])
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertCart = typeof cartTable.$inferInsert;
export type SelectCart = InferSelectModel<typeof cartTable>;
