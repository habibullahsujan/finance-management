import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATA_BASE_URL!,
  },
});
