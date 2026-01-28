import { SelectOption } from "@/components/core/select";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
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
    rawMaxValue: string;
    rawMinValue: string;
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
                    rawMaxValue: "0",
                    rawMinValue: "0",
                    liqThreshold: 0,
                },
                isLoadingLoanSelectedData: false
            };
        }

        const selectedRowKey = Object.keys(LoanTypeValues).
            find(key => LoanTypeValues[key as keyof typeof LoanTypeValues] === selectedRow);
        const item = loanData.models[Number(selectedRowKey)];
        const overcollateralizationRate = Number(item?.ratio || 0);
        const originationFeeRate = Number(loanData.origFeePercent || 0);
        const loanTotalCost = (Number(value) + Number(value) * originationFeeRate) * overcollateralizationRate;
        const tokenLabel =
            assetSelector.label || "";
        const collateralLabel =
            collateralSelector.label || "";
        const rawMaxValue =
            assetSelector.value || "0";
        const rawMinValue = loanData?.minSize ?? "0";
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
            rawMaxValue,
            rawMinValue,
            liqThreshold,
        };
        return { loanSelectedData, isLoadingLoanSelectedData: false };
    }, [loanData, selectedLoan, selectedRow, value, assetSelector, collateralSelector]);

    return {
        loanSelectedData,
        isLoadingLoanSelectedData,
    };
}