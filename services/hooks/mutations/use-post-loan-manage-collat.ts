"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedLoanPostManageCollatData,
  getMockedLoanPostManageCollatData,
  LoanPostManageCollatDataResponse,
  loanPostManageCollatDataResponseSchema
} from "../types/loan-post-manage-collat-data";
import { invalidatePortfolioQueries } from "./utils/invalidate-portfolio-queries";

type Vars = {
  userId: string;
  opId: string;
  amount: string;
};

export function usePostLoanManageCollat(action: "add" | "remove") {
  const { EP_LOAN_ADD_COLLAT_POST, EP_LOAN_REM_COLLAT_POST } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<LoanPostManageCollatDataResponse['data'], unknown, Vars>({
    mutationKey: ["postLoanManageCollat", action],
    mutationFn: async ({ opId, amount }) => {
      if (sessionMode === "mock") return getMockedLoanPostManageCollatData();

      const url = action === "add" ? `${EP_LOAN_ADD_COLLAT_POST}`.replace("%OPID", opId) : `${EP_LOAN_REM_COLLAT_POST}`.replace("%OPID", opId);

      const resp = await postValidated<LoanPostManageCollatDataResponse>(
        url,
        { amount },
        loanPostManageCollatDataResponseSchema
      );

      return getFormattedLoanPostManageCollatData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      await invalidatePortfolioQueries(userId);
    },
  });
}
