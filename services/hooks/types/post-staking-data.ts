import { STAKING } from "@/shared/mockups/staking";
import { z } from "zod";

export const postStakingDataSchema = z.object({}).nullable();

export type PostStakingData = z.infer<typeof postStakingDataSchema>;

export const postStakingDataResponseSchema = z.object({
  data: postStakingDataSchema,
  status: z.number(),
});

export type PostStakingDataResponse = z.infer<
  typeof postStakingDataResponseSchema
>;

export const getMockedPostStakingData = (): PostStakingData => {
  return postStakingDataSchema.parse(STAKING);
};

export const getFormattedPostStakingData = (
  response: PostStakingDataResponse
): PostStakingData => {
  return postStakingDataSchema.parse(response.data);
};
