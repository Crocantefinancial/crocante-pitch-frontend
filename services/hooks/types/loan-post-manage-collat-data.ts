import { LOAN_MANAGE_COLLAT } from "@/shared/mockups/loan-manage-collat";
import { z } from "zod";
import { loanPostDataResponseSchema } from "./loan-post-data";

export const loanPostManageCollatDataResponseSchema = loanPostDataResponseSchema;

export type LoanPostManageCollatDataResponse = z.infer<typeof loanPostManageCollatDataResponseSchema>;

export const getFormattedLoanPostManageCollatData = (
    response: LoanPostManageCollatDataResponse
): LoanPostManageCollatDataResponse['data'] => {
    return loanPostManageCollatDataResponseSchema.parse(response).data;
};

export const getMockedLoanPostManageCollatData = (): LoanPostManageCollatDataResponse['data'] => {
    return loanPostManageCollatDataResponseSchema.parse(LOAN_MANAGE_COLLAT).data;
};