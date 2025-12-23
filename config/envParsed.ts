import { z } from "zod";

const env = {
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY,
  API_PROXY_ORIGIN: process.env.NEXT_PUBLIC_API_PROXY_ORIGIN,
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  TESTING_USERNAME: process.env.NEXT_PUBLIC_TESTING_USERNAME,
  TESTING_PASSWORD: process.env.NEXT_PUBLIC_TESTING_PASSWORD,
};

const envSchema = z
  .object({
    API_GATEWAY: z.string().url(),

    API_PROXY_ORIGIN: z
      .string()
      .url()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),

    APP_ENV: z
      .enum(["development", "staging", "production"])
      .optional()
      .transform((v) => (v === "staging" ? undefined : v)),

    TESTING_USERNAME: z
      .string()
      .email()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    TESTING_PASSWORD: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
