import { Button, Label, Modal, Tabs, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";
import { useSelector } from "@/hooks/use-selector";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { usePostLoanManager } from "@/services/hooks/mutations/use-post-loan-manager";
import { useEffect, useState } from "react";
import LoanCollateralPair from "./loan-collateral-pair";
import LoanInfo from "./loan-info";

interface ManageDebtModalProps {
  loanData: UILoanHistoryDataType;
  debtModalOpen: boolean;
  closeDebtModal: () => void;
  userId: string;
}

enum TabValues {
  TOKEN = "Pay w/USDT",
  COLLATERAL = "Pay w/Collateral",
}

export default function ManageDebtModal({
  loanData,
  debtModalOpen,
  closeDebtModal,
  userId
}: ManageDebtModalProps) {
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
    if (debtModalOpen) {
      resetTabSelection();
    }
  }, [debtModalOpen]);

  const { showToast } = useToast();
  const postLoanRepay = usePostLoanManager("repay");
  const postLoanLiquidate = usePostLoanManager("liquidate");

  const payWithUSDT = () => {
    postLoanRepay.mutate({ userId, opId: loanData.opId, amount: valueLoan }, {
      onSuccess: (data) => {
        showToast("Debt repaid successfully", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN REPAY ERROR", err);
        showToast("Debt repayment failed", ToastType.ERROR);
      },
      onSettled: () => {
        closeDebtModal();
        setValueCollateral("");
        setValueLoan("");
      },
    });
  }

  const payWithCollateral = () => {
    postLoanLiquidate.mutate({ userId, opId: loanData.opId, amount: valueLoan }, {
      onSuccess: (data) => {
        showToast("Debt liquidated successfully", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN LIQUIDATE ERROR", err);
        showToast("Debt liquidation failed", ToastType.ERROR);
      },
      onSettled: () => {
        closeDebtModal();
        setValueCollateral("");
        setValueLoan("");
      },
    });
  }

  const {
    convertTo,
  } = useTokenSwap(userId, loanData.token, loanData.collateralToken, false);

  const { isValid: isValidValue } = useValueVerifier({
    value: valueLoan,
    min: 0,
    max: loanData.debtSize,
    requireNonZero: true,
  });

  const conditionsSuccess = isValidValue;

  return (
    <Modal
      open={debtModalOpen}
      onClose={closeDebtModal}
      title="Manage Debt"
      actions={() => (
        <>
          {selectedRow === TabValues.TOKEN ? (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={payWithUSDT}
              disabled={!conditionsSuccess}
              isLoading={postLoanRepay.isPending}
            >
              Pay with USDT
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={payWithCollateral}
              disabled={!conditionsSuccess}
              isLoading={postLoanLiquidate.isPending}
            >
              Pay with Collateral
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
          maxValueCollateral={selectedRow === TabValues.TOKEN
            ? undefined
            : convertTo(loanData.debtSize.toString()).toString()}
          maxValueLoan={
            selectedRow === TabValues.TOKEN
              ? Math.min(loanData.debtSize, loanData.availableToken).toString()
              : undefined
          }
        />
      </div>
    </Modal>
  );
}
