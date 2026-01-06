import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { useQuery } from "@tanstack/react-query";
import { getValidated } from "../zod/utils";
import {
  getMockedTokensNetworksData,
  TokensNetworksData,
  TokensNetworksResponse,
  tokensNetworksResponseSchema,
} from "./types/tokens-networks-data";

export function useTokensNetworks(currencyId: string, pollInterval: number) {
  const { EP_CURRENCY_NETWORKS } = envParsed();
  const { sessionMode } = useSessionMode();

  return useQuery<TokensNetworksData[]>({
    queryKey: ["tokensNetworksData", currencyId],
    queryFn: async () => {
      if (typeof currencyId !== "string" || currencyId.trim() === "") {
        console.warn("No currency ID provided");
        return getMockedTokensNetworksData(currencyId);
      }
      try {
        if (sessionMode === "mock") {
          return getMockedTokensNetworksData(currencyId);
        }

        const response = await getValidated<TokensNetworksResponse>(
          `${EP_CURRENCY_NETWORKS}`.replace("%TOKEN", currencyId),
          tokensNetworksResponseSchema
        );
        return response.data;
      } catch (error) {
        console.warn("Error fetching tokens networks data:", error);
        return getMockedTokensNetworksData(currencyId);
      }
    },
    enabled:
      typeof currencyId === "string" &&
      currencyId.trim() !== "" &&
      sessionMode !== "none", // Disable when logged out
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
    meta: { silent: true }, // Errors are handled gracefully with fallback to mock
  });
}
