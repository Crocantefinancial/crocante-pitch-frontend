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

export const TiersSchema = z.object({
  minRatio: z.string().optional(),
  minPrice: z.string().optional(),
  apr: z.string(),
});

export const LastUpdateSchema = z.object({
  createdAt: z.string(),
  type: z.string(),
  status: z.string(),
  apr: z.string(),
  dCollat: z.string(),
  dRepayed: z.string(),
  liqCollat: z.string(),
  price: z.string(),
  dFees: z.string(),
  dTierNum: z.number(),
  forcedLiq: z.boolean(),
});

export const LoanOperationDataSchema = z.object({
  type: z.literal("LOAN").optional(),
  typeId: z.string(),
  operation: OperationSchema,
  sizeCurrencyId: z.string().optional(),
  collatCurrencyId: z.string().optional(),
  status: z.string().optional(),
  size: z.string().optional(),
  collat: z.string().optional(),
  repayed: z.string().optional(),
  debt: z.string().optional(),
  interest: z.string().optional(),
  ratio: z.string().optional(),
  liqPrice: z.string().optional(),
  apr: z.string().optional(),
  tierNum: z.number().optional(),
  minCollat: z.string().optional(),
  initialAPR: z.string().optional(),
  initialRatio: z.string().optional(),
  initialSize: z.string().optional(),
  initialCollat: z.string().optional(),
  initialDebt: z.string().optional(),
  origFee: z.string().optional(),
  tiers: z.array(TiersSchema),
  lastUpdate: LastUpdateSchema,
  forcedLiq: z.boolean().optional(),
});

export const NetworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainCurrencyID: z.string(),
  minConfirms: z.number(),
});

export const CryptoOperationDataSchema = z.object({
  type: z.literal("CRYPTO"),
  currencyId: z.string(),
  operation: OperationSchema,
  currency: CurrencySchema,
  id: z.string().optional(),
  amount: z.string().optional(),
  netAmount: z.string().optional(),
  feeAmount: z.string().optional(),
  grossAmount: z.string().optional(),
  receiverId: z.string().optional(),
  network: NetworkSchema,
  networkId: z.string().optional(),
  address: z.string().optional(),
  addressURL: z.string().optional(),
  dstAddress: z.string().optional(),
  dstAddressURL: z.string().optional(),
  srcAddress: z.string().optional(),
  srcAddressURL: z.string().optional(),
  transactionHash: z.string().nullable().optional(),
  transactionHashURL: z.string().nullable().optional(),
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
  approverId: z.string().nullable().optional(),
  approvalState: z.string().optional(),
});

export const TransferOperationDataSchema = z.object({
  type: z.literal("TRANSFER"),
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
  receiver: z.string().optional(),
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
  TransferOperationDataSchema,
  CryptoOperationDataSchema,
  LoanOperationDataSchema,
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
