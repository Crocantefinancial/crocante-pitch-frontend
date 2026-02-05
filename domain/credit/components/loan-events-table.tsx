import { Badge, Label, Table } from "@/components/index";
import { POLL_LOAN_HISTORY_EVENTS_INTERVAL } from "@/config/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { useLoanHistoryEvents } from "@/services/hooks/use-loan-history-events";

interface LoanEventsTableProps {
    opId: string;
    userId: string;
}

export default function LoanEventsTable({ opId, userId }: LoanEventsTableProps) {
    const { data: loanEventsData, isLoading: isLoadingLoanEvents } = useLoanHistoryEvents(
        userId, opId, false, POLL_LOAN_HISTORY_EVENTS_INTERVAL
    );

    if (!loanEventsData) {
        return (
            <div className="flex flex-col gap-2 mt-2 px-4 text-center justify-center items-center bg-card rounded-lg bg-primary/10 p-2">
                <Label label="No history events found for this loan" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 mt-2">
            <Table
                isLoading={isLoadingLoanEvents}
                tableHeaders={[
                    {
                        id: "createdAtHeader",
                        label: "Date",
                        className: "text-left",
                    },
                    {
                        id: "amountHeader",
                        label: "Amount",
                        className: "text-left",
                    },
                    {
                        id: "typeHeader",
                        label: "Type",
                        className: "text-center",
                    },
                ]}
                rows={loanEventsData.map((tx) => (
                    {
                        id: tx.createdAt,
                        onClick: () => { },
                        cells: [
                            {
                                id: "date",
                                value: formatDate(tx.createdAt),
                                subtitle: formatTime(tx.createdAt),
                                className: "text-center",
                            },
                            {
                                id: "amount",
                                value: tx.data.amount + " " + tx.data.currencyId,
                                className: "text-center",
                            },
                            {
                                id: "type",
                                className: "text-right",
                                leftIcon: () => (
                                    <Badge
                                        label={tx.type.toLocaleUpperCase() === "ADD_COLLAT" ? "Add Collateral" : "Remove Collateral"}
                                        variant={tx.type.toLocaleUpperCase() === "ADD_COLLAT" ? "accent" : "primary"}
                                    />
                                ),
                            },
                        ],
                    }
                ))}
            />
        </div>
    )

}