"use client";

import { Modal } from "@/components/index";
import envParsed from "@/config/envParsed";
import { AuthExpiredListener } from "@/context/auth-expired-listener";
import { useModal } from "@/hooks/use-modal";
import useMounted from "@/hooks/use-mounted";
import { useLogin } from "@/services/hooks/mutations/use-login";
//import { resetAuthExpired } from "@/services/react-query/auth-expired";
import { queryClient } from "@/services/react-query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { SessionProvider, useSession } from "./session-provider";

const { TESTING_USERNAME, TESTING_PASSWORD } = envParsed();

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const { mutate: loginMutation } = useLogin();

  const {
    isOpen: isOpenSessionExpiredModal,
    open: openSessionExpiredModalAction,
    close: closeSessionExpiredModal,
  } = useModal(false, {});

  useEffect(() => {
    if (
      isOpenSessionExpiredModal &&
      mounted &&
      TESTING_USERNAME &&
      TESTING_PASSWORD
    ) {
      loginMutation({
        username: TESTING_USERNAME,
        password: TESTING_PASSWORD,
      });
    }
  }, [isOpenSessionExpiredModal, mounted, loginMutation]);

  /* const { isSignedIn } = useSession();

  useEffect(() => {
    // If we re-authenticated while the modal is open, close it and reset the latch.
    if (mounted && isOpenSessionExpiredModal && isSignedIn) {
      closeSessionExpiredModal();
      resetAuthExpired();
    }
  }, [
    mounted,
    isOpenSessionExpiredModal,
    isSignedIn,
    closeSessionExpiredModal,
  ]); */

  return (
    <>
      <AuthExpiredListener
        onOpen={openSessionExpiredModalAction}
        isOpen={isOpenSessionExpiredModal}
      />
      <SessionProvider>{children}</SessionProvider>

      {mounted && (
        <Modal
          open={isOpenSessionExpiredModal}
          onClose={closeSessionExpiredModal}
          title="Session Expired"
          icon={<AlertCircle className="w-5 h-5 text-muted-foreground" />}
        >
          <div>
            <p>Your session has expired. Please log in again.</p>
          </div>
        </Modal>
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
