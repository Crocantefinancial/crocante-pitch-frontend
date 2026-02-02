import { Button, InputSelectorToken, Label, Modal, Tabs, ToastType } from "@/components/index";
import { getTokenLogo } from "@/components/token-icons";
import { useSession } from "@/context/session-provider";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";
import { useSelector } from "@/hooks/use-selector";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { useEffect, useState } from "react";
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
  const { selectedRow, change: changeTabSelection } = useSelector<TabType>(
    TabValues,
    0
  );
  const [value, setValue] = useState("");
  const [valueReceive, setValueReceive] = useState("");
  const [inputReceiveFocused, setInputReceiveFocused] = useState(false);
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

  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const {
    convertTo,
    convertFrom,
    conversionRateFrom: conversionRate,
  } = useTokenSwap(userId, loanData.token, loanData.collateralToken, false);

  const handleChangeValue = (tokenValue: string) => {
    if (inputReceiveFocused) {
      setValueReceive(tokenValue);
    } else {
      setValue(tokenValue);
    }
    if (tokenValue) {
      if (inputReceiveFocused) {
        setValue(convertFrom(tokenValue));
      } else {
        setValueReceive(convertTo(tokenValue));
      }
    } else {
      setValueReceive("0");
      setValue("0");
    }
  };

  useEffect(() => {
    if (conversionRate) {
      if (inputReceiveFocused) {
        setValueReceive(convertTo(value));
      } else {
        setValue(convertTo(valueReceive));
      }
    }
  }, [conversionRate]);

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: 0,
    max: selectedRow === TabValues.Withdraw ? Number(loanData.withdrawableCollat) : 0, //loanData.availableCollat,
    requireNonZero: true,
  });

  const conditionsSuccess = isValidValue;

  const renderTabContent = () => {
    return (
      <div className="space-y-4">
        <div className="max-w-full flex flex-row gap-4">
          <InputSelectorToken
            className="w-1/2"
            label=""
            value={value}
            onMaxClick={() => handleChangeValue(selectedRow === TabValues.Withdraw ? loanData.withdrawableCollat.toString() : "0")}
            onChangeValue={(e) => handleChangeValue(e.target.value)}
            maxValue={selectedRow === TabValues.Withdraw ? loanData.withdrawableCollat.toString() : "0"}
            tokenCode={loanData.collateralToken}
            selectorProps={{
              options: [
                {
                  label: loanData.collateralToken,
                  id: loanData.collateralToken,
                  value: loanData.collateralToken,
                  icon: <img src={getTokenLogo(loanData.collateralToken)} className="w-7 h-7 rounded-full" />,
                }
              ],
              selectedIndex: 0,
              onChange: () => { },
            }}
          />
          <InputSelectorToken
            className="w-1/2"
            label=""
            value={valueReceive}
            onChangeValue={(e) => handleChangeValue(e.target.value)}
            tokenCode={loanData.token}
            selectorProps={{
              options: [
                {
                  label: loanData.token,
                  id: loanData.token,
                  value: loanData.token,
                  icon: <img src={getTokenLogo(loanData.token)} className="w-7 h-7 rounded-full" />,
                }
              ],
              selectedIndex: 0,
              onChange: () => { },
            }}
            onFocus={() => {
              setInputReceiveFocused(true);
            }}
            onBlur={() => {
              setInputReceiveFocused(false);
            }}
          />
        </div>
      </div>
    )
  }

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
          secondaryLabel={`${loanData.minCollat} ${loanData.collateralToken}` || ""}
        />

        <div className="bg-card rounded-lg max-w-full mt-4">
          <Tabs
            TabValues={TabValues}
            selectedRow={selectedRow}
            onChange={changeTabSelection}
          />
        </div>

        {renderTabContent()}
      </div>
    </Modal>
  );
}
