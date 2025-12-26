import envParsed from "@/config/envParsed";
import { useQuery } from "@tanstack/react-query";
import {
  DepositAddressDataResponse,
  getMockedDepositAddressData,
} from "./types/deposit-address-data";

export function useDepositAddress(networkId: string, pollInterval: number) {
  const { API_GATEWAY } = envParsed();

  return useQuery<DepositAddressDataResponse>({
    queryKey: ["depositAddressData", networkId],
    queryFn: async () => {
      if (typeof networkId !== "string" || networkId.trim() === "") {
        console.warn("No network ID provided");
        return getMockedDepositAddressData(networkId);
      }
      try {
        //throw new Error("test");

        const depositAddressData: DepositAddressDataResponse | undefined =
          undefined;
        return depositAddressData || getMockedDepositAddressData(networkId);
      } catch (error) {
        console.warn("Error fetching deposit address data:", error);
        return getMockedDepositAddressData(networkId);
      }
    },
    enabled:
      typeof networkId === "string" &&
      networkId.trim() !== "" &&
      typeof networkId === "string" &&
      networkId.trim() !== "",
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
  });
}
