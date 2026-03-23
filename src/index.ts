import { LocalAuth } from "whatsapp-web.js";
import { KanoClient } from "./lib/client";

const bot = new KanoClient({
  options: {
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth() // TODO: change depending on node env
  },
});

bot.build();