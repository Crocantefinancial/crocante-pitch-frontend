import envParsed from "@/config/envParsed";
import { useQuery } from "@tanstack/react-query";
import {
  getMockedTokenConversionByToken,
  TokenValuation,
} from "./types/conversion-data";

export function useTokenValuation(token: string, pollInterval: number) {
  const { API_GATEWAY } = envParsed();

  return useQuery<TokenValuation>({
    queryKey: ["tokenConversion", token],
    queryFn: async () => {
      if (typeof token !== "string" || token.trim() === "") {
        console.warn("No token provided");
        return getMockedTokenConversionByToken(token);
      }
      try {
        //throw new Error("test");

        return getMockedTokenConversionByToken(token);
      } catch (error) {
        console.warn("Error fetching token conversion:", error);
        return getMockedTokenConversionByToken(token);
      }
    },
    enabled: typeof token === "string" && token.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
  });
}
