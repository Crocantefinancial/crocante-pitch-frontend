import { useModal } from "@/hooks/use-modal";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

interface AuthModalProps {
  isOpenAuthModal: boolean;
  onCloseAuthModal: () => void;
  onOpenAuthModal: () => void;
}

export default function AuthModal({
  isOpenAuthModal,
  onCloseAuthModal,
  onOpenAuthModal,
}: AuthModalProps) {
  const {
    isOpen: isOpenRegisterModal,
    open: openRegisterModalAction,
    close: closeRegisterModal,
  } = useModal(false, { onClosePrevious: onOpenAuthModal });

  return (
    <>
      <LoginModal
        open={isOpenAuthModal}
        onClose={onCloseAuthModal}
        onRegister={openRegisterModalAction}
      />
      <RegisterModal
        open={isOpenRegisterModal}
        onClose={closeRegisterModal}
        onCancel={closeRegisterModal}
      />
    </>
  );
}
