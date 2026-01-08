import { POLL_QUOTE_INTERVAL } from "@/config/constants";
import { useQuote } from "@/services/hooks/use-quote";
import { useCallback } from "react";

export function useTokenSwap(
  userId: string,
  tokenFrom: string,
  tokenTo: string,
  isLoading: boolean
) {
  const { data: quote } = useQuote(
    userId,
    tokenFrom,
    tokenTo,
    isLoading,
    POLL_QUOTE_INTERVAL
  );

  const conversionRateFrom =
    quote?.edge.side === "SELL"
      ? Number(quote?.estPrice || 0)
      : 1 / Number(quote?.estPrice || 1);

  const convertTo = useCallback(
    (valueFrom: string): string => {
      if (!valueFrom || conversionRateFrom === 0) return "0";
      const result = Number(valueFrom) * conversionRateFrom;
      return isNaN(result) || !isFinite(result) ? "0" : result.toString();
    },
    [conversionRateFrom]
  );

  const convertFrom = useCallback(
    (valueTo: string): string => {
      if (!valueTo || conversionRateFrom === 0) return "0";
      const result = Number(valueTo) / conversionRateFrom;
      return isNaN(result) || !isFinite(result) ? "0" : result.toString();
    },
    [conversionRateFrom]
  );

  return {
    convertTo,
    convertFrom,
    conversionRateFrom,
    isLoading: !quote,
  };
}
