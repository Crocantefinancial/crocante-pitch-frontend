import { CURRENCY_DEPOSIT } from "@/shared/mockups/currency-deposit";

export interface CurrencyDeposit {
  id: string;
  name: string;
  decimals: number;
  allowTransfers: boolean;
  disabled: boolean;
  priority: number;
}

export function getMockedCurrencyDepositData(): CurrencyDeposit[] {
  return CURRENCY_DEPOSIT;
}
