import {
  ASSET_ALLOCATION,
  BANKS_DATA,
  CRYPTOCURRENCIES,
  CURRENCIES,
  CUSTODIANS_DATA,
  EXCHANGES_DATA,
  INTERNAL_WALLETS,
  OTC_DESKS_DATA,
  PORTFOLIO_DATA,
} from "@/shared/mockups/portfolio";

export interface PortfolioDataResponse {
  totalBalance: number;
  cryptocurrencies: number;
  currencies: number;
  commodities: number;
  banksData: Array<{
    name: string;
    balance: string;
    available: string;
    currency: string;
    accountType: string;
    lastSync: string;
  }>;
  custodiansData: Array<{
    name: string;
    balance: string;
    available: string;
    assets: number;
    service: string;
    lastSync: string;
  }>;
  exchangesData: Array<{
    name: string;
    balance: string;
    available: string;
    assets: number;
    status: string;
    lastSync: string;
  }>;
  internalWalletsData: Array<{
    name: string;
    balance: string;
    available: string;
    assets: number;
    type: string;
    lastActivity: string;
  }>;
  otcDesksData: Array<{
    name: string;
    balance: string;
    available: string;
    lastTrade: string;
    volume30d: string;
    status: string;
  }>;
  currenciesData: Array<{
    code: string;
    name: string;
    amount: string;
    value: string;
    change: string;
  }>;
  cryptocurrenciesData: Array<{
    code: string;
    name: string;
    amount: string;
    value: string;
    change: string;
  }>;
  assetAllocationData: Array<{
    name: string;
    value: number;
    color: string;
    amount: number;
  }>;
}

export function getNullMockedPortfolioData(): PortfolioDataResponse {
  return {
    totalBalance: PORTFOLIO_DATA.totalBalance,
    cryptocurrencies: PORTFOLIO_DATA.cryptocurrencies,
    currencies: PORTFOLIO_DATA.currencies,
    commodities: PORTFOLIO_DATA.commodities,
    banksData: BANKS_DATA,
    custodiansData: CUSTODIANS_DATA,
    exchangesData: EXCHANGES_DATA,
    internalWalletsData: INTERNAL_WALLETS,
    otcDesksData: OTC_DESKS_DATA,
    currenciesData: CURRENCIES,
    cryptocurrenciesData: CRYPTOCURRENCIES,
    assetAllocationData: ASSET_ALLOCATION,
  };
}
