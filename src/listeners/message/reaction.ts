import type { KanoClient } from "@/lib/client";
import { CreateListener } from "@/lib/handlers/listener";
import type { WAMessage, proto } from "baileys";

export default CreateListener("messages.reaction", async function (args, client: KanoClient) {
  for (const { reaction, key } of args) {
    if (["✅", "☑️", "✔️"].includes(reaction.text!)) {
      const approvalMessage = await client.store.getMessage("APPROVAL_MESSAGE", key.id!);
      const voData = await client.store.getVOData(key.id!);
      if (!!voData && !!approvalMessage) {
        client.event.emit("approval.reaction", {
          reaction,
          key,
        });
      }
    }
  }
});