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

// Helper to check if an appointment date has passed (GMT-3 timezone)
const isAppointmentPast = (dateStr: string, timeStr: string): boolean => {
  // Get current time in GMT-3
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gmt3Now = new Date(utcTime - (3 * 60 * 60 * 1000));

  // Parse appointment date
  let appointmentDate: Date;

  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    // DD/MM/YYYY format
    const [day, month, year] = dateStr.split('/').map(Number);
    appointmentDate = new Date(year, month - 1, day);
  } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // YYYY-MM-DD format
    appointmentDate = new Date(dateStr);
  } else {
    appointmentDate = new Date(dateStr);
  }

  // Add time to the date
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);
  } else {
    // If no time specified, assume end of day
    appointmentDate.setHours(23, 59, 59, 999);
  }

  return appointmentDate < gmt3Now;
};

export function useAppointmentsFilter(
  appointments: Appointment[]
): UseAppointmentsFilterResult {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Process appointments to auto-mark past ones as completed
  const processedAppointments = useMemo(() => {
    return appointments.map(apt => {
      // Only auto-complete if currently scheduled and date has passed
      if (apt.status === "scheduled" && isAppointmentPast(apt.date, apt.time)) {
        return { ...apt, status: "completed" as AppointmentStatus };
      }
      return apt;
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (selectedFilter === "all") {
      return processedAppointments;
    }
    return processedAppointments.filter((apt) => apt.status === selectedFilter);
  }, [processedAppointments, selectedFilter]);

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
