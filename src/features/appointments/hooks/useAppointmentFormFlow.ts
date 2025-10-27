import { useState, useEffect, useMemo, useCallback } from "react";

type FormStep = "datetime" | "doctor" | "patient";

interface UseAppointmentFormFlowProps {
  currentStep: FormStep;
  showSummaryCard: boolean;
  selectedDateValue?: string;
  selectedTimeValue?: string;
}

interface UseAppointmentFormFlowResult {
  // Step navigation
  steps: FormStep[];
  currentStepIndex: number;
  progress: number;
  stepTitles: Record<FormStep, string>;

  // Summary card scroll tracking
  hasScrolledToSummary: boolean;
  handleScroll: (event: any) => void;
  showNextButton: boolean;
}

/**
 * Hook that manages the appointment form flow logic
 * Handles step progression, progress calculation, scroll tracking, and UI state
 *
 * @param currentStep - Current form step
 * @param showSummaryCard - Whether the summary card should be shown
 * @param selectedDateValue - Selected date value (for summary card)
 * @param selectedTimeValue - Selected time value (for summary card)
 * @returns Form flow state and handlers
 *
 * @example
 * ```typescript
 * const {
 *   progress,
 *   stepTitles,
 *   handleScroll,
 *   showNextButton,
 * } = useAppointmentFormFlow({
 *   currentStep,
 *   showSummaryCard: !!date && !!time,
 *   selectedDateValue: date,
 *   selectedTimeValue: time,
 * });
 * ```
 */
export function useAppointmentFormFlow({
  currentStep,
  showSummaryCard,
}: UseAppointmentFormFlowProps): UseAppointmentFormFlowResult {
  const [hasScrolledToSummary, setHasScrolledToSummary] = useState(false);

  // Define step order and titles
  const steps: FormStep[] = useMemo(
    () => ["datetime", "doctor", "patient"],
    []
  );

  const stepTitles: Record<FormStep, string> = useMemo(
    () => ({
      datetime: "Fecha y Horario",
      doctor: "Seleccionar Profesional",
      patient: "Datos del Paciente",
    }),
    []
  );

  // Calculate current progress
  const currentStepIndex = useMemo(
    () => steps.indexOf(currentStep),
    [steps, currentStep]
  );

  const progress = useMemo(
    () => ((currentStepIndex + 1) / steps.length) * 100,
    [currentStepIndex, steps.length]
  );

  // Reset scroll state when summary card visibility changes or step changes
  useEffect(() => {
    if (!showSummaryCard || currentStep !== "datetime") {
      setHasScrolledToSummary(false);
    }
  }, [showSummaryCard, currentStep]);

  // Handle scroll event to detect when user has seen the summary card
  const handleScroll = useCallback(
    (event: any) => {
      if (!showSummaryCard) return;

      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const scrollPosition = contentOffset.y;
      const scrollViewHeight = layoutMeasurement.height;
      const contentHeight = contentSize.height;

      // Calculate scroll percentage (60% threshold to consider "seen")
      const scrollPercentage = (scrollPosition + scrollViewHeight) / contentHeight;

      if (scrollPercentage > 0.6) {
        setHasScrolledToSummary(true);
      }
    },
    [showSummaryCard]
  );

  // Determine if next button should be shown
  // On datetime step: only show after user has scrolled to summary card
  // On other steps: always show
  const showNextButton = useMemo(() => {
    if (currentStep === "datetime") {
      return showSummaryCard && hasScrolledToSummary;
    }
    return true;
  }, [currentStep, showSummaryCard, hasScrolledToSummary]);

  return {
    steps,
    currentStepIndex,
    progress,
    stepTitles,
    hasScrolledToSummary,
    handleScroll,
    showNextButton,
  };
}
