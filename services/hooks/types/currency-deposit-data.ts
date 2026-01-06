import { CURRENCY_DEPOSIT } from "@/shared/mockups/currency-deposit";
import { z } from "zod";

export const currencyDepositSchema = z.object({
  id: z.string(),
  name: z.string(),
  decimals: z.number(),
  allowTransfers: z.boolean(),
  disabled: z.boolean(),
  priority: z.number(),
});

export type CurrencyDeposit = z.infer<typeof currencyDepositSchema>;

export const currencyDepositResponseSchema = z.object({
  data: z.array(currencyDepositSchema),
  status: z.number(),
});

export type CurrencyDepositResponse = z.infer<
  typeof currencyDepositResponseSchema
>;

export function getMockedCurrencyDepositData(): CurrencyDeposit[] {
  return CURRENCY_DEPOSIT;
}
