import { ChannelTypes, Command, CommandContext } from "@/lib/handlers/commands";

export default class VOCommand extends Command {
  public meta = {
    name: "vo",
    description: "Sends a copy of a view-once message.",
    aliases: [],
    usage: "!vo",
    category: "Chat",

    adminOnly: false,
    cooldown: 10,
    disabled: false,

    developerOnly: false,
    channelTypes: [ChannelTypes.Group, ChannelTypes.Private]
  };

  async execute(context: CommandContext) {
    const { message } = context;
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quotedMessage = message.message.extendedTextMessage.contextInfo.quotedMessage;
      if (!quotedMessage.imageMessage?.viewOnce && !quotedMessage.videoMessage?.viewOnce && !quotedMessage.audioMessage?.viewOnce) {
        await context.client.socket.sendMessage(message.key.remoteJid!, {
          text: "The quoted message is not a view-once message."
        }, { quoted: message });
        return;
      }

      const authorPart = message.message.extendedTextMessage.contextInfo!.participant!;
      const approvalMsg = await context.client.socket.sendMessage(message.key.remoteJid!, {
        text: "Awaiting approval from @" + authorPart.split("@")[0] + " to view the image.\nReact with ✅ to approve, ❌ or ignore to reject.",
        mentions: [authorPart]
      }, { quoted: message });

      await context.client.store.setMessage("APPROVAL_MESSAGE", approvalMsg!.key.id!, approvalMsg!);
      const mediaKey = quotedMessage.imageMessage?.viewOnce
        ? quotedMessage.imageMessage.mediaKey
        : quotedMessage.videoMessage?.viewOnce
          ? quotedMessage.videoMessage.mediaKey
          : quotedMessage.audioMessage!.mediaKey;

      await context.client.store.setVOData(approvalMsg!.key.id!, {
        mediaType: quotedMessage.imageMessage?.viewOnce ? "image" : quotedMessage.videoMessage?.viewOnce ? "video" : "audio",
        url: quotedMessage.imageMessage?.viewOnce ? quotedMessage.imageMessage.url : quotedMessage.videoMessage?.viewOnce ? quotedMessage.videoMessage.url! : quotedMessage.audioMessage!.url!,
        mediaKey: Buffer.from(mediaKey!).toString("base64"),
        participantPhoneNumber: authorPart.split("@")[0]
      });
    }
  }
}