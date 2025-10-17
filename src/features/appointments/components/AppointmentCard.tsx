import { useTheme } from "@/src/features/settings";
import { ThemedText, ThemedView } from "@/src/shared";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Appointment } from "../types";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

// Format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateStr: string): string => {
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return dateStr;
  }
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

const getStatusText = (status: string) => {
  switch (status) {
    case "scheduled":
      return "Programada";
    case "completed":
      return "Completada";
    case "cancelled":
      return "Cancelada";
    default:
      return status;
  }
};

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return theme.primary;
      case "completed":
        return theme.success;
      case "cancelled":
        return theme.error;
      default:
        return "#8E8E93";
    }
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <ThemedText type="subtitle" style={styles.patient}>
            {appointment.patient}
          </ThemedText>
          <ThemedText style={styles.doctor}>{appointment.doctor}</ThemedText>

          {/* Date and Time Row */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <MaterialIcons
                name="event"
                size={16}
                color={theme.textSecondary}
                style={styles.icon}
              />
              <ThemedText style={styles.dateTime}>
                {formatDate(appointment.date)}
              </ThemedText>
            </View>

            {appointment.time && (
              <View style={styles.dateTimeItem}>
                <MaterialIcons
                  name="schedule"
                  size={16}
                  color={theme.textSecondary}
                  style={styles.icon}
                />
                <ThemedText style={styles.dateTime}>
                  {appointment.time}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) },
          ]}
        >
          <ThemedText style={styles.statusText}>
            {getStatusText(appointment.status)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(appointment)}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color={theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(appointment.id)}
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  info: {
    flex: 1,
  },
  patient: {
    marginBottom: 4,
  },
  doctor: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  dateTime: {
    fontSize: 13,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});
