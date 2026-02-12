import { POLL_AVAILABLES_INTERVAL, POLL_LOANS_ACTIVITY_DATA_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { formatDate, formatTime, formatToMaxDefinition } from "@/lib/utils";
import { LoanOperationDataSchema } from "@/services/hooks/types/activity-data";
import { TiersType } from "@/services/hooks/types/loans-activity-data";
import { useAvailables } from "@/services/hooks/use-availables";
import { useLoansActivity } from "@/services/hooks/use-loans-activity";
import { useMemo } from "react";

export type UILoanHistoryDataType = {
  opId: string;
  id: string;
  token: string;
  collateralToken: string;
  ratio: string;
  tierNum: number;
  collat: string;
  minCollat: string;
  initialAPR: string;
  initialRatio: string;
  initialSize: string;
  initialDebt: string;
  origFee: string;
  tiers: TiersType[];
  availableToken: number;
  availableCollateral: number;
  withdrawableCollat: number;
  debtSize: number;
  formattedAvailableCollateral: string;
  formattedWithdrawableCollat: string;
  uiDisplay: {
    date: string;
    time?: string;
    closedAt: string;
    amount: string;
    status: string;
    debt: string;
    overcollateralization: string;
    liqPrice: string;
    apr: string;
    interest: string;
    initialCollat: string;
    collateral: string;
    withdrawableCollat: string;
    minCollat: string;
    availableCollateral: string;
    origFee: string;
  }
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

  const { data: availablesData, isLoading: isLoadingAvailables } = useAvailables(
    userId,
    POLL_AVAILABLES_INTERVAL
  );

  const formattedLoanData: UILoanHistoryDataType[] = useMemo(() => {
    if (!loanData) {
      return [] as UILoanHistoryDataType[];
    }
    return loanData.map((loan) => {
      const date = formatDate(loan.operation.openedAt);
      const time = formatTime(loan.operation.openedAt);
      const dateClosed = loan.operation.closedAt ? formatDate(loan.operation.closedAt) : "";
      const withdrawableCollat = Number(loan.collat) - Number(loan.minCollat);
      const availableCollateral = Number(availablesData?.find(available => available.id === loan.collatCurrencyId)?.amount || "0");

      if (LoanOperationDataSchema.safeParse(loan).success) {
        return {
          opId: loan.operation.id,
          id: loan.operation.id,
          token: loan.sizeCurrencyId,
          collateralToken: loan.collatCurrencyId,
          tierNum: loan.tierNum,
          collat: loan.collat,
          minCollat: loan.minCollat,
          initialAPR: loan.initialAPR,
          initialRatio: loan.initialRatio,
          initialSize: loan.initialSize,
          initialDebt: loan.initialDebt,
          origFee: loan.origFee,
          tiers: loan.tiers,
          availableToken: Number(availablesData?.find(available => available.id === loan.sizeCurrencyId)?.amount || "0"),
          availableCollateral: availableCollateral,
          withdrawableCollat: withdrawableCollat,
          formattedAvailableCollateral: formatToMaxDefinition(availableCollateral, loan.collatCurrencyId).toString(),
          formattedWithdrawableCollat: formatToMaxDefinition(withdrawableCollat, loan.collatCurrencyId).toString(),
          debtSize: Number(loan.debt),

          uiDisplay: {
            date: date,
            //subDate: time,
            time: time,
            closedAt: dateClosed,
            amount: formatToMaxDefinition(Number(loan.size), loan.sizeCurrencyId) + " " + loan.sizeCurrencyId,
            status: loan.lastUpdate.status === "REPAYED" ?
              loan.lastUpdate.type === "REPAY" ? "Completed" : "Liquidated" :
              loan.operation.status,
            debt: formatToMaxDefinition(Number(loan.debt), loan.sizeCurrencyId) + " " + loan.sizeCurrencyId,
            overcollateralization: formatToMaxDefinition(Number(loan.ratio) * 100, loan.sizeCurrencyId) + "%",
            liqPrice: formatToMaxDefinition(Number(loan.liqPrice), loan.sizeCurrencyId) + " " + loan.sizeCurrencyId + "/" + loan.collatCurrencyId,
            apr: formatToMaxDefinition(Number(loan.apr) * 100, loan.sizeCurrencyId) + "%",
            interest: formatToMaxDefinition(Number(loan.interest), loan.sizeCurrencyId) + " " + loan.sizeCurrencyId,
            initialCollat: formatToMaxDefinition(Number(loan.initialCollat), loan.collatCurrencyId) + " " + loan.collatCurrencyId,
            collateral: `${formatToMaxDefinition(Number(loan.collat), loan.collatCurrencyId)} ${loan.collatCurrencyId}` || "",
            withdrawableCollat: `${formatToMaxDefinition(withdrawableCollat, loan.collatCurrencyId)} ${loan.collatCurrencyId}` || "",
            minCollat: `${formatToMaxDefinition(Number(loan.minCollat), loan.collatCurrencyId)} ${loan.collatCurrencyId}` || "",
            availableCollateral: `${formatToMaxDefinition(availableCollateral, loan.collatCurrencyId)} ${loan.collatCurrencyId}` || "",
            origFee: formatToMaxDefinition(Number(loan.origFee), loan.sizeCurrencyId, 3) + " " + loan.sizeCurrencyId,
          }
        } as UILoanHistoryDataType;
      }
      return {} as UILoanHistoryDataType;
    });
  }, [loanData, availablesData]);

  return { isLoading: isLoadingLoan || isLoadingAvailables, loanData: formattedLoanData, userId: userId, };
}
