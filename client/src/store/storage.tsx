import { createMMKV } from "react-native-mmkv";

const tokenKey = process.env.MMKV_TOKEN_KEY!;
const storageKey = process.env.MMKV_STORAGE_KEY!;

export const tokenStorage = createMMKV({
  id: "token-storage",
  encryptionKey: tokenKey,
});

export const storage = createMMKV({
  id: "my-app-storage",
  encryptionKey: storageKey,
});

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },

  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },

  removeItem: (key: string) => {
    storage.remove(key);
  },
};
