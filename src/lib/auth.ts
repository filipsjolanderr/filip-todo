import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Pool } from "pg";

// Database connection - use local PostgreSQL by default
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/filip_todo";

// For Better Auth, we'll use the Pool adapter since it's well-supported
const pool = new Pool({
  connectionString,
  // Add connection timeout and retry settings
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// For Drizzle operations, we'll use postgres-js
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
export const db = drizzle(client);

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    // Add social providers as needed
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
  // Optional: Add plugins for additional features
  // plugins: [admin(), twoFactor(), phoneNumber(), username()],
}); 