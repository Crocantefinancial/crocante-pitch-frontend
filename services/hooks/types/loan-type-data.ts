import { LOAN_TYPE } from "@/shared/mockups/loan-type";
import { z } from "zod";

export const ModelsSchema = z.object({
    apr: z.string(),
    ratio: z.string(),
});

export const LoanTypeDataSchema = z.object({
    id: z.string(),
    groupId: z.string(),
    collatId: z.string(),
    sizeId: z.string(),
    durationDays: z.number(),
    tiers: z.array(ModelsSchema),
    models: z.array(ModelsSchema),
    liqRatio: z.string(),
    forcedLiqFeePercent: z.string(),
    liqFeePercent: z.string(),
    origFeePercent: z.string(),
    minCollatRatio: z.string(),
    marginCallRatio: z.string(),
    minSize: z.string(),
    maxSize: z.string(),
    minLiqAmount: z.string(),
    maxLiqAmount: z.string(),
});

export type LoanTypeData = z.infer<typeof LoanTypeDataSchema>;

export const LoanTypeDataResponseSchema = z.object({
    data: z.array(LoanTypeDataSchema),
    status: z.number(),
});

export type LoanTypeDataResponse = z.infer<typeof LoanTypeDataResponseSchema>;

export function getFormattedLoanTypeData(data: LoanTypeDataResponse): LoanTypeData[] {
    return LoanTypeDataSchema.array().parse(data.data);
}

export function getMockedLoanTypeData(): LoanTypeData[] {
    return LoanTypeDataSchema.array().parse(LOAN_TYPE.data);
}