import { ThemedText, ThemedView, AppointmentStatus } from "@shared";
import { useTheme } from "@features/settings";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";

interface StatusSelectorProps {
  name: string;
  control: Control<any>;
  label: string;
}

const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "scheduled", label: "Programada" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

export function StatusSelector({ name, control, label }: StatusSelectorProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Controller
        control={control}
        name={name}
        rules={{ required: "El estado es requerido" }}
        render={({ field: { onChange, value } }) => (
          <ThemedView style={styles.statusButtons}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.value}
                style={[
                  styles.statusButton,
                  { backgroundColor: theme.card },
                  value === status.value && { backgroundColor: theme.primary },
                ]}
                onPress={() => onChange(status.value)}
              >
                <ThemedText
                  style={[
                    styles.statusButtonText,
                    { color: theme.text },
                    value === status.value && styles.statusButtonTextActive,
                  ]}
                >
                  {status.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
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
});
