import { Skeleton } from "@/components/index";
import { SelectOption } from "@/components/core/select";
import { ToastType } from "@/components/core/toast";
import { useToast } from "@/context/toast-provider";
import { LoanComponent } from "@/domain/credit";
import { useLoanData } from "@/domain/credit/hooks/use-loan-data";
import {
    TokenType,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useSelector } from "@/hooks/use-selector";
import { useSessionMode } from "@/hooks/use-session-mode";
import { formatToMaxDefinition } from "@/lib/utils";
import { getDisplayMessage } from "@/services/api/errors/service-error";
import { usePostLoan } from "@/services/hooks/mutations/use-post-loan";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLoanSelectedData } from "./hooks/use-loan-selected-data";

const LoanHistoryTable = dynamic(
    () => import("./components/loan-history-table").then((m) => m.default),
    {
        loading: () => (
            <div className="flex flex-col gap-2 mt-2 px-4 py-6">
                <Skeleton lines={4} />
            </div>
        ),
        ssr: false,
    }
);

export default function Credit() {
    const postLoan = usePostLoan();
    const { showToast } = useToast();
    const [selectedOpId, setSelectedOpId] = useState("");
    const [selectedCollateralId, setSelectedCollateralId] = useState("");
    const [selectedLoan, setSelectedLoan] = useState("");
    const [selectedRow, setSelectedRow] = useState("");
    const {
        tokens,
        tokensOptions,
        collaterals,
        collateralOptions,
        loanData,
        LoanTypeValues,
        isLoading: isLoadingLoanData,
    } = useLoanData(selectedOpId, selectedCollateralId);
    const { sessionMode } = useSessionMode();
    const [value, setValue] = useState("");
    const [collateralValue, setCollateralValue] = useState("");

    const handleResetValues = () => {
        setValue("");
        setCollateralValue("");
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
        change: changeCollateralSelection,
        reset: resetCollateralSelector,
    } = useSelector<TokenType>(collaterals || {}, 0, {
        onReset: handleResetValues,
        onChange: handleResetValues,
    });

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
        resetCollateralSelector();
    }, []);

    const { loanSelectedData, isLoadingLoanSelectedData } = useLoanSelectedData(
        loanData!,
        LoanTypeValues,
        selectedLoan,
        selectedRow,
        value,
        collateralValue,
        tokensOptions[selectedAssetIndex],
        collateralOptions[selectedCollateralIndex]
    );

    const handleLoan = (userId: string, ratio: string, size: string, typeId: string) => {
        if (!userId || !ratio || !size || !typeId) {
            console.warn("Loan blocked: missing inputs", {
                userId,
                ratio,
                size,
                typeId,
            });
            return;
        }
        postLoan.mutate(
            { userId, ratio, size, typeId },
            {
                onSuccess: (data) => {
                    showToast(
                        `Loan successful. Liquidation price: ${formatToMaxDefinition(Number(data.liqPrice))} ${data.sizeCurrencyId}/${data.collatCurrencyId}`,
                        ToastType.SUCCESS
                    );
                },
                onError: (err: unknown) => {
                    console.error("POST LOAN ERROR", err);
                    showToast(getDisplayMessage(err, "Loan failed"), ToastType.ERROR);
                },
                onSettled: () => {
                    resetAssetSelector();
                },
            }
        );
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

    useEffect(() => {
        if (selectedLoanType) {
            setSelectedLoan(selectedLoanType);
            setSelectedRow(loanTypeOptions[selectedLoanTypeIndex]?.label || "");
        }
    }, [selectedLoanType]);

    if (!tokens || !loanData) return null;

    return (
        <div className="flex flex-col gap-8">
            <LoanComponent
                isLoading={isLoadingLoanData || isLoadingLoanSelectedData}
                isSessionModeMock={sessionMode === "mock"}
                isLoanPending={postLoan.isPending}
                handleLoan={handleLoan}
                loanData={loanData}
                value={value}
                collateralValue={collateralValue}
                setValue={setValue}
                setCollateralValue={setCollateralValue}
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
                loanSelectedData={loanSelectedData}
            />
            <LoanHistoryTable />
        </div>
    );
}
