import type { Events } from "whatsapp-web.js";
import type { KanoClient } from "../client";
import fs from "fs/promises";
import path from "path";

export abstract class Listener {
  constructor(
    public client: KanoClient,
    public readonly name: `${Events}`, // Lord forgive me
  ) { }

  public abstract execute(...args: any[]): Promise<void> | void;
}

export class ListenerHandler {
  constructor() {  }

  async load(listenerFolderPath: string, client: KanoClient) {
    const basePath = process.cwd();
    const listenerFiles = await fs.readdir(path.resolve(basePath, "src", listenerFolderPath));
    for (const file of listenerFiles) {
      const stat = await fs.stat(path.resolve(basePath, "src", listenerFolderPath, file));
      if (stat.isFile() && file.endsWith(".ts")) {
        const listenerModule = await import(path.resolve(basePath, "src", listenerFolderPath, file));
        const listener: Listener = new listenerModule.default(client);
        client.on(listener.name, (...args) => listener.execute(...args));
        console.log(`Loaded listener: ${listener.name}`);
      } else if (stat.isDirectory()) {
        await this.load(path.resolve(listenerFolderPath, file), client);
      } else {
        console.warn(`Skipping file: ${file}`);
      }
    }
  }
}