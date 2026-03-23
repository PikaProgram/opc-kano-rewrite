import type { KanoClient } from "@/lib/client";
import { Listener } from "@/lib/handlers/listener";

export default class ReadyListener extends Listener {
  constructor(client: KanoClient) {
    super(client, "ready");
  }

  async execute() {
    console.log("Client is ready!");
  }
}