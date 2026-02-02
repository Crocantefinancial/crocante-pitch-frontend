import { POLL_LOANS_ACTIVITY_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime, formatToMaxDefinition } from "@/lib/utils";
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
  collateralToken: string;
  amount: string;
  subAmount?: string;
  status: string;
  debt: string;
  overcollateralization: string;
  closedAt: string;
  ratio: string;
  liqPrice: string;
  apr: string;
  interest: string;
  tierNum: number;
  collat: string;
  minCollat: string;
  withdrawableCollat: number;
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
      const dateClosed = loan.operation.closedAt ? formatDate(loan.operation.closedAt) : "";

      if (LoanOperationDataSchema.safeParse(loan).success) {
        return {
          opId: loan.operation.id,
          id: loan.operation.id,
          date: date,
          subDate: time,
          token: loan.sizeCurrencyId,
          collateralToken: loan.collatCurrencyId,
          amount: loan.size + " " + loan.sizeCurrencyId,
          status: loan.lastUpdate.status === "REPAYED" ?
            loan.lastUpdate.type === "REPAY" ? "Completed" : "Liquidated" :
            loan.operation.status,
          debt: loan.debt + " " + loan.sizeCurrencyId,
          closedAt: dateClosed,
          overcollateralization: formatToMaxDefinition(Number(loan.ratio) * 100) + "%",
          liqPrice: formatToMaxDefinition(Number(loan.liqPrice)) + " " + loan.sizeCurrencyId + "/" + loan.collatCurrencyId,
          apr: formatToMaxDefinition(Number(loan.apr) * 100) + "%",
          interest: loan.interest + " " + loan.sizeCurrencyId,
          tierNum: loan.tierNum,
          collat: loan.collat,
          minCollat: loan.minCollat,
          withdrawableCollat: Number(loan.collat) - Number(loan.minCollat),
          initialAPR: loan.initialAPR,
          initialRatio: loan.initialRatio,
          initialSize: loan.initialSize,
          initialCollat: loan.initialCollat + " " + loan.collatCurrencyId,
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
