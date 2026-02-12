import { Button, Label, Modal, Tabs, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";
import { useSelector } from "@/hooks/use-selector";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { usePostLoanManager } from "@/services/hooks/mutations/use-post-loan-manager";
import { useEffect, useState } from "react";
import LoanCollateralPair from "./loan-collateral-pair";
import LoanInfo from "./loan-info";

interface ManageCollateralModalProps {
  loanData: UILoanHistoryDataType;
  collateralModalOpen: boolean;
  closeCollateralModal: () => void;
  userId: string;
}

enum TabValues {
  Withdraw = "Withdraw",
  Deposit = "Deposit",
}


export default function ManageCollateralModal({
  loanData,
  collateralModalOpen,
  closeCollateralModal,
  userId
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
  const postLoanAddCollat = usePostLoanManager("add");
  const postLoanRemoveCollat = usePostLoanManager("remove");

  const withdrawCollateral = () => {
    postLoanRemoveCollat.mutate({ userId, opId: loanData.opId, amount: valueCollateral }, {
      onSuccess: (data) => {
        showToast("Collateral withdrawn successfully", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN REMOVE COLLATERAL ERROR", err);
        showToast("Collateral withdrawal failed", ToastType.ERROR);
      },
      onSettled: () => {
        closeCollateralModal();
        setValueCollateral("");
        setValueLoan("");
      },
    });
  }

  const depositCollateral = () => {
    postLoanAddCollat.mutate({ userId, opId: loanData.opId, amount: valueCollateral }, {
      onSuccess: (data) => {
        showToast("Collateral deposited successfully", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN ADD COLLATERAL ERROR", err);
        showToast("Collateral deposit failed", ToastType.ERROR);
      },
      onSettled: () => {
        closeCollateralModal();
        setValueCollateral("");
        setValueLoan("");
      },
    });
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
              isLoading={postLoanRemoveCollat.isPending}
            >
              Withdraw
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={depositCollateral}
              disabled={!conditionsSuccess}
              isLoading={postLoanAddCollat.isPending}
            >
              Deposit
            </Button>
          )}
        </>
      )}
    >
      <div className="flex flex-col gap-2 px-4">
        <div className="flex flex-col gap-2 mb-2 bg-card rounded-lg bg-primary/10 p-2">
          <Label
            label="Overall"
            className="!font-bold !text-sm"
          />
          <LoanInfo loanData={loanData} />
        </div>
        <div className="flex flex-col gap-2 mb-2 bg-card rounded-lg bg-primary/10 p-2">
          <Label
            label="Collateral"
            className="!font-bold !text-sm"
          />
          <Label
            label="Loan Collateral"
            secondaryLabel={loanData.uiDisplay.collateral || ""}
          />
          <Label
            label="Withdrawable Collateral"
            secondaryLabel={loanData.uiDisplay.withdrawableCollat || ""}
          />
          <Label
            label="Minimum Collateral"
            secondaryLabel={loanData.uiDisplay.minCollat || ""}

          />
          <Label
            label="Available Collateral"
            secondaryLabel={loanData.uiDisplay.availableCollateral || ""}
          />
        </div>

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
              ? loanData.formattedWithdrawableCollat
              : loanData.formattedAvailableCollateral
          }
        />
      </div>
    </Modal>
  );
}
