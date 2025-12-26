export enum LocalStorageKeys {
  TOKEN = "crocante_token",
  SESSION_MODE = "crocante_session_mode",
}

export const LocalStorageManager = {
  setItem(key: string, item: any) {
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error al guardar en localStorage: ${error}`);
    }
  },
  getItem(key: string) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error al obtener de localStorage: ${error}`);
      return null;
    }
  },
  clearLocalStorage() {
    localStorage.removeItem(LocalStorageKeys.TOKEN);
    localStorage.removeItem(LocalStorageKeys.SESSION_MODE);
  },
};
