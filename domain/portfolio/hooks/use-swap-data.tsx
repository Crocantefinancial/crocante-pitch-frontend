import { SelectOption } from "@/components/core/select";
import { getTokenLogo } from "@/components/token-icons";
import { POLL_AVAILABLES_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatToMaxDefinition } from "@/lib/utils";
import { ConversionPairsData } from "@/services/hooks/types/conversion-pairs-data";
import { useAvailables } from "@/services/hooks/use-availables";
import { useConversionPairs } from "@/services/hooks/use-conversion-pairs";
import { useMemo } from "react";
import { TokenType } from "./use-portfolio-data";

export function useSwapData(selectedTokenFrom: string) {
  const { user } = useSession();
  const userId = user?.id.toString() || "";
  const { data: availables, isLoading: isLoadingAvailables } = useAvailables(
    userId,
    POLL_AVAILABLES_INTERVAL
  );
  const { data: conversionPairs, isLoading: isLoadingConversionPairs } =
    useConversionPairs(userId, POLL_AVAILABLES_INTERVAL);

  const { tokensFrom, tokensFromOptions } = useMemo(() => {
    if (!availables || availables.length === 0) {
      return { tokensFrom: undefined, tokensFromOptions: [] };
    }

    const tokensRecord: Record<string, TokenType> = {};
    const options: Array<SelectOption> = [];

    availables.forEach((currency) => {
      const token: TokenType = {
        symbol: currency.id,
        icon: (
          <img
            src={getTokenLogo(currency.id)}
            className="w-7 h-7 rounded-full"
          />
        ),
      };
      tokensRecord[currency.id] = token;
      options.push({
        label: currency.id,
        id: currency.id,
        value: formatToMaxDefinition(Number(currency.amount), currency.id).toString(), // amount - token units
        icon: token.icon,
      });
    });

    return {
      tokensFrom: tokensRecord,
      tokensFromOptions: options,
    };
  }, [availables]);

  const { tokensTo, tokensToOptions } = useMemo(() => {
    if (!conversionPairs) {
      return { tokensTo: undefined, tokensToOptions: [] };
    }

    const tokensRecord: Record<string, TokenType> = {};
    const options: Array<SelectOption> = [];

    conversionPairs[selectedTokenFrom as keyof ConversionPairsData]?.forEach(
      (currency) => {
        const token: TokenType = {
          symbol: currency.destId,
          icon: (
            <img
              src={getTokenLogo(currency.destId)}
              className="w-7 h-7 rounded-full"
            />
          ),
        };
        tokensRecord[currency.destId] = token;
        options.push({
          label: currency.destId,
          id: currency.destId,
          value: formatToMaxDefinition(Number(currency.feePercent), currency.destId).toString(),
          icon: token.icon,
        });
      }
    );

    return {
      tokensTo: tokensRecord,
      tokensToOptions: options,
    };
  }, [conversionPairs, selectedTokenFrom]);

  return {
    tokensFrom,
    tokensFromOptions,
    tokensTo,
    tokensToOptions,
    isLoading: isLoadingAvailables || isLoadingConversionPairs,
  };
}
