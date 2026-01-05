"use client";

import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
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
  return useQuery<NetWorthData>({
    queryKey: ["netWorth", userId],
    queryFn: async () => {
      const sessionMode =
        LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "real";

      if (sessionMode === "mock") {
        return getMockedNetWorthData();
      }
      try {
        const netWorthDataResponse = await getValidated<NetWorthDataResponse>(
          "/private/statement/net-worth",
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
