import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Supabase Postgres requires SSL. Without this, connections can hang
    // indefinitely instead of failing fast, which shows up as a page that
    // "just sits there loading" until the serverless function times out.
    ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    // Keep the per-instance pool small — on Vercel every function
    // invocation can spin up its own pool, so a large `max` here quickly
    // exhausts Supabase's connection limit (especially on the pooler).
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
