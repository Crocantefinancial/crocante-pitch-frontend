"use client";

import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import { useEffect, useState } from "react";

/** Default so SSR and first client paint match (no localStorage on server). */
const SESSION_MODE_DEFAULT = "none";

export function useSessionMode() {
  const [sessionMode, setSessionMode] = useState<string>(SESSION_MODE_DEFAULT);

  useEffect(() => {
    setSessionMode(
      LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? SESSION_MODE_DEFAULT
    );

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LocalStorageKeys.SESSION_MODE) {
        setSessionMode(e.newValue ?? SESSION_MODE_DEFAULT);
      }
    };

    const handleCustomStorageChange = () => {
      setSessionMode(
        LocalStorageManager.getItem(LocalStorageKeys.SESSION_MODE) ?? SESSION_MODE_DEFAULT
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
