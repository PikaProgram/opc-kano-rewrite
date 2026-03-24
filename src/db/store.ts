import { Pool } from "pg";
import { RemoteAuth } from "whatsapp-web.js";
// @ts-ignore-next-line fuckass wrong package typing
import { PostgresStore } from "wwebjs-postgres";

export function createRemoteAuth() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  const store = new PostgresStore({
    pool: pool,
    tableName: "whatsapp_sessions",
    sessionTTL: 60 * 60 * 24 * 7 // 7 days
  });

  return new RemoteAuth({ store, backupSyncIntervalMs: 5 * 60 * 1000 });
}