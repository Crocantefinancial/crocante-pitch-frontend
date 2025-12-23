/* import { HttpService } from "@/services/api/http-service";
import {
  LoginRequestSchema,
  LoginResponseSchema,
  type LoginRequest,
  type LoginResponse,
} from "./schemas";

export const LoginService = {
  async login(input: LoginRequest): Promise<LoginResponse> {
    // Validate request once (runtime + types)
    const request = LoginRequestSchema.parse(input);

    // IMPORTANT: login call should NOT attach bearer token
    // Usually ok since request interceptor only adds token if present.
    // Also: you probably want to opt out of auth-expired handling for login
    const data = await HttpService.post<LoginResponse>("/auth/login", request, {
      // if you added axios config flags:
      //skipAuthHandling: true,
      //skipGlobalErrorHandling: false,
    });

    // Validate response shape
    return LoginResponseSchema.parse(data);
  },

  async logout(): Promise<null> {
    // For logout you might want to silence auth handling too
    // because server can reply 401 if session already dead.
    return await HttpService.post<null>("/private/auth/logout", null, {
      //skipAuthHandling: true,
    });
  },
};
 */

import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { HttpService } from "@/services/api/http-service";
import { LoginRequest, LoginResponse } from "./schemas";

export const LoginService = {
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
