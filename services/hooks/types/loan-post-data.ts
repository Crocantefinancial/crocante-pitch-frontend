import { LOAN_POST } from "@/shared/mockups/loan";
import { z } from "zod";

export const loanPostDataResponseSchema = z.object({
    data: z.object({
        typeId: z.string(),
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
        tiers: z.array(z.object({
            minRatio: z.string(),
            minPrice: z.string(),
            apr: z.string(),
        })),
        lastUpdate: z.object({
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
        }),
        forcedLiq: z.boolean(),
    }),
    status: z.number(),
});

export type LoanPostDataResponse = z.infer<typeof loanPostDataResponseSchema>;

export const getFormattedLoanPostData = (
    response: LoanPostDataResponse
): LoanPostDataResponse['data'] => {
    return loanPostDataResponseSchema.parse(response).data;
};

export const getMockedLoanPostData = (): LoanPostDataResponse['data'] => {
    return loanPostDataResponseSchema.parse(LOAN_POST).data;
};