import { useMemo } from "react";
import { Appointment } from "../types";

interface StatusConfig {
  text: string;
  color: string;
  icon: "schedule" | "check-circle" | "cancel" | "info";
}

interface UseAppointmentCardResult {
  statusConfig: StatusConfig;
  dayName: string;
  formattedDate: string;
  canEdit: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
}

// Format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateStr: string): string => {
  let formattedDate = dateStr;

  // Convert to DD/MM/YYYY if needed
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-");
    formattedDate = `${day}/${month}/${year}`;
  }

  return formattedDate;
};

// Get day name from date string
const getDayName = (dateStr: string): string => {
  try {
    let date: Date;

    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateStr.split("/");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateStr);
    } else {
      return "";
    }

    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return days[date.getDay()];
  } catch {
    return "";
  }
};

const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "scheduled":
      return {
        text: "Programado",
        color: "#007AFF",
        icon: "schedule",
      };
    case "completed":
      return {
        text: "Completado",
        color: "#34C759",
        icon: "check-circle",
      };
    case "cancelled":
      return {
        text: "Cancelado",
        color: "#FF3B30",
        icon: "cancel",
      };
    default:
      return {
        text: status,
        color: "#8E8E93",
        icon: "info",
      };
  }
};

export function useAppointmentCard(appointment: Appointment): UseAppointmentCardResult {
  const statusConfig = useMemo(
    () => getStatusConfig(appointment.status),
    [appointment.status]
  );

  const dayName = useMemo(
    () => getDayName(appointment.date),
    [appointment.date]
  );

  const formattedDate = useMemo(
    () => formatDate(appointment.date),
    [appointment.date]
  );

  const isCompleted = appointment.status === "completed";
  const isCancelled = appointment.status === "cancelled";
  const canEdit = !isCompleted && !isCancelled;

  return {
    statusConfig,
    dayName,
    formattedDate,
    canEdit,
    isCompleted,
    isCancelled,
  };
}
