import { CreateListener } from "@/lib/handlers/listener";
import { downloadEncryptedContent, getMediaKeys } from "baileys";

export default CreateListener("approval.reaction", async function (args, client) {
  const { reaction, key } = args;
  const voData = await client.store.getVOData(key.id!);
  const approvalMessage = await client.store.getMessage("APPROVAL_MESSAGE", key.id!);
  console.log("VO data in approval reaction listener", JSON.stringify(voData, null, 2));
  console.log("Approval message in approval reaction listener", JSON.stringify(approvalMessage, null, 2));
  if (["✅", "☑️", "✔️"].includes(reaction.text!)) {
    if (!voData && !approvalMessage) {
      await client.socket.sendMessage(key.remoteJid!, {
        text: "The original message cannot be found, it may have been too old.",
      }, { quoted: approvalMessage });
      return;
    }
    if (voData?.mediaType === "image") {
      const { url, mediaKey } = voData;
      const { cipherKey, iv } = await getMediaKeys(mediaKey, "image");
      const imageStream = await downloadEncryptedContent(url, {
        cipherKey: cipherKey,
        iv: iv
      });
      await client.socket.sendMessage(key.remoteJid!, {
        image: {
          stream: imageStream,
        },
      }, { quoted: approvalMessage });
    }

    else if (voData?.mediaType === "video") {
      const { url, mediaKey } = voData;
      const { cipherKey, iv } = await getMediaKeys(mediaKey, "video");
      const videoStream = await downloadEncryptedContent(url, {
        cipherKey: cipherKey,
        iv: iv
      });

      await client.socket.sendMessage(key.remoteJid!, {
        video: {
          stream: videoStream,
        },
      }, { quoted: approvalMessage });

    } else if (voData?.mediaType === "audio") {
      const { url, mediaKey } = voData;
      const { cipherKey, iv } = await getMediaKeys(mediaKey, "audio");
      const audioStream = await downloadEncryptedContent(url, {
        cipherKey: cipherKey,
        iv: iv
      });
      await client.socket.sendMessage(key.remoteJid!, {
        audio: {
          stream: audioStream,
        }
      }, { quoted: approvalMessage });
    }
  }
});