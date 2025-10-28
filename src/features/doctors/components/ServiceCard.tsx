import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@features/settings";
import { ThemedText, ThemedView } from "@shared";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Service } from "../types/service.types";

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
      {/* Icon and Title */}
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}
        >
          <MaterialIcons
            name={service.icon as any}
            size={28}
            color={theme.primary}
          />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {service.title}
          </ThemedText>
          <ThemedText style={[styles.doctor, { color: theme.textSecondary }]}>
            {service.doctorName}
          </ThemedText>
        </View>
      </View>

      {/* Description */}
      <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
        {service.description}
      </ThemedText>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialIcons name="schedule" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {service.duration}
          </ThemedText>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons
            name="attach-money"
            size={16}
            color={theme.textSecondary}
          />
          <ThemedText style={[styles.infoText, { color: theme.textSecondary }]}>
            {service.price}
          </ThemedText>
        </View>
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: theme.primary }]}
        onPress={() => onBook(service)}
      >
        <MaterialIcons name="calendar-today" size={18} color="#FFF" />
        <ThemedText style={styles.bookButtonText}>Agendar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  doctor: {
    fontSize: 13,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 13,
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
