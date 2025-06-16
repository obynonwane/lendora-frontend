import CryptoJS from "crypto-js";

const secretKey =
  "U2FsdU2FsdGVkX18zvOABOGRKMek4j231i042ijwfijnoeoi3erjfoi3ezvOABOU2FsdGVkX18zvOABOGRKM8KM7OPw7kr";

/**
 * Encrypts and saves an object to localStorage.
 * @param key - The localStorage key.
 * @param value - The data to store (object or string).
 * @returns The encrypted string, or null if it fails.
 */
export const saveToLocalStorage = (
  key: string,
  value: unknown
): string | null => {
  try {
    const stringified = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(stringified, secretKey).toString();
    localStorage.setItem(key, encrypted);
    return encrypted;
  } catch {
    return null;
  }
};

/**
 * Retrieves and decrypts data from localStorage.
 * @param key - The localStorage key.
 * @returns The parsed object, or null if not found or decryption fails.
 */
export const getFromLocalStorage = <T = unknown>(key: string): T | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;

    return JSON.parse(decrypted) as T;
  } catch {
    return null;
  }
};
