import { ThemedText, ThemedView } from "@/src/shared";
import { useTheme } from "@/src/features/settings";
import { MaterialIcons } from "@expo/vector-icons";
import { Control, Controller, FieldError } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface TimePickerFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  timeSlots: string[];
  error?: FieldError;
}

export function TimePickerField({
  name,
  control,
  label,
  timeSlots,
  error,
}: TimePickerFieldProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Controller
        control={control}
        name={name}
        rules={{ required: "El horario es requerido" }}
        render={({ field: { onChange, value } }) => (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeSlotsContainer}
            >
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    value === slot && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => onChange(slot)}
                >
                  <MaterialIcons
                    name="schedule"
                    size={18}
                    color={value === slot ? "#FFF" : theme.text}
                  />
                  <ThemedText
                    style={[
                      styles.timeSlotText,
                      { color: theme.text },
                      value === slot && { color: "#FFF" },
                    ]}
                  >
                    {slot}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    marginBottom: 12,
  },
  timeSlotsContainer: {
    gap: 10,
    paddingVertical: 4,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
    minWidth: 100,
  },
  timeSlotText: {
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    fontSize: 12,
    marginTop: 8,
  },
});
