import { POLL_ACTIVITY_DATA_INTERVAL } from "@/config/constants";
import { DEPOSIT_ICON, STAKE_ICON, SWAP_ICON, WITHDRAWAL_ICON } from "@/config/operation-icons";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime } from "@/lib/utils";
import { AdminOperationDataSchema, ConvertDataSchema, StakingDataSchema } from "@/services/hooks/types/activity-data";
import { useActivity } from "@/services/hooks/use-activity";
import { useMemo } from "react";



export type UIActivityDataType = {
  id: string;
  type: string;
  opIcon: React.ReactNode;
  date: string;
  subDate?: string;
  amount: string;
  subAmount?: string;
  status: string;
};

export function useActivityData() {
  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const { data: activityData, isLoading: isLoadingActivity } = useActivity(
    userId,
    POLL_ACTIVITY_DATA_INTERVAL
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
    }
  };

  const formattedActivityData: UIActivityDataType[] = useMemo(() => {
    if (!activityData) {
      return [] as UIActivityDataType[];
    }
    return activityData.map((activity) => {
      const type = activity.operation.type;
      const opIcon = getActivityIcon(type);
      const date = formatDate(activity.operation.openedAt);
      const time = formatTime(activity.operation.openedAt);
      if (AdminOperationDataSchema.safeParse(activity).success) {
        const instantiatedActivity = AdminOperationDataSchema.safeParse(activity).data!;
        const amount = instantiatedActivity.operation.type === "DEPOSIT" ? instantiatedActivity.amount : instantiatedActivity.netAmount;
        console.log("AdminOperationDataSchema", instantiatedActivity);
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: amount + " " + instantiatedActivity.currencyId,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIActivityDataType;
      }
      if (ConvertDataSchema.safeParse(activity).success) {
        const instantiatedActivity = ConvertDataSchema.safeParse(activity).data!;
        console.log("ConvertDataSchema", instantiatedActivity);
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.grossCreditAmount + " " + instantiatedActivity.creditCurrencyID,
          subAmount: instantiatedActivity.debitAmount + " " + instantiatedActivity.debitCurrencyID,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIActivityDataType;
      }
      if (StakingDataSchema.safeParse(activity).success) {
        const instantiatedActivity = StakingDataSchema.safeParse(activity).data!;
        console.log("StakingDataSchema", instantiatedActivity);
        return {
          id: instantiatedActivity.operation.id,
          type,
          opIcon,
          amount: instantiatedActivity.initialAmount + " " + instantiatedActivity.type.currencyId,
          status: instantiatedActivity.operation.status,
          date: date,
          subDate: time
        } as UIActivityDataType;
      }

      return {} as UIActivityDataType;
    });
  }, [activityData]);

  return {
    isLoading: isLoadingActivity,
    activityData: formattedActivityData
  };
}
