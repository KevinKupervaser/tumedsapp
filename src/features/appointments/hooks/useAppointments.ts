import { appointmentsAPI } from "@/src/features/appointments/services";
import { AppointmentFormData } from "@/src/shared/types/common.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentsAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: appointmentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Alert.alert("Exito!", "Turno medico creado con exito");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create appointment");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AppointmentFormData>;
    }) => appointmentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Alert.alert("Exito!", "Turno medico actualizado con exito");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.message || "Error al actualizar el turno medico"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: appointmentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      Alert.alert("Exito!", "Turno medico borrado con exito");
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Error al borrar turno medico");
    },
  });

  return {
    appointments,
    isLoading,
    isError,
    error,
    refetch,
    createAppointment: createMutation.mutateAsync,
    updateAppointment: updateMutation.mutateAsync,
    deleteAppointment: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
