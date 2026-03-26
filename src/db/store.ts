import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';
import { kanoEnv } from '@/lib/utils/env';
import { makeKeyvAuthState } from '@rodrigogs/baileys-store';
import { useMultiFileAuthState, type AuthenticationState, proto, type WAMessage } from 'baileys';

export async function createAuth(env: typeof kanoEnv): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void>; store: KanoStore; }> {
  if (env.NODE_ENV == "development") {
    const { state, saveCreds } = await useMultiFileAuthState('.kano_auth');
    const store = new KanoStore();

    return { state, saveCreds, store };
  } else {
    const store = new KanoStore({
      store: new KeyvPostgres({
        connectionString: env.DATABASE_URL,
      })
    });
    const { state, saveCreds } = await makeKeyvAuthState(store, '.kano_auth');
    return { state, saveCreds, store };
  }
}

export class KanoStore extends Keyv {
  async getMessage(key: keyof typeof KanoStoreKey, messageID: string): Promise<WAMessage | undefined> {
    const msgStore = await this.store.get(key) as Keyv<WAMessage> | undefined;
    if (!msgStore) {
      return undefined;
    }
    return await msgStore.get(messageID);
  }

  async setMessage(key: keyof typeof KanoStoreKey, messageID: string, message: WAMessage): Promise<void> {
    let msgStore = await this.store.get(key) as Keyv<WAMessage> | undefined;
    if (!msgStore) {
      msgStore = new Keyv();
    }
    await msgStore.set(messageID, message);
    await this.store.set(key, msgStore);
  }

  async deleteMessage(key: keyof typeof KanoStoreKey, messageID: string): Promise<void> {
    const msgStore = await this.store.get(key) as Keyv<WAMessage> | undefined;
    if (!msgStore) {
      return;
    }
    await msgStore.delete(messageID);
  }

  async setVOData(messageID: string, data: { mediaType: "image" | "video" | "audio"; url: string; mediaKey: Uint8Array<ArrayBufferLike>; }): Promise<void> {
    await this.set("VO_MESSAGE" + messageID, data);
  }

  async getVOData(messageID: string): Promise<{ mediaType: "image" | "video" | "audio"; url: string; mediaKey: Uint8Array<ArrayBufferLike>; } | undefined> {
    return await this.get("VO_MESSAGE" + messageID);
  }

  async deleteVOData(messageID: string): Promise<void> {
    await this.delete("VO_MESSAGE" + messageID);
  }
}

export enum KanoStoreKey {
  APPROVAL_MESSAGE,
  VO_MESSAGE
}