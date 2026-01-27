import { POLL_LOANS_ACTIVITY_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime } from "@/lib/utils";
import { LoanOperationDataSchema } from "@/services/hooks/types/activity-data";
import { TiersType } from "@/services/hooks/types/loans-activity-data";
import { useLoansActivity } from "@/services/hooks/use-loans-activity";
import { useMemo } from "react";

export type UILoanHistoryDataType = {
  opId: string;
  id: string;
  date: string;
  subDate?: string;
  token: string;
  amount: string;
  subAmount?: string;
  status: string;
  closedAt: string;
  ratio: string;
  liqPrice: string;
  apr: string;
  tierNum: number;
  minCollat: string;
  initialAPR: string;
  initialRatio: string;
  initialSize: string;
  initialCollat: string;
  initialDebt: string;
  origFee: string;
  tiers: TiersType[];
};

export function useLoanHistoryData(page: number, status: string) {
  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const { data: loanData, isLoading: isLoadingLoan } = useLoansActivity(
    userId,
    page,
    status,
    POLL_LOANS_ACTIVITY_DATA_INTERVAL
  );

  const formattedLoanData: UILoanHistoryDataType[] = useMemo(() => {
    if (!loanData) {
      return [] as UILoanHistoryDataType[];
    }
    return loanData.map((loan) => {
      const date = formatDate(loan.operation.openedAt);
      const time = formatTime(loan.operation.openedAt);

      if (LoanOperationDataSchema.safeParse(loan).success) {
        return {
          opId: loan.operation.id,
          id: loan.operation.id,
          date: date,
          subDate: time,
          token: loan.sizeCurrencyId,
          amount: loan.size + " " + loan.sizeCurrencyId,
          status: loan.lastUpdate.status === "REPAYED" ?
            loan.lastUpdate.type === "REPAY" ? "Completed" : "Liquidated" :
            loan.operation.status,
          closedAt: loan.operation.closedAt,
          ratio: loan.ratio,
          liqPrice: loan.liqPrice,
          apr: loan.apr,
          tierNum: loan.tierNum,
          minCollat: loan.minCollat,
          initialAPR: loan.initialAPR,
          initialRatio: loan.initialRatio,
          initialSize: loan.initialSize,
          initialCollat: loan.initialCollat,
          initialDebt: loan.initialDebt,
          origFee: loan.origFee,
          tiers: loan.tiers,
        } as UILoanHistoryDataType;
      }
      return {} as UILoanHistoryDataType;
    });
  }, [loanData]);

  return { isLoading: isLoadingLoan, loanData: formattedLoanData, userId: userId, };
}
