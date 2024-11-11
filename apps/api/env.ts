/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  UNKEY_TOKEN: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_SUBSCRIPTION_ITEM_ID: z.string(),
  RUNPOD_ENDPOINT_ID: z.string(),
  RUNPOD_API_KEY: z.string(),
})

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: parsedEnv, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

// Since we exit the process if there's an error,
// we can safely assert that parsedEnv exists here
export const env = parsedEnv as Env;
