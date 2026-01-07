"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ConversionPairsDataItem,
  ConversionPairsDataResponse,
  conversionPairsDataResponseSchema,
  getFormattedConversionPairsData,
  getMockedConversionPairsData,
} from "./types/conversion-pairs-data";

export function useConversionPairs(
  userId: string,
  tokenId: string,
  pollIntervalMs: number
) {
  const { EP_CONVERSION_PAIRS } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<ConversionPairsDataItem>({
    queryKey: ["conversionPairs", userId, tokenId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedConversionPairsData(tokenId);
      }
      try {
        const conversionPairsDataResponse =
          await getValidated<ConversionPairsDataResponse>(
            `${EP_CONVERSION_PAIRS}`,
            conversionPairsDataResponseSchema
          );
        return getFormattedConversionPairsData(
          conversionPairsDataResponse,
          tokenId
        );
      } catch (error) {
        console.warn("Error fetching conversion pairs data:", error);
        return getMockedConversionPairsData(tokenId);
      }
    },
    enabled: !!userId && !!tokenId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
