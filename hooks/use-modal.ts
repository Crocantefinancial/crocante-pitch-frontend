import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onClosePrevious?: () => void;
  onOpenPrevious?: () => void;
}

export function useModal(initial = false, opts?: UseModalOptions) {
  const [isOpen, setIsOpen] = useState(initial);

  // Memoize opts to prevent infinite loops when callbacks change
  const memoizedOpts = useMemo(
    () => opts,
    [opts?.onOpen, opts?.onClose, opts?.onClosePrevious, opts?.onOpenPrevious]
  );

  // Use refs to track previous state and call callbacks in useEffect
  const wasJustOpenedRef = useRef(false);
  const wasJustClosedRef = useRef(false);

  const toggle = useCallback(
    (next?: boolean) => {
      setIsOpen((prev: boolean) => {
        const value = typeof next === "boolean" ? next : !prev;
        // Call onClosePrevious in next microtask to avoid setState during render
        // but still before the modal actually closes
        if (!value && prev) {
          queueMicrotask(() => {
            memoizedOpts?.onClosePrevious?.();
          });
          wasJustClosedRef.current = true;
        } else if (value && !prev) {
          queueMicrotask(() => {
            memoizedOpts?.onOpenPrevious?.();
          });
          wasJustOpenedRef.current = true;
        }
        return value;
      });
    },
    [memoizedOpts]
  );

  // Call onOpen and onClose in useEffect to avoid setState during render
  useEffect(() => {
    if (wasJustOpenedRef.current) {
      wasJustOpenedRef.current = false;
      memoizedOpts?.onOpen?.();
    }
    if (wasJustClosedRef.current) {
      wasJustClosedRef.current = false;
      memoizedOpts?.onClose?.();
    }
  }, [isOpen, memoizedOpts]);

  const open = useCallback(() => toggle(true), [toggle]);
  const close = useCallback(() => toggle(false), [toggle]);

  return { isOpen, open, close, toggle, setIsOpen };
}
