"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { getValidated } from "@/services/zod/utils";
import { useQuery } from "@tanstack/react-query";
import {
  AvailableTokenDataResponse,
  availableTokenDataResponseSchema,
  getFormattedAvailableTokenData,
  getMockedAvailableTokenData
} from "./types/available-token-data";
import { AvailablesDataItemUI } from "./types/availables-data";

export function useAvailableToken(userId: string, token: string, pollIntervalMs: number) {
  const { EP_STATEMENT_AVAILABLE_TOKEN } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<AvailablesDataItemUI>({
    queryKey: ["availableToken", userId, token],
    queryFn: async () => {
      if (sessionMode === "mock") {
        return getMockedAvailableTokenData(token);
      }
      try {
        const availableTokenDataResponse =
          await getValidated<AvailableTokenDataResponse>(
            `${EP_STATEMENT_AVAILABLE_TOKEN}`.replace("%TOKEN", token),
            availableTokenDataResponseSchema
          );
        return getFormattedAvailableTokenData(availableTokenDataResponse);
      } catch (error) {
        console.warn("Error fetching available token data:", error);
        return getMockedAvailableTokenData(token);
      }
    },
    enabled: !!userId && !!token,
    staleTime: 1000 * 60 * 5,
    refetchInterval: pollIntervalMs > 0 ? pollIntervalMs : false,
    refetchIntervalInBackground: pollIntervalMs > 0,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
  });
}
