import { useSessionMode } from "@/hooks/use-session-mode";
import { useQuery } from "@tanstack/react-query";
import {
  getFormattedPortfolioData,
  getMockedPortfolioData,
  PortfolioDataResponse,
} from "./types/portfolio-data";
import { useNetWorth } from "./use-net-worth";

export function usePortfolio(userId: string, pollInterval: number) {
  const { data: netWorthData } = useNetWorth(userId, pollInterval);
  const { sessionMode } = useSessionMode();
  return useQuery<PortfolioDataResponse>({
    queryKey: ["portfolioData"],
    queryFn: async () => {
      if (sessionMode === "mock" || !netWorthData) {
        return getMockedPortfolioData();
      }
      return getFormattedPortfolioData(netWorthData);
    },
    enabled: !!netWorthData,
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
  });
}
