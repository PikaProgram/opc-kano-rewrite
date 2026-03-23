import { ChannelTypes, Command, type CommandContext } from "@/lib/handlers/commands";
import type { Message } from "whatsapp-web.js";

export default class PingCommand extends Command {
  public meta = {
    name: "ping",
    description: "Check the bot's latency.",
    aliases: ["p"],
    usage: "!ping",
    category: "Utility",

    adminOnly: false,
    cooldown: 5,
    disabled: false,

    developerOnly: false,
    channelTypes: [ChannelTypes.Group, ChannelTypes.Private]
  };

  async execute(context: CommandContext) {
    const start = Date.now();
    await context.message.reply("Pong!");
    const latency = Date.now() - start;
    await context.message.reply(`Latency: ${latency}ms`);
  }
}