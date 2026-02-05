import { Badge, Label, Table } from "@/components/index";
import { POLL_LOAN_HISTORY_EVENTS_INTERVAL } from "@/config/constants";
import { formatDate, formatTime, formatToMaxDefinition } from "@/lib/utils";
import { useLoanHistoryEvents } from "@/services/hooks/use-loan-history-events";

interface LoanEventsTableProps {
    opId: string;
    userId: string;
    isActive: boolean;
    loanTokenId: string;
    collateralTokenId: string;
}

export default function LoanEventsTable({ opId, userId, isActive, loanTokenId, collateralTokenId }: LoanEventsTableProps) {
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

    const renderCompleteTable = () => {
        return (
            <Table
                isLoading={isLoadingLoanEvents}
                className="overflow-y-auto max-h-[300px]"
                tableHeaders={[
                    {
                        id: "createdAtHeader",
                        label: "Date",
                        className: "text-left",
                    },
                    {
                        id: "liqCollatHeader",
                        label: "Amount",
                        className: "text-left",
                    },
                    {
                        id: "liqCollatValueHeader",
                        label: "Liq. Value",
                        className: "text-left",
                    },
                    {
                        id: "feeHeader",
                        label: "Fee",
                        className: "text-left",
                    },
                    {
                        id: "typeHeader",
                        label: "Type",
                        className: "text-center",
                    },
                ]}
                rows={loanEventsData.map((loan, index) => (
                    {
                        id: index.toString(),
                        onClick: () => { },
                        cells: [
                            {
                                id: "date",
                                value: formatDate(loan.createdAt),
                                subtitle: formatTime(loan.createdAt),
                                className: "text-center",
                            },
                            loan.data.amount ?
                                {
                                    id: "amount",
                                    value: "-" + formatToMaxDefinition(Number(loan.data.amount)) + " " + loan.data.currencyId,
                                    className: "text-center",
                                }
                                : {
                                    id: "liqCollat",
                                    value: "-" + formatToMaxDefinition(Number(loan.data.liqCollat)) + " " + collateralTokenId,
                                    className: "text-center",
                                },
                            {
                                id: "liqCollatValue",
                                value: loan.data.liqCollatValue ? "-" + formatToMaxDefinition(Number(loan.data.liqCollatValue)) + " " + loanTokenId : "",
                                className: "text-center",
                            },
                            {
                                id: "fee",
                                value: loan.data.fee ? "-" + formatToMaxDefinition(Number(loan.data.fee)) + " " + loanTokenId : "",
                                className: "text-center",
                            },
                            {
                                id: "type",
                                className: "text-right",
                                leftIcon: () => (
                                    <Badge
                                        label={
                                            loan.type.toLocaleUpperCase() === "REM_COLLAT"
                                                ? "Remove Collateral"
                                                : loan.type.toLocaleUpperCase() === "REPAY_COLLAT" ?
                                                    "Payback Collateral"
                                                    : "Add Collateral"
                                        }
                                        variant={loan.type.toLocaleUpperCase() === "REPAY_COLLAT" ? "accent" : "primary"}
                                    />
                                ),
                            },
                        ],
                    }
                ))}
            />
        )
    }

    const renderActiveTable = () => {
        return (
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
                rows={loanEventsData.map((loan, index) => (
                    {
                        id: index.toString(),
                        onClick: () => { },
                        cells: [
                            {
                                id: "date",
                                value: formatDate(loan.createdAt),
                                subtitle: formatTime(loan.createdAt),
                                className: "text-center",
                            },
                            {
                                id: "amount",
                                value: formatToMaxDefinition(Number(loan.data.amount)) + " " + loan.data.currencyId,
                                className: "text-center",
                            },
                            {
                                id: "type",
                                className: "text-right",
                                leftIcon: () => (
                                    <Badge
                                        label={loan.type.toLocaleUpperCase() === "ADD_COLLAT" ? "Add Collateral" : "Remove Collateral"}
                                        variant={loan.type.toLocaleUpperCase() === "ADD_COLLAT" ? "primary" : "accent"}
                                    />
                                ),
                            },
                        ],
                    }
                ))}
            />
        )
    }

    return (
        <div className="flex flex-col gap-2 mt-2">
            {isActive ? renderActiveTable() : renderCompleteTable()}
        </div>
    )

}