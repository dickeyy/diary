import { defineConfig } from "drizzle-kit";
import config from "./config";
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: config.db.url
    },
    verbose: true,
    strict: true,
    dialect: "postgresql"
});
