import { useCallback, useMemo, useState } from "react";

export function useModal(
  initial = false,
  opts?: { onOpen?: () => void; onClose?: () => void }
) {
  const [isOpen, setIsOpen] = useState(initial);

  // Memoize opts to prevent infinite loops when callbacks change
  const memoizedOpts = useMemo(() => opts, [opts?.onOpen, opts?.onClose]);

  const toggle = useCallback(
    (next?: boolean) => {
      setIsOpen((prev: boolean) => {
        const value = typeof next === "boolean" ? next : !prev;
        value ? memoizedOpts?.onOpen?.() : memoizedOpts?.onClose?.();
        return value;
      });
    },
    [memoizedOpts]
  );

  const open = useCallback(() => toggle(true), [toggle]);
  const close = useCallback(() => toggle(false), [toggle]);

  return { isOpen, open, close, toggle, setIsOpen };
}
