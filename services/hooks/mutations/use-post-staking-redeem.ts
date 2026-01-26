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
    opId: string;
};

export function usePostStakingRedeem() {
    const { EP_STAKING_REDEEM } = envParsed();
    const { sessionMode } = useSessionMode();

    return useMutation<PostEmptyResponseData, unknown, Vars>({
        mutationKey: ["postStakingRedeem"],
        mutationFn: async ({ opId }) => {
            if (sessionMode === "mock") return getMockedPostEmptyResponseData();

            const url = `${EP_STAKING_REDEEM}`.replace("%OPID", opId);

            const resp = await postValidated<PostEmptyResponseDataResponse>(
                url,
                {},
                postEmptyResponseDataResponseSchema
            );

            return getFormattedPostEmptyResponseData(resp);
        },
        onSuccess: async (_data, { userId }) => {
            await invalidatePortfolioQueries(userId);
        },
    });
}
