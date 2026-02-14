import { SelectOption } from "@/components/core/select";
import { POLL_AVAILABLES_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { formatToMaxDefinition, parseValue } from "@/lib/utils";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { useAvailableToken } from "@/services/hooks/use-available-token";
import { useMemo } from "react";


export type LoanItem = LoanTypeData["models"][number] & {
    aprDisplay: string;
}

export interface LoanSelectedData {
    selectedLoan: string;
    selectedRow: string;
    selectedRowKey: string;
    item: LoanItem | undefined;
    overcollateralizationRate: number;
    originationFeeRate: number;
    loanTotalCost: number;
    tokenLabel: string;
    collateralLabel: string;
    availableCollat: number;
    minLoanValue: string;
    maxLoanValue: string;
    maxPossibleLoan: string;
    parsedMaxPossibleLoan: string;
    parsedMinLoanValue: string;
    liqThreshold: number;
    originationCost: number;
    overcollateralizationCost: number;
    liquidationPrice: number;
    dailyCost: number;
    modelId: string;
    uiDisplay: {
        overcollateralizationDisplay: string;
        originationFeeRateDisplay: string;
        loanTotalCostDisplay: string;
        originationCostDisplay: string;
        collateralValueDisplay: string;
        overcollateralizationCostDisplay: string;
        liquidationPriceDisplay: string;
        dailyCostDisplay: string;
    };
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
                    availableCollat: 0,
                    minLoanValue: "0",
                    maxLoanValue: "0",
                    maxPossibleLoan: "0",
                    parsedMaxPossibleLoan: "0",
                    parsedMinLoanValue: "0",
                    liqThreshold: 0,
                    originationCost: 0,
                    overcollateralizationCost: 0,
                    liquidationPrice: 0,
                    dailyCost: 0,
                    modelId: "",
                    uiDisplay: {
                        overcollateralizationDisplay: "",
                        originationFeeRateDisplay: "",
                        originationCostDisplay: "",
                        loanTotalCostDisplay: "",
                        collateralValueDisplay: "",
                        overcollateralizationCostDisplay: "",
                        liquidationPriceDisplay: "",
                        dailyCostDisplay: "",
                    }
                },
                isLoadingLoanSelectedData: false
            };
        }

        const selectedRowKey = (Object.keys(LoanTypeValues).
            find(key => LoanTypeValues[key as keyof typeof LoanTypeValues] === selectedRow)) ?? "";
        const selectedRowIdx = selectedRowKey === "" ? -1 : Number(selectedRowKey);
        const item = selectedRowIdx >= 0 ? loanData.models[selectedRowIdx] as LoanItem : undefined;
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
        const overcollateralizationDisplay = `${formatToMaxDefinition(overcollateralizationRate * 100, tokenLabel)}%`;
        const originationFeeRateDisplay = `${formatToMaxDefinition(originationFeeRate * 100, tokenLabel)}%`;

        const isCollateralValueValid = !isNaN(Number(collateralValue)) && Number(collateralValue) > 0;
        const originationCostDisplay = isCollateralValueValid ? `${formatToMaxDefinition(originationCost, tokenLabel)} ${tokenLabel}` : "-";
        const overcollateralizationCostDisplay = isCollateralValueValid ? `${formatToMaxDefinition(overcollateralizationCost, tokenLabel)} ${tokenLabel}` : "-";
        const loanTotalCostDisplay = isCollateralValueValid ? `${formatToMaxDefinition(loanTotalCost, tokenLabel)} ${tokenLabel}` : "-";
        const collateralValueDisplay = isCollateralValueValid ? `${formatToMaxDefinition(Number(collateralValue), collateralLabel)} ${collateralLabel}` : "-";
        const liquidationPriceDisplay = isCollateralValueValid ? `${formatToMaxDefinition(liquidationPrice, tokenLabel)} ${tokenLabel}/${collateralLabel}` : "-";
        const dailyCostDisplay = isCollateralValueValid ? `${formatToMaxDefinition(dailyCost, tokenLabel)} ${tokenLabel}` : "-";

        const parsedMaxPossibleLoan = parseValue(maxPossibleLoan);
        const parsedMinLoanValue = parseValue(minLoanValue);

        if (item) {
            item.aprDisplay = `${formatToMaxDefinition(Number(item.apr) * 100, tokenLabel)}% yearly`;
        }

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
            availableCollat: Number(availableCollateral),
            minLoanValue,
            parsedMinLoanValue,
            maxLoanValue,
            parsedMaxPossibleLoan,
            maxPossibleLoan,
            liqThreshold,
            originationCost,
            overcollateralizationCost,
            liquidationPrice,
            dailyCost,
            modelId: loanData.id,
            uiDisplay: {
                overcollateralizationDisplay,
                originationFeeRateDisplay,
                originationCostDisplay,
                loanTotalCostDisplay,
                collateralValueDisplay,
                overcollateralizationCostDisplay,
                liquidationPriceDisplay,
                dailyCostDisplay,
            }
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