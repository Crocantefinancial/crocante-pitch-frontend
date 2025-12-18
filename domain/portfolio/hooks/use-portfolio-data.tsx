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
        value: currency.code,
        icon: token.icon,
      });
    });

    return {
      tokens: tokensRecord,
      tokensOptions: options,
    };
  }, [portfolioData?.cryptocurrenciesData]);

  const { wallets, walletsOptions } = useMemo(() => {
    if (!portfolioData?.custodiansData) {
      return { wallets: undefined, walletsOptions: [] };
    }

    const walletsRecord: Record<string, FromType> = {};
    const options: Array<SelectOption> = [];

    portfolioData.custodiansData.forEach((currency) => {
      const wallet: FromType = {
        symbol: currency.name,
        //icon: <AvatarIcon initials={currency.name.charAt(0)} color="primary" />,
        icon: <Lock className="w-5 h-5 text-muted-foreground" />,
      };
      walletsRecord[currency.name] = wallet;
      options.push({
        label: currency.name,
        value: currency.name,
        icon: wallet.icon,
      });
    });

    return {
      wallets: walletsRecord,
      walletsOptions: options,
    };
  }, [portfolioData?.custodiansData]);

  const { exchanges, exchangesOptions } = useMemo(() => {
    if (!portfolioData?.exchangesData) {
      return { exchanges: undefined, exchangesOptions: [] };
    }

    const exchangesRecord: Record<string, ToType> = {};
    const options: Array<SelectOption> = [];

    portfolioData.exchangesData.forEach((ex) => {
      const exchange: ToType = {
        symbol: ex.name,
        icon: <AvatarIcon initials={ex.name.charAt(0)} color="primary" />,
      };
      exchangesRecord[ex.name] = exchange;
      options.push({
        label: ex.name,
        value: ex.name,
        icon: exchange.icon,
      });
    });

    return {
      exchanges: exchangesRecord,
      exchangesOptions: options,
    };
  }, [portfolioData?.exchangesData]);

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
    tokens: tokens,
    tokensOptions: tokensOptions,
    wallets: wallets,
    walletsOptions: walletsOptions,
    exchanges: exchanges,
    exchangesOptions: exchangesOptions,
  };
}
