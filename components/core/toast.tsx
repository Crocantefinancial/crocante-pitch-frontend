"use client";

import clsx from "clsx";
import { AlertCircleIcon, CheckIcon, InfoIcon, XIcon } from "lucide-react";
import { useEffect } from "react";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

interface ToastProps {
  show: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  show,
  message,
  type = ToastType.INFO,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return <CheckIcon />;
      case ToastType.ERROR:
        return <AlertCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return "bg-lime-400/10";
      case ToastType.ERROR:
        return "bg-red-400/10";
      default:
        return "bg-blue-400/10";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideUp">
      <div
        className={clsx(`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border border-border-light shadow-lg`,
          getBackgroundColor()
        )}
      >
        <div className="flex-shrink-0">{getIcon()}</div>
        <p className="text-sm text-foreground-light">
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-muted hover:text-foreground-light transition-colors"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
}
