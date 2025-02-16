import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("🥲 Database credentials missing!");
}

export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  entities: {
    roles: {
      provider: "neon",
    },
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
