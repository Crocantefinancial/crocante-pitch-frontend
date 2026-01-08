"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ConversionPairsData,
  ConversionPairsDataResponse,
  conversionPairsDataResponseSchema,
  getFormattedConversionPairsData,
  getMockedConversionPairsData,
} from "./types/conversion-pairs-data";

export function useConversionPairs(userId: string, pollIntervalMs: number) {
  const { EP_CONVERSION_PAIRS } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<ConversionPairsData>({
    queryKey: ["conversionPairs", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedConversionPairsData();
      }
      try {
        const conversionPairsDataResponse =
          await getValidated<ConversionPairsDataResponse>(
            `${EP_CONVERSION_PAIRS}`,
            conversionPairsDataResponseSchema
          );
        return getFormattedConversionPairsData(conversionPairsDataResponse);
      } catch (error) {
        console.warn("Error fetching conversion pairs data:", error);
        return getMockedConversionPairsData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
