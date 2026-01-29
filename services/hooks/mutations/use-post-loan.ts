"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedLoanPostData,
  getMockedLoanPostData,
  LoanPostDataResponse,
  loanPostDataResponseSchema,
} from "../types/loan-post-data";
import { invalidatePortfolioQueries } from "./utils/invalidate-portfolio-queries";

type Vars = {
  userId: string;
  ratio: string;
  size: string;
  typeId: string;
};

export function usePostLoan() {
  const { EP_LOAN_POST } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<LoanPostDataResponse['data'], unknown, Vars>({
    mutationKey: ["postLoan"],
    mutationFn: async ({ ratio, size, typeId }) => {
      if (sessionMode === "mock") return getMockedLoanPostData();

      const url = `${EP_LOAN_POST}`;

      const resp = await postValidated<LoanPostDataResponse>(
        url,
        { ratio, size, typeId },
        loanPostDataResponseSchema
      );

      return getFormattedLoanPostData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      await invalidatePortfolioQueries(userId);
    },
  });
}
