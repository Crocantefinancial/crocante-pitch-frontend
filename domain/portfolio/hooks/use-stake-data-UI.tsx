import { SelectorProps } from "@/components/core/select";
import { formatToMaxDefinition, parseValue } from "@/lib/utils";
import { StakingTypeItem } from "@/services/hooks/types/staking-type-data";

export type StakingTypeItemUI = {
    apy: string;
    durationDays: string;
    totalYield: string;
    tokenLabel: string;
    rawMaxValue: string;
    rawMinValue: string;
    parsedMaxValue: number;
    parsedMinValue: number;
    totalAccumulatedDisplay: string;
    totalYieldDisplay: string;
    startDateDisplay: string;
    endDateDisplay: string;
};

export function useStakeDataUI(item: StakingTypeItem, assetSelector: SelectorProps, value: string = "0") {
    if (!item) return { stakeDataUI: null };
    const tokenLabel =
        assetSelector.options[assetSelector.selectedIndex]?.label || "";
    const rawMaxValue =
        assetSelector.options[assetSelector.selectedIndex]?.value || "0";
    const rawMinValue = item?.minAmount || "0";
    const totalYield = Number(value) * Number(item.apy) / 365 * (Number(item.durationDays) || 1);
    const totalYieldDisplay = `${formatToMaxDefinition(totalYield, tokenLabel)} ${tokenLabel}`;
    const totalAccumulated = totalYield + Number(value);
    const totalAccumulatedDisplay = `${formatToMaxDefinition(totalAccumulated, tokenLabel)} ${tokenLabel}`;
    const tomorrow = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    const endDate = new Date(tomorrow.getTime() + (Number(item.durationDays) || 1) * 24 * 60 * 60 * 1000);
    const startDateDisplay = tomorrow.toLocaleDateString();
    const endDateDisplay = endDate.toLocaleDateString();


    const parsedMaxValue = parseValue(rawMaxValue);
    const parsedMinValue = parseValue(rawMinValue);

    return {
        stakeDataUI: {
            apy: `${formatToMaxDefinition(Number(item.apy) * 100, tokenLabel)}% yearly`,
            durationDays: item.durationDays ? item.durationDays + " days" : "Flexible",
            totalYield: `${formatToMaxDefinition(totalYield, tokenLabel)} ${tokenLabel}`,
            tokenLabel: tokenLabel,
            rawMaxValue,
            parsedMaxValue: parsedMaxValue,
            rawMinValue,
            parsedMinValue: parsedMinValue,
            totalAccumulatedDisplay,
            totalYieldDisplay,
            startDateDisplay,
            endDateDisplay
        }
    }
}