import { KanoClient } from "./lib/client";
import { Browsers, fetchLatestWaWebVersion, useMultiFileAuthState } from "baileys";
import P from "pino";
import { createAuth } from "./db/store";
import { kanoEnv } from "./lib/utils/env";

try {
  const { state, saveCreds, store } = await createAuth(kanoEnv);
  const { version, isLatest } = await fetchLatestWaWebVersion();
  // const { state, saveCreds } = await useMultiFileAuthState('.baileys_auth');
  const bot = new KanoClient({
    version: version,
    browser: Browsers.ubuntu("Google Chrome"),
    auth: state,
    logger: P({
      level: "silent",
      transport: {
        target: "pino-pretty",
      }
    }),
  }, store);

  bot.socket.ev.on("creds.update", saveCreds);

  await bot.build();
} catch (error) {
  console.error("Failed to initialize WhatsApp client:", error);
  process.exit(1);
}