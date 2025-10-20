import {
  Appointment,
  AppointmentStatus,
} from "@shared/types/common.types";
import { useMemo, useState } from "react";

type FilterType = AppointmentStatus | "all";

interface UseAppointmentsFilterResult {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  filteredAppointments: Appointment[];
  getFilterLabel: (filter: FilterType) => string;
  getFilterIcon: (filter: FilterType) => string;
  filters: FilterType[];
}

export function useAppointmentsFilter(
  appointments: Appointment[]
): UseAppointmentsFilterResult {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  const filteredAppointments = useMemo(() => {
    if (selectedFilter === "all") {
      return appointments;
    }
    return appointments.filter((apt) => apt.status === selectedFilter);
  }, [appointments, selectedFilter]);

  const getFilterLabel = (filter: FilterType): string => {
    switch (filter) {
      case "all":
        return "Todas";
      case "scheduled":
        return "Programadas";
      case "completed":
        return "Completadas";
      case "cancelled":
        return "Canceladas";
    }
  };

  const getFilterIcon = (filter: FilterType): string => {
    switch (filter) {
      case "all":
        return "list";
      case "scheduled":
        return "schedule";
      case "completed":
        return "check-circle";
      case "cancelled":
        return "cancel";
    }
  };

  const filters: FilterType[] = ["all", "scheduled", "completed", "cancelled"];

  return {
    selectedFilter,
    setSelectedFilter,
    filteredAppointments,
    getFilterLabel,
    getFilterIcon,
    filters,
  };
}
