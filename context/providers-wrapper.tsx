"use client";

import { AuthExpiredListener } from "@/context/auth-expired-listener";
import { useModal } from "@/hooks/use-modal";
import useMounted from "@/hooks/use-mounted";
import { queryClient } from "@/services/react-query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import AuthModal from "./components/auth-modal";
import { SessionProvider } from "./session-provider";

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  const {
    isOpen: isOpenAuthModal,
    open: openAuthModalAction,
    close: closeAuthModal,
  } = useModal(false, {});

  return (
    <>
      <AuthExpiredListener
        onOpen={openAuthModalAction}
        isOpen={isOpenAuthModal}
      />
      <SessionProvider>{children}</SessionProvider>

      {mounted && (
        <AuthModal
          isOpenAuthModal={isOpenAuthModal}
          onCloseAuthModal={closeAuthModal}
          onOpenAuthModal={openAuthModalAction}
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
