import { Button } from "@/components/index";
import clsx from "clsx";
import { useRef, useState } from "react";

interface DynamicAvatarButtonProps {
  icon: React.ReactNode;
  iconHover: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}

export default function DynamicAvatarButton({
  icon,
  iconHover,
  onClick,
  disabled,
}: DynamicAvatarButtonProps) {
  const [currentIcon, setCurrentIcon] = useState(icon);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationKey, setRotationKey] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isRotatingRef = useRef(false);

  const handleMouseEnter = () => {
    // Prevent multiple rotations while already rotating
    if (isRotatingRef.current) return;

    isRotatingRef.current = true;
    setIsRotating(true);
    // Change icon at 180 degrees (midpoint) when it's not visible
    const timeout1 = setTimeout(() => {
      setCurrentIcon(iconHover);
    }, 300); // Half rotation duration
    // Reset rotation state and force remount after full rotation completes
    const timeout2 = setTimeout(() => {
      setIsRotating(false);
      // Force remount to reset transform without reverse animation
      setRotationKey((prev) => prev + 1);
      // Allow next rotation after a brief delay to ensure remount completes
      setTimeout(() => {
        isRotatingRef.current = false;
      }, 50);
    }, 600); // Full rotation duration

    timeoutsRef.current = [timeout1, timeout2];
  };

  const handleMouseLeave = () => {
    setCurrentIcon(icon);
    // Clear any pending timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
    setIsRotating(false);
    isRotatingRef.current = false;
  };

  return (
    <Button
      variant="avatar-outline"
      className="w-10 h-10 !rounded-full justify-center"
      onClick={() => {
        onClick();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      <div
        key={rotationKey}
        className={clsx(
          "transition-transform duration-[600ms] ease-in-out",
          isRotating && "rotate-[360deg]"
        )}
      >
        {currentIcon}
      </div>
    </Button>
  );
}
