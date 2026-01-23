import { STAKING } from "@/shared/mockups/staking";
import { z } from "zod";
import { OperationSchema, TypeSchema } from "./activity-data";

export const StakingDataSchema = z.array(z.object({
    typeId: z.string(),
    startsAt: z.string(),
    redeemableAt: z.string().nullable(),
    initialAmount: z.string(),
    initialAPY: z.string(),
    operation: OperationSchema,
    type: TypeSchema,
    amount: z.string(),
    yield: z.string(),
    estRedeemYield: z.string(),
    apy: z.string(),
}));

export type StakingData = z.infer<typeof StakingDataSchema>;

export const StakingDataResponseSchema = z.object({
    data: StakingDataSchema,
    status: z.number(),
});

export type StakingDataResponse = z.infer<typeof StakingDataResponseSchema>;

export const getMockedStakingData = (): StakingData => {
    return StakingDataSchema.parse(STAKING.data);
};

export const getFormattedStakingData = (
    response: StakingDataResponse
): StakingData => {
    return StakingDataSchema.parse(response.data);
};