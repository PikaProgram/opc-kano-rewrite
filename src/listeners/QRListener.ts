import type { KanoClient } from "@/lib/client";
import { Listener } from "@/lib//handlers/listener";
import qrcode from "qrcode-terminal";

export default class QRListener extends Listener {
  constructor(client: KanoClient) {
    super(client, "qr");
  }

  async execute(qr: string) {
    console.log("QR code received:");
    qrcode.generate(qr, { small: true });
  }
}