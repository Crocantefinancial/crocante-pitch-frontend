import { AVAILABLES } from "@/shared/mockups/availables";
import { z } from "zod";
import { AvailablesDataItemUI, AvailableTokenDataSchema } from "./availables-data";

export type AvailableTokenData = z.infer<typeof AvailableTokenDataSchema>;

export const availableTokenDataResponseSchema = z.object({
  data: AvailableTokenDataSchema,
  status: z.number(),
});

export type AvailableTokenDataResponse = z.infer<
  typeof availableTokenDataResponseSchema
>;

const helperFormattedAvailableTokenData = (
  response: AvailableTokenDataResponse
): AvailablesDataItemUI => {
  return {
    id: response.data.currency.id,
    name: response.data.currency.name,
    amount: response.data.amount,
    value: response.data.estValue,
  } as AvailablesDataItemUI;
};

export const getMockedAvailableTokenData = (token: string): AvailablesDataItemUI => {
  const availableToken = AVAILABLES.data.availables.find(av => av.currency.id === token);
  if (!availableToken) {
    throw new Error(`Available token not found for token: ${token}`);
  }
  return helperFormattedAvailableTokenData({
    data: availableToken as AvailableTokenData,
    status: 200,
  });
};

export const getFormattedAvailableTokenData = (
  response: AvailableTokenDataResponse
): AvailablesDataItemUI => {
  return helperFormattedAvailableTokenData(response);
};
