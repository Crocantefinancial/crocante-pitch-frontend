"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedNetWorthData,
  getMockedNetWorthData,
  NetWorthData,
  NetWorthDataResponse,
  netWorthDataResponseSchema,
} from "./types/net-worth-data";

export function useNetWorth(
  userId: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_NET_WORTH } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<NetWorthData>({
    queryKey: ["netWorth", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedNetWorthData();
      }
      try {
        const netWorthDataResponse = await getValidated<NetWorthDataResponse>(
          `${EP_NET_WORTH}`,
          netWorthDataResponseSchema
        );
        return getFormattedNetWorthData(netWorthDataResponse);
      } catch (error) {
        console.warn("Error fetching net worth data:", error);
        return getMockedNetWorthData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
