import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { authApi } from "@/services/api/utils";
import { LoginRequest } from "./schemas";

/** BFF login: session is HttpOnly cookie; no token in response or client. */
export const LoginService = {
  async loginMock(): Promise<boolean> {
    LocalStorageManager.clearLocalStorage();
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "mock");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }
    return Promise.resolve(true);
  },

  async login(payload: LoginRequest): Promise<{ success: true }> {
    await authApi.post("/api/auth/login", payload);
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "real");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }
    return { success: true };
  },

  async logout(): Promise<void> {
    try {
      await authApi.post("/api/auth/logout");
    } catch {
      // Clear local state even if server logout fails (e.g. network, 5xx)
    }
    LocalStorageManager.clearLocalStorage();
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "none");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }
  },
};
