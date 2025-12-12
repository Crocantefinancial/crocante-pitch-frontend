"use client";

import { PortfolioSection } from "@/domain/portfolio-section";
import { useCustomHeader } from "@/context/custom-header-context";

export default function PortfolioPage() {
  const { setCustomAdditionalHeader } = useCustomHeader();
  return <PortfolioSection setCustomAdditionalHeader={setCustomAdditionalHeader} />;
}

