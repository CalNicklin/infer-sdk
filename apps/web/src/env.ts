import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  expand(config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    ),
  }));
}

const EnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  UNKEY_TOKEN: z.string(),
  UNKEY_API_ID: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PRICE_ID: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

export type Env = z.infer<typeof EnvSchema>;

const { success, data: parsedEnv, error } = EnvSchema.safeParse(process.env);

if (!success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsedEnv;
