import { LoginService } from "@/services/api/auth/login-service";
import { queryClient } from "@/services/react-query/query-client";
import { useMutation } from "@tanstack/react-query";

export function useMock() {
  return useMutation({
    mutationFn: LoginService.loginMock,
    onSuccess: () => {
      // Small delay to ensure sessionMode state has updated
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      }, 0);
    },
    meta: { silent: false }, // show toast or errors normally
  });
}
