import { AvatarIcon } from "@/components/index";
import { POLL_PORTFOLIO_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/services/api/use-portfolio";
import { useMemo } from "react";

export type TokenType = {
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

  const tokens: Record<string, TokenType> | undefined = useMemo(
    () =>
      portfolioData?.cryptocurrenciesData?.reduce(
        (acc: Record<string, TokenType>, currency) => {
          acc[currency.code] = {
            symbol: currency.code,
            icon: (
              <AvatarIcon initials={currency.code.charAt(0)} color="primary" />
            ),
          };
          return acc;
        },
        {}
      ),
    [portfolioData?.cryptocurrenciesData]
  );

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
  };
}
