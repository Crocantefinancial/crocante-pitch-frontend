import { z } from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required").optional(),
  totpCode: z.string().min(1).optional().nullable(),
});

export const LoginResponseSchema = z.object({
  data: z.object({
    token: z.string(),
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
