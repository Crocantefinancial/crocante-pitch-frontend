"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AvailablesDataItemUI,
  AvailablesDataResponse,
  availablesDataResponseSchema,
  getFormattedAvailablesData,
  getMockedAvailablesData,
} from "./types/availables-data";

export function useAvailables(userId: string, pollIntervalMs: number) {
  const { EP_STATEMENT_AVAILABLE } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<AvailablesDataItemUI[]>({
    queryKey: ["availables", userId],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedAvailablesData();
      }
      try {
        const availablesDataResponse =
          await getValidated<AvailablesDataResponse>(
            `${EP_STATEMENT_AVAILABLE}`,
            availablesDataResponseSchema
          );
        return getFormattedAvailablesData(availablesDataResponse);
      } catch (error) {
        console.warn("Error fetching availables data:", error);
        return getMockedAvailablesData();
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
