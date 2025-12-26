import ServiceError from "@/services/api/errors/service-error";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { triggerAuthExpired } from "./auth-expired";

function shouldTriggerAuthExpired(error: unknown) {
  if (!(error instanceof ServiceError)) return false;
  if (error.status !== 401) return false;

  // We should use stable codes if our backend provides them
  // For example: TOKEN_EXPIRED / SESSION_INVALID
  const msg = error.message ?? "";
  return (
    msg.includes("token is expired") ||
    msg.includes("token has invalid claims") ||
    msg.includes("SESSION_INVALID") ||
    msg.includes("authorization header not found")
  );
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Defaults: queries are often background, so we keep them silent unless opted in.
      const meta = query.meta as any;
      const authSensitive = meta?.authSensitive === true; // opt-in
      const silent = meta?.silent === true;

      if (!silent && authSensitive && shouldTriggerAuthExpired(error)) {
        triggerAuthExpired();
      }

      // If we want global toasts for queries, we can do it here.
    },
  }),

  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Mutations are usually user-triggered, so we can show UI by default.
      const meta = mutation.meta as any;
      const silent = meta?.silent === true;

      if (!silent && shouldTriggerAuthExpired(error)) {
        triggerAuthExpired();
      }

      // Global toast example:
      // if (!silent && error instanceof ServiceError) toast.error(error.message);
    },
  }),

  defaultOptions: {
    queries: {
      // Avoid "retry storm" when session is invalid
      retry: (failureCount, error) => {
        if (error instanceof ServiceError && error.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
