import { ChannelTypes, Command, type CommandContext } from "@/lib/handlers/commands";

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
    const sentMessage = await context.message.reply("Pinging...");
    const latency = Date.now() - start;
    setTimeout(async () => {
      await sentMessage.edit(`Pong! Latency: ${latency}ms`);
    }, 5000);
  }
}