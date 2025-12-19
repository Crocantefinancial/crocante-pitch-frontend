import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

// Helper function to parse value string (e.g., "$25M" -> "25000000", "$1,000" -> "1000")
export function parseValue(valueStr: string): string {
  if (!valueStr) return "0";

  // Remove $ prefix if present
  let cleaned = valueStr.replace(/^\$/, "");

  // Remove commas
  cleaned = cleaned.replace(/,/g, "");

  // Check if it ends with M (millions)
  const hasM = cleaned.toUpperCase().endsWith("M");
  if (hasM) {
    // Remove M suffix
    cleaned = cleaned.replace(/M$/i, "");
    // Convert to number, multiply by 1,000,000, then back to string
    const numValue = Number(cleaned);
    if (isNaN(numValue) || !isFinite(numValue)) return "0";
    return (numValue * 1000000).toString();
  }

  // If no M, just return the numeric value
  const numValue = Number(cleaned);
  return isNaN(numValue) || !isFinite(numValue) ? "0" : numValue.toString();
}
