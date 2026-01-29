import { queryClient } from "@/services/react-query/query-client";

/**
 * Invalidates portfolio-related queries to refresh data after mutations.
 * Handles indexer lag by invalidating queries multiple times with delays.
 *
 * @param userId - The user ID to invalidate user-specific queries
 */
export async function invalidatePortfolioQueries(userId: string): Promise<void> {
  const invalidateQueries = () => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ["netWorth", userId] }),
      queryClient.invalidateQueries({ queryKey: ["portfolioData"] }),
      queryClient.invalidateQueries({ queryKey: ["availables", userId] }),
      queryClient.invalidateQueries({
        queryKey: ["conversionPairs", userId],
      }),
      queryClient.invalidateQueries({ queryKey: ["activity", userId] }),
      queryClient.invalidateQueries({ queryKey: ["staking", userId] }),
      queryClient.invalidateQueries({ queryKey: ["loans-activity", userId] }),
      queryClient.invalidateQueries({ queryKey: ["availableToken", userId] }),
    ]);
  };

  // 1) immediate refresh
  await invalidateQueries();

  // 2) indexer lag follow-ups
  setTimeout(invalidateQueries, 1500);
  setTimeout(invalidateQueries, 4000);
  setTimeout(invalidateQueries, 6000);
}
