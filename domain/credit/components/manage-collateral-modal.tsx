import { Button, Label, Modal, Tabs, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";
import { useSelector } from "@/hooks/use-selector";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { useEffect, useState } from "react";
import LoanCollateralPair from "./loan-collateral-pair";
//import { usePostLoan } from "@/services/hooks/mutations/use-post-loan";

interface ManageCollateralModalProps {
  loanData: UILoanHistoryDataType;
  collateralModalOpen: boolean;
  closeCollateralModal: () => void;
}

enum TabValues {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}


export default function ManageCollateralModal({
  loanData,
  collateralModalOpen,
  closeCollateralModal
}: ManageCollateralModalProps) {
  type TabType = (typeof TabValues)[keyof typeof TabValues];
  const { selectedRow, reset: resetTabSelection, change: changeTabSelection } = useSelector<TabType>(
    TabValues,
    0,
    {
      onChange: () => {
        setValueCollateral("");
        setValueLoan("");
      }
    }
  );
  const [valueCollateral, setValueCollateral] = useState("");
  const [valueLoan, setValueLoan] = useState("");

  useEffect(() => {
    if (collateralModalOpen) {
      resetTabSelection();
    }
  }, [collateralModalOpen]);

  const { showToast } = useToast();
  //const postLoan = usePostLoan();

  const withdrawCollateral = () => {
    showToast("Withdraw not implemented", ToastType.ERROR);
    /* postLoanComplete.mutate({ userId: userId, opId: loanId }, {
      onSuccess: (data) => {
        showToast("Loan complete successful", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN COMPLETE ERROR", err);
        showToast("Loan complete failed", ToastType.ERROR);
      },
      onSettled: () => {
        setLoanId("");
        setSelectedLoanData(null);
        setIsCompleteable(false);
      },
    }); */
    closeCollateralModal();
  }

  const depositCollateral = () => {
    showToast("Deposit not implemented", ToastType.ERROR);
    closeCollateralModal();
  }

  const { isValid: isValidValue } = useValueVerifier({
    value: valueCollateral,
    min: 0,
    max: selectedRow === TabValues.Withdraw ? Number(loanData.withdrawableCollat) : loanData.availableCollateral,
    requireNonZero: true,
  });

  const conditionsSuccess = isValidValue;

  return (
    <Modal
      open={collateralModalOpen}
      onClose={closeCollateralModal}
      title="Manage Collateral"
      actions={() => (
        <>
          {selectedRow === TabValues.Withdraw ? (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={withdrawCollateral}
              disabled={!conditionsSuccess}
            >
              Withdraw
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={depositCollateral}
              disabled={!conditionsSuccess}
            >
              Deposit
            </Button>
          )}
        </>
      )}
    >
      <div className="flex flex-col gap-2 px-6">
        <Label
          label="Loan Collateral"
          secondaryLabel={`${loanData.collat} ${loanData.collateralToken}` || ""}
        />
        <Label
          label="Withdrawable Collateral"
          secondaryLabel={`${loanData.withdrawableCollat} ${loanData.collateralToken}` || ""}
        />
        <Label
          label="Minimum Collateral"
          secondaryLabel={`${loanData.minCollat} ${loanData.collateralToken}` || ""}
        />
        <Label
          label="Available Collateral"
          secondaryLabel={`${loanData.availableCollateral} ${loanData.collateralToken}` || ""}
        />

        <div className="bg-card rounded-lg max-w-full mt-4">
          <Tabs
            TabValues={TabValues}
            selectedRow={selectedRow}
            onChange={changeTabSelection}
          />
        </div>

        <LoanCollateralPair
          loanData={loanData}
          valueCollateral={valueCollateral}
          setValueCollateral={setValueCollateral}
          valueLoan={valueLoan}
          setValueLoan={setValueLoan}
          maxValueCollateral={
            selectedRow === TabValues.Withdraw
              ? loanData.withdrawableCollat.toString()
              : loanData.availableCollateral.toString()
          }
        />
      </div>
    </Modal>
  );
}
