"use client";

import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { queryClient } from "@/services/react-query/query-client";
import { postValidated } from "@/services/zod/utils";
import { useMutation } from "@tanstack/react-query";
import {
  getFormattedPostConversionData,
  getMockedPostConversionData,
  PostConversionData,
  PostConversionDataResponse,
  postConversionDataResponseSchema,
} from "../types/post-conversion-data";

type Vars = {
  userId: string;
  tokenFrom: string;
  tokenTo: string;
  amount: string;
};

export function usePostConversion() {
  const { EP_CONVERSION } = envParsed();
  const { sessionMode } = useSessionMode();

  return useMutation<PostConversionData, unknown, Vars>({
    mutationKey: ["postConversion"],
    mutationFn: async ({ tokenFrom, tokenTo, amount }) => {
      if (sessionMode === "mock") return getMockedPostConversionData();

      const url = `${EP_CONVERSION}`
        .replace("%TOKEN1", tokenFrom)
        .replace("%TOKEN2", tokenTo);

      const resp = await postValidated<PostConversionDataResponse>(
        url,
        { amount },
        postConversionDataResponseSchema
      );

      return getFormattedPostConversionData(resp);
    },
    onSuccess: async (_data, { userId }) => {
      const invalidateQueries = () => {
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ["netWorth", userId] }),
          queryClient.invalidateQueries({ queryKey: ["portfolioData"] }),
          queryClient.invalidateQueries({ queryKey: ["availables", userId] }),
          queryClient.invalidateQueries({
            queryKey: ["conversionPairs", userId],
          }),
        ]);
      };
      // 1) immediate refresh
      await invalidateQueries();

      // 2) indexer lag follow-ups
      setTimeout(invalidateQueries, 1500);
      setTimeout(invalidateQueries, 4000);
      setTimeout(invalidateQueries, 6000);
    },
  });
}
