import { useMemo } from "react";

type TimePeriod = "morning" | "afternoon";

interface PeriodFormatting {
  periodText: string;           // "mañana" | "tarde"
  periodTextCapitalized: string; // "Mañana" | "Tarde"
  periodIcon: "wb-sunny" | "nights-stay";
  gradientColors: [string, string];
}

/**
 * Hook that provides formatting and visual configuration for time periods
 * @param period - The time period ("morning" or "afternoon")
 * @returns Formatted text, icons, and gradient colors for the period
 */
export function usePeriodFormatting(period: TimePeriod): PeriodFormatting {
  const periodText = period === "morning" ? "mañana" : "tarde";

  const periodTextCapitalized = useMemo(
    () => periodText.charAt(0).toUpperCase() + periodText.slice(1),
    [periodText]
  );

  const periodIcon = period === "morning" ? "wb-sunny" : "nights-stay";

  const gradientColors: [string, string] = useMemo(
    () => (period === "morning" ? ["#FFA726", "#FF6F00"] : ["#5C6BC0", "#3949AB"]),
    [period]
  );

  return {
    periodText,
    periodTextCapitalized,
    periodIcon,
    gradientColors,
  };
}
