import { Client, type ClientOptions } from "whatsapp-web.js";
import { CommandHandler } from "./handlers/commands";
import { ListenerHandler } from "./handlers/listener";

export class KanoClient extends Client {
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;

  constructor({ options }: { options: ClientOptions; }) {
    super(options);
    this.commandHandler = new CommandHandler();
    this.listenerHandler = new ListenerHandler();
  }

  public async build() {
    await this.commandHandler.load("commands");
    await this.listenerHandler.load("listeners", this);

    this.initialize();
  }
}