"use client";

import { POLL_USER_DATA_INTERVAL } from "@/config/constants";
import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
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
    error,
  } = useUser(POLL_USER_DATA_INTERVAL);

  const isSignedIn = !!user && !isError;

  const setToken = useCallback((token: string) => {
    LocalStorageManager.setItem(LocalStorageKeys.TOKEN, token);
    queryClient.invalidateQueries({ queryKey: ["user", "me"] });
  }, []);

  const logout = useCallback(() => {
    LocalStorageManager.clearLocalStorage();
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
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
}
