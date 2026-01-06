import envParsed from "@/config/envParsed";
import { useSessionMode } from "@/hooks/use-session-mode";
import { useQuery } from "@tanstack/react-query";
import { getValidated } from "../zod/utils";
import {
  DepositAddress,
  DepositAddressResponse,
  depositAddressResponseSchema,
  getMockedDepositAddressData,
} from "./types/deposit-address-data";

export function useDepositAddress(networkId: string, pollInterval: number) {
  const { EP_DEPOSIT_ADDRESS } = envParsed();
  const { sessionMode } = useSessionMode();
  return useQuery<DepositAddress>({
    queryKey: ["depositAddressData", networkId],
    queryFn: async () => {
      if (typeof networkId !== "string" || networkId.trim() === "") {
        console.warn("No network ID provided");
        return getMockedDepositAddressData(networkId);
      }
      try {
        if (sessionMode === "mock") {
          return getMockedDepositAddressData(networkId);
        }

        const response = await getValidated<DepositAddressResponse>(
          `${EP_DEPOSIT_ADDRESS}`.replace("%NETWORK", networkId),
          depositAddressResponseSchema
        );
        return response.data;
      } catch (error) {
        console.warn("Error fetching deposit address data:", error);
        return getMockedDepositAddressData(networkId);
      }
    },
    enabled:
      typeof networkId === "string" &&
      networkId.trim() !== "" &&
      sessionMode !== "none", // Disable when logged out
    staleTime: 1000 * 60 * 5, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep unused data in cache for 10 minutes
    refetchInterval: pollInterval,
    refetchIntervalInBackground: true,
    refetchOnMount: true, // Only refetch if data is stale (respects staleTime)
    //refetchOnMount: "always" // Always refetch when component mounts,
    meta: { silent: true }, // Errors are handled gracefully with fallback to mock
  });
}
