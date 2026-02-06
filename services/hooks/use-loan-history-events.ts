"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedLoanHistoryEventsData,
  getMockedLoanHistoryEventsData,
  LoanHistoryEvent,
  LoanHistoryEventsDataResponse,
  loanHistoryEventsDataResponseSchema,
} from "./types/loan-history-events-data";

export function useLoanHistoryEvents(
  userId: string,
  opId: string,
  isLoading: boolean,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_LOAN_HISTORY_EVENTS } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<LoanHistoryEvent[]>({
    queryKey: ["loan-history-events", userId, opId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedLoanHistoryEventsData();
      }
      try {
        const loanHistoryEventsDataResponse = await getValidated<LoanHistoryEventsDataResponse>(
          `${EP_LOAN_HISTORY_EVENTS}`.replace("%OPID", opId),
          loanHistoryEventsDataResponseSchema
        );
        return getFormattedLoanHistoryEventsData(loanHistoryEventsDataResponse);
      } catch (error) {
        console.warn("Error fetching loan history events data:", error);
        return getMockedLoanHistoryEventsData();
      }
    },
    enabled: !!userId && !!opId && !isLoading,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
