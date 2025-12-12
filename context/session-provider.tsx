"use client";
import { POLL_USER_DATA_INTERVAL } from "@/config/constants";
import { User } from "@/services/api/types/user-data";
import { useUser } from "@/services/api/use-user";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<SessionContextType | undefined>(undefined);
type SessionContextType = {
  isSignedIn: boolean;
  user: User | undefined;
  logout: () => void;
  login: (user: User) => void;
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const defaultUserId = "1";
  const { data: userData, isLoading } = useUser(
    defaultUserId,
    POLL_USER_DATA_INTERVAL
  );

  const [user, setUser] = useState<User | undefined>(userData?.user);
  const logout = () => {
    setUser(undefined);
  };
  const login = (user: User) => {
    setUser(user);
  };

  useEffect(() => {
    if (!isLoading && userData) {
      setUser(userData.user);
    }
  }, [isLoading, userData, user]);

  return (
    <SessionContext.Provider
      value={{
        isSignedIn: user ? true : false,
        user,
        logout,
        login,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
