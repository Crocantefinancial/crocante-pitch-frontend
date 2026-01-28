"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedLoanTypeData,
  getMockedLoanTypeData,
  LoanTypeData,
  LoanTypeDataResponse,
  LoanTypeDataResponseSchema
} from "./types/loan-type-data";

export function useLoanType(
  userId: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_LOAN_TYPE } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<LoanTypeData[]>({
    queryKey: ["loanType", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedLoanTypeData();
      }
      try {
        const loanTypeDataResponse = await getValidated<LoanTypeDataResponse>(
          `${EP_LOAN_TYPE}`
          , LoanTypeDataResponseSchema
        );
        return getFormattedLoanTypeData(loanTypeDataResponse);
      } catch (error) {
        console.warn("Error fetching loan type data:", error);
        return getMockedLoanTypeData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
