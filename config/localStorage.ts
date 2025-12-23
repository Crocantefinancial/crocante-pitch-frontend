export enum LocalStorageKeys {
  TOKEN = "crocante_token",
  LANG = "crocante_lang",
  USERNAME = "crocante_username",
  TOKEN_REGISTER = "crocante_token_register",
  CLIENT = "crocante_client_info",
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
    localStorage.removeItem(LocalStorageKeys.CLIENT);
  },
};
