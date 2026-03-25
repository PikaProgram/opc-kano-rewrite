import type { KanoClient } from "@/lib/client";
import { Boom } from "@hapi/boom";
import { CreateListener } from "@/lib/handlers/listener";
import qrcode from "qrcode-terminal";
import { DisconnectReason } from "baileys";

export default CreateListener("connection.update", async function (args, client: KanoClient) {
  const { connection, lastDisconnect, qr } = args;
  if (connection) {
    switch (connection) {
      case "open":
        console.log("Connection opened");
        break;
      case "close":
        if ((lastDisconnect?.error as Boom).output?.statusCode === DisconnectReason.restartRequired) {
          console.log("Connection closed, reconnecting...");
          client.reconnect(lastDisconnect?.error as Error);
        }
        break;
      case "connecting":
        console.log("Connecting...");
        break;
    }
  }
  if (qr) {
    qrcode.generate(qr, { small: true });
  }
});