import { SelectOption } from "@/components/core/select";
import { AvatarIcon } from "@/components/index";
import { POLL_PORTFOLIO_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/services/api/use-portfolio";
import { Lock } from "lucide-react";
import { useMemo } from "react";

export type TokenType = {
  symbol: string;
  icon: React.ReactNode;
};

export type FromType = {
  symbol: string;
  icon: React.ReactNode;
};

export type ToType = {
  symbol: string;
  icon: React.ReactNode;
};

export function usePortfolioData() {
  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const { data: portfolioData, isLoading: isLoadingPortfolio } = usePortfolio(
    userId,
    POLL_PORTFOLIO_DATA_INTERVAL
  );

  const { tokens, tokensOptions } = useMemo(() => {
    if (!portfolioData?.cryptocurrenciesData) {
      return { tokens: undefined, tokensOptions: [] };
    }

    const tokensRecord: Record<string, TokenType> = {};
    const options: Array<SelectOption> = [];

    portfolioData.cryptocurrenciesData.forEach((currency) => {
      const token: TokenType = {
        symbol: currency.code,
        icon: <AvatarIcon initials={currency.code.charAt(0)} color="primary" />,
      };
      tokensRecord[currency.code] = token;
      options.push({
        label: currency.code,
        id: currency.code,
        value: currency.value,
        icon: token.icon,
      });
    });

    return {
      tokens: tokensRecord,
      tokensOptions: options,
    };
  }, [portfolioData?.cryptocurrenciesData]);

  const { custodiansFrom, fromOptions } = useMemo(() => {
    // TODO: Should filter out custodians that hold no balance
    if (!portfolioData?.custodiansData) {
      return { custodiansFrom: undefined, fromOptions: [] };
    }

    const custodiansRecord: Record<string, FromType> = {};
    const options: Array<SelectOption> = [];

    portfolioData.custodiansData.forEach((custodianData) => {
      const custodian: FromType = {
        symbol: custodianData.name,
        icon: <Lock className="w-5 h-5 text-muted-foreground" />,
      };
      custodiansRecord[custodianData.name] = custodian;
      options.push({
        label: custodianData.name,
        id: custodianData.name,
        icon: custodian.icon,
      });
    });

    return {
      custodiansFrom: custodiansRecord,
      fromOptions: options,
    };
  }, [portfolioData?.custodiansData]);

  const { custodiansTo, toOptions } = useMemo(() => {
    // Delivers all custodians, From selector will remove from To selector the From custodian
    if (!portfolioData?.custodiansData) {
      return { custodiansTo: undefined, toOptions: [] };
    }

    const custodiansRecord: Record<string, ToType> = {};
    const options: Array<SelectOption> = [];

    portfolioData.custodiansData.forEach((custodianData) => {
      const custodian: ToType = {
        symbol: custodianData.name,
        icon: (
          <AvatarIcon initials={custodianData.name.charAt(0)} color="primary" />
        ),
      };
      custodiansRecord[custodianData.name] = custodian;
      options.push({
        label: custodianData.name,
        id: custodianData.name,
        icon: custodian.icon,
      });
    });

    return {
      custodiansTo: custodiansRecord,
      toOptions: options,
    };
  }, [portfolioData?.custodiansData]);

  return {
    isLoading: isLoadingPortfolio,
    totalBalance: portfolioData?.totalBalance
      ? formatCurrency(portfolioData.totalBalance)
      : undefined,
    cryptocurrencies: portfolioData?.cryptocurrencies
      ? formatCurrency(portfolioData.cryptocurrencies)
      : undefined,
    currencies: portfolioData?.currencies
      ? formatCurrency(portfolioData.currencies)
      : undefined,
    commodities: portfolioData?.commodities,
    banksData: portfolioData?.banksData,
    custodiansData: portfolioData?.custodiansData,
    exchangesData: portfolioData?.exchangesData,
    internalWalletsData: portfolioData?.internalWalletsData,
    otcDesksData: portfolioData?.otcDesksData,
    currenciesData: portfolioData?.currenciesData,
    cryptocurrenciesData: portfolioData?.cryptocurrenciesData,
    assetAllocationData: portfolioData?.assetAllocationData,
    tokens,
    tokensOptions,
    custodiansFrom,
    fromOptions,
    custodiansTo,
    toOptions,
  };
}

/* 

wallets: custodiansFrom,
    walletsOptions: fromOptions,
    exchanges: custodiansTo,
    exchangesOptions: toOptions,

*/
