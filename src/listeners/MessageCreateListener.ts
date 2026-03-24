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
    if (!message.body.startsWith("!")) {
      return;
    }

    const [cmd, ...args] = message.body.substring(1).trim().split(/\s+/);
    const context = new CommandContext(this.client, message, args);

    try {
      // If OWNER_ONLY is false, anyone can use commands. If it's true, only the owner (or messages from the bot itself) can use commands.
      if (kanoEnv.OWNER_ONLY) {
        const author = await context.getAuthor();
        if (author.number !== kanoEnv.OWNER_PHONE_NUMBER && !message.fromMe) {
          console.log("rejected", cmd);
          return;
        }
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