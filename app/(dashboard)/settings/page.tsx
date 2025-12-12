"use client";

import { SettingsSection } from "@/domain/settings-section";
import { useCustomHeader } from "@/context/custom-header-context";

export default function SettingsPage() {
  const { setCustomAdditionalHeader } = useCustomHeader();
  return <SettingsSection setCustomAdditionalHeader={setCustomAdditionalHeader} />;
}

