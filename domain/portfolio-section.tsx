"use client";

import { CustomAdditionalHeader } from "@/domain/portfolio/components";
import Portfolio from "@/domain/portfolio/portfolio";
import { useEffect } from "react";

interface PortfolioSectionProps {
  setCustomAdditionalHeader: (header: React.ReactNode) => void;
}

export function PortfolioSection({
  setCustomAdditionalHeader,
}: PortfolioSectionProps) {
  useEffect(() => {
    setCustomAdditionalHeader(<CustomAdditionalHeader />);
  }, [setCustomAdditionalHeader]);

  return <Portfolio />;
}
