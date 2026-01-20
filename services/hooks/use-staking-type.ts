"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
    getFormattedStakingTypeData,
    getMockedStakingTypeData,
    StakingTypeData,
    StakingTypeDataResponse,
    stakingTypeDataResponseSchema
} from "./types/staking-type-data";

export function useStakingType(
  userId: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_STAKING_TYPE } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<StakingTypeData>({
    queryKey: ["stakingType", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedStakingTypeData();
      }
      try {
        const stakingTypeDataResponse = await getValidated<StakingTypeDataResponse>(
          `${EP_STAKING_TYPE}`
          , stakingTypeDataResponseSchema
        );
        return getFormattedStakingTypeData(stakingTypeDataResponse);
      } catch (error) {
        console.warn("Error fetching staking type data:", error);
        return getMockedStakingTypeData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
