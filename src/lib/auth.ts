import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "./db/db"
import * as schema from "./db/auth-schema"
import { reactStartCookies } from "better-auth/react-start";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  plugins: [reactStartCookies()]
})
