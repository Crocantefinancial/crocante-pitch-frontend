import { Button, Input } from "@/components/index";
import { useEffect, useRef, useState } from "react";

interface OTPComponentProps {
  onCancel: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
}

export default function OTP({
  onCancel,
  onVerify,
  onResend,
}: OTPComponentProps) {
  const OTP_LENGTH = 6;
  const [otpCodes, setOtpCodes] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const inputRefs = Array.from({ length: OTP_LENGTH }, () =>
    useRef<HTMLInputElement>(null)
  );

  const handleChange = (index: number, value: string) => {
    // Only allow single character
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const previousValue = otpCodes[index];
    const newOtpCodes = [...otpCodes];
    newOtpCodes[index] = value;
    setOtpCodes(newOtpCodes);

    // Move to next input if a character was entered and it's different from before
    if (
      value.length === 1 &&
      value !== previousValue &&
      index < OTP_LENGTH - 1
    ) {
      // Use requestAnimationFrame for reliable focus after React update
      requestAnimationFrame(() => {
        const nextInput = inputRefs[index + 1].current;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      });
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && otpCodes[index] === "" && index > 0) {
      e.preventDefault();
      inputRefs[index - 1].current?.focus();
      inputRefs[index - 1].current?.select();
    }
  };

  const processPastedText = (text: string) => {
    const pastedText = text.trim();

    // Extract only alphanumeric characters and take first OTP_LENGTH characters
    const cleanedText = pastedText
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, OTP_LENGTH);

    if (cleanedText.length > 0) {
      const newOtpCodes = Array(OTP_LENGTH).fill("");
      // Fill inputs with pasted characters
      for (let i = 0; i < cleanedText.length && i < OTP_LENGTH; i++) {
        newOtpCodes[i] = cleanedText[i];
      }
      setOtpCodes(newOtpCodes);

      // Focus the last filled input or the last input if all are filled
      const focusIndex = Math.min(cleanedText.length - 1, OTP_LENGTH - 1);
      requestAnimationFrame(() => {
        inputRefs[focusIndex].current?.focus();
        inputRefs[focusIndex].current?.select();
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    processPastedText(pastedText);
  };

  const handlePasteButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      processPastedText(text);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.error("Failed to read clipboard:", err);
    }
  };

  // Focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (otpCodes.every((code) => code.length === 1)) {
      onVerify(otpCodes.join("").trim());
    }
  }, [otpCodes, onVerify]);

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between gap-2 mt-8">
        {otpCodes.map((code, index) => (
          <Input
            key={index}
            type="text"
            value={code}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-1/6"
            ref={inputRefs[index]}
          />
        ))}
      </div>

      <div className="flex flex-row justify-between mt-4 gap-2">
        <div className="flex flex-row gap-2">
          <Button variant="primary" onClick={onResend}>
            Resend OTP Code
          </Button>
          <Button variant="outline" onClick={handlePasteButton}>
            Paste
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
