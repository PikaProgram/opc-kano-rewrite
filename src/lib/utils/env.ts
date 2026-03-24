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
      OWNER_PHONE_NUMBER: v.pipe(
        v.string(),
        v.nonEmpty("OWNER_PHONE_NUMBER cannot be empty"),
        v.regex(/^\d+$/, "OWNER_PHONE_NUMBER must contain only digits")
      ),
    },
    public: {
      OWNER_ONLY: v.pipe(
        v.string(),
        v.nonEmpty("OWNER_ONLY cannot be empty"),
        v.union([v.literal("true"), v.literal("false")], "OWNER_ONLY must be 'true' or 'false'"),
        v.transform((value) => value === "true")
      )
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: process.env
});