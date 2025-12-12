import envParsed from "@/config/envParsed";
import { USERS_DATA } from "@/shared/mockups/users";
import { useQuery } from "@tanstack/react-query";
import { getNullMockedUserData, UserDataResponse } from "./types/user-data";

export function useUser(userId: string, pollInterval: number) {
  const { API_GATEWAY } = envParsed();

  return useQuery<UserDataResponse>({
    queryKey: ["userData", userId],
    queryFn: async () => {
      if (typeof userId !== "string" || userId.trim() === "") {
        console.warn("No user ID provided");
        return getNullMockedUserData();
      }
      try {
        //throw new Error("test");

        const user = USERS_DATA.find((user) => user.id === parseInt(userId));
        return user ? { user } : getNullMockedUserData();
      } catch (error) {
        console.warn("Error fetching user data:", error);
        return getNullMockedUserData();
      }
    },
    enabled: typeof userId === "string" && userId.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
  });
}
