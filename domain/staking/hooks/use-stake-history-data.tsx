import { POLL_STAKING_DATA_INTERVAL } from "@/config/constants";
import { DEPOSIT_ICON, LOAN_ICON, STAKE_ICON, SWAP_ICON, WITHDRAWAL_ICON } from "@/config/operation-icons";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime } from "@/lib/utils";
import { AdminOperationDataSchema, ConvertDataSchema, CryptoOperationDataSchema, LoanOperationDataSchema, StakingDataSchema, TransferOperationDataSchema } from "@/services/hooks/types/activity-data";
import { useStaking } from "@/services/hooks/use-staking";
import { useMemo } from "react";

export type UIStakeHistoryDataType = {
  id: string;
  type: string;
  opIcon: React.ReactNode;
  date: string;
  subDate?: string;
  amount: string;
  subAmount?: string;
  status: string;
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

  const getActivityIcon = (type: string) => {
    const iconClassName = "w-4 h-4";
    const wrapperClassName =
      "inline-flex items-center justify-center rounded-full border border-muted-foreground p-1";
    switch (type) {
      case "DEPOSIT":
        return (
          <span className={wrapperClassName}>
            <DEPOSIT_ICON className={iconClassName} />
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className={wrapperClassName}>
            <WITHDRAWAL_ICON className={iconClassName} />
          </span>
        );
      case "TRADE":
        return (
          <span className={wrapperClassName}>
            <SWAP_ICON className={iconClassName} />
          </span>
        );
      case "STAKING":
        return (
          <span className={wrapperClassName}>
            <STAKE_ICON className={iconClassName} />
          </span>
        );
      case "LOAN":
        return (
          <span className={wrapperClassName}>
            <LOAN_ICON className={iconClassName} />
          </span>
        );
    }
  };

  const formattedStakingData: UIStakeHistoryDataType[] = useMemo(() => {
    if (!stakingData) {
      return [] as UIStakeHistoryDataType[];
    }
    return stakingData.map((staking) => {
      const type = staking.operation.type;
      const opIcon = getActivityIcon(type);
      const date = formatDate(staking.operation.openedAt);
      const time = formatTime(staking.operation.openedAt);
      if (AdminOperationDataSchema.safeParse(staking).success) {
        const instantiatedActivity = AdminOperationDataSchema.safeParse(staking).data!;
        const amount = instantiatedActivity.operation.type === "DEPOSIT" ? instantiatedActivity.amount : instantiatedActivity.netAmount;
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: amount + " " + instantiatedActivity.currencyId,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIStakeHistoryDataType;
      }
      if (ConvertDataSchema.safeParse(staking).success) {
        const instantiatedActivity = ConvertDataSchema.safeParse(staking).data!;
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.grossCreditAmount + " " + instantiatedActivity.creditCurrencyID,
          subAmount: instantiatedActivity.debitAmount + " " + instantiatedActivity.debitCurrencyID,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIStakeHistoryDataType;
      }
      if (StakingDataSchema.safeParse(staking).success) {
        const instantiatedActivity = StakingDataSchema.safeParse(staking).data!;
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.initialAmount + " " + instantiatedActivity.type.currencyId,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIStakeHistoryDataType;
      }
      if (CryptoOperationDataSchema.safeParse(staking).success) {
        const instantiatedActivity = CryptoOperationDataSchema.safeParse(staking).data!;
        const amount = (instantiatedActivity.grossAmount ? instantiatedActivity.grossAmount : instantiatedActivity.amount ? instantiatedActivity.amount : instantiatedActivity.netAmount);
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: amount + " " + instantiatedActivity.currencyId,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time,
        } as UIStakeHistoryDataType;
      }
      if (LoanOperationDataSchema.safeParse(staking).success) {
        const instantiatedActivity = LoanOperationDataSchema.safeParse(staking).data!;
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.repayed + " " + instantiatedActivity.sizeCurrencyId,
          status: instantiatedActivity.operation.status,
          date: formatDate(instantiatedActivity.lastUpdate.createdAt),
          subDate: formatTime(instantiatedActivity.lastUpdate.createdAt),
        } as UIStakeHistoryDataType;
      }
      if (TransferOperationDataSchema.safeParse(staking).success) {
        const instantiatedActivity = TransferOperationDataSchema.safeParse(staking).data!;
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.netAmount + " " + instantiatedActivity.currencyId,
          status: instantiatedActivity.operation.status,
          date: formatDate(instantiatedActivity.operation.updatedAt),
          subDate: formatTime(instantiatedActivity.operation.updatedAt),
        } as UIStakeHistoryDataType;
      }
      return {} as UIStakeHistoryDataType;
    });
  }, [stakingData, getActivityIcon]);

  return { isLoading: isLoadingStaking, stakingData: formattedStakingData };
}
