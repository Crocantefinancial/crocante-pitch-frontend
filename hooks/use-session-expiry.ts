"use client";

import { WARN_BEFORE_MS } from "@/components/auth/session-expiry-modal";
import { authApi } from "@/services/api/utils";
import { triggerAuthExpired } from "@/services/react-query/auth-expired";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionExpiry(isSignedIn: boolean) {
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [expiresAtForModal, setExpiresAtForModal] = useState<number | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleExpiryWarning = useCallback((expiresAt: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const msUntilWarning = expiresAt - Date.now() - WARN_BEFORE_MS;
    if (msUntilWarning <= 0) {
      setExpiresAtForModal(expiresAt);
      setIsExpiryModalOpen(true);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setExpiresAtForModal(expiresAt);
      setIsExpiryModalOpen(true);
    }, msUntilWarning);
  }, []);

  const fetchSessionAndSchedule = useCallback(async () => {
    try {
      const { data } = await authApi.get<{ hasSession: boolean; expiresAt?: number }>(
        "/api/auth/session"
      );
      if (data.hasSession && typeof data.expiresAt === "number") {
        scheduleExpiryWarning(data.expiresAt);
      }
    } catch {
      // No session or request failed; do nothing
    }
  }, [scheduleExpiryWarning]);

  useEffect(() => {
    if (!isSignedIn) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
        expiryTimeoutRef.current = null;
      }
      setIsExpiryModalOpen(false);
      setExpiresAtForModal(null);
      return;
    }
    fetchSessionAndSchedule();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isSignedIn, fetchSessionAndSchedule]);

  const onRenew = useCallback(async () => {
    setIsRenewing(true);
    try {
      await authApi.post("/api/auth/renew");
      setIsExpiryModalOpen(false);
      setExpiresAtForModal(null);
      await fetchSessionAndSchedule();
    } catch {
      // Keep modal open; user can retry or session will expire
    } finally {
      setIsRenewing(false);
    }
  }, [fetchSessionAndSchedule]);

  // When countdown reaches zero: close expiry modal and show login modal
  useEffect(() => {
    if (!isExpiryModalOpen || expiresAtForModal == null) return;
    const msUntilExpiry = expiresAtForModal - Date.now();
    if (msUntilExpiry <= 0) {
      setIsExpiryModalOpen(false);
      setExpiresAtForModal(null);
      triggerAuthExpired();
      return;
    }
    expiryTimeoutRef.current = setTimeout(() => {
      expiryTimeoutRef.current = null;
      setIsExpiryModalOpen(false);
      setExpiresAtForModal(null);
      triggerAuthExpired();
    }, msUntilExpiry);
    return () => {
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
        expiryTimeoutRef.current = null;
      }
    };
  }, [isExpiryModalOpen, expiresAtForModal]);

  return {
    isExpiryModalOpen,
    expiresAtForModal,
    onRenew,
    isRenewing,
  };
}
