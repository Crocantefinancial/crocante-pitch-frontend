import Label from "@/components/core/label";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";

interface LoanInfoProps {
    loanData: UILoanHistoryDataType | null;
    isCompleteable?: boolean;
}
export default function LoanInfo({ loanData, isCompleteable = true }: LoanInfoProps) {
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
            {!isCompleteable ?
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
            {!isCompleteable && <Label
                label="Closed At"
                secondaryLabel={loanData?.closedAt || ""}
            />
            }
            <Label
                label="Origination Fee"
                secondaryLabel={loanData?.origFee || ""}
            />
            {!isCompleteable &&
                <Label
                    label="Initial Collateral"
                    secondaryLabel={loanData?.initialCollat || ""}
                />
            }
        </div>
    );
}