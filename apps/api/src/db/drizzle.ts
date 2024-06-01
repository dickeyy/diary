import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../../config";

// import schemas
import * as schema from "./schema";

// for query purposes
const queryClient = postgres(config.db.url);
const db = drizzle(queryClient, {
    schema: schema,
});

export default db;
