import { CreateListener } from "@/lib/handlers/listener";
import { downloadEncryptedContent, getMediaKeys } from "baileys";

type MediaType = "image" | "video" | "audio";

type StoredMediaKey =
  | Uint8Array
  | number[]
  | string
  | { type: "Buffer"; data: number[] };

type StoredVOData = {
  mediaType: MediaType;
  url: string;
  mediaKey: StoredMediaKey;
};

function normalizeMediaKey(mediaKey: StoredMediaKey): Uint8Array {
  if (mediaKey instanceof Uint8Array) {
    return mediaKey;
  }

  if (typeof mediaKey === "string") {
    return Buffer.from(mediaKey, "base64");
  }

  if (Array.isArray(mediaKey)) {
    return Uint8Array.from(mediaKey);
  }

  if (mediaKey && mediaKey.type === "Buffer" && Array.isArray(mediaKey.data)) {
    return Uint8Array.from(mediaKey.data);
  }

  throw new Error("Invalid mediaKey format in stored VO data");
}

export default CreateListener("approval.reaction", async function (args, client) {
  const { reaction, key } = args;
  const voData = await client.store.getVOData(key.id!) as StoredVOData | undefined;
  const approvalMessage = await client.store.getMessage("APPROVAL_MESSAGE", key.id!);

  async function sendMedia(mediaType: MediaType) {
    if (!voData) {
      return;
    }

    const { url } = voData;
    const mediaKey = normalizeMediaKey(voData.mediaKey);
    const { cipherKey, iv } = await getMediaKeys(mediaKey, mediaType);
    const mediaStream = await downloadEncryptedContent(url, {
      cipherKey,
      iv,
    });

    if (mediaType === "image") {
      await client.socket.sendMessage(key.remoteJid!, {
        image: { stream: mediaStream },
      }, { quoted: approvalMessage });
      return;
    }

    if (mediaType === "video") {
      await client.socket.sendMessage(key.remoteJid!, {
        video: { stream: mediaStream },
      }, { quoted: approvalMessage });
      return;
    }

    await client.socket.sendMessage(key.remoteJid!, {
      audio: { stream: mediaStream },
    }, { quoted: approvalMessage });
  }

  if (["✅", "☑️", "✔️"].includes(reaction.text!)) {
    if (!voData && !approvalMessage) {
      await client.socket.sendMessage(key.remoteJid!, {
        text: "The original message cannot be found, it may have been too old.",
      }, { quoted: approvalMessage });
      return;
    }

    try {
      if (voData?.mediaType === "image") {
        await sendMedia("image");
      } else if (voData?.mediaType === "video") {
        await sendMedia("video");
      } else if (voData?.mediaType === "audio") {
        await sendMedia("audio");
      }
    } catch {
      await client.socket.sendMessage(key.remoteJid!, {
        text: "Unable to decrypt the original media. It may have expired or no longer be available.",
      }, { quoted: approvalMessage });
    }
  }
});