import { STAKING_TYPE } from "@/shared/mockups/staking-type";
import { z } from "zod";

export const StakingTypeDataSchema = z.array(z.object({
    id: z.string(),
    currencyId: z.string(),
    mode: z.enum(["VARIABLE", "FIXED"]),
    apy: z.string(),
    minAmount: z.string(),
    durationDays: z.number().optional(),
}));

export type StakingTypeData = z.infer<typeof StakingTypeDataSchema>;

export const stakingTypeDataResponseSchema = z.object({
  data: StakingTypeDataSchema,
  status: z.number(),
});

export type StakingTypeDataResponse = z.infer<typeof stakingTypeDataResponseSchema>;

export const getMockedStakingTypeData = (): StakingTypeData => {
    return StakingTypeDataSchema.parse(STAKING_TYPE);
};

export const getFormattedStakingTypeData = (
    response: StakingTypeDataResponse
): StakingTypeData => {
    return StakingTypeDataSchema.parse(response.data);
};