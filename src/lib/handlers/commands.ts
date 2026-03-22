import { type Command, type CommandContext, HandleCommand } from "@/lib/types/handlers";
import fs from "fs/promises";
import path from "path";

export class CommandHandler {
  private commands: Map<string[], typeof HandleCommand>;

  constructor() {
    this.commands = new Map();
  }

  register(command: Command) {
    this.commands.set([command.name, ...command.aliases], command.execute);
  }

  async handle(command: string, context: CommandContext) {
    const cmd: typeof HandleCommand | undefined = this.commands.get([command]);
    if (cmd) {
      await cmd(context);
    } else {
      console.warn(`No handler registered for command: ${command}`);
    }
  }

  async readCommands(folder: string) {
    const absolutePath = path.resolve(process.cwd(), folder);
    const commandFiles = await fs.readdir(absolutePath);

    for (const file of commandFiles) {
      if (file.endsWith(".ts") || file.endsWith(".js")) {
        try {
          const commandModule = await import(path.join(absolutePath, file));
          const command: Command = commandModule.default;
          this.register(command);
        } catch (error) {
          console.error(`Error importing command file: ${file}`, error);
        }
      }
    }
  }
}