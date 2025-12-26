import { LoginService } from "@/services/api/auth/login-service";
import { queryClient } from "@/services/react-query/query-client";
import { useMutation } from "@tanstack/react-query";

export function useMock() {
  return useMutation({
    mutationFn: LoginService.loginMock,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
    meta: { silent: false }, // show toast or errors normally
  });
}
