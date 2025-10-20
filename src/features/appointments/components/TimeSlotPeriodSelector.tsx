import { ThemedText, ThemedView } from "@shared";
import { useTheme } from "@features/settings";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

type TimeSlotPeriod = "morning" | "afternoon" | null;

interface TimeSlotPeriodSelectorProps {
  selectedPeriod: TimeSlotPeriod;
  onSelectPeriod: (period: TimeSlotPeriod) => void;
}

export function TimeSlotPeriodSelector({
  selectedPeriod,
  onSelectPeriod,
}: TimeSlotPeriodSelectorProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Horarios *</ThemedText>
      <ThemedView style={styles.periodButtons}>
        {/* Morning Button */}
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: theme.card, borderColor: theme.border },
            selectedPeriod === "morning" && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => onSelectPeriod("morning")}
        >
          <MaterialIcons
            name="wb-sunny"
            size={24}
            color={selectedPeriod === "morning" ? "#FFF" : theme.primary}
          />
          <ThemedText
            style={[
              styles.periodButtonText,
              selectedPeriod === "morning" && { color: "#FFF" },
            ]}
          >
            Mañanas
          </ThemedText>
          <ThemedText
            style={[
              styles.periodTime,
              {
                color:
                  selectedPeriod === "morning"
                    ? "rgba(255, 255, 255, 0.8)"
                    : theme.textSecondary,
              },
            ]}
          >
            09:00 - 13:00
          </ThemedText>
          {selectedPeriod === "morning" && (
            <MaterialIcons
              name="check-circle"
              size={20}
              color="#FFF"
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>

        {/* Afternoon Button */}
        <TouchableOpacity
          style={[
            styles.periodButton,
            { backgroundColor: theme.card, borderColor: theme.border },
            selectedPeriod === "afternoon" && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => onSelectPeriod("afternoon")}
        >
          <MaterialIcons
            name="nights-stay"
            size={24}
            color={selectedPeriod === "afternoon" ? "#FFF" : theme.primary}
          />
          <ThemedText
            style={[
              styles.periodButtonText,
              selectedPeriod === "afternoon" && { color: "#FFF" },
            ]}
          >
            Tardes
          </ThemedText>
          <ThemedText
            style={[
              styles.periodTime,
              {
                color:
                  selectedPeriod === "afternoon"
                    ? "rgba(255, 255, 255, 0.8)"
                    : theme.textSecondary,
              },
            ]}
          >
            17:00 - 21:00
          </ThemedText>
          {selectedPeriod === "afternoon" && (
            <MaterialIcons
              name="check-circle"
              size={20}
              color="#FFF"
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  periodButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  periodTime: {
    fontSize: 12,
  },
  checkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
