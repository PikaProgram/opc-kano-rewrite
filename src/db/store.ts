import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';
import { kanoEnv } from '@/lib/utils/env';
import { makeKeyvAuthState } from '@rodrigogs/baileys-store';
import { useMultiFileAuthState, type AuthenticationState } from 'baileys';

export async function createAuth(env: typeof kanoEnv): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void>; }> {
  if (env.NODE_ENV == "development") {
    const { state, saveCreds } = await useMultiFileAuthState('kano_auth');
    return { state, saveCreds };
  } else {
    const store = new Keyv({
      store: new KeyvPostgres({
        connectionString: env.DATABASE_URL,
      })
    });
    const { state, saveCreds } = await makeKeyvAuthState(store, 'kano_auth');
    return { state, saveCreds };
  }
}