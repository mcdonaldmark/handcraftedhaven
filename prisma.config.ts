import "dotenv/config";          // loads .env into process.env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // tells Prisma where your schema is
  datasource: {
    url: env("DATABASE_URL"),    // reads DATABASE_URL from .env
  },
});
