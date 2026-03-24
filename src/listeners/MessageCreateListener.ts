import type { KanoClient } from "@/lib/client";
import { CommandContext } from "@/lib/handlers/commands";
import { Listener } from "@/lib/handlers/listener";
import { kanoEnv } from "@/lib/utils/env";
import type { Message } from "whatsapp-web.js";

export default class MessageCreateListener extends Listener {
  constructor(client: KanoClient) {
    super(client, "message_create");
  }

  async execute(message: Message) {
    const [cmd, ...args] = message.body.substring(1).trim().split(/\s+/);
    const context = new CommandContext(this.client, message, args);
    try {
      // If owner-only mode is enabled, only allow the owner and messages sent by the bot itself to be processed
      if (!kanoEnv.OWNER_ONLY || (await context.getAuthor()).number === kanoEnv.OWNER_PHONE_NUMBER || message.fromMe) {
        return;
      }

      const command = this.client.commandHandler.getCommand(cmd!.toLowerCase());
      if (command) {
        try {
          await command.execute(context);
        } catch (error) {
          console.error("Error executing command:", error);
        }
      }
    }
    catch (error) {
      console.error("Error in message_create listener:", error);
    }
  }
}