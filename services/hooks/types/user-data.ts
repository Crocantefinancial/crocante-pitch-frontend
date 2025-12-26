import { USERS_DATA } from "@/shared/mockups/users";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  avatar: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  userRole: z.string(),
  status: z.enum([
    "Invited",
    "Registered",
    "Active",
    "Disabled",
    "APPROVED",
    "REJECTED",
  ]),
});

export type User = z.infer<typeof userSchema>;

export function getNullMockedUserData(): User {
  return {
    id: "0",
    fullName: "",
    avatar: "",
    email: "",
    phoneNumber: "",
    userRole: "",
    status: "Invited",
  };
}

export function getMockedDefaultUserData(): User {
  const defaultUserId = "1";
  const user = USERS_DATA.find((user) => user.id === defaultUserId);
  if (!user) {
    return getNullMockedUserData();
  }
  return userSchema.parse({
    id: user.id,
    fullName: user.fullName,
    avatar: user.avatar,
    email: user.email,
    phoneNumber: user.phoneNumber,
    userRole: user.userRole,
    status: user.status,
  });
}

export const clientResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    alias: z.string(),
    birthDate: z.string(),
    approvalStatus: z.string(),
    approvedAt: z.string(),
    approverID: z.string(),
    refererId: z.string().nullable(),
    sourceOfFunds: z.string(),
    details: z.string().nullable(),
    pep: z.boolean(),
    acceptedTerms: z.boolean(),
    protected: z.boolean(),
    user: z.object({
      id: z.string(),
      createdAt: z.string(),
      totpEnabledAt: z.string().nullable(),
      totpResetAt: z.string().nullable(),
      firstName: z.string(),
      lastName: z.string(),
      userName: z.string(),
      passwordSetAt: z.string(),
      otpCreatedAt: z.string().nullable(),
      emailVerifiedAt: z.string(),
      referralCode: z.string(),
      langCode: z.string(),
      disabled: z.boolean(),
    }),
  }),
  status: z.number(),
});

export type ClientResponse = z.infer<typeof clientResponseSchema>;

export function getFormattedClientResponse(response: ClientResponse): User {
  return userSchema.parse({
    id: response.data.id,
    fullName: `${response.data.user.firstName} ${response.data.user.lastName}`,
    avatar: `${response.data.user.firstName
      .charAt(0)
      .toUpperCase()}${response.data.user.lastName.charAt(0).toUpperCase()}`,
    email: response.data.user.userName,
    phoneNumber: response.data.alias,
    userRole: response.data.user.langCode,
    status: response.data.approvalStatus,
  });
}
