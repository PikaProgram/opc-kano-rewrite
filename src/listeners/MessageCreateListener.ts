import type { KanoClient } from "@/lib/client";
import { CommandContext } from "@/lib/handlers/commands";
import { Listener } from "@/lib/handlers/listener";
import type { Message } from "whatsapp-web.js";

export default class MessageCreateListener extends Listener {
  constructor(client: KanoClient) {
    super(client, "message_create");
  }

  async execute(message: Message) {
    // if (message.fromMe) return; // Ignore messages sent by the bot itself

    if (message.body.startsWith("!")) {
      const [cmd, ...args]: string[] = message.body.substring(1).trim().split(/\s+/);
      const command = this.client.commandHandler.get(cmd!.toLowerCase());

      if (command) {
        try {
          const ctx = new CommandContext(this.client, message, args);
          await command.execute(ctx);
        } catch (error) {
          console.error(`Error executing command ${command.meta.name}:`, error);
          await message.reply("An error occurred while executing that command.");
        }
      }
    }
  }
}