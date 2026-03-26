import makeWASocket, { type UserFacingSocketConfig } from "baileys";
import { CommandHandler } from "./handlers/commands";
import { ListenerHandler } from "./handlers/listener";
import { KanoStore } from "@/db/store";
import { KanoEventEmitter, type KanoEventMap } from "./handlers/events";

export class KanoClient {
  private config: UserFacingSocketConfig;
  public socket: ReturnType<typeof makeWASocket>;
  public store: KanoStore;
  public event: KanoEventEmitter<KanoEventMap>;
  
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;

  constructor(config: UserFacingSocketConfig, store: KanoStore) {
    this.config = config;
    this.store = store || new KanoStore();
    this.socket = makeWASocket(this.config);
    this.commandHandler = new CommandHandler(this);
    this.listenerHandler = new ListenerHandler(this);
    this.event = new KanoEventEmitter<KanoEventMap>();
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