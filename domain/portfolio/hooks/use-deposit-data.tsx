import { SelectOption } from "@/components/core/select";
import { AvatarIcon } from "@/components/index";
import { POLL_CURRENCY_DEPOSIT_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { useCurrencyDeposit } from "@/services/api/use-currency-deposit";
import { useMemo } from "react";

export type DepositTokenType = {
  symbol: string;
  icon: React.ReactNode;
};

export function useDepositData() {
  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const { data: depositData, isLoading: isLoadingDeposit } = useCurrencyDeposit(
    userId,
    POLL_CURRENCY_DEPOSIT_DATA_INTERVAL
  );

  const { depositTokens, depositTokensOptions } = useMemo(() => {
    if (!depositData) {
      return { depositTokens: undefined, depositTokensOptions: [] };
    }

    const tokensRecord: Record<string, DepositTokenType> = {};
    const options: Array<SelectOption> = [];

    depositData.forEach((currency) => {
      const token: DepositTokenType = {
        symbol: currency.id,
        icon: <AvatarIcon initials={currency.id.charAt(0)} color="primary" />,
      };
      tokensRecord[currency.id] = token;
      options.push({
        label: currency.id,
        id: currency.id,
        icon: token.icon,
      });
    });

    return {
      depositTokens: tokensRecord,
      depositTokensOptions: options,
    };
  }, [depositData]);

  return {
    depositTokens,
    depositTokensOptions,
    isLoading: isLoadingDeposit,
  };
}
