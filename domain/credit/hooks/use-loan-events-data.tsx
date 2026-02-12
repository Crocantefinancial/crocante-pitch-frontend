import { POLL_LOAN_HISTORY_EVENTS_INTERVAL } from "@/config/constants";
import { formatDate, formatTime, formatToMaxDefinition } from "@/lib/utils";
import { LoanHistoryEvent } from "@/services/hooks/types/loan-history-events-data";
import { useLoanHistoryEvents } from "@/services/hooks/use-loan-history-events";

type LoanEventsDataUI = LoanHistoryEvent & {
    uiDisplay: {
        date: string;
        time: string;
        amount: string;
        negativeAmount: string;
        liqCollat: string;
        liqCollatValue: string;
        fee: string;
    }
}

export function useLoanEventsData(userId: string, opId: string, loanTokenId: string, collateralTokenId: string) {
    const { data: loanEventsData, isLoading: isLoadingLoanEvents } = useLoanHistoryEvents(
        userId, opId, false, POLL_LOAN_HISTORY_EVENTS_INTERVAL
    );

    const loanEventsDataUI: LoanEventsDataUI[] = loanEventsData?.map(loan => ({
        ...loan,
        uiDisplay: {
            date: formatDate(loan.createdAt),
            time: formatTime(loan.createdAt),
            amount: loan.data.amount ? formatToMaxDefinition(Number(loan.data.amount), loan.data.currencyId) + " " + loan.data.currencyId : "",
            negativeAmount: loan.data.amount ? "-" + formatToMaxDefinition(Number(loan.data.amount), loan.data.currencyId) + " " + loan.data.currencyId : "",
            liqCollat: loan.data.liqCollat ? "-" + formatToMaxDefinition(Number(loan.data.liqCollat), collateralTokenId) + " " + collateralTokenId : "",
            liqCollatValue: loan.data.liqCollatValue ? "-" + formatToMaxDefinition(Number(loan.data.liqCollatValue), loanTokenId) + " " + loanTokenId : "",
            fee: loan.data.fee ? "-" + formatToMaxDefinition(Number(loan.data.fee), loanTokenId) + " " + loanTokenId : "",
        }
    })) ?? [];

    return {
        loanEventsData: loanEventsDataUI,
        isLoadingLoanEvents,
    };
}