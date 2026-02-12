import { POLL_STAKING_TYPE_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatToMaxDefinition } from "@/lib/utils";
import { useStakingType } from "@/services/hooks/use-staking-type";
import { useMemo } from "react";
import { TokenType, usePortfolioData } from "./use-portfolio-data";

export function useStakeData(selectedToken: string) {
    const { user } = useSession();
    const userId = user?.id.toString() || "";
    const {
        tokens: allTokens,
        tokensOptions: allTokensOptions,
    } = usePortfolioData();
    const { data: stakingTypeData, isLoading: isLoadingStakingType } = useStakingType(userId, POLL_STAKING_TYPE_DATA_INTERVAL);

    const { tokens, tokensOptions } = useMemo(() => {
        if (!allTokens) {
            return { tokens: undefined, tokensOptions: [] };
        }
        if (!stakingTypeData) {
            return { tokens: allTokens, tokensOptions: allTokensOptions };
        }

        const keysFilteredByStakingType = Object.keys(allTokens).filter(item => stakingTypeData.some(stakingType => stakingType.currencyId === item));
        const tokensFilteredByStakingType = keysFilteredByStakingType.reduce((acc, item) => {
            acc[item] = allTokens[item];
            return acc;
        }, {} as Record<string, TokenType>);
        const tokensOptionsFilteredByStakingType = allTokensOptions.filter(item => keysFilteredByStakingType.includes(item.id));

        return {
            tokens: tokensFilteredByStakingType,
            tokensOptions: tokensOptionsFilteredByStakingType
        };
    }, [allTokens, allTokensOptions, stakingTypeData]);

    const { stakeData, StakingTypeValues, isLoading: isLoadingStakeData } = useMemo(() => {
        if (!stakingTypeData) {
            return { stakeData: null, StakingTypeValues: { "": "" }, isLoading: false };
        }
        const stakeData = stakingTypeData.filter(item => item.currencyId === selectedToken);
        const StakingTypeValues: Record<string, string> = stakeData.reduce((acc, item) => {
            acc[item.id] = item.mode === "VARIABLE" ? "Flexible" : item.durationDays ? `${item.durationDays} Days` : item.id;
            return acc;
        }, {} as Record<string, string>);
        return { stakeData, StakingTypeValues, isLoading: isLoadingStakingType };
    }, [stakingTypeData, selectedToken]);

    return {
        tokens,
        tokensOptions,
        stakeData,
        StakingTypeValues,
        isLoading: isLoadingStakeData,
    };
}