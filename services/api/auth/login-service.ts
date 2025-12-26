import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { HttpService } from "@/services/api/http-service";
import { LoginRequest, LoginResponse } from "./schemas";

export const LoginService = {
  async loginMock(): Promise<boolean> {
    // Persist token
    LocalStorageManager.clearLocalStorage();
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "mock");
    return Promise.resolve(true);
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await HttpService.post<LoginResponse>(
      "/auth/login",
      payload
    );

    if (!response?.data?.token) {
      throw new Error("Login response missing token");
    }

    // Persist token
    LocalStorageManager.setItem(LocalStorageKeys.TOKEN, response.data.token);
    LocalStorageManager.setItem(LocalStorageKeys.SESSION_MODE, "real");

    return response;
  },

  async logout(): Promise<void> {
    try {
      await HttpService.post("/private/auth/logout", null);
    } finally {
      // Always clear token
      LocalStorageManager.clearLocalStorage();
    }
  },
};
