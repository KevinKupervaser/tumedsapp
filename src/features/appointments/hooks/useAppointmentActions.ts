
import { Appointment } from "@/src/shared/types/common.types";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

interface UseAppointmentActionsResult {
  handleEdit: (appointment: Appointment) => void;
  handleDelete: (
    id: string,
    deleteFn: (id: string) => Promise<void>
  ) => Promise<void>;
  handleCreate: () => void;
}

export function useAppointmentActions(): UseAppointmentActionsResult {
  const router = useRouter();

  const handleEdit = useCallback(
    (appointment: Appointment) => {
      router.push({
        pathname: "/(protected)/appointment-form",
        params: {
          id: appointment.id,
          patient: appointment.patient,
          doctor: appointment.doctor,
          date: appointment.date,
          status: appointment.status,
        },
      });
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, deleteFn: (id: string) => Promise<void>) => {
      return new Promise<void>((resolve) => {
        Alert.alert(
          "Eliminar",
          "¿Estás seguro que deseas eliminar esta cita?",
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve() },
            {
              text: "Eliminar",
              style: "destructive",
              onPress: async () => {
                await deleteFn(id);
                resolve();
              },
            },
          ]
        );
      });
    },
    []
  );

  const handleCreate = useCallback(() => {
    router.push("/(protected)/appointment-form");
  }, [router]);

  return {
    handleEdit,
    handleDelete,
    handleCreate,
  };
}
