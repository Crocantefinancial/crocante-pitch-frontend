import {
  AVAX_DEPOSIT_ADDRESS,
  BTC_DEPOSIT_ADDRESS,
  ETH_DEPOSIT_ADDRESS,
  TRON_DEPOSIT_ADDRESS,
} from "@/shared/mockups/deposit-address";

export interface DepositAddressDataResponse {
  networkId: string;
  address: string;
  createdAt: string;
  clientId: string;
}

export function getNullMockedDepositAddressData(): DepositAddressDataResponse {
  return {
    networkId: "",
    address: "",
    createdAt: "",
    clientId: "",
  };
}

export function getMockedDepositAddressData(
  networkId: string
): DepositAddressDataResponse {
  switch (networkId) {
    case "BITCOIN":
      return BTC_DEPOSIT_ADDRESS;
    case "AVALANCHE":
      return AVAX_DEPOSIT_ADDRESS;
    case "ETHEREUM":
      return ETH_DEPOSIT_ADDRESS;
    case "TRON":
      return TRON_DEPOSIT_ADDRESS;
    default:
      return getNullMockedDepositAddressData();
  }
}
