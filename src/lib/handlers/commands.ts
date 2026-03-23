import fs from "fs/promises";
import path from "path";
import type { Message, GroupChat, PrivateChat } from "whatsapp-web.js";
import type { KanoClient } from "../client";

export abstract class Command implements CommandComponent {
  public constructor(
    public client: KanoClient,
  ) { }
  
  public abstract meta: CommandComponent["meta"]
  public abstract execute(context: CommandContext): Promise<void> | void;
}

export enum ChannelTypes {
  Group = "group",
  Private = "private"
}

export interface CommandComponent {
  meta: {
    // Identity
    name: string;
    description: string;
    aliases: string[];
    usage: string;
    category: string;

    // Admin flags
    adminOnly: boolean;
    cooldown: number;
    disabled: boolean;

    // Developer flags
    developerOnly: boolean;
    channelTypes: ChannelTypes[];
  };

  execute(context: CommandContext): Promise<void> | void;
}

export class CommandContext {
  public client: KanoClient;
  public message: Message;
  
  constructor(
    client: KanoClient,
    message: Message,
    public args: string[],
  ) {
    this.client = client;
    this.message = message;
  }
}

export class CommandHandler {
  private commands: Map<string, Command>;
  private aliases: Map<string, string>;

  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
  }

  async load(commandFolderPath: string) {
    const basePath = path.resolve(process.cwd(), "src");
    const commandFiles = await fs.readdir(path.resolve(basePath, commandFolderPath));
    for (const file of commandFiles) {
      const stat = await fs.stat(path.resolve(basePath, commandFolderPath, file));
      if (stat.isFile() && file.endsWith(".ts")) {
        const commandModule = await import(path.resolve(basePath, commandFolderPath, file));
        const command: Command = new commandModule.default();
        this.register(command);
        console.log(`Loaded command: ${command.meta.name}`);
      } else if (stat.isDirectory()) {
        await this.load(path.resolve(commandFolderPath, file));
      } else {
        console.warn(`Skipping file: ${file}`);
      }
    }
  }

  register(command: Command) {
    this.commands.set(command.meta.name, command);
    for (const alias of command.meta.aliases) {
      this.aliases.set(alias, command.meta.name);
    }
  }

  get(name: string): Command | undefined {
    const commandName = this.aliases.get(name) || name;
    return this.commands.get(commandName);
  }
}