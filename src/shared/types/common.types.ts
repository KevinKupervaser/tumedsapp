export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  email: string;
  token: string;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  observations?: string; // Optional field
  status: AppointmentStatus;
}

export interface AppointmentFormData {
  patient: string;
  doctor: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  observations?: string; // Optional field
  status: AppointmentStatus;
}

// Helper function to validate status
export function isValidStatus(status: string): status is AppointmentStatus {
  return ["scheduled", "completed", "cancelled"].includes(status);
}

// Helper to sanitize appointment from API
export function sanitizeAppointment(data: any): Appointment {
  return {
    id: data.id || "",
    patient: data.patient || "",
    doctor: data.doctor || "",
    date: data.date || "",
    time: data.time || "",
    phone: data.phone || "",
    email: data.email || "",
    observations: data.observations || "",
    status: isValidStatus(data.status) ? data.status : "scheduled",
  };
}
