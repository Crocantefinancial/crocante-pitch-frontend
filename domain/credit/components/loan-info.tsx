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
                secondaryLabel={loanData?.amount || ""}
            />
            <Label
                label="Debt"
                secondaryLabel={loanData?.debt || ""}
            />
            <Label
                label="APY"
                secondaryLabel={loanData?.apr || ""}
            />
            {!isActive ?
                <Label
                    label="Yield"
                    secondaryLabel={loanData?.interest || ""}
                />
                :
                <Label
                    label="Overcollateralization"
                    secondaryLabel={loanData?.overcollateralization || ""}
                />
            }
            <Label
                label="Opened At"
                secondaryLabel={loanData?.date || ""}
            />
            {!isActive && <Label
                label="Closed At"
                secondaryLabel={loanData?.closedAt || ""}
            />
            }
            <Label
                label="Origination Fee"
                secondaryLabel={loanData?.origFee || ""}
            />
            {!isActive &&
                <Label
                    label="Initial Collateral"
                    secondaryLabel={loanData?.initialCollat || ""}
                />
            }
        </div>
    );
}