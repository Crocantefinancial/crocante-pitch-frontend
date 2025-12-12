export interface User {
  id: number;
  fullName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  status: "Invited" | "Registered" | "Active" | "Disabled";
}

export interface UserDataResponse {
  user: User;
}

export function getNullMockedUserData(): UserDataResponse {
  return {
    user: {
      id: 0,
      fullName: "",
      avatar: "",
      email: "",
      phoneNumber: "",
      userRole: "",
      status: "Invited",
    },
  };
}
