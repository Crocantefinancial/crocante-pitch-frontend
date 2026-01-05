import {
  ASSET_ALLOCATION,
  ASSET_ALLOCATION_COLORS,
  BANKS_DATA,
  CRYPTOCURRENCIES,
  CURRENCIES,
  CUSTODIANS_DATA,
  EXCHANGES_DATA,
  INTERNAL_WALLETS,
  OTC_DESKS_DATA,
  PORTFOLIO_DATA,
} from "@/shared/mockups/portfolio";
import { NetWorthData } from "./net-worth-data";

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

export function getMockedPortfolioData(): PortfolioDataResponse {
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

export function getNullPortfolioData(): PortfolioDataResponse {
  return {
    totalBalance: 0,
    cryptocurrencies: 0,
    currencies: 0,
    commodities: 0,
    banksData: [],
    custodiansData: [],
    exchangesData: [],
    internalWalletsData: [],
    otcDesksData: [],
    currenciesData: [],
    cryptocurrenciesData: [],
    assetAllocationData: [],
  };
}

export function getFormattedPortfolioData(
  response: NetWorthData
): PortfolioDataResponse {
  //const nullPortfolioData = getNullPortfolioData();
  const nullPortfolioData = getMockedPortfolioData();
  nullPortfolioData.totalBalance = parseFloat(response.estTotalValue);
  nullPortfolioData.cryptocurrencies = parseFloat(
    response.assets.estTotalValue
  );
  nullPortfolioData.cryptocurrenciesData = response.assets.assets.map(
    (asset) => {
      return {
        code: asset.currency.id,
        name: asset.currency.name,
        amount: asset.total,
        value: asset.estValue,
        change: "0",
      };
    }
  );
  nullPortfolioData.assetAllocationData = [];
  response.assets.assets
    .slice(0, ASSET_ALLOCATION_COLORS.length - 1)
    .forEach((asset, index) => {
      const value = (
        (parseFloat(asset.estValue) / nullPortfolioData.cryptocurrencies) *
        100
      ).toFixed(2);
      nullPortfolioData.assetAllocationData.push({
        name: asset.currency.id,
        value: parseFloat(value),
        color: ASSET_ALLOCATION_COLORS[index],
        amount: parseFloat(asset.estValue),
      });
    });

  nullPortfolioData.assetAllocationData.push({
    name: "Others",
    value: 0,
    color: ASSET_ALLOCATION_COLORS[ASSET_ALLOCATION_COLORS.length - 1],
    amount: 0,
  });
  let othersAmount = 0;
  response.assets.assets
    .slice(ASSET_ALLOCATION_COLORS.length - 1)
    .forEach((asset) => {
      othersAmount += parseFloat(asset.estValue);
    });
  nullPortfolioData.assetAllocationData[
    nullPortfolioData.assetAllocationData.length - 1
  ].amount = othersAmount;
  nullPortfolioData.assetAllocationData[
    nullPortfolioData.assetAllocationData.length - 1
  ].value = parseFloat(
    ((othersAmount / nullPortfolioData.cryptocurrencies) * 100).toFixed(2)
  );

  return nullPortfolioData;
}
