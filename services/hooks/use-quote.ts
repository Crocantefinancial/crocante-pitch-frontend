"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedQuoteData,
  getMockedQuoteData,
  QuoteData,
  QuoteDataResponse,
  quoteDataResponseSchema,
} from "./types/quote-data";

export function useQuote(
  userId: string,
  tokenFrom: string,
  tokenTo: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_CONVERSION_QUOTE } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<QuoteData>({
    queryKey: ["quote", userId, tokenFrom, tokenTo],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedQuoteData();
      }
      try {
        const quoteDataResponse = await getValidated<QuoteDataResponse>(
          `${EP_CONVERSION_QUOTE}`
            .replace("%TOKEN1", tokenFrom)
            .replace("%TOKEN2", tokenTo),
          quoteDataResponseSchema
        );
        return getFormattedQuoteData(quoteDataResponse);
      } catch (error) {
        console.warn("Error fetching quote data:", error);
        return getMockedQuoteData();
      }
    },
    enabled: !!userId && !!tokenFrom && !!tokenTo,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
