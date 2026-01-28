"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedLoanData,
  getMockedLoanData,
  LoanData,
  LoanDataResponse,
  loanDataResponseSchema,
} from "./types/loans-activity-data";

export function useLoansActivity(
  userId: string,
  page: number,
  status: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_LOAN_ACTIVE, EP_LOAN_COMPLETED } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<LoanData>({
    queryKey: ["loans-activity", userId, page, status],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedLoanData();
      }
      try {
        let url = status === "Active" ? `${EP_LOAN_ACTIVE}` : `${EP_LOAN_COMPLETED}`;
        url += `?page=${page}&size=10`;

        const loanDataResponse = await getValidated<LoanDataResponse>(
          url,
          loanDataResponseSchema
        );
        return getFormattedLoanData(loanDataResponse);
      } catch (error) {
        console.warn("Error fetching loans activity data:", error);
        return getMockedLoanData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
