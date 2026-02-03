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

interface ManageDebtModalProps {
  loanData: UILoanHistoryDataType;
  debtModalOpen: boolean;
  closeDebtModal: () => void;
}

enum TabValues {
  TOKEN = "Pay w/USDT",
  COLLATERAL = "Pay w/Collateral",
}

export default function ManageDebtModal({
  loanData,
  debtModalOpen,
  closeDebtModal
}: ManageDebtModalProps) {
  type TabType = (typeof TabValues)[keyof typeof TabValues];
  const { selectedRow, change: changeTabSelection } = useSelector<TabType>(
    TabValues,
    0,
    {
      onChange: () => {
        setValue("0");
        setValueReceive("0");
      }
    }
  );
  const [value, setValue] = useState("");
  const [valueReceive, setValueReceive] = useState("");
  const [inputReceiveFocused, setInputReceiveFocused] = useState(false);
  const { showToast } = useToast();
  //const postLoan = usePostLoan();

  const payWithUSDT = () => {
    showToast("Pay with USDT not implemented", ToastType.ERROR);
    closeDebtModal();
  }

  const payWithCollateral = () => {
    showToast("Pay with Collateral not implemented", ToastType.ERROR);
    closeDebtModal();
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
    max: selectedRow === TabValues.TOKEN ? loanData.debtSize : loanData.availableCollateral,
    requireNonZero: true,
  });

  const conditionsSuccess = isValidValue;

  const renderTabContent = () => {
    const max_value = selectedRow === TabValues.TOKEN
      ? Math.min(loanData.debtSize, loanData.availableToken)
      : convertTo(loanData.debtSize.toString());

    return (
      <div className="space-y-4">
        <div className="max-w-full flex flex-row gap-4">
          <InputSelectorToken
            className="w-1/2"
            label=""
            value={value}
            onMaxClick={() => handleChangeValue(max_value.toString())}
            onChangeValue={(e) => handleChangeValue(e.target.value)}
            maxValue={max_value.toString()}
            tokenCode={selectedRow === TabValues.TOKEN ? loanData.token : loanData.collateralToken}
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
            >
              Pay with USDT
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={payWithCollateral}
              disabled={!conditionsSuccess}
            >
              Pay with Collateral
            </Button>
          )}
        </>
      )}
    >
      <div className="flex flex-col gap-2 px-6">
        <Label
          label="Loan Debt"
          secondaryLabel={`${loanData.debt}` || ""}
        />
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

        {renderTabContent()}
      </div>
    </Modal>
  );
}
