import envParsed from "@/config/envParsed";
import { useQuery } from "@tanstack/react-query";
import {
  getNullMockedTokensNetworksData,
  TokensNetworksDataResponse,
} from "./types/tokens-networks-data";

export function useTokensNetworks(currencyId: string, pollInterval: number) {
  const { API_GATEWAY } = envParsed();

  return useQuery<TokensNetworksDataResponse>({
    queryKey: ["tokensNetworksData", currencyId],
    queryFn: async () => {
      if (typeof currencyId !== "string" || currencyId.trim() === "") {
        console.warn("No currency ID provided");
        return getNullMockedTokensNetworksData(currencyId);
      }
      try {
        //throw new Error("test");

        const tokensNetworks: TokensNetworksDataResponse | null = null;
        return tokensNetworks || getNullMockedTokensNetworksData(currencyId);
      } catch (error) {
        console.warn("Error fetching tokens networks data:", error);
        return getNullMockedTokensNetworksData(currencyId);
      }
    },
    enabled: typeof currencyId === "string" && currencyId.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
  });
}
