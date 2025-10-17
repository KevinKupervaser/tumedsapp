import { ThemedText } from "@/src/shared/components/themed/ThemedText";
import { ThemedView } from "@/src/shared/components/themed/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Control, Controller, FieldError } from "react-hook-form";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../settings/hooks/useTheme";

interface DatePickerFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  rules?: any;
  error?: FieldError;
  showPicker: boolean;
  selectedDate: Date;
  onDateChange: (event: any, date?: Date) => void;
  onShowPicker: () => void;
  onHidePicker: () => void;
}

export function DatePickerField({
  name,
  control,
  label,
  rules,
  error,
  showPicker,
  selectedDate,
  onDateChange,
  onShowPicker,
  onHidePicker,
}: DatePickerFieldProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value } }) => (
          <>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={onShowPicker}
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

            {showPicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                locale="es-ES"
                minimumDate={new Date()} // Add this line - prevents selecting past dates
              />
            )}

            {Platform.OS === "ios" && showPicker && (
              <TouchableOpacity
                style={[styles.doneButton, { backgroundColor: theme.primary }]}
                onPress={onHidePicker}
              >
                <ThemedText style={styles.doneButtonText}>Confirmar</ThemedText>
              </TouchableOpacity>
            )}
          </>
        )}
      />
      {error && (
        <ThemedText style={[styles.error, { color: theme.error }]}>
          {error.message}
        </ThemedText>
      )}
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
});
