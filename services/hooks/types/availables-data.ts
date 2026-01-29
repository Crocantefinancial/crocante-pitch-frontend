import { AVAILABLES } from "@/shared/mockups/availables";
import { z } from "zod";
import { CurrencySchema } from "./net-worth-data";

export const AvailableTokenDataSchema = z.object({
  currency: CurrencySchema,
  quoteCurrency: CurrencySchema,
  amount: z.string(),
  estPrice: z.string(),
  estValue: z.string(),
});

export type AvailableTokenData = z.infer<typeof AvailableTokenDataSchema>;

export const AvailablesDataSchema = z.object({
  availables: z.array(AvailableTokenDataSchema),
});

export type AvailablesData = z.infer<typeof AvailablesDataSchema>;
export type AvailablesDataItem = z.infer<typeof CurrencySchema>;

export const availablesDataResponseSchema = z.object({
  data: AvailablesDataSchema,
  status: z.number(),
});

export type AvailablesDataResponse = z.infer<
  typeof availablesDataResponseSchema
>;

export type AvailablesDataItemUI = {
  id: string;
  name: string;
  amount: string;
  value: string;
};

const helperFormattedAvailablesData = (
  response: AvailablesDataResponse
): AvailablesDataItemUI[] => {
  return response.data.availables.reduce((acc, av) => {
    acc.push({
      id: av.currency.id,
      name: av.currency.name,
      amount: av.amount,
      value: av.estValue,
    });
    return acc;
  }, [] as AvailablesDataItemUI[]);
};

export const getMockedAvailablesData = (): AvailablesDataItemUI[] => {
  return helperFormattedAvailablesData(AVAILABLES);
};

export const getFormattedAvailablesData = (
  response: AvailablesDataResponse
): AvailablesDataItemUI[] => {
  return helperFormattedAvailablesData(response);
};
