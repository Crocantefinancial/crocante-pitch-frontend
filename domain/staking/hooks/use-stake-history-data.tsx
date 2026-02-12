import { POLL_STAKING_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime, formatToMaxDefinition } from "@/lib/utils";
import { StakingDataSchema } from "@/services/hooks/types/activity-data";
import { useStaking } from "@/services/hooks/use-staking";
import { useMemo } from "react";

export type UIStakeHistoryDataType = {
  opId: string;
  id: string;
  date: string;
  subDate?: string;
  token: string;
  duration: string;
  status: string;
  redeemableAmount: string;
  redeemableAt: string;
  closedAt: string;
  yield: string;
  estRedeemYield: string;
  apy: string;
  uiDisplay: {
    amount: string;
    subAmount?: string;
    yield: string;
    estRedeemYield: string;
    redeemableAmount: string;

  }
};

export function useStakeHistoryData(page: number, status: string) {
  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const { data: stakingData, isLoading: isLoadingStaking } = useStaking(
    userId,
    page,
    status,
    POLL_STAKING_DATA_INTERVAL
  );

  const formattedStakingData: UIStakeHistoryDataType[] = useMemo(() => {
    if (!stakingData) {
      return [] as UIStakeHistoryDataType[];
    }
    return stakingData.map((staking) => {
      const type = staking.operation.type;

      const date = formatDate(staking.operation.openedAt);
      const time = formatTime(staking.operation.openedAt);

      if (StakingDataSchema.safeParse(staking).success) {
        const instantiatedActivity = StakingDataSchema.safeParse(staking).data!;
        return {
          opId: instantiatedActivity.operation.id,
          id: instantiatedActivity.operation.id,
          date: date,
          subDate: time,
          token: instantiatedActivity.type.currencyId,
          redeemableAmount: instantiatedActivity.amount,
          status: instantiatedActivity.operation.status === "COMPLETED" ? "Redeemed" : instantiatedActivity.operation.status,
          duration: instantiatedActivity.type.durationDays ? `${instantiatedActivity.type.durationDays} Days` : instantiatedActivity.type.mode,
          redeemableAt: instantiatedActivity.redeemableAt,
          closedAt: instantiatedActivity.operation.closedAt,
          yield: instantiatedActivity.yield,
          estRedeemYield: instantiatedActivity.estRedeemYield,
          apy: instantiatedActivity.apy,
          uiDisplay: {
            amount: formatToMaxDefinition(Number(instantiatedActivity.initialAmount), instantiatedActivity.type.currencyId).toString() + " " + instantiatedActivity.type.currencyId,
            subAmount: formatToMaxDefinition(Number(instantiatedActivity.initialAmount), instantiatedActivity.type.currencyId).toString() + " " + instantiatedActivity.type.currencyId,
            yield: formatToMaxDefinition(Number(instantiatedActivity.yield), instantiatedActivity.type.currencyId).toString() + " " + instantiatedActivity.type.currencyId,
            estRedeemYield: formatToMaxDefinition(Number(instantiatedActivity.estRedeemYield), instantiatedActivity.type.currencyId).toString() + " " + instantiatedActivity.type.currencyId,
            redeemableAmount: formatToMaxDefinition(Number(instantiatedActivity.amount), instantiatedActivity.type.currencyId).toString() + " " + instantiatedActivity.type.currencyId,
          }
        } as UIStakeHistoryDataType;
      }
      return {} as UIStakeHistoryDataType;
    });
  }, [stakingData]);

  return { isLoading: isLoadingStaking, stakingData: formattedStakingData, userId: userId, };
}
