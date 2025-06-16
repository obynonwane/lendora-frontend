import CryptoJS from "crypto-js";
import type { StateStorage } from "zustand/middleware";

const secretKey = "U2FsdGVkX1...your_secret_key";

export const encryptedStorage: StateStorage = {
  getItem: (name) => {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch {
      return null;
    }
  },

  setItem: (name, value) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();
      localStorage.setItem(name, encrypted);
    } catch {
      // optionally handle error
    }
  },

  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
