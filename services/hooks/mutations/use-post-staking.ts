"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedPostEmptyResponseData,
  getMockedPostEmptyResponseData,
  PostEmptyResponseData,
  PostEmptyResponseDataResponse,
  postEmptyResponseDataResponseSchema,
} from "../types/post-empty-response-data";
import { invalidatePortfolioQueries } from "./utils/invalidate-portfolio-queries";

type Vars = {
  userId: string;
  typeId: string;
  amount: string;
};

export function usePostStaking() {
  const { EP_STAKING } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<PostEmptyResponseData, unknown, Vars>({
    mutationKey: ["postStaking"],
    mutationFn: async ({ amount, typeId }) => {
      if (sessionMode === "mock") return getMockedPostEmptyResponseData();

      const url = `${EP_STAKING}`;

      const resp = await postValidated<PostEmptyResponseDataResponse>(
        url,
        { amount, typeId },
        postEmptyResponseDataResponseSchema
      );

      return getFormattedPostEmptyResponseData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      await invalidatePortfolioQueries(userId);
    },
  });
}
