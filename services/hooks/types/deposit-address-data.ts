import {
  AVAX_DEPOSIT_ADDRESS,
  BTC_DEPOSIT_ADDRESS,
  ETH_DEPOSIT_ADDRESS,
  TRON_DEPOSIT_ADDRESS,
} from "@/shared/mockups/deposit-address";
import { z } from "zod";

export function getNullMockedDepositAddressData(): DepositAddress {
  return {
    networkId: "",
    walletGroupID: "",
    address: "",
    createdAt: "",
    clientId: "",
  };
}

export const depositAddressSchema = z.object({
  networkId: z.string(),
  walletGroupID: z.string(),
  address: z.string(),
  createdAt: z.string(),
  clientId: z.string(),
});

export const depositAddressResponseSchema = z.object({
  data: depositAddressSchema,
  status: z.number(),
});

export type DepositAddress = z.infer<typeof depositAddressSchema>;
export type DepositAddressResponse = z.infer<
  typeof depositAddressResponseSchema
>;

export function getMockedDepositAddressData(networkId: string): DepositAddress {
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
