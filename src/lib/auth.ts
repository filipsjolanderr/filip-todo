import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Pool } from "pg";

// Database connection
const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/filip_todo";

// For Better Auth, we'll use the Pool adapter since it's well-supported
const pool = new Pool({
  connectionString,
});

// For Drizzle operations, we'll use postgres-js
const client = postgres(connectionString);
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