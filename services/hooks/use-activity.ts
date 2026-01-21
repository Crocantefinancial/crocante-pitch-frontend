"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityData,
  ActivityDataResponse,
  activityDataResponseSchema,
  getFormattedActivityData,
  getMockedActivityData,
} from "./types/activity-data";

export function useActivity(
  userId: string,
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_ACTIVITY } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<ActivityData[]>({
    queryKey: ["activity", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedActivityData();
      }
      try {
        const activityDataResponse = await getValidated<ActivityDataResponse>(
          `${EP_ACTIVITY}?page=1&size=10`,
          activityDataResponseSchema
        );
        return getFormattedActivityData(activityDataResponse);
      } catch (error) {
        console.warn("Error fetching activity data:", error);
        return getMockedActivityData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
