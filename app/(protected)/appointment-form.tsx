import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppointments } from "@/hooks/useAppointments";
import { useTheme } from "@/hooks/useTheme";
import { AppointmentFormData } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function AppointmentFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createAppointment, updateAppointment, isCreating, isUpdating } =
    useAppointments();
  const { theme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointmentId = params.id as string | undefined;
  const isEditMode = !!appointmentId;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      patient: "",
      doctor: "",
      date: "",
      status: "scheduled",
    },
  });

  useEffect(() => {
    if (isEditMode && params && params.id) {
      // Only run once when component mounts in edit mode
      const patientValue = (params.patient as string) || "";
      const doctorValue = (params.doctor as string) || "";
      const dateStr = (params.date as string) || "";
      const statusParam = params.status as string;

      setValue("patient", patientValue);
      setValue("doctor", doctorValue);

      // Only parse valid date format DD/MM/YYYY
      if (dateStr && dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        try {
          const [day, month, year] = dateStr.split("/").map(Number);
          const parsedDate = new Date(year, month - 1, day);

          // Verify date is valid
          if (
            parsedDate.getDate() === day &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getFullYear() === year &&
            !isNaN(parsedDate.getTime())
          ) {
            setSelectedDate(parsedDate);
            setValue("date", dateStr);
          } else {
            // Invalid date, use today
            setSelectedDate(new Date());
            setValue("date", formatDate(new Date()));
          }
        } catch (error) {
          console.error("Date parsing error:", error);
          setSelectedDate(new Date());
          setValue("date", formatDate(new Date()));
        }
      } else {
        // No valid date, use today
        setSelectedDate(new Date());
        setValue("date", formatDate(new Date()));
      }

      // Validate status
      const validStatus = ["scheduled", "completed", "cancelled"].includes(
        statusParam
      )
        ? (statusParam as "scheduled" | "completed" | "cancelled")
        : "scheduled";

      setValue("status", validStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, params?.id]); // Only depend on isEditMode and params.id

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setValue("date", formatDate(date));
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      if (isEditMode && appointmentId) {
        await updateAppointment({ id: appointmentId, data });
      } else {
        await createAppointment(data);
      }
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <ThemedText type="title">
          {isEditMode ? "Editar" : "Nuevo"} Turno
        </ThemedText>
        <ThemedView style={{ width: 24 }} />
      </ThemedView>

      <ScrollView style={styles.form}>
        {/* Patient */}
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Nombre del Paciente *</ThemedText>
          <Controller
            control={control}
            name="patient"
            rules={{ required: "El nombre del paciente es requerido" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.card, color: theme.text },
                ]}
                placeholder="Ingrese nombre del paciente"
                placeholderTextColor={theme.textSecondary}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.patient && (
            <ThemedText style={[styles.error, { color: theme.error }]}>
              {errors.patient.message}
            </ThemedText>
          )}
        </ThemedView>

        {/* Doctor */}
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Nombre del Doctor *</ThemedText>
          <Controller
            control={control}
            name="doctor"
            rules={{ required: "El nombre del doctor es requerido" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.card, color: theme.text },
                ]}
                placeholder="Ingrese nombre del doctor"
                placeholderTextColor={theme.textSecondary}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.doctor && (
            <ThemedText style={[styles.error, { color: theme.error }]}>
              {errors.doctor.message}
            </ThemedText>
          )}
        </ThemedView>

        {/* Date with Picker */}
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Fecha *</ThemedText>
          <Controller
            control={control}
            name="date"
            rules={{
              required: "La fecha es requerida",
              pattern: {
                value: /^\d{2}\/\d{2}\/\d{4}$/,
                message: "Formato de fecha inválido (DD/MM/AAAA)",
              },
            }}
            render={({ field: { value } }) => (
              <>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <MaterialIcons
                    name="calendar-today"
                    size={20}
                    color={theme.textSecondary}
                  />
                  <ThemedText
                    style={[
                      styles.dateText,
                      !value && { color: theme.textSecondary },
                    ]}
                  >
                    {value || "Seleccione una fecha"}
                  </ThemedText>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    locale="es-ES"
                  />
                )}

                {Platform.OS === "ios" && showDatePicker && (
                  <TouchableOpacity
                    style={[
                      styles.doneButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <ThemedText style={styles.doneButtonText}>
                      Confirmar
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </>
            )}
          />
          {errors.date && (
            <ThemedText style={[styles.error, { color: theme.error }]}>
              {errors.date.message}
            </ThemedText>
          )}
        </ThemedView>

        {/* Status */}
        <ThemedView style={styles.field}>
          <ThemedText style={styles.label}>Estado *</ThemedText>
          <Controller
            control={control}
            name="status"
            rules={{ required: "El estado es requerido" }}
            render={({ field: { onChange, value } }) => (
              <ThemedView style={styles.statusButtons}>
                {(["scheduled", "completed", "cancelled"] as const).map(
                  (status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { backgroundColor: theme.card },
                        value === status && { backgroundColor: theme.primary },
                      ]}
                      onPress={() => onChange(status)}
                    >
                      <ThemedText
                        style={[
                          styles.statusButtonText,
                          { color: theme.text },
                          value === status && styles.statusButtonTextActive,
                        ]}
                      >
                        {status === "scheduled"
                          ? "Programada"
                          : status === "completed"
                          ? "Completada"
                          : "Cancelada"}
                      </ThemedText>
                    </TouchableOpacity>
                  )
                )}
              </ThemedView>
            )}
          />
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.primary },
            (isCreating || isUpdating) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.submitButtonText}>
              {isEditMode ? "Actualizar" : "Crear"} Turno
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  dateText: {
    fontSize: 16,
  },
  doneButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  doneButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusButtonTextActive: {
    color: "#FFF",
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
