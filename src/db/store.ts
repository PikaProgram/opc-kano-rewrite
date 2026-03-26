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
  private generateKey(key: keyof typeof KanoStoreMessageKey, id: string): string {
    return `${KanoStoreMessageKey[key]}_${id}`;
  }

  async getMessage(key: keyof typeof KanoStoreMessageKey, messageID: string): Promise<WAMessage | undefined> {
    const data = await this.get(this.generateKey(key, messageID));
    return data ? JSON.parse(data) as WAMessage : undefined;
  }

  async setMessage(key: keyof typeof KanoStoreMessageKey, messageID: string, message: WAMessage): Promise<void> {
    this.set(this.generateKey(key, messageID), JSON.stringify(message));
  }

  async deleteMessage(key: keyof typeof KanoStoreMessageKey, messageID: string): Promise<void> {
    await this.delete(this.generateKey(key, messageID));
  }

  async getVOData(messageID: string): Promise<any> {
    const data = await this.get("VO_DATA" + messageID);
    return data ? JSON.parse(data) : undefined;
  }

  async setVOData(messageID: string, data: any): Promise<void> {
    this.set("VO_DATA" + messageID, JSON.stringify(data));
  }

  async deleteVOData(messageID: string): Promise<void> {
    await this.delete("VO_DATA" + messageID);
  }
}

export enum KanoStoreMessageKey {
  APPROVAL_MESSAGE,
  VO_MESSAGE
}