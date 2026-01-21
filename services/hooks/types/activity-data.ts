import { ACTIVITY_DATA } from "@/shared/mockups/activity";
import { z } from "zod";

export const OperationSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  ownerId: z.string(),
  openedAt: z.string(),
  updatedAt: z.string(),
  closedAt: z.string().nullable(),
  status: z.string(),
  type: z.string(),
  fullType: z.string(),
});

export const TypeSchema = z.object({
  id: z.string(),
  currencyId: z.string(),
  mode: z.enum(["VARIABLE", "FIXED"]),
  apy: z.string(),
  minAmount: z.string(),
  durationDays: z.number().optional(),
});

export const CurrencySchema = z.object({
  id: z.string(),
  name: z.string(),
  decimals: z.number(),
  allowTransfers: z.boolean(),
  disabled: z.boolean(),
  priority: z.number(),
});

export const AdminOperationDataSchema = z.object({
  type: z.literal("ADMIN"),
  currencyId: z.string(),
  operation: OperationSchema,
  currency: CurrencySchema,
  id: z.string().optional(),
  amount: z.string().optional(),
  netAmount: z.string().optional(),
  feeAmount: z.string().optional(),
  grossAmount: z.string().optional(),
  senderId: z.string().optional(),
  receiverId: z.string().optional(),
  approverId: z.string().optional(),
  approvalState: z.string().optional(),
});

export const StakingDataSchema = z.object({
  typeId: z.string().optional(),
  startsAt: z.string().optional(),
  redeemableAt: z.string().nullable().optional(),
  initialAmount: z.string().optional(),
  initialAPY: z.string().optional(),
  operation: OperationSchema,
  type: TypeSchema,
  amount: z.string().optional(),
  yield: z.string().optional(),
  estRedeemYield: z.string().optional(),
  apy: z.string().optional(),
});

/* 

"operationId": "e79a12b9-0981-439f-8a49-a1e226b89516",
            "groupId": "CONVERT",
            "baseId": "USDC",
            "quoteId": "USDT",
            "limitPrice": null,
            "type": "MARKET",
            "side": "BUY",
            "status": "FILLED",
            "size": "20",
            "lastFilledAt": "2026-01-09T14:40:23.906478Z",
            "filledSize": "19.984012",
            "avgPrice": "1.0008",
            "canceling": false,
            "makerFeePercent": "0.0035",
            "takerFeePercent": "0.0035",
            "execType": "IMMEDIATE",
            "triggeredAt": null,
            "triggerPrice": null,
            "triggerPriceHigh": null,
            "triggerPriceLow": null,
            "operation": {
                "id": "e79a12b9-0981-439f-8a49-a1e226b89516",
                "creatorId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
                "ownerId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
                "openedAt": "2026-01-09T14:40:23.508926Z",
                "updatedAt": "2026-01-09T14:40:23.906478Z",
                "closedAt": "2026-01-09T14:40:23.906478Z",
                "status": "COMPLETED",
                "type": "TRADE",
                "fullType": "TRADE.CONVERSION"
            },
            "baseSize": null,
            "quoteSize": "20",
            "filledQuoteSize": "19.9999992096",
            "creditCurrencyID": "USDC",
            "debitCurrencyID": "USDT",
            "estCreditAmount": null,
            "estGrossCreditAmount": null,
            "estNetCreditAmount": null,
            "estDebitAmount": null,
            "estFeeAmount": null,
            "creditAmount": "19.914067958",
            "netCreditAmount": "19.914067958",
            "grossCreditAmount": "19.984012",
            "debitAmount": "19.9999992096",
            "feeAmount": "0.069944042",
            "tickSize": 4,
            "stepSize": 6,
            "liquidityProviderType": "OKX",
            "triggerPriceHighBaseSize": null,
            "triggerPriceLowBaseSize": null,
            "triggerPriceHighQuoteSize": null,
            "triggerPriceLowQuoteSize": null

*/
export const ConvertDataSchema = z.object({
  operationId: z.string(),
  groupId: z.string(),
  baseId: z.string(),
  quoteId: z.string(),
  limitPrice: z.string().nullable(),
  type: z.string(),
  side: z.string(),
  status: z.string(),
  size: z.string(),
  lastFilledAt: z.string().nullable(),
  filledSize: z.string(),
  avgPrice: z.string().nullable(),
  canceling: z.boolean(),
  makerFeePercent: z.string(),
  takerFeePercent: z.string(),
  execType: z.string(),
  triggeredAt: z.string().nullable(),
  triggerPrice: z.string().nullable(),
  triggerPriceHigh: z.string().nullable(),
  triggerPriceLow: z.string().nullable(),
  operation: OperationSchema,
  baseSize: z.string().nullable(),
  quoteSize: z.string().nullable(),
  filledQuoteSize: z.string(),
  creditCurrencyID: z.string(),
  debitCurrencyID: z.string(),
  estCreditAmount: z.string().nullable(),
  estGrossCreditAmount: z.string().nullable(),
  estNetCreditAmount: z.string().nullable(),
  estDebitAmount: z.string().nullable(),
  estFeeAmount: z.string().nullable(),
  creditAmount: z.string(),
  netCreditAmount: z.string(),
  grossCreditAmount: z.string(),
  debitAmount: z.string(),
  feeAmount: z.string(),
  tickSize: z.number(),
  stepSize: z.number(),
  liquidityProviderType: z.string(),
  triggerPriceHighBaseSize: z.string().nullable(),
  triggerPriceLowBaseSize: z.string().nullable(),
  triggerPriceHighQuoteSize: z.string().nullable(),
  triggerPriceLowQuoteSize: z.string().nullable(),
});

export const ActivityDataSchema = z.union([
  StakingDataSchema,
  AdminOperationDataSchema,
  ConvertDataSchema,
]);

export type ActivityData = z.infer<typeof ActivityDataSchema>;

export const activityDataResponseSchema = z.object({
  data: z.array(ActivityDataSchema),
  status: z.number(),
});

export type ActivityDataResponse = z.infer<typeof activityDataResponseSchema>;

export const getMockedActivityData = (): ActivityData[] => {
  return ActivityDataSchema.array().parse(ACTIVITY_DATA.data);
};

export const getFormattedActivityData = (
  response: ActivityDataResponse
): ActivityData[] => {
  return ActivityDataSchema.array().parse(response.data);
};
