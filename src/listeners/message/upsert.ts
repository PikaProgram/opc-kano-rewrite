import type { KanoClient } from "@/lib/client";
import { CreateListener } from "@/lib/handlers/listener";
import { kanoEnv } from "@/lib/utils/env";

export default CreateListener("messages.upsert", async function (args, client: KanoClient) {
  const { messages, type } = args;
  if (type === "notify") {
    for (const message of messages) {
      // If owner-only mode is enabled, ignore messages that are not from the owner or sent by the bot itself
      if (
        kanoEnv.OWNER_ONLY &&
        !(message.key.fromMe || message.key.participant === kanoEnv.OWNER_PHONE_NUMBER)
      ) {
        continue;
      }

      if (message.message?.conversation?.startsWith("!")) {
        const [cmdName, ...args] = message.message.conversation.slice(1).trim().split(/\s+/);
        const command = client.commandHandler.getCommand(cmdName!.toLowerCase());
        if (command) {
          try {
            await command.execute({
              client,
              message,
              args,
            });
          } catch (error) {
            console.error(`Error executing command ${cmdName}:`, error);
          }
        } else {
          console.warn(`Command not found: ${cmdName}`);
        }
      }
    }
  }
});