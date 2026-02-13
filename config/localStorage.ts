/** Client-only storage. Auth uses BFF + HttpOnly cookie; no token stored here. */
export enum LocalStorageKeys {
  SESSION_MODE = "crocante_session_mode",
}

export const LocalStorageManager = {
  setItem(key: string, item: any) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Failed while saving to localStorage: ${error}`);
    }
  },
  getItem(key: string) {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed while getting from localStorage: ${error}`);
      return null;
    }
  },
  clearLocalStorage() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LocalStorageKeys.SESSION_MODE);
  },
};
