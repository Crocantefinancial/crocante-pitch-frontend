import { Modal } from "@/components/index";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Account, Fondos, Info, OTP, RegisterHeader } from "./index";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onCancel: () => void;
}

// Define valid register step indices as a const array
// This ensures type safety and exhaustiveness checking
const REGISTER_STEP_INDICES = [0, 1, 2, 3, 4] as const;
type RegisterStepIndex = (typeof REGISTER_STEP_INDICES)[number];

export default function RegisterModal({
  open,
  onClose,
  onCancel,
}: RegisterModalProps) {
  const navLength = REGISTER_STEP_INDICES.length;

  const [selectedIndex, setSelectedIndex] = useState<
    RegisterStepIndex | undefined
  >(undefined);
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

  const handleSelect = (index: RegisterStepIndex) => {
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

  const handleInfo = () => {
    handleSelect(3);
  };

  const handleAssets = () => {
    handleSelect(4);
  };

  const updateCurrentRegisterStepComponentByIndex = (
    index: RegisterStepIndex
  ): void => {
    // Clamp index to valid range [0, navLength]
    const clampedIndex = Math.max(
      0,
      Math.min(index, navLength)
    ) as RegisterStepIndex;

    // TypeScript will error if switch doesn't handle all cases
    switch (clampedIndex) {
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
        currentComponentRef.current.title = "Personal Information";
        currentComponentRef.current.subtitle =
          "Please fill in the following information.";
        currentComponentRef.current.component = (
          <Info onCancel={onCancel} onRegister={handleInfo} />
        );
        break;
      case 3:
        currentComponentRef.current.title = "Assets Origin";
        currentComponentRef.current.subtitle =
          "Please select the origin of your assets.";
        currentComponentRef.current.component = (
          <Fondos onCancel={onCancel} onRegister={handleAssets} />
        );
        break;
      case 4:
        currentComponentRef.current.title = "KYC Documents";
        currentComponentRef.current.subtitle =
          "Please upload the following documents.";
        currentComponentRef.current.component = (
          <Fondos onCancel={onCancel} onRegister={handleAssets} />
        );
        break;
      default: {
        // Exhaustiveness check: TypeScript will error if a case is missing
        const _exhaustive: never = clampedIndex;
        currentComponentRef.current = defaultComponent;
        break;
      }
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
            onSelect={(index: number) =>
              handleSelect(index as RegisterStepIndex)
            }
            navLength={navLength}
          />

          {currentComponentRef.current.component}
        </div>
      </Modal>
    )
  );
}
