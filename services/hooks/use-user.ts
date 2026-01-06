"use client";

import envParsed from "@/config/envParsed";
import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { useSessionMode } from "@/hooks/use-session-mode";
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
  const { EP_CLIENT } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<User | null>({
    queryKey: ["user", "me", sessionMode],
    queryFn: async () => {
      // Read sessionMode directly from localStorage to ensure we get the latest value
      const currentSessionMode =
        LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "none";

      // 1) Explicit mock mode: skip backend, always mock
      if (currentSessionMode === "mock") {
        return getMockedDefaultUserData();
      }

      // 2) No session mode: throw 401 error to trigger login modal
      if (currentSessionMode === "none") {
        throw new ServiceError({
          message: "Not authenticated",
          code: "NOT_AUTHENTICATED",
          status: 401,
        });
      }

      // 3) Real mode: talk to backend
      try {
        const clientResponse = await getValidated<ClientResponse>(
          `${EP_CLIENT}`,
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
          console.warn("Non-auth error fetching user data, using mock:", err);
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
