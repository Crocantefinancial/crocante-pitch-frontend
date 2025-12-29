import { Modal } from "@/components/index";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Account, Info, OTP, RegisterHeader } from "./register";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export default function RegisterModal({
  open,
  onClose,
  onCancel,
}: RegisterModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined
  );
  interface CurrentComponent {
    title: string;
    subtitle: string;
    component: React.ReactNode;
  }

  const defaultComponent: CurrentComponent = {
    title: "",
    subtitle: "",
    component: null,
  };
  const currentComponentRef = useRef<CurrentComponent>(defaultComponent);

  const handleSelect = (index: number) => {
    updateCurrentRegisterStepComponentByIndex(index);
    setSelectedIndex(index);
  };

  const handleRegister = () => {
    handleSelect(1);
  };

  const handleVerify = (code: string) => {
    console.log("handleVerify", code);
    handleSelect(2);
  };

  const handleResend = () => {
    handleSelect(1);
  };

  const updateCurrentRegisterStepComponentByIndex = (index: number) => {
    switch (index) {
      case 0:
        currentComponentRef.current.title = "Register New Account";
        currentComponentRef.current.subtitle =
          "Please fill in the following information to register a new account.";
        currentComponentRef.current.component = (
          <Account onCancel={onCancel} onRegister={handleRegister} />
        );
        break;
      case 1:
        currentComponentRef.current.title = "Verify Your Email";
        currentComponentRef.current.subtitle =
          "Please enter the OTP code sent to your email.";
        currentComponentRef.current.component = (
          <OTP
            onCancel={onCancel}
            onVerify={handleVerify}
            onResend={handleResend}
          />
        );
        break;
      case 2:
        currentComponentRef.current.title = "Complete Registration";
        currentComponentRef.current.subtitle =
          "Please fill in the following information to complete your registration.";
        currentComponentRef.current.component = (
          <Info onCancel={onCancel} onRegister={handleRegister} />
        );
        break;
      default:
        currentComponentRef.current = defaultComponent;
        break;
    }
  };

  useEffect(() => {
    if (open) {
      handleSelect(0);
    }
  }, [open]);

  return (
    selectedIndex !== undefined && (
      <Modal
        open={open}
        onClose={onClose}
        title={currentComponentRef.current.title}
        icon={<AlertCircle className="w-5 h-5 text-muted-foreground" />}
        blockClose
      >
        <div>
          <RegisterHeader
            title={currentComponentRef.current.subtitle}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />

          {currentComponentRef.current.component}
        </div>
      </Modal>
    )
  );
}
