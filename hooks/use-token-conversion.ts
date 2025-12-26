import { POLL_TOKEN_CONVERSION_INTERVAL } from "@/config/constants";
import { useTokenValuation } from "@/services/hooks/use-token-valuation";
import { useCallback } from "react";

export function useTokenConversion(token: string) {
  const { data: tokenValuation } = useTokenValuation(
    token,
    POLL_TOKEN_CONVERSION_INTERVAL
  );
  const conversionRate = tokenValuation?.value || 0;

  const convertToUSD = useCallback(
    (value: string): string => {
      if (!value || conversionRate === 0) return "0";
      const result = Number(value) * conversionRate;
      return isNaN(result) || !isFinite(result) ? "0" : result.toString();
    },
    [conversionRate]
  );

  const convertFromUSD = useCallback(
    (usdValue: string): string => {
      if (!usdValue || conversionRate === 0) return "0";
      const result = Number(usdValue) / conversionRate;
      return isNaN(result) || !isFinite(result) ? "0" : result.toString();
    },
    [conversionRate]
  );

  return {
    convertToUSD,
    convertFromUSD,
    conversionRate,
    isLoading: !tokenValuation,
  };
}
