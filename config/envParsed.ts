import { z } from "zod";

const env = {
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY,
};

const envSchema = z
  .object({
    API_GATEWAY: z.string().url().optional().default("http://localhost:5000"),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
