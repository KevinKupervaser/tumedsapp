import { useTheme } from "@/src/features/settings";
import { ThemedText } from "@/src/shared/components/themed/ThemedText";
import { ThemedView } from "@/src/shared/components/themed/ThemedView";
import { Control, Controller, FieldError } from "react-hook-form";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface FormFieldProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label: string;
  rules?: any;
  error?: FieldError;
}

export function FormField({
  name,
  control,
  label,
  rules,
  error,
  style,
  ...textInputProps
}: FormFieldProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.field}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text, // Add this - ensures text is visible
              },
              style,
            ]}
            value={value}
            onChangeText={onChange}
            placeholderTextColor={theme.textSecondary}
            {...textInputProps}
          />
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
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
