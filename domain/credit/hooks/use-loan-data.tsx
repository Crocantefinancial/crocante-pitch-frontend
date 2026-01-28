import { SelectOption } from "@/components/core/select";
import { getTokenLogo } from "@/components/token-icons";
import { POLL_LOANS_TYPE_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { TokenType } from "@/domain/portfolio/hooks/use-portfolio-data";
import { useLoanType } from "@/services/hooks/use-loan-type";
import { useMemo } from "react";

export function useLoanData(selectedToken: string, selectedCollateral: string) {
    const { user } = useSession();
    const userId = user?.id.toString() || "";

    const { data: loanTypeData, isLoading: isLoadingLoanType } = useLoanType(userId, POLL_LOANS_TYPE_DATA_INTERVAL);

    const { tokens, tokensOptions, collaterals, collateralOptions } = useMemo(() => {
        if (!loanTypeData) {
            return { tokens: {}, tokensOptions: [], collaterals: {}, collateralOptions: [] };
        }
        const collateralsRecord: Record<string, TokenType> = {};
        const tokensRecord: Record<string, TokenType> = {};
        const collateralOptions: Array<SelectOption> = [];
        const tokensOptions: Array<SelectOption> = [];
        loanTypeData.forEach((loanType) => {
            if (!tokensRecord[loanType.sizeId]) {
                const token: TokenType = {
                    symbol: loanType.sizeId,
                    icon: <img src={getTokenLogo(loanType.sizeId)} className="w-7 h-7 rounded-full" />
                };
                tokensRecord[loanType.sizeId] = token;
                tokensOptions.push({
                    label: loanType.sizeId,
                    id: loanType.sizeId,
                    value: loanType.sizeId,
                    icon: token.icon,
                });
            }
            const collateral: TokenType = {
                symbol: loanType.collatId,
                icon: <img src={getTokenLogo(loanType.collatId)} className="w-7 h-7 rounded-full" />
            };
            collateralsRecord[loanType.collatId] = collateral;
            collateralOptions.push({
                label: loanType.collatId,
                id: loanType.collatId,
                value: loanType.collatId,
                icon: collateral.icon,
            });
        });
        return { tokens: tokensRecord, tokensOptions, collaterals: collateralsRecord, collateralOptions };
    }, [loanTypeData]);

    const { loanData, LoanTypeValues, isLoadingLoanData } = useMemo(() => {
        if (!loanTypeData) {
            return { loanData: null, LoanTypeValues: { "": "" }, isLoadingLoanData: false };
        }
        const loanData = loanTypeData.find(loanType => loanType.sizeId === selectedToken && loanType.collatId === selectedCollateral);
        if (!loanData) {
            return { loanData: null, LoanTypeValues: { "": "" }, isLoadingLoanData: false };
        }
        const LoanTypeValues: Record<string, string> = loanData.models.
            reduce((acc, _, index) => {
                acc[index] = `Risk Level ${index + 1}`;
                return acc;
            }, {} as Record<string, string>);
        return { loanData, LoanTypeValues, isLoadingLoanData: isLoadingLoanType };
    }, [loanTypeData, selectedToken, selectedCollateral]);

    return {
        tokens,
        tokensOptions,
        collaterals,
        collateralOptions,
        loanData,
        LoanTypeValues,
        isLoading: isLoadingLoanType || isLoadingLoanData,
    };
}