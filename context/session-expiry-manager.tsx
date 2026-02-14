"use client";

import SessionExpiryModal from "@/components/auth/session-expiry-modal";
import { useSessionExpiry } from "@/hooks/use-session-expiry";
import { useSession } from "./session-provider";

export function SessionExpiryManager() {
  const { isSignedIn } = useSession();
  const { isExpiryModalOpen, expiresAtForModal, onRenew, isRenewing } =
    useSessionExpiry(isSignedIn);

  return (
    <SessionExpiryModal
      open={isExpiryModalOpen}
      expiresAt={expiresAtForModal}
      onRenew={onRenew}
      isRenewing={isRenewing}
    />
  );
}
