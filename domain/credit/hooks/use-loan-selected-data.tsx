import { SelectOption } from "@/components/core/select";
import { POLL_AVAILABLES_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { useAvailableToken } from "@/services/hooks/use-available-token";
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
    originationCost: number;
    overcollateralizationCost: number;
    liquidationPrice: number;
    dailyCost: number;
    modelId: string;
}

export function useLoanSelectedData(
    loanData: LoanTypeData,
    LoanTypeValues: Record<string, string>,
    selectedLoan: string,
    selectedRow: string,
    value: string,
    collateralValue: string,
    assetSelector: SelectOption,
    collateralSelector: SelectOption
) {
    const { user } = useSession();
    const userId = user?.id.toString() || "";
    const {
        convertFrom,
        isLoading: isLoadingTokenSwap,
    } = useTokenSwap(userId, assetSelector?.label, collateralSelector?.label, false);

    const { data: availableTokenData, isLoading: isLoadingAvailableToken } = useAvailableToken(
        userId,
        collateralSelector?.label,
        POLL_AVAILABLES_INTERVAL
    );
    const { minLoanValue, maxLoanValue, availableCollateral } = useMemo(() => {
        if (!availableTokenData || !collateralSelector || !loanData) {
            return { minLoanValue: "0", maxLoanValue: "0", availableCollateral: "0" };
        }
        return {
            minLoanValue: loanData?.minSize || "0",
            maxLoanValue: loanData?.maxSize || "0",
            availableCollateral: availableTokenData.amount,
        };
    }, [availableTokenData, loanData, collateralSelector]);

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
                    originationCost: 0,
                    overcollateralizationCost: 0,
                    liquidationPrice: 0,
                    dailyCost: 0,
                    modelId: "",
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

        const originationCost = originationFeeRate * Number(value);
        const overcollateralizationCost = (overcollateralizationRate * (Number(value) + originationCost)) - (Number(value));
        const liquidationPrice = liqThreshold * (Number(value) + originationCost) / Number(collateralValue);
        const dailyCost = (Number(item!.apr) * (Number(value) + originationCost) / 365);

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
            originationCost,
            overcollateralizationCost,
            liquidationPrice,
            dailyCost,
            modelId: loanData.id,
        };
        return { loanSelectedData, isLoadingLoanSelectedData: false };
    }, [
        loanData,
        selectedLoan,
        selectedRow,
        value,
        collateralValue,
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
        isLoadingLoanSelectedData: isLoadingAvailableToken || isLoadingLoanSelectedData || isLoadingTokenSwap,
    };
}