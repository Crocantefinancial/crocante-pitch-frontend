import { LoginService } from "@/services/api/auth/login-service";
import { queryClient } from "@/services/react-query/query-client";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: LoginService.logout,
    onSettled: () => {
      // Clear query cache
      queryClient.clear();

      // Trigger the same flow as a 401/403
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth-expired"));
      }
    },
    meta: { silent: true }, // we don't want noise on logout failures, just log the error
  });
}
