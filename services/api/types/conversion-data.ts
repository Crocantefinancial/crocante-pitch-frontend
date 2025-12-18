import { TOKENS_VALUATION } from "@/shared/mockups/tokens-valuation";

export interface TokenValuation {
  label: string;
  value: number;
}

export function getNullMockedTokenConversion(): TokenValuation[] {
  return TOKENS_VALUATION;
}

export function getMockedTokenConversionByToken(token: string): TokenValuation {
  return (
    TOKENS_VALUATION.find((tokenValuation) => tokenValuation.label === token) ||
    ({ label: "", value: 0 } as TokenValuation)
  );
}
