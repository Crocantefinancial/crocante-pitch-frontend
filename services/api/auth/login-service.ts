import envParsed from "@/config/envParsed";
import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { HttpService } from "@/services/api/http-service";
import { LoginRequest, LoginResponse } from "./schemas";

const { EP_AUTH_LOGIN, EP_AUTH_LOGOUT } = envParsed();

export const LoginService = {
  async loginMock(): Promise<boolean> {
    // Persist token
    LocalStorageManager.clearLocalStorage();
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "mock");

    // Dispatch custom event for same-tab reactivity
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }

    return Promise.resolve(true);
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await HttpService.post<LoginResponse>(
      `${EP_AUTH_LOGIN}`,
      payload
    );

    if (!response?.data?.token) {
      throw new Error("Login response missing token");
    }

    // Persist token
    LocalStorageManager.setItem(LocalStorageKeys.TOKEN, response.data.token);
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "real");

    // Dispatch custom event for same-tab reactivity
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }

    return response;
  },

  async logout(): Promise<void> {
    // Check session mode before making API call
    const currentSessionMode =
      LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "none";

    // Only make API call if we're in real mode (not mock)
    if (currentSessionMode === "real") {
      try {
        await HttpService.post(`${EP_AUTH_LOGOUT}`, null);
      } catch (error) {
        // Silently ignore errors on logout - cleanup should always happen
      }
    }

    // Always clear token and set session mode to none
    LocalStorageManager.clearLocalStorage();
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "none");

    // Dispatch custom event for same-tab reactivity
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session-mode-changed"));
    }
  },
};
