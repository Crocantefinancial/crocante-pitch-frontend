"use client";

import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { useEffect, useState } from "react";

export function useSessionMode() {
  const [sessionMode, setSessionMode] = useState<string>(
    () => LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "none"
  );

  useEffect(() => {
    // Listen for storage events (cross-tab changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LocalStorageKeys.SESSION_MODE) {
        setSessionMode(e.newValue ?? "none");
      }
    };

    // Listen for custom event (same-tab changes)
    const handleCustomStorageChange = () => {
      setSessionMode(
        LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? "none"
      );
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("session-mode-changed", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "session-mode-changed",
        handleCustomStorageChange
      );
    };
  }, []);

  return { sessionMode };
}
