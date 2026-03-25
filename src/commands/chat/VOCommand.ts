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
  }
}