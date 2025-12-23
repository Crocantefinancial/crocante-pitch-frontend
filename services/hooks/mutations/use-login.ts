import { LoginService } from "@/services/api/auth/login-service";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: LoginService.login,
    meta: { silent: false }, // show toast or errors normally
  });
}
