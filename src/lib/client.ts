import makeWASocket, { type UserFacingSocketConfig } from "baileys";
import { CommandHandler } from "./handlers/commands";
import { ListenerHandler } from "./handlers/listener";

export class KanoClient {
  private config: UserFacingSocketConfig;
  public socket: ReturnType<typeof makeWASocket>;
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;

  constructor(config: UserFacingSocketConfig) {
    this.config = config;
    this.socket = makeWASocket(config);
    this.commandHandler = new CommandHandler(this);
    this.listenerHandler = new ListenerHandler(this);
  }

  public async build() {
    await this.commandHandler.load("commands");
    await this.listenerHandler.load("listeners");
  }

  public async reconnect(err: Error) {
    this.socket.end(err);
    // Recreate the socket connection
    this.socket = makeWASocket(this.config);
  }
}