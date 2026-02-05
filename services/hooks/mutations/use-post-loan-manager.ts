"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedLoanPostManagerData,
  getMockedLoanPostManagerData,
  LoanPostManagerDataResponse,
  loanPostManagerDataResponseSchema
} from "../types/loan-post-manager-data";
import { invalidatePortfolioQueries } from "./utils/invalidate-portfolio-queries";

type Vars = {
  userId: string;
  opId: string;
  amount: string;
};

export function usePostLoanManager(action: "add" | "remove" | "repay" | "liquidate") {
  const {
    EP_LOAN_ADD_COLLAT_POST,
    EP_LOAN_REM_COLLAT_POST,
    EP_LOAN_REPAY_POST,
    EP_LOAN_LIQUIDATE_POST
  } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<LoanPostManagerDataResponse['data'], unknown, Vars>({
    mutationKey: ["postLoanManager", action],
    mutationFn: async ({ opId, amount }) => {
      if (sessionMode === "mock") return getMockedLoanPostManagerData();

      const baseUrl = action === "repay"
        ? EP_LOAN_REPAY_POST
        : action === "add"
          ? EP_LOAN_ADD_COLLAT_POST
          : action === "remove"
            ? EP_LOAN_REM_COLLAT_POST
            : EP_LOAN_LIQUIDATE_POST;

      const url = `${baseUrl}`.replace("%OPID", opId);

      const resp = await postValidated<LoanPostManagerDataResponse>(
        url,
        { amount },
        loanPostManagerDataResponseSchema
      );

      return getFormattedLoanPostManagerData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      await invalidatePortfolioQueries(userId);
    },
  });
}
