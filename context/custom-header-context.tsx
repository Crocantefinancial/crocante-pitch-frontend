"use client";

import { createContext, useContext } from "react";

const CustomHeaderContext = createContext<{
  setCustomAdditionalHeader: (header: React.ReactNode) => void;
} | null>(null);

export function CustomHeaderProvider({
  children,
  setCustomAdditionalHeader,
}: {
  children: React.ReactNode;
  setCustomAdditionalHeader: (header: React.ReactNode) => void;
}) {
  return (
    <CustomHeaderContext.Provider value={{ setCustomAdditionalHeader }}>
      {children}
    </CustomHeaderContext.Provider>
  );
}

export function useCustomHeader() {
  const context = useContext(CustomHeaderContext);
  if (!context) {
    throw new Error("useCustomHeader must be used within CustomHeaderProvider");
  }
  return context;
}

