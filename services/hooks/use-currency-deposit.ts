import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { useQuery } from "@tanstack/react-query";
import { getValidated } from "../zod/utils";
import {
  CurrencyDeposit,
  CurrencyDepositResponse,
  currencyDepositResponseSchema,
  getMockedCurrencyDepositData,
} from "./types/currency-deposit-data";

export function useCurrencyDeposit(userId: string, pollInterval: number) {
  const { EP_CURRENCY_DEPOSIT: EP_DEPOSIT } = envParsed();
  const { sessionMode } = useSessionMode();

  return useQuery<CurrencyDeposit[]>({
    queryKey: ["currencyDeposit", userId],
    queryFn: async () => {
      if (typeof userId !== "string" || userId.trim() === "") {
        console.warn("No user ID provided");
        return getMockedCurrencyDepositData();
      }
      try {
        if (sessionMode === "mock") {
          return getMockedCurrencyDepositData();
        }

        const response = await getValidated<CurrencyDepositResponse>(
          `${EP_DEPOSIT}`,
          currencyDepositResponseSchema
        );
        return response.data;
      } catch (error) {
        console.warn("Error fetching currency deposit data:", error);
        return getMockedCurrencyDepositData();
      }
    },
    enabled: typeof userId === "string" && userId.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
  });
}
