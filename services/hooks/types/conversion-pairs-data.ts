import { CONVERSION_PAIRS } from "@/shared/mockups/conversion-pairs";
import { z } from "zod";

export const ConversionPairsDataSchemaItem = z.object({
  sourceId: z.string(),
  destId: z.string(),
  feePercent: z.string(),
  pair: z.object({
    groupId: z.string(),
    baseId: z.string(),
    quoteId: z.string(),
  }),
  pairSide: z.enum(["SELL", "BUY"]),
});

export const ConversionPairsDataSchema = z.record(
  z.enum([
    "AAVE",
    "ADA",
    "AVAX",
    "BTC",
    "ETH",
    "SOL",
    "XRP",
    "DOGE",
    "DOT",
    "LINK",
    "LTC",
    "MANA",
    "MATIC",
    "SUI",
    "USDC",
    "USDT",
    "XLM",
    "XRP",
    "ZIL",
  ] as const),
  z.array(ConversionPairsDataSchemaItem)
);

export type ConversionPairsData = z.infer<typeof ConversionPairsDataSchema>;
export type ConversionPairsDataItem = z.infer<
  typeof ConversionPairsDataSchemaItem
>;

export const conversionPairsDataResponseSchema = z.object({
  data: ConversionPairsDataSchema,
  status: z.number(),
});

export type ConversionPairsDataResponse = z.infer<
  typeof conversionPairsDataResponseSchema
>;

export const getMockedConversionPairsData = (
  tokenId: string
): ConversionPairsDataItem => {
  return ConversionPairsDataSchemaItem.parse(
    CONVERSION_PAIRS.data[tokenId as keyof typeof CONVERSION_PAIRS.data]
  );
};

export const getFormattedConversionPairsData = (
  response: ConversionPairsDataResponse,
  tokenId: string
): ConversionPairsDataItem => {
  return ConversionPairsDataSchemaItem.parse(
    response.data[tokenId as keyof typeof response.data]
  );
};
