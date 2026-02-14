"use client";

import { POLL_USER_DATA_INTERVAL } from "@/config/constants";
import { LocalStorageManager } from "@/config/localStorage";
import { LoginService } from "@/services/api/auth/login-service";
import type { User } from "@/services/hooks/types/user-data";
import { useUser } from "@/services/hooks/use-user";
import { queryClient } from "@/services/react-query/query-client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { SessionExpiryManager } from "./session-expiry-manager";

type SessionContextType = {
  isSignedIn: boolean;
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  setToken: (token: string) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    isError,
  } = useUser(POLL_USER_DATA_INTERVAL);

  const isSignedIn = !!user && !isError;

  const setToken = useCallback((_token: string) => {
    // No-op: session is HttpOnly cookie; BFF owns token. Refresh user state if needed.
    queryClient.invalidateQueries({ queryKey: ["user", "me"] });
  }, []);

  const logout = useCallback(async () => {
    await LoginService.logout();
    queryClient.removeQueries({ queryKey: ["user", "me"] });
  }, []);

  const value = useMemo(
    () => ({
      isSignedIn,
      user: user ?? null,
      isLoading,
      logout,
      setToken,
    }),
    [isSignedIn, user, isLoading, logout, setToken]
  );

  useEffect(() => {
    const handler = () => {
      LocalStorageManager.clearLocalStorage();
      queryClient.removeQueries({ queryKey: ["user", "me"] });
    };
    window.addEventListener("auth-expired", handler as any);
    return () => window.removeEventListener("auth-expired", handler as any);
  }, []);

  return (
    <SessionContext.Provider value={value}>
      <SessionExpiryManager />
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
}
