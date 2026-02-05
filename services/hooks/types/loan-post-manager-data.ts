import { LOAN_MANAGER } from "@/shared/mockups/loan-manager";
import { z } from "zod";
import { loanPostDataResponseSchema } from "./loan-post-data";

export const loanPostManagerDataResponseSchema = loanPostDataResponseSchema;

export type LoanPostManagerDataResponse = z.infer<typeof loanPostManagerDataResponseSchema>;

export const getFormattedLoanPostManagerData = (
    response: LoanPostManagerDataResponse
): LoanPostManagerDataResponse['data'] => {
    return loanPostManagerDataResponseSchema.parse(response).data;
};

export const getMockedLoanPostManagerData = (): LoanPostManagerDataResponse['data'] => {
    return loanPostManagerDataResponseSchema.parse(LOAN_MANAGER).data;
};