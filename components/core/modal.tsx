import { useIsMobile } from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { XIcon as CloseIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export default function Modal({
  title,
  icon,
  statusIcon,
  open,
  onClose,
  children,
  className,
  actions,
  blockClose,
}: {
  title: string;
  icon?: React.ReactNode;
  statusIcon?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  actions?: () => React.ReactNode;
  blockClose?: boolean;
}) {
  const isMobile = useIsMobile();

  if (!open) return null;

  const modalContent = (
    <div
      className={clsx(
        "fixed inset-0 bg-black/50 backdrop-blur-[2px] flex justify-center z-[9999]",
        isMobile ? "items-end p-0" : "items-center p-4"
      )}
      onClick={blockClose ? undefined : onClose}
    >
      <div
        className={clsx(
          "w-full max-w-2xl border-2 overflow-hidden \
          bg-white border-secondary animate-slideUp",
          isMobile ? "rounded-t-2xl p-4 mx-0" : "rounded-2xl p-6 mx-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={clsx(
            "flex justify-between items-center",
            isMobile ? "mb-4" : "mb-3"
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            {icon && (
              <div
                className={clsx("flex-shrink-0", isMobile ? "mr-4" : "mr-2")}
              >
                {icon}
              </div>
            )}
            <h3
              className={clsx(
                "font-montserrat font-bold leading-none text-textLight truncate",
                isMobile ? "text-2xl" : "text-lg"
              )}
            >
              {title}
            </h3>
            {statusIcon && (
              <div
                className={clsx("flex-shrink-0", isMobile ? "ml-4" : "ml-2")}
              >
                {statusIcon}
              </div>
            )}
          </div>
          {!blockClose && (
            <button
              onClick={onClose}
              type="button"
              className="p-1 bg-transparent border-0 outline-none hover:outline-none focus:outline-none active:outline-none group flex-shrink-0 ml-2"
            >
              <CloseIcon className="w-5 h-5 transition-all stroke-[1] group-hover:stroke-[2]" />
            </button>
          )}
        </div>
        <div
          className={clsx(
            "overflow-y-auto",
            isMobile ? "space-y-4 max-h-[80vh]" : "space-y-3 max-h-[75vh]"
          )}
        >
          {children}
          {actions && (
            <div
              className={clsx(
                "flex flex-row w-full",
                isMobile ? "space-x-3" : "space-x-2"
              )}
            >
              {actions()}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to ensure it appears above all other content
  return createPortal(modalContent, document.body);
}
