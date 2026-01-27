import { LOANS_ACTIVITY } from "@/shared/mockups/loans-activity";
import { z } from "zod";
import { LastUpdateSchema, OperationSchema, TiersSchema } from "./activity-data";

export type TiersType = z.infer<typeof TiersSchema>;

export const LoanSchema = z.array(z.object({
    typeId: z.string(),
    operation: OperationSchema,
    sizeCurrencyId: z.string(),
    collatCurrencyId: z.string(),
    status: z.string(),
    size: z.string(),
    collat: z.string(),
    repayed: z.string(),
    debt: z.string(),
    interest: z.string(),
    ratio: z.string(),
    liqPrice: z.string(),
    apr: z.string(),
    tierNum: z.number(),
    minCollat: z.string(),
    initialAPR: z.string(),
    initialRatio: z.string(),
    initialSize: z.string(),
    initialCollat: z.string(),
    initialDebt: z.string(),
    origFee: z.string(),
    tiers: z.array(TiersSchema),
    lastUpdate: LastUpdateSchema,
    forcedLiq: z.boolean(),
}));

export type LoanData = z.infer<typeof LoanSchema>;

export const loanDataResponseSchema = z.object({
    data: LoanSchema,
    status: z.number(),
});

export type LoanDataResponse = z.infer<typeof loanDataResponseSchema>;

export const getMockedLoanData = (): LoanData => {
    return LoanSchema.parse(LOANS_ACTIVITY.data);
};

export const getFormattedLoanData = (response: LoanDataResponse): LoanData => {
    return LoanSchema.parse(response.data);
};
