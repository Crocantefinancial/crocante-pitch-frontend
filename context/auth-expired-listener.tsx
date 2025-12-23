import { resetAuthExpired } from "@/services/react-query/auth-expired";
import { useEffect } from "react";

export function AuthExpiredListener({
  onOpen,
  isOpen,
}: {
  onOpen: () => void;
  isOpen: boolean;
}) {
  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener("auth-expired", handler as any);
    return () => window.removeEventListener("auth-expired", handler as any);
  }, [onOpen]);

  useEffect(() => {
    if (!isOpen) resetAuthExpired();
  }, [isOpen]);

  return null;
}
