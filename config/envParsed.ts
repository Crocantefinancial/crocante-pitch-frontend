import { z } from "zod";

const env = {
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY,
  API_PROXY_ORIGIN: process.env.NEXT_PUBLIC_API_PROXY_ORIGIN,
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  MAX_DEFINITION: process.env.NEXT_PUBLIC_MAX_DEFINITION,
  EP_NET_WORTH: process.env.NEXT_PUBLIC_EP_NET_WORTH,
  EP_AUTH_LOGIN: process.env.NEXT_PUBLIC_EP_AUTH_LOGIN,
  EP_AUTH_LOGOUT: process.env.NEXT_PUBLIC_EP_AUTH_LOGOUT,
  EP_CLIENT: process.env.NEXT_PUBLIC_EP_CLIENT,
  EP_CURRENCY_DEPOSIT: process.env.NEXT_PUBLIC_EP_CURRENCY_DEPOSIT,
  EP_CURRENCY_NETWORKS: process.env.NEXT_PUBLIC_EP_CURRENCY_NETWORKS,
  EP_DEPOSIT_ADDRESS: process.env.NEXT_PUBLIC_EP_DEPOSIT_ADDRESS,
  EP_CONVERSION_QUOTE: process.env.NEXT_PUBLIC_EP_CONVERSION_QUOTE,
  EP_CONVERSION_PAIRS: process.env.NEXT_PUBLIC_EP_CONVERSION_PAIRS,
  EP_STATEMENT_AVAILABLE: process.env.NEXT_PUBLIC_EP_STATEMENT_AVAILABLE,
  EP_CONVERSION: process.env.NEXT_PUBLIC_EP_CONVERSION,
  EP_STAKING_TYPE: process.env.NEXT_PUBLIC_EP_STAKING_TYPE,
  EP_STAKING: process.env.NEXT_PUBLIC_EP_STAKING,
  EP_STAKING_REDEEM: process.env.NEXT_PUBLIC_EP_STAKING_REDEEM,
  EP_STAKING_ACTIVE: process.env.NEXT_PUBLIC_EP_STAKING_ACTIVE,
  EP_STAKING_REDEEMED: process.env.NEXT_PUBLIC_EP_STAKING_REDEEMED,
  EP_ACTIVITY: process.env.NEXT_PUBLIC_EP_ACTIVITY,
  EP_LOAN_ACTIVE: process.env.NEXT_PUBLIC_EP_LOAN_ACTIVE,
  EP_LOAN_COMPLETED: process.env.NEXT_PUBLIC_EP_LOAN_COMPLETED,
  EP_STATEMENT_LIABILITY: process.env.NEXT_PUBLIC_EP_STATEMENT_LIABILITY,
  EP_LOAN: process.env.NEXT_PUBLIC_EP_LOAN,
  EP_LOAN_HISTORY_EVENTS: process.env.NEXT_PUBLIC_EP_LOAN_HISTORY_EVENTS,
  EP_LOAN_TYPE: process.env.NEXT_PUBLIC_EP_LOAN_TYPE,
  EP_STATEMENT_AVAILABLE_TOKEN: process.env.NEXT_PUBLIC_EP_STATEMENT_AVAILABLE_TOKEN,
  EP_LOAN_POST: process.env.NEXT_PUBLIC_EP_LOAN_POST,
  EP_LOAN_ADD_COLLAT_POST: process.env.NEXT_PUBLIC_EP_LOAN_ADD_COLLAT_POST,
  EP_LOAN_REM_COLLAT_POST: process.env.NEXT_PUBLIC_EP_LOAN_REM_COLLAT_POST,
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

    MAX_DEFINITION: z.string().transform(v => Number(v)).default("2"),
    EP_NET_WORTH: z.string(),
    EP_AUTH_LOGIN: z.string(),
    EP_AUTH_LOGOUT: z.string(),
    EP_CLIENT: z.string(),
    EP_CURRENCY_DEPOSIT: z.string(),
    EP_CURRENCY_NETWORKS: z.string(),
    EP_DEPOSIT_ADDRESS: z.string(),
    EP_CONVERSION_QUOTE: z.string(),
    EP_CONVERSION_PAIRS: z.string(),
    EP_STATEMENT_AVAILABLE: z.string(),
    EP_CONVERSION: z.string(),
    EP_STAKING_TYPE: z.string(),
    EP_STAKING: z.string(),
    EP_STAKING_REDEEM: z.string(),
    EP_STAKING_ACTIVE: z.string(),
    EP_STAKING_REDEEMED: z.string(),
    EP_ACTIVITY: z.string(),
    EP_LOAN_ACTIVE: z.string(),
    EP_LOAN_COMPLETED: z.string(),
    EP_STATEMENT_LIABILITY: z.string(),
    EP_LOAN: z.string(),
    EP_LOAN_HISTORY_EVENTS: z.string(),
    EP_LOAN_TYPE: z.string(),
    EP_STATEMENT_AVAILABLE_TOKEN: z.string(),
    EP_LOAN_POST: z.string(),
    EP_LOAN_ADD_COLLAT_POST: z.string(),
    EP_LOAN_REM_COLLAT_POST: z.string(),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
