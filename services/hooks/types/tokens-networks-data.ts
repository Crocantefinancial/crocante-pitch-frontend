import {
  AVAX_TOKEN_NETWORKS,
  BTC_TOKEN_NETWORKS,
  ETH_TOKEN_NETWORKS,
  USDT_TOKEN_NETWORKS,
} from "@/shared/mockups/tokens-networks";
import z from "zod";
import { currencyDepositSchema } from "./currency-deposit-data";

export const networkSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainCurrencyID: z.string(),
  minConfirms: z.number(),
});

export const tokensNetworksSchema = z.object({
  currencyId: z.string(),
  networkId: z.string(),
  allowDeposits: z.boolean(),
  allowWithdrawals: z.boolean(),
  withdrawalFeeValue: z.string(),
  withdrawalMin: z.string(),
  depositMin: z.string(),
  currency: currencyDepositSchema,
  network: networkSchema,
  withdrawalFee: z.string(),
});

export type TokensNetworksData = z.infer<typeof tokensNetworksSchema>;

export const tokensNetworksResponseSchema = z.object({
  data: z.array(tokensNetworksSchema),
  status: z.number(),
});

export type TokensNetworksResponse = z.infer<
  typeof tokensNetworksResponseSchema
>;

export function getMockedTokensNetworksData(
  currencyId: string
): TokensNetworksData[] {
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
