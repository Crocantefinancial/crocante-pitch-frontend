"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedPostStakingData,
  getMockedPostStakingData,
  PostStakingData,
  PostStakingDataResponse,
  postStakingDataResponseSchema,
} from "../types/post-staking-data";
import { invalidatePortfolioQueries } from "./utils/invalidate-portfolio-queries";

type Vars = {
  userId: string;
  typeId: string;
  amount: string;
};

export function usePostStaking() {
  const { EP_STAKING } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<PostStakingData, unknown, Vars>({
    mutationKey: ["postStaking"],
    mutationFn: async ({ amount, typeId }) => {
      if (sessionMode === "mock") return getMockedPostStakingData();

      const url = `${EP_STAKING}`;

      const resp = await postValidated<PostStakingDataResponse>(
        url,
        { amount, typeId },
        postStakingDataResponseSchema
      );

      return getFormattedPostStakingData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      await invalidatePortfolioQueries(userId);
    },
  });
}
