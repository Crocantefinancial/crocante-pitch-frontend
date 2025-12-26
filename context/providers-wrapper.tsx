"use client";

import { AuthExpiredListener } from "@/context/auth-expired-listener";
import LoginModal from "@/context/components/login-modal";
import { useModal } from "@/hooks/use-modal";
import useMounted from "@/hooks/use-mounted";
import { queryClient } from "@/services/react-query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { SessionProvider } from "./session-provider";

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  const {
    isOpen: isOpenSessionExpiredModal,
    open: openSessionExpiredModalAction,
    close: closeSessionExpiredModal,
  } = useModal(false, {});

  return (
    <>
      <AuthExpiredListener
        onOpen={openSessionExpiredModalAction}
        isOpen={isOpenSessionExpiredModal}
      />
      <SessionProvider>{children}</SessionProvider>

      {mounted && (
        <LoginModal
          open={isOpenSessionExpiredModal}
          onClose={closeSessionExpiredModal}
        />
      )}
    </>
  );
}

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersInner>{children}</ProvidersInner>
    </QueryClientProvider>
  );
}
