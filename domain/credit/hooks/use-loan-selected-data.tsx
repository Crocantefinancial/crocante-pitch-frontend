import { SelectOption } from "@/components/core/select";
import { POLL_PORTFOLIO_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { usePortfolio } from "@/services/hooks/use-portfolio";
import { useMemo } from "react";

export interface LoanSelectedData {
    selectedLoan: string;
    selectedRow: string;
    selectedRowKey: string;
    item: LoanTypeData["models"][number] | undefined;
    overcollateralizationRate: number;
    originationFeeRate: number;
    loanTotalCost: number;
    tokenLabel: string;
    collateralLabel: string;
    minLoanValue: string;
    maxLoanValue: string;
    maxPossibleLoan: string;
    liqThreshold: number;
}

export function useLoanSelectedData(
    loanData: LoanTypeData,
    LoanTypeValues: Record<string, string>,
    selectedLoan: string,
    selectedRow: string,
    value: string,
    assetSelector: SelectOption,
    collateralSelector: SelectOption
) {
    const { user } = useSession();
    const userId = user?.id.toString() || "";
    const {
        convertFrom,
        isLoading: isLoadingTokenSwap,
    } = useTokenSwap(userId, assetSelector?.label, collateralSelector?.label, false);

    const { data: portfolioData, isLoading: isLoadingPortfolio } = usePortfolio(
        userId,
        POLL_PORTFOLIO_DATA_INTERVAL
    );
    const { minLoanValue, maxLoanValue, availableCollateral } = useMemo(() => {
        if (!portfolioData || !collateralSelector || !loanData) {
            return { minLoanValue: "0", maxLoanValue: "0", availableCollateral: "0" };
        }
        const availableCollateral = portfolioData.cryptocurrenciesData.
            find(currency => currency.code === collateralSelector.label)?.available || "0";

        return {
            minLoanValue: loanData?.minSize || "0",
            maxLoanValue: loanData?.maxSize || "0",
            availableCollateral,
        };
    }, [portfolioData, loanData, collateralSelector]);

    const { loanSelectedData, isLoadingLoanSelectedData } = useMemo(() => {
        if (!loanData || !selectedLoan) {
            return {
                loanSelectedData:
                {
                    selectedLoan: "",
                    selectedRow: "",
                    selectedRowKey: "",
                    item: undefined,
                    overcollateralizationRate: 0,
                    originationFeeRate: 0,
                    loanTotalCost: 0,
                    tokenLabel: "",
                    collateralLabel: "",
                    minLoanValue: "0",
                    maxLoanValue: "0",
                    maxPossibleLoan: "0",
                    liqThreshold: 0,
                },
                isLoadingLoanSelectedData: false
            };
        }

        const selectedRowKey = (Object.keys(LoanTypeValues).
            find(key => LoanTypeValues[key as keyof typeof LoanTypeValues] === selectedRow)) ?? "";
        const selectedRowIdx = selectedRowKey === "" ? -1 : Number(selectedRowKey);
        const item = selectedRowIdx >= 0 ? loanData.models[selectedRowIdx] : undefined;
        const overcollateralizationRate = Number(item?.ratio || 0);
        const originationFeeRate = Number(loanData.origFeePercent || 0);
        const loanTotalCost = (Number(value) + Number(value) * originationFeeRate) * overcollateralizationRate;

        const maxAvailableCollateralToLoan = Number(availableCollateral) / ((1 + originationFeeRate) * overcollateralizationRate);
        const maxAvailableToLoan = Number(convertFrom(maxAvailableCollateralToLoan.toString()));

        const maxPossibleLoan = String(
            Math.min(Number(maxLoanValue), maxAvailableToLoan)
        );

        const tokenLabel =
            assetSelector.label || "";
        const collateralLabel =
            collateralSelector.label || "";
        const liqThreshold = Number(loanData?.liqRatio || 0);
        const loanSelectedData = {
            selectedLoan,
            selectedRow,
            selectedRowKey,
            item,
            overcollateralizationRate,
            originationFeeRate,
            loanTotalCost,
            tokenLabel,
            collateralLabel,
            minLoanValue,
            maxLoanValue,
            maxPossibleLoan,
            liqThreshold,
        };
        return { loanSelectedData, isLoadingLoanSelectedData: false };
    }, [
        loanData,
        selectedLoan,
        selectedRow,
        value,
        assetSelector,
        collateralSelector,
        LoanTypeValues,
        minLoanValue,
        maxLoanValue,
        availableCollateral,
        convertFrom,
        isLoadingTokenSwap,
    ]);

    return {
        loanSelectedData,
        isLoadingLoanSelectedData: isLoadingPortfolio || isLoadingLoanSelectedData || isLoadingTokenSwap,
    };
}