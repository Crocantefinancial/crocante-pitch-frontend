import { useCallback, useEffect, useRef, useState } from "react";

export interface SelectorOptions<T> {
  [vaultId: string]: T;
}

export function useSelector<T>(
  options: SelectorOptions<T>,
  defaultIndex = 0,
  opts?: {
    onReset?: () => void;
    onChange?: () => void;
    onChangeReactive?: (selectedRow: T) => void;
  }
) {
  const defaultSelection = options[Object.keys(options)[defaultIndex]];
  const [selectedRow, setSelectedRow] = useState<T>(defaultSelection);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const optionsKeysRef = useRef<string>(
    JSON.stringify(Object.keys(options).sort())
  );

  // Auto-select first option when options change from empty to populated
  useEffect(() => {
    const currentKeys = JSON.stringify(Object.keys(options).sort());
    const previousKeys = optionsKeysRef.current;

    // Only reset if options actually changed (keys are different) or if it was empty before
    if (currentKeys !== previousKeys) {
      optionsKeysRef.current = currentKeys;
      if (Object.keys(options).length > 0) {
        const newDefaultSelection = options[Object.keys(options)[defaultIndex]];
        setSelectedRow(newDefaultSelection);
        setSelectedIndex(defaultIndex);
        opts?.onReset?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, defaultIndex]);

  const change = useCallback(
    (key: string | React.ChangeEvent<HTMLSelectElement>) => {
      if (typeof key !== "string") {
        key = key.target.value;
      }
      setSelectedRow(options[key]);
      setSelectedIndex(Object.keys(options).indexOf(key));
      opts && opts.onChange?.();
      opts && opts.onChangeReactive?.(options[key]);
    },
    [options, opts]
  );

  const reset = useCallback(() => {
    const newDefaultSelection = options[Object.keys(options)[defaultIndex]];
    setSelectedRow(newDefaultSelection);
    setSelectedIndex(defaultIndex);
    opts && opts.onReset?.();
  }, [options, defaultIndex, opts]);

  const getNextRow = useCallback(() => {
    const keys = Object.keys(options);
    if (keys.length <= 1) return selectedRow;

    const currentIndex = keys.findIndex((key) => options[key] === selectedRow);
    const nextIndex = (currentIndex + 1) % keys.length;
    const nextKey = keys[nextIndex];

    return options[nextKey];
  }, [options, selectedRow]);

  return { selectedRow, selectedIndex, getNextRow, change, reset };
}
