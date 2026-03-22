import { Client, type ClientOptions } from "whatsapp-web.js";

export class KanoClient extends Client {
  constructor({ options }: { options: ClientOptions; }) {
    super(options);
  }
}