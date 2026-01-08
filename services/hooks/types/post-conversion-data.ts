import { CONVERSION } from "@/shared/mockups/conversion";
import { z } from "zod";

export const postConversionDataSchema = z.object({
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
  operation: z.object({
    id: z.string(),
    creatorId: z.string(),
    ownerId: z.string(),
    openedAt: z.string(),
    updatedAt: z.string(),
    closedAt: z.string().nullable(),
    status: z.string(),
    type: z.string(),
    fullType: z.string(),
  }),
  baseSize: z.string().nullable(),
  quoteSize: z.string().nullable(),
  filledQuoteSize: z.string(),
  creditCurrencyID: z.string(),
  debitCurrencyID: z.string(),
  estCreditAmount: z.string().nullable(),
  estGrossCreditAmount: z.string().nullable(),
  estNetCreditAmount: z.string().nullable(),
  estDebitAmount: z.string(),
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

export type PostConversionData = z.infer<typeof postConversionDataSchema>;

export const postConversionDataResponseSchema = z.object({
  data: postConversionDataSchema,
  status: z.number(),
});

export type PostConversionDataResponse = z.infer<
  typeof postConversionDataResponseSchema
>;

export const getMockedPostConversionData = (): PostConversionData => {
  return postConversionDataSchema.parse(CONVERSION);
};

export const getFormattedPostConversionData = (
  response: PostConversionDataResponse
): PostConversionData => {
  return postConversionDataSchema.parse(response.data);
};
