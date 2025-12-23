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
      try {
        const clientResponse = await getValidated<ClientResponse>(
          "/private/client",
          clientResponseSchema
        );
        //throw new Error("test");
        return getFormattedClientResponse(clientResponse);
      } catch (err) {
        // If auth fails, rethrow so the authExpired flow (meta: authSensitive) triggers.
        if (
          err instanceof ServiceError &&
          (err.status === 401 || err.status === 403)
        ) {
          throw err;
        }

        // Optional fallback for non-auth errors only (network, 5xx, schema mismatch, etc.)
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
