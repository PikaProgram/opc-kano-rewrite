import { Command, ChannelTypes, CommandContext } from "@/lib/handlers/commands";

export default class HelpCommand extends Command {
  public meta = {
    name: "help",
    description: "List all available commands or get detailed info about a specific command.",
    aliases: ["h"],
    usage: "!help [command]",
    category: "Utility",

    adminOnly: false,
    cooldown: 5,
    disabled: false,

    developerOnly: false,
    channelTypes: [ChannelTypes.Group, ChannelTypes.Private]
  };

  async execute(context: CommandContext) {
    const { args } = context;
    const commands = this.client.commandHandler.getAllCommands().filter(cmd => !cmd.meta.disabled && !cmd.meta.developerOnly);
    if (args.length === 0) {
      const commandCategories = new Map<string, Command[]>();

      for (const command of commands) {
        if (!commandCategories.has(command.meta.category)) {
          commandCategories.set(command.meta.category, []);
        }
        commandCategories.get(command.meta.category)!.push(command);
      }

      let helpMessage = "Available Commands:\n\n";
      for (const [category, cmds] of commandCategories) {
        helpMessage += `*${category}*\n`;
        for (const cmd of cmds) {
          helpMessage += `- *${cmd.meta.name}*: ${cmd.meta.description}\n`;
        }
        helpMessage += "\n";
      }

      await context.client.socket.sendMessage(context.message.key.remoteJid!, { text: helpMessage });
    } else {
      const commandName = args[0]!.toLowerCase();
      const command = this.client.commandHandler.getCommand(commandName);
      if (!command || command.meta.disabled || command.meta.developerOnly) {
        await context.client.socket.sendMessage(context.message.key.remoteJid!, { text: "Command not found." });
        return;
      }

      const { meta } = command;
      let helpMessage = `*${meta.name}*\n\n`;
      helpMessage += `*Description:* ${meta.description}\n`;
      helpMessage += `*Usage:* ${meta.usage}\n`;
      if (meta.aliases.length > 0) {
        helpMessage += `*Aliases:* ${meta.aliases.join(", ")}\n`;
      }
      helpMessage += `*Category:* ${meta.category}\n`;
      helpMessage += `*Cooldown:* ${meta.cooldown} seconds\n`;
      if (meta.adminOnly) {
        helpMessage += `*Group Admin Only:* Yes\n`;
      }
      if (meta.developerOnly) {
        helpMessage += `*Developer Only:* Yes\n`;
      }
      await context.client.socket.sendMessage(context.message.key.remoteJid!, { text: helpMessage });
    }
  }
}