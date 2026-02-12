import Label from "@/components/core/label";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";

interface LoanInfoProps {
    loanData: UILoanHistoryDataType | null;
    isActive?: boolean;
}
export default function LoanInfo({ loanData, isActive = true }: LoanInfoProps) {
    if (!loanData) {
        return null;
    }
    return (
        <div className="flex flex-col gap-2">
            <Label
                label="Invested Amount"
                secondaryLabel={loanData?.uiDisplay.amount || ""}
            />
            <Label
                label="Debt"
                secondaryLabel={loanData?.uiDisplay.debt || ""}
            />
            <Label
                label="APY"
                secondaryLabel={loanData?.uiDisplay.apr || ""}
            />
            {!isActive ?
                <Label
                    label="Yield"
                    secondaryLabel={loanData?.uiDisplay.interest || ""}
                />
                :
                <Label
                    label="Overcollateralization"
                    secondaryLabel={loanData?.uiDisplay.overcollateralization || ""}
                />
            }
            <Label
                label="Opened At"
                secondaryLabel={loanData?.uiDisplay.date || ""}
            />
            {!isActive && <Label
                label="Closed At"
                secondaryLabel={loanData?.uiDisplay.closedAt || ""}
            />
            }
            <Label
                label="Origination Fee"
                secondaryLabel={loanData?.uiDisplay.origFee || ""}
            />
            {!isActive &&
                <Label
                    label="Initial Collateral"
                    secondaryLabel={loanData?.uiDisplay.initialCollat || ""}
                />
            }
        </div>
    );
}