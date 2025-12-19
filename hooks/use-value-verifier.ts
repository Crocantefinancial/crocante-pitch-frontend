import { useEffect, useState } from "react";

interface UseValueVerifierProps {
  value: string;
  min?: number;
  max?: number;
  requireNonZero?: boolean;
}

export function useValueVerifier({
  value,
  min,
  max,
  requireNonZero = true,
}: UseValueVerifierProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if value exists and is not empty
    if (!value || value.trim() === "") {
      setIsValid(false);
      return;
    }

    const numValue = Number(value);

    // Check if value is a valid number
    if (isNaN(numValue) || !isFinite(numValue)) {
      setIsValid(false);
      return;
    }

    // Check if value is greater than 0 (if required)
    if (requireNonZero && numValue <= 0) {
      setIsValid(false);
      return;
    }

    // Check min constraint (if provided)
    if (min !== undefined && numValue < min) {
      setIsValid(false);
      return;
    }

    // Check max constraint (if provided)
    if (max !== undefined && numValue > max) {
      setIsValid(false);
      return;
    }

    // All checks passed
    setIsValid(true);
  }, [value, min, max, requireNonZero]);

  return { isValid };
}
