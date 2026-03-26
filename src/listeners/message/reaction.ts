import type { KanoClient } from "@/lib/client";
import { CreateListener } from "@/lib/handlers/listener";

export default CreateListener("messages.reaction", async function (args, client: KanoClient) {
  for (const { reaction, key } of args) {
    if (["✅", "☑️", "✔️"].includes(reaction.text!)) {
      const approvalMessage = await client.store.getMessage("APPROVAL_MESSAGE", key.id!);
      const voData = await client.store.getVOData(key.id!);
      const groupMetadata = await client.socket.groupMetadata(reaction.key!.remoteJid!);
      const originalSender = groupMetadata.participants.find(p => p.phoneNumber?.split("@")[0] === voData?.participantPhoneNumber)?.id
      if ((!!voData && !!approvalMessage) && (reaction.key?.participant === originalSender)) {
        client.event.emit("approval.reaction", {
          reaction,
          key,
        });
      }
    }
  }
});