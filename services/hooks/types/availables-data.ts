import { AVAILABLES } from "@/shared/mockups/availables";
import { z } from "zod";
import { CurrencySchema } from "./net-worth-data";

export const AvailablesDataSchema = z.object({
  availables: z.array(
    z.object({
      currency: CurrencySchema,
      quoteCurrency: CurrencySchema,
      amount: z.string(),
      estPrice: z.string(),
      estValue: z.string(),
    })
  ),
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

const helperFormattedAvailablesData = (
  response: AvailablesDataResponse
): string[] => {
  return response.data.availables.reduce((acc, av) => {
    acc.push(av.currency.id);
    return acc;
  }, [] as string[]);
};

export const getMockedAvailablesData = (): string[] => {
  return helperFormattedAvailablesData(AVAILABLES);
};

export const getFormattedAvailablesData = (
  response: AvailablesDataResponse
): string[] => {
  return helperFormattedAvailablesData(response);
};
