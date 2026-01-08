import { QUOTE } from "@/shared/mockups/quote";
import { z } from "zod";

export const QuoteDataSchema = z.object({
  edge: z.object({
    pair: z.object({
      groupId: z.string(),
      baseId: z.string(),
      quoteId: z.string(),
      lastConfigNum: z.number(),
      priority: z.number(),
      LastConfig: z.object({
        num: z.number(),
        groupId: z.string(),
        baseId: z.string(),
        quoteId: z.string(),
        createdAt: z.string(),
        makerFeePercent: z.string(),
        takerFeePercent: z.string(),
        limitSpreadAsk: z.string(),
        limitSpreadBid: z.string(),
        marketSpreadAsk: z.string(),
        marketSpreadBid: z.string(),
        tickSize: z.number(),
        stepSize: z.number(),
        limitMinQuoteSize: z.string(),
        limitMaxQuoteSize: z.string(),
        liquidityProviderType: z.string(),
        marketMinQuoteSize: z.string(),
        marketMaxQuoteSize: z.string(),
      }),
    }),
    side: z.enum(["SELL", "BUY"]),
  }),
  estSourceAmount: z.string(),
  estDestAmount: z.string(),
  estPrice: z.string(),
  estMaxSize: z.string(),
  estMinSize: z.string(),
});

export type QuoteData = z.infer<typeof QuoteDataSchema>;

export const quoteDataResponseSchema = z.object({
  data: QuoteDataSchema,
  status: z.number(),
});

export type QuoteDataResponse = z.infer<typeof quoteDataResponseSchema>;

export const getMockedQuoteData = (): QuoteData => {
  return QuoteDataSchema.parse(QUOTE);
};

export const getFormattedQuoteData = (
  response: QuoteDataResponse
): QuoteData => {
  return QuoteDataSchema.parse(response.data);
};
