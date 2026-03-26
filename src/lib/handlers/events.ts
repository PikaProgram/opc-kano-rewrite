import { EventEmitter } from "events";
import { proto, type WAMessage, type WAMessageKey } from "baileys";

export class KanoEventEmitter<T extends Record<string | symbol, any>> extends EventEmitter {
  override emit<K extends keyof T>(eventName: K, payload: T[K]): boolean {
    return super.emit(eventName as string, payload);
  }

  override on<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.on(eventName as string, listener);
  }

  override once<K extends keyof T>(eventName: K, listener: (payload: T[K]) => void): this {
    return super.once(eventName as string, listener);
  }
}

export interface KanoEventMap {
  "approval.reaction": {
    reaction: proto.IReaction;
    key: WAMessageKey;
  };
};

export const KanoEvents = ["approval.reaction"];