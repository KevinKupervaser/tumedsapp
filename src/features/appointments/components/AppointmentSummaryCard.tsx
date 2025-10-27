import { ThemedText, ThemedView } from "@shared";
import { useTheme } from "@features/settings";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePeriodFormatting } from "../hooks/usePeriodFormatting";

interface AppointmentSummaryCardProps {
  date: string;
  time: string;
  period: "morning" | "afternoon";
}

export function AppointmentSummaryCard({
  date,
  time,
  period,
}: AppointmentSummaryCardProps) {
  const { theme } = useTheme();
  const { periodTextCapitalized, periodIcon, gradientColors } = usePeriodFormatting(period);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
        {/* Icon Header with Gradient Background */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconHeader}
        >
          <MaterialIcons name="check-circle" size={32} color="#FFF" />
        </LinearGradient>

        {/* Title */}
        <ThemedText style={styles.title}>¡Turno Seleccionado!</ThemedText>

        {/* Summary Text */}
        <ThemedText
          style={[styles.summaryText, { color: theme.textSecondary }]}
        >
          Usted ha seleccionado el turno para:
        </ThemedText>

        {/* Details Section */}
        <ThemedView style={styles.detailsContainer}>
          {/* Date Detail */}
          <View style={[styles.detailRow, { borderColor: theme.border }]}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${theme.primary}15` },
              ]}
            >
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <ThemedText
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Fecha
              </ThemedText>
              <ThemedText style={styles.detailValue}>{date}</ThemedText>
            </View>
          </View>

          {/* Time Period Detail */}
          <View style={[styles.detailRow, { borderColor: theme.border }]}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${theme.primary}15` },
              ]}
            >
              <MaterialIcons
                name={periodIcon}
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <ThemedText
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Turno
              </ThemedText>
              <ThemedText style={styles.detailValue}>
                {periodTextCapitalized}
              </ThemedText>
            </View>
          </View>

          {/* Time Detail */}
          <View style={styles.detailRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${theme.primary}15` },
              ]}
            >
              <MaterialIcons
                name="access-time"
                size={20}
                color={theme.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <ThemedText
                style={[styles.detailLabel, { color: theme.textSecondary }]}
              >
                Horario
              </ThemedText>
              <ThemedText style={styles.detailValue}>{time}</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Bottom Info Banner */}
        <View
          style={[styles.infoBanner, { backgroundColor: `${theme.primary}10` }]}
        >
          <MaterialIcons name="info-outline" size={16} color={theme.primary} />
          <ThemedText style={[styles.infoText, { color: theme.primary }]}>
            Continúe con los siguientes pasos
          </ThemedText>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  summaryText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
