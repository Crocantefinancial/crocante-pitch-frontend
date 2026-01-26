import { POLL_STAKING_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime } from "@/lib/utils";
import { StakingDataSchema } from "@/services/hooks/types/activity-data";
import { useStaking } from "@/services/hooks/use-staking";
import { useMemo } from "react";

export type UIStakeHistoryDataType = {
  opId: string;
  id: string;
  date: string;
  subDate?: string;
  token: string;
  amount: string;
  subAmount?: string;
  duration: string;
  status: string;
  redeemableAmount: string;
  redeemableAt: string;
  closedAt: string;
  yield: string;
  estRedeemYield: string;
  apy: string;
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
          amount: instantiatedActivity.initialAmount + " " + instantiatedActivity.type.currencyId,
          redeemableAmount: instantiatedActivity.amount,
          status: instantiatedActivity.operation.status === "COMPLETED" ? "Redeemed" : instantiatedActivity.operation.status,
          duration: instantiatedActivity.type.durationDays ? `${instantiatedActivity.type.durationDays} Days` : instantiatedActivity.type.mode,
          redeemableAt: instantiatedActivity.redeemableAt,
          closedAt: instantiatedActivity.operation.closedAt,
          yield: instantiatedActivity.yield,
          estRedeemYield: instantiatedActivity.estRedeemYield,
          apy: instantiatedActivity.apy,
        } as UIStakeHistoryDataType;
      }
      return {} as UIStakeHistoryDataType;
    });
  }, [stakingData]);

  return { isLoading: isLoadingStaking, stakingData: formattedStakingData, userId: userId, };
}
