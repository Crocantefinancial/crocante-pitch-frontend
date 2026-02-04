import { InputSelectorToken } from "@/components/index";
import { getTokenLogo } from "@/components/token-icons";
import { useSession } from "@/context/session-provider";
import { UILoanHistoryDataType } from "@/domain/credit/hooks/use-loan-history-data";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useEffect, useRef } from "react";

interface LoanCollateralPairProps {
  loanData: UILoanHistoryDataType;
  valueCollateral: string;
  setValueCollateral: (value: string) => void;
  valueLoan: string;
  setValueLoan: (value: string) => void;
  maxValueCollateral: string | undefined;
  maxValueLoan?: string | undefined;
}

export default function LoanCollateralPair({
  loanData,
  valueCollateral,
  setValueCollateral,
  valueLoan,
  setValueLoan,
  maxValueCollateral,
  maxValueLoan,
}: LoanCollateralPairProps) {
  const inputLoanFocused = useRef<boolean>(false);

  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const {
    convertTo,
    convertFrom,
    conversionRateFrom: conversionRate,
  } = useTokenSwap(userId, loanData.token, loanData.collateralToken, false);

  const handleChangeValue = (tokenValue: string) => {
    if (tokenValue) {
      if (inputLoanFocused.current) {
        setValueLoan(tokenValue);
        setValueCollateral(convertTo(tokenValue));
      } else {
        setValueCollateral(tokenValue);
        setValueLoan(convertFrom(tokenValue));
      }
    } else {
      setValueLoan("");
      setValueCollateral("");
    }
  };

  useEffect(() => {
    if (conversionRate && valueLoan && valueCollateral) {
      if (inputLoanFocused.current) {
        setValueCollateral(convertTo(valueLoan));
      } else {
        setValueLoan(convertFrom(valueCollateral));
      }
    }
  }, [conversionRate]);

  useEffect(() => {
    setValueLoan("");
    setValueCollateral("");
  }, []);

  return (
    <div className="space-y-4">
      <div className="max-w-full flex flex-row gap-2">
        <InputSelectorToken
          className="w-1/2"
          label=""
          value={valueCollateral}
          onMaxClick={
            maxValueCollateral
              ? () => {
                inputLoanFocused.current = false;
                handleChangeValue(maxValueCollateral);
              }
              : undefined
          }
          onChangeValue={(e) => handleChangeValue(e.target.value)}
          maxValue={maxValueCollateral}
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
          onFocus={() => {
            inputLoanFocused.current = false;
          }}
        />
        <InputSelectorToken
          className="w-1/2"
          label=""
          value={valueLoan}
          onChangeValue={(e) => handleChangeValue(e.target.value)}
          maxValue={maxValueLoan}
          onMaxClick={
            maxValueLoan
              ? () => {
                inputLoanFocused.current = true;
                handleChangeValue(maxValueLoan);
              }
              : undefined
          }
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
            inputLoanFocused.current = true;
          }}
        />
      </div>
    </div>
  )
}
