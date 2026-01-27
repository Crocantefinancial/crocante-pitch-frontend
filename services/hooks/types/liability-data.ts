import { LIABILITY } from "@/shared/mockups/liability";
import { z } from "zod";
import { CurrencySchema } from "./activity-data";

export const LiabilityDataSchema = z.object({
    liabilities: z.array(z.object({
        currency: CurrencySchema,
        quoteCurrency: CurrencySchema,
        amount: z.string(),
        debt: z.string(),
        interest: z.string(),
        estPrice: z.string(),
        estValue: z.string(),
        estInterestValue: z.string(),
    })),
    estTotalValue: z.string(),
    estTotalInterestValue: z.string(),
});

export type LiabilityData = z.infer<typeof LiabilityDataSchema>;

export const liabilityDataResponseSchema = z.object({
    data: LiabilityDataSchema,
    status: z.number(),
});

export type LiabilityDataResponse = z.infer<typeof liabilityDataResponseSchema>;

export const getMockedLiabilityData = (): LiabilityData => {
    return LiabilityDataSchema.parse(LIABILITY.data);
};

export const getFormattedLiabilityData = (response: LiabilityDataResponse): LiabilityData => {
    return LiabilityDataSchema.parse(response.data);
};
