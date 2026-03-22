import * as v from "valibot";
import { createEnv } from "valibot-env";

export const kanoEnv = createEnv({
  schema: {
    private: {
      DATABASE_URL: v.pipe(
        v.string(),
        v.nonEmpty("DATABASE_URL cannot be empty"),
        v.url("DATABASE_URL must be a valid URL"),
        v.startsWith("postgres://", "DATABASE_URL must start with postgres://")
      ),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")])
    },
  },
  values: process.env
});