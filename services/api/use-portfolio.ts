import envParsed from "@/config/envParsed";
import { useQuery } from "@tanstack/react-query";
import {
  getNullMockedPortfolioData,
  PortfolioDataResponse,
} from "./types/portfolio-data";

export function usePortfolio(userId: string, pollInterval: number) {
  const { API_GATEWAY } = envParsed();

  return useQuery<PortfolioDataResponse>({
    queryKey: ["portfolioData", userId],
    queryFn: async () => {
      if (typeof userId !== "string" || userId.trim() === "") {
        console.warn("No user ID provided");
        return getNullMockedPortfolioData();
      }
      try {
        //throw new Error("test");

        const portfolio: PortfolioDataResponse | null = null;
        return portfolio || getNullMockedPortfolioData();
      } catch (error) {
        console.warn("Error fetching portfolio data:", error);
        return getNullMockedPortfolioData();
      }
    },
    enabled: typeof userId === "string" && userId.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
  });
}
