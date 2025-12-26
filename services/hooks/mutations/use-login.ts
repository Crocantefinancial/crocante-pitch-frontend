import { LoginService } from "@/services/api/auth/login-service";
import { queryClient } from "@/services/react-query/query-client";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: LoginService.login,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
    onError: (error) => {
      // Clear query cache
      queryClient.clear();

      // Trigger the same flow as a 401/403
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth-expired"));
      }
    },
    meta: { silent: false }, // show toast or errors normally
  });
}
