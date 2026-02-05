import { LOAN_HISTORY_EVENTS } from "@/shared/mockups/loan-history-events";
import { z } from "zod";

export const LoanHistoryEventSchema = z.object({
    createdAt: z.string(),
    type: z.string(),
    data: z.object({
        currencyId: z.string().optional(),
        amount: z.string().optional(),
        liqCollat: z.string().optional(),
        liqCollatValue: z.string().optional(),
        repayed: z.string().optional(),
        price: z.string().optional(),
        fee: z.string().optional()
    }),
});

export type LoanHistoryEvent = z.infer<typeof LoanHistoryEventSchema>;

export const loanHistoryEventsDataResponseSchema = z.object({
    data: z.array(LoanHistoryEventSchema),
    status: z.number(),
});

export type LoanHistoryEventsDataResponse = z.infer<typeof loanHistoryEventsDataResponseSchema>;

export const getMockedLoanHistoryEventsData = (): LoanHistoryEvent[] => {
    return LoanHistoryEventSchema.array().parse(LOAN_HISTORY_EVENTS.data);
};

export const getFormattedLoanHistoryEventsData = (response: LoanHistoryEventsDataResponse): LoanHistoryEvent[] => {
    return LoanHistoryEventSchema.array().parse(response.data);
};
