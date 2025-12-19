import {
  AVAX_TOKEN_NETWORKS,
  BTC_TOKEN_NETWORKS,
  ETH_TOKEN_NETWORKS,
  USDT_TOKEN_NETWORKS,
} from "@/shared/mockups/tokens-networks";

export type TokensNetworksDataResponse =
  | typeof USDT_TOKEN_NETWORKS
  | typeof ETH_TOKEN_NETWORKS
  | typeof AVAX_TOKEN_NETWORKS
  | typeof BTC_TOKEN_NETWORKS;

export type TokensNetworksData = {
  currencyId: string;
  networkId: string;
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  withdrawalFeeValue: string;
  withdrawalMin: string;
  depositMin: string;
  currency: {
    id: string;
    name: string;
    decimals: number;
    allowTransfers: boolean;
    disabled: boolean;
    priority: number;
  };
  network: {
    id: string;
    name: string;
    mainCurrencyID: string;
    minConfirms: number;
  };
  withdrawalFee: string;
};

export function getNullMockedTokensNetworksData(
  currencyId: string
): TokensNetworksDataResponse {
  switch (currencyId) {
    case "USDT":
      return USDT_TOKEN_NETWORKS;
    case "ETH":
      return ETH_TOKEN_NETWORKS;
    case "AVAX":
      return AVAX_TOKEN_NETWORKS;
    case "BTC":
      return BTC_TOKEN_NETWORKS;
    default:
      return [];
  }
}
