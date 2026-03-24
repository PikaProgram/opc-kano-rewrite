import { LocalAuth, RemoteAuth } from "whatsapp-web.js";
import { KanoClient } from "./lib/client";
import { kanoEnv } from "./lib/utils/env";
import { createRemoteAuth } from "./db/store";

try {
  const bot = new KanoClient({
    options: {
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      authStrategy: (kanoEnv.NODE_ENV === "production" ? createRemoteAuth() : new LocalAuth()),
    },
  });

  await bot.build();
} catch (error) {
  console.error("Failed to initialize WhatsApp client:", error);
  process.exit(1);
}