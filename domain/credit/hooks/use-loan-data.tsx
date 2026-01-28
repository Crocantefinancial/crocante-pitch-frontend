import { SelectOption } from "@/components/core/select";
import { getTokenLogo } from "@/components/token-icons";
import { POLL_LIABILITY_DATA_INTERVAL, POLL_LOANS_TYPE_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { TokenType } from "@/domain/portfolio/hooks/use-portfolio-data";
import { useLiability } from "@/services/hooks/use-liability";
import { useLoanType } from "@/services/hooks/use-loan-type";
import { useMemo } from "react";

export function useLoanData(selectedToken: string, selectedCollateral: string) {
    const { user } = useSession();
    const userId = user?.id.toString() || "";

    const { data: liabilityData, isLoading: isLoadingLiability } = useLiability(
        userId,
        POLL_LIABILITY_DATA_INTERVAL
    );

    const { allTokens, allTokensOptions } = useMemo(() => {
        if (!liabilityData?.liabilities) {
            return { allTokens: undefined, allTokensOptions: [] };
        }

        const tokensRecord: Record<string, TokenType> = {};
        const options: Array<SelectOption> = [];

        liabilityData.liabilities.forEach((liability) => {
            if (liability.amount !== "0") {
                const token: TokenType = {
                    symbol: liability.currency.id,
                    icon: (
                        <img
                            src={getTokenLogo(liability.currency.id)}
                            className="w-7 h-7 rounded-full"
                        />
                    ),
                };
                tokensRecord[liability.currency.id] = token;
                options.push({
                    label: liability.currency.id,
                    id: liability.currency.id,
                    value: liability.amount,
                    icon: token.icon,
                });
            }
        });

        return {
            allTokens: tokensRecord,
            allTokensOptions: options,
        };
    }, [liabilityData?.liabilities]);


    const { data: loanTypeData, isLoading: isLoadingLoanType } = useLoanType(userId, POLL_LOANS_TYPE_DATA_INTERVAL);

    const { tokens, tokensOptions } = useMemo(() => {
        if (!allTokens) {
            return { tokens: undefined, tokensOptions: [] };
        }

        if (!loanTypeData) {
            return { tokens: allTokens, tokensOptions: allTokensOptions };
        }

        const keysFilteredByLoanType = Object.keys(allTokens).filter(item => loanTypeData.filter(loanType => loanType.sizeId === item));
        const tokensFilteredByLoanType = keysFilteredByLoanType.reduce((acc, item) => {
            acc[item] = allTokens[item];
            return acc;
        }, {} as Record<string, TokenType>);
        const tokensOptionsFilteredByLoanType = allTokensOptions?.filter(item => keysFilteredByLoanType.includes(item.id));

        return {
            tokens: tokensFilteredByLoanType,
            tokensOptions: tokensOptionsFilteredByLoanType
        };
    }, [allTokens, allTokensOptions, loanTypeData]);

    const { collaterals, collateralOptions } = useMemo(() => {
        if (!liabilityData?.liabilities || !loanTypeData) {
            return { collaterals: {}, collateralOptions: [] };
        }
        const collateralsRecord: Record<string, TokenType> = {};
        const collateralOptions: Array<SelectOption> = [];
        loanTypeData.forEach((loanType) => {
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
        return { collaterals: collateralsRecord, collateralOptions };
    }, [liabilityData?.liabilities, loanTypeData]);

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
        isLoading: isLoadingLiability || isLoadingLoanType || isLoadingLoanData,
    };
}