import { formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/services/api/use-portfolio";

export function usePortfolioData() {
  const userId = "1";
  const { data: portfolioData, isLoading: isLoadingPortfolio } = usePortfolio(
    userId,
    1000
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
  };
}
