import { KanoClient } from "./lib/client";
import { Browsers, fetchLatestWaWebVersion, useMultiFileAuthState } from "baileys";
import P from "pino";
import pretty from "pino-pretty";

try {
  // const { state, saveCreds } = await createAuth(kanoEnv);
  const { version, isLatest } = await fetchLatestWaWebVersion();
  const { state, saveCreds } = await useMultiFileAuthState('.baileys_auth');
  const bot = new KanoClient({
    version: version,
    browser: Browsers.ubuntu("Google Chrome"),
    shouldSyncHistoryMessage: (() => false),
    auth: state,
    logger: P({
      transport: {
        target: "pino-pretty",
      }
    })
  });

  bot.socket.ev.on("creds.update", saveCreds);

  await bot.build();
} catch (error) {
  console.error("Failed to initialize WhatsApp client:", error);
  process.exit(1);
}