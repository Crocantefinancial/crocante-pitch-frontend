"use client";

import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import ServiceError from "@/services/api/errors/service-error";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ClientResponse,
  clientResponseSchema,
  getFormattedClientResponse,
  getMockedDefaultUserData,
  User,
} from "./types/user-data";

export function useUser(
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const sessionMode =
        LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "real";

      // 1) Explicit mock mode: skip backend, always mock
      if (sessionMode === "mock") {
        return getMockedDefaultUserData();
      }

      // 2) Real mode (or initial, no mode): talk to backend
      try {
        const clientResponse = await getValidated<ClientResponse>(
          "/private/client",
          clientResponseSchema
        );
        return getFormattedClientResponse(clientResponse);
      } catch (err) {
        // Auth errors: always bubble up in real mode so the global
        // auth-sensitive handler can dispatch "auth-expired"
        if (
          err instanceof ServiceError &&
          (err.status === 401 || err.status === 403)
        ) {
          throw err;
        }

        // Non-auth errors: optionally fall back to mock
        if (fallbackToMockOnNonAuthError) {
          console.warn(
            "Non-auth error fetching /private/client, using mock:",
            err
          );
          return getMockedDefaultUserData();
        }

        throw err;
      }
    },

    meta: { authSensitive: true },

    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: "always",
  });
}
