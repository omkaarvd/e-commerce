import { InferSelectModel, sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTableCreator,
  text,
  timestamp,
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
  },
  (table) => [
    index("search_index").using(
      "gin",
      sql`(
          setweight(to_tsvector('english', ${table.name}), 'A') ||
          setweight(to_tsvector('english', ${table.description}), 'B') ||
          setweight(to_tsvector('english', ${table.color}), 'C')
      )`
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
