import { SelectOption } from "@/components/core/select";
import { AvatarIcon } from "@/components/index";
import { getTokenLogo } from "@/components/token-icons";
import { POLL_PORTFOLIO_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/services/hooks/use-portfolio";
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
        icon: (
          <img
            src={getTokenLogo(currency.code)}
            className="w-7 h-7 rounded-full"
          />
        ),
      };
      tokensRecord[currency.code] = token;
      options.push({
        label: currency.code,
        id: currency.code,
        value: currency.amount, // amount - token units
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
        icon: <Lock className="w-5 h-5 text-muted-foreground ml-2" />,
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
      : 0,
    cryptocurrencies: portfolioData?.cryptocurrencies
      ? formatCurrency(portfolioData.cryptocurrencies)
      : 0,
    currencies: portfolioData?.currencies
      ? formatCurrency(portfolioData.currencies)
      : 0,
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
