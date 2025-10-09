import {
  Appointment,
  AppointmentFormData,
  sanitizeAppointment,
} from "../types";
import api from "./api";

export const appointmentsAPI = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get<any[]>("/appointments");
    // Sanitize all appointments from API
    return response.data.map(sanitizeAppointment);
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<any>(`/appointments/${id}`);
    return sanitizeAppointment(response.data);
  },

  create: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post<any>("/appointments", data);
    return sanitizeAppointment(response.data);
  },

  update: async (
    id: string,
    data: Partial<AppointmentFormData>
  ): Promise<Appointment> => {
    const response = await api.put<any>(`/appointments/${id}`, data);
    return sanitizeAppointment(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
