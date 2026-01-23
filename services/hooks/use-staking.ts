"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  StakingData,
  StakingDataResponse,
  StakingDataResponseSchema,
  getFormattedStakingData,
  getMockedStakingData,
} from "./types/staking-data";

export function useStaking(
  userId: string,
  page: number,
  status: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_STAKING_ACTIVE, EP_STAKING_REDEEMED } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<StakingData>({
    queryKey: ["staking", userId, page, status],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedStakingData();
      }
      try {
        let url = status === "Active" ? `${EP_STAKING_ACTIVE}` : `${EP_STAKING_REDEEMED}`;
        url += `?page=${page}&size=10`;

        const stakingActiveDataResponse = await getValidated<StakingDataResponse>(
          url,
          StakingDataResponseSchema
        );
        return getFormattedStakingData(stakingActiveDataResponse);
      } catch (error) {
        console.warn("Error fetching staking data:", error);
        return getMockedStakingData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
