import type { BaileysEventMap } from "baileys";
import type { KanoClient } from "../client";
import fs from "fs/promises";
import path from "path";

abstract class Listener<K extends keyof BaileysEventMap> {
  constructor(
    public client: KanoClient,
    public readonly name: K
  ) { }

  public abstract execute: (args: BaileysEventMap[K], client: KanoClient) => Promise<void> | void;
}

export class ListenerHandler {
  constructor(
    public client: KanoClient,
  ) { }

  async load(listenerFolderPath: string) {
    const basePath = path.resolve(process.cwd(), "src");
    const listenerFiles = await fs.readdir(path.resolve(basePath, listenerFolderPath));
    for (const file of listenerFiles) {
      const stat = await fs.stat(path.resolve(basePath, listenerFolderPath, file));
      if (stat.isFile() && file.endsWith(".ts")) {
        const listenerModule = await import(path.resolve(basePath, listenerFolderPath, file));
        if (!listenerModule.default || typeof listenerModule.default !== "function") {
          console.warn(`Invalid listener format in ${file}, skipping.`);
          continue;
        }
        const ListenerClass: ReturnType<typeof CreateListener> = listenerModule.default;
        const listenerInstance = new ListenerClass(this.client);
        this.client.socket.ev.on(listenerInstance.name, (args) => listenerInstance.execute(args, this.client));
        console.log(`Loaded listener: ${listenerInstance.name} from ${file}`);
      } else if (stat.isDirectory()) {
        await this.load(path.resolve(basePath, listenerFolderPath, file));
      } else {
        console.warn(`Skipping file: ${file}`);
      }
    }
  }
}

export function CreateListener<K extends keyof BaileysEventMap>(
  name: K,
  execute:
    (args: BaileysEventMap[K], client: KanoClient) => Promise<void> | void) {
  return class extends Listener<K> {
    constructor(
      client: KanoClient
    ) {
      super(client, name);
    }
    public override execute = execute;
  };
}

