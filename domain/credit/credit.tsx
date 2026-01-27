import { ToastType } from "@/components/core/toast";
import { useToast } from "@/context/toast-provider";
import { LoanComponent } from "@/domain/credit";
import { useLoanData } from "@/domain/credit/hooks/use-loan-data";
import {
    TokenType,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useSelector } from "@/hooks/use-selector";
//import { usePostLoan } from "@/services/hooks/mutations/use-post-loan";
import { SelectOption } from "@/components/core/select";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { useEffect, useState } from "react";
import LoanHistoryTable from "./components/loan-history-table";

export default function Credit() {
    //const postLoan = usePostLoan();
    const { showToast } = useToast();
    const [selectedOpId, setSelectedOpId] = useState("");
    const [selectedCollateralId, setSelectedCollateralId] = useState("");

    const {
        tokens,
        tokensOptions,
        collaterals,
        collateralOptions,
        loanData,
        LoanTypeValues,
        isLoading: isLoadingLoanData,
    } = useLoanData(selectedOpId, selectedCollateralId);

    console.log(loanData);
    console.log(LoanTypeValues);

    const [value, setValue] = useState("");
    const [valueUSD, setValueUSD] = useState("");

    const handleResetValues = () => {
        setValue("");
        setValueUSD("");
    };

    type LoanTypeType = (typeof LoanTypeValues)[keyof typeof LoanTypeValues];

    const {
        selectedRow: selectedLoanType,
        selectedIndex: selectedLoanTypeIndex,
        change: changeLoanTypeSelection
    } = useSelector<LoanTypeType>(
        LoanTypeValues,
        0
    );

    const loanTypeOptions = Object.entries(LoanTypeValues).map(
        ([key, label]) => ({
            id: key,
            label,
            value: label,
        })
    );

    const {
        selectedRow: selectedCollateral,
        selectedIndex: selectedCollateralIndex,
        change: changeCollateralSelection
    } = useSelector<TokenType>(collaterals || {}, 0);

    const {
        selectedRow: selectedAsset,
        selectedIndex: selectedAssetIndex,
        reset: resetAssetSelector,
        change: changeAssetSelection,
    } = useSelector<TokenType>(tokens || {}, 0, {
        onReset: handleResetValues,
        onChange: handleResetValues,
    });


    useEffect(() => {
        resetAssetSelector();
    }, []);

    const handleLoan = (userId: string, typeId: string) => {
        const amount = value?.trim();

        if (!userId || !typeId || !amount) {
            console.warn("Loan blocked: missing inputs", {
                userId,
                typeId,
                amount,
            });
            return;
        }

        showToast("Loan not implemented", ToastType.ERROR);

        /* postLoan.mutate(
            { userId, typeId, amount },
            {
                onSuccess: (data) => {
                    showToast("Loan successful", ToastType.SUCCESS);
                },
                onError: (err) => {
                    console.error("POST LOAN ERROR", err);
                    showToast("Loan failed", ToastType.ERROR);
                },
                onSettled: () => {
                    resetAssetSelector();
                },
            }
        ); */
    };

    useEffect(() => {
        if (selectedAsset) {
            setSelectedOpId(selectedAsset.symbol);
        }
    }, [selectedAsset]);

    useEffect(() => {
        if (selectedCollateral) {
            setSelectedCollateralId(selectedCollateral.symbol);
        }
    }, [selectedCollateral]);

    if (!tokens) return null;

    return (
        <div className="flex flex-col gap-8">
            <LoanComponent
                isLoading={isLoadingLoanData}
                //isLoan={postLoan.isPending}
                isLoan={false}
                handleLoan={handleLoan}
                loanData={loanData as LoanTypeData}
                value={value}
                valueUSD={valueUSD}
                setValue={setValue}
                setValueUSD={setValueUSD}
                assetSelector={{
                    selectedIndex: selectedAssetIndex,
                    onChange: changeAssetSelection,
                    options: tokensOptions || [],
                }}
                collateralSelector={{
                    selectedIndex: selectedCollateralIndex,
                    onChange: changeCollateralSelection,
                    options: collateralOptions || [],
                }}
                loanTypeSelector={{
                    selectedIndex: selectedLoanTypeIndex,
                    onChange: changeLoanTypeSelection,
                    options: loanTypeOptions as SelectOption[],
                }}
            />
            <LoanHistoryTable />
        </div>
    );
}
