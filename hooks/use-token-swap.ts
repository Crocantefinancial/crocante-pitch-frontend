import { POLL_TOKEN_CONVERSION_INTERVAL } from "@/config/constants";
import { useTokenValuation } from "@/services/hooks/use-token-valuation";
import { useCallback } from "react";

export function useTokenSwap(
  userId: string,
  tokenFrom: string,
  tokenTo: string
) {
  // TODO: This is a workaround, we should use the conversion rate from the API
  const { data: tokenValuationFrom } = useTokenValuation(
    userId,
    tokenFrom,
    POLL_TOKEN_CONVERSION_INTERVAL
  );
  // TODO: This is a workaround, we should use the conversion rate from the API
  const { data: tokenValuationTo } = useTokenValuation(
    userId,
    tokenTo,
    POLL_TOKEN_CONVERSION_INTERVAL
  );

  // TODO: This is a workaround, we should use the conversion rate from the API
  const conversionRateFrom =
    (tokenValuationFrom?.value || 0) / (tokenValuationTo?.value || 1);

  // TODO: This is a workaround, we should use the conversion rate from the API
  const conversionRateTo =
    (tokenValuationTo?.value || 0) / (tokenValuationFrom?.value || 1);

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
      if (!valueTo || conversionRateTo === 0) return "0";
      const result = Number(valueTo) / conversionRateTo;
      return isNaN(result) || !isFinite(result) ? "0" : result.toString();
    },
    [conversionRateTo]
  );

  return {
    convertTo,
    convertFrom,
    conversionRateFrom,
    conversionRateTo,
    isLoading: !tokenValuationFrom || !tokenValuationTo,
  };
}
