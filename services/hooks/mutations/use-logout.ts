import { LoginService } from "@/services/api/auth/login-service";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: LoginService.logout,
    meta: { silent: true }, // we don't want noise on logout failures, just log the error
  });
}
