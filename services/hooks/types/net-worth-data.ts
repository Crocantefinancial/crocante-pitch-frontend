import { NET_WORTH_DATA } from "@/shared/mockups/net-worth";
import { z } from "zod";

export const CurrencySchema = z.object({
  id: z.string(),
  name: z.string(),
  decimals: z.number(),
  allowTransfers: z.boolean(),
  disabled: z.boolean(),
  priority: z.number(),
});
export const StakingSchema = z.object({
  initial: z.string(),
  accrued: z.string(),
});
export const AssetSchema = z.object({
  currency: CurrencySchema,
  quoteCurrency: CurrencySchema,
  available: z.string(),
  locked: z.string(),
  total: z.string(),
  staking: StakingSchema,
  estPrice: z.string(),
  estValue: z.string(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const LiabilitySchema = z.object({
  currency: CurrencySchema,
  quoteCurrency: CurrencySchema,
  amount: z.string(),
  debt: z.string(),
  interest: z.string(),
  estPrice: z.string(),
  estValue: z.string(),
  estInterestValue: z.string(),
});
export type Liability = z.infer<typeof LiabilitySchema>;
export const NetWorthDataSchema = z.object({
  assets: z.object({
    clientId: z.string(),
    assets: z.array(AssetSchema),
    estTotalValue: z.string(),
  }),
  liabilities: z.object({
    liabilities: z.array(LiabilitySchema),
    estTotalValue: z.string(),
    estTotalInterestValue: z.string(),
  }),
  estTotalValue: z.string(),
});
export type NetWorthData = z.infer<typeof NetWorthDataSchema>;

export const netWorthDataResponseSchema = z.object({
  data: NetWorthDataSchema,
  status: z.number(),
});

export type NetWorthDataResponse = z.infer<typeof netWorthDataResponseSchema>;

export const getMockedNetWorthData = (): NetWorthData => {
  return NET_WORTH_DATA;
};

export const getFormattedNetWorthData = (
  response: NetWorthDataResponse
): NetWorthData => {
  return NetWorthDataSchema.parse(response.data);
};
