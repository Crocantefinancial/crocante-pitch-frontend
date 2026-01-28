"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedLiabilityData,
  getMockedLiabilityData,
  LiabilityData,
  LiabilityDataResponse,
  liabilityDataResponseSchema,
} from "./types/liability-data";

export function useLiability(userId: string, pollIntervalMs: number) {
  const { EP_STATEMENT_LIABILITY } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<LiabilityData>({
    queryKey: ["liability", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedLiabilityData();
      }
      try {
        const liabilityDataResponse =
          await getValidated<LiabilityDataResponse>(
            `${EP_STATEMENT_LIABILITY}`,
            liabilityDataResponseSchema
          );
        return getFormattedLiabilityData(liabilityDataResponse);
      } catch (error) {
        console.warn("Error fetching liability data:", error);
        return getMockedLiabilityData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
