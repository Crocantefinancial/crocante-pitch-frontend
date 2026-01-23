import { EMPTY_RESPONSE } from "@/shared/mockups/empty-response";
import { z } from "zod";

export const postEmptyResponseDataSchema = z.object({}).nullable();

export type PostEmptyResponseData = z.infer<typeof postEmptyResponseDataSchema>;

export const postEmptyResponseDataResponseSchema = z.object({
  data: postEmptyResponseDataSchema,
  status: z.number(),
});

export type PostEmptyResponseDataResponse = z.infer<
  typeof postEmptyResponseDataResponseSchema
>;

export const getMockedPostEmptyResponseData = (): PostEmptyResponseData => {
  return postEmptyResponseDataSchema.parse(EMPTY_RESPONSE);
};

export const getFormattedPostEmptyResponseData = (
  response: PostEmptyResponseDataResponse
): PostEmptyResponseData => {
  return postEmptyResponseDataSchema.parse(response.data);
};
