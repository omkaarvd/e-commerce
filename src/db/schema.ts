import { InferSelectModel } from "drizzle-orm";
import { pgTableCreator, text, doublePrecision } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `e_com_${name}`);

export const productsTable = createTable("products", {
  id: text().notNull().primaryKey(),
  imageURL: text("image_url").notNull(),
  name: text("name").notNull(),
  size: text({ enum: ["S", "M", "L"] }).notNull(),
  color: text({
    enum: ["white", "beige", "blue", "green", "purple"],
  }).notNull(),
  price: doublePrecision().notNull(),
});

export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = InferSelectModel<typeof productsTable>;
