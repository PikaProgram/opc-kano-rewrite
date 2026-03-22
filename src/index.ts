import { LocalAuth } from "whatsapp-web.js";
import { KanoClient } from "./lib/client";
import qrcode from "qrcode-terminal";

const bot = new KanoClient({
  options: {
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth() // TODO: change depending on node env
  },
});

bot.initialize();

bot.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});