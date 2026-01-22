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
  page: number,
  status: string[],
  txType: string[],
  pollIntervalMs: number,
  fallbackToMockOnNonAuthError = true
) {
  const { EP_ACTIVITY } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<ActivityData[]>({
    queryKey: ["activity", userId, page, status, txType],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedActivityData();
      }
      try {
        let url = `${EP_ACTIVITY}?page=${page}&size=10`;
        if (status.length > 0 && status[0] !== "") {
          url += `&statuses=${status.map(s => s.toUpperCase()).join("&statuses=")}`;
        }
        if (txType.length > 0 && txType[0] !== "") {
          url += `&fullTypes=${txType.map(t => t.toUpperCase().concat("%25")).join("&fullTypes=")}`;
        }
        const activityDataResponse = await getValidated<ActivityDataResponse>(
          url,
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
