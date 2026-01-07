import { POLL_AVAILABLES_INTERVAL } from "@/config/constants";
import { useSession } from "@/context/session-provider";
import { useAvailables } from "@/services/hooks/use-availables";
import { useConversionPairs } from "@/services/hooks/use-conversion-pairs";

export function useSwapData(selectedTokenTo: string) {
  const { user } = useSession();
  const userId = user?.id.toString() || "";
  const { data: availables } = useAvailables(userId, POLL_AVAILABLES_INTERVAL);
  const { data: conversionPairs } = useConversionPairs(
    userId,
    selectedTokenTo,
    POLL_AVAILABLES_INTERVAL
  );

  return {
    tokensFrom: availables,
    tokensTo: conversionPairs,
  };
}
