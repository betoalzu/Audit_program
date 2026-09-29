import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

function createDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to use persistent interview storage.");
  }

  return drizzle(postgres(connectionString, { max: 5 }), { schema });
}

const globalForDatabase = globalThis as typeof globalThis & {
  atlasDatabase?: ReturnType<typeof createDatabase>;
};

export function getDatabase() {
  globalForDatabase.atlasDatabase ??= createDatabase();
  return globalForDatabase.atlasDatabase;
}