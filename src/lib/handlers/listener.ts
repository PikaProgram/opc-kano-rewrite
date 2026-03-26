import type { BaileysEventMap } from "baileys";
import type { KanoClient } from "../client";
import fs from "fs/promises";
import path from "path";
import { type KanoEventMap, KanoEvents } from "./events";

abstract class Listener<K extends keyof (BaileysEventMap & KanoEventMap)> {
  constructor(
    public client: KanoClient,
    public readonly name: K
  ) { }

  public abstract execute: (args: (BaileysEventMap & KanoEventMap)[K], client: KanoClient) => Promise<void> | void;
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
        if (KanoEvents.includes(listenerInstance.name as keyof KanoEventMap)) {
          this.client.event.on(listenerInstance.name as keyof KanoEventMap, (args) => listenerInstance.execute(args, this.client));
        } else{
          this.client.socket.ev.on(listenerInstance.name as keyof BaileysEventMap, (args) => listenerInstance.execute(args, this.client));
        }
        console.log(`Loaded listener: ${listenerInstance.name} from ${file}`);
      } else if (stat.isDirectory()) {
        await this.load(path.resolve(basePath, listenerFolderPath, file));
      } else {
        console.warn(`Skipping file: ${file}`);
      }
    }
  }
}

export function CreateListener<K extends keyof (BaileysEventMap & KanoEventMap)>(
  name: K,
  execute:
    (args: (BaileysEventMap & KanoEventMap)[K], client: KanoClient) => Promise<void> | void) {
  return class extends Listener<K> {
    constructor(
      client: KanoClient
    ) {
      super(client, name);
    }
    public override execute = execute;
  };
}
