import { useTheme } from "@features/settings";
import { ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { Appointment } from "../types";
import { useAppointmentCard } from "../hooks/useAppointmentCard";

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: AppointmentCardProps) {
  const { theme, isDark } = useTheme();
  const { statusConfig, dayName, formattedDate, canEdit } = useAppointmentCard(appointment);

  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.text,
        },
      ]}
    >
      {/* Status Indicator Bar */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: statusConfig.color },
        ]}
      />

      {/* Main Content */}
      <View style={styles.cardContent}>
        {/* Header with Patient Name and Status */}
        <View style={styles.header}>
          <View style={styles.patientSection}>
            <View style={[styles.avatarCircle, { backgroundColor: isDark ? theme.primary + "20" : "#F5F5F5" }]}>
              <MaterialIcons name="person" size={24} color={theme.textSecondary} />
            </View>
            <View style={styles.patientInfo}>
              <ThemedText type="subtitle" style={styles.patientName} numberOfLines={1}>
                {appointment.patient}
              </ThemedText>
              <View style={styles.doctorRow}>
                <MaterialIcons
                  name="medical-services"
                  size={14}
                  color={theme.textSecondary}
                />
                <ThemedText style={styles.doctorName} numberOfLines={1}>
                  {appointment.doctor}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isDark ? statusConfig.color + "20" : statusConfig.color + "15",
                borderWidth: 1,
                borderColor: statusConfig.color + "30",
              },
            ]}
          >
            <MaterialIcons
              name={statusConfig.icon}
              size={12}
              color={statusConfig.color}
            />
            <ThemedText
              style={[styles.statusText, { color: statusConfig.color }]}
            >
              {statusConfig.text}
            </ThemedText>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Date and Time Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailCard}>
            <View
              style={[
                styles.detailIconContainer,
                { backgroundColor: isDark ? theme.textSecondary + "15" : "#F5F5F5" },
              ]}
            >
              <MaterialIcons name="event" size={20} color={theme.textSecondary} />
            </View>
            <View style={styles.detailText}>
              <ThemedText style={styles.detailLabel}>Fecha</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                {formattedDate}
              </ThemedText>
              {dayName && (
                <ThemedText style={styles.dayName}>{dayName}</ThemedText>
              )}
            </View>
          </View>

          {appointment.time && (
            <View style={styles.detailCard}>
              <View
                style={[
                  styles.detailIconContainer,
                  { backgroundColor: isDark ? theme.textSecondary + "15" : "#F5F5F5" },
                ]}
              >
                <MaterialIcons
                  name="schedule"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
              <View style={styles.detailText}>
                <ThemedText style={styles.detailLabel}>Hora</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.detailValue}>
                  {appointment.time}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Observations if exists */}
        {appointment.observations && (
          <View style={[
            styles.observationsContainer,
            { backgroundColor: isDark ? theme.textSecondary + "10" : "#F8F9FA" }
          ]}>
            <MaterialIcons
              name="description"
              size={16}
              color={theme.textSecondary}
              style={styles.observationsIcon}
            />
            <ThemedText style={styles.observations} numberOfLines={2}>
              {appointment.observations}
            </ThemedText>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {canEdit && (
            <TouchableOpacity
              onPress={() => onEdit(appointment)}
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark ? theme.primary + "20" : theme.primary + "10",
                  borderWidth: 1,
                  borderColor: theme.primary + "30",
                },
              ]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="edit" size={18} color={theme.primary} />
              <ThemedText
                style={[styles.actionButtonText, { color: theme.primary }]}
              >
                Editar
              </ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => onDelete(appointment.id)}
            style={[
              styles.actionButton,
              !canEdit && styles.deleteButtonFull,
              {
                backgroundColor: isDark ? theme.error + "20" : theme.error + "10",
                borderWidth: 1,
                borderColor: theme.error + "30",
              },
            ]}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={18} color={theme.error} />
            <ThemedText
              style={[styles.actionButtonText, { color: theme.error }]}
            >
              Eliminar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statusBar: {
    height: 4,
    width: "100%",
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  patientSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0, // Important: allows flex children to shrink below content size
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
    minWidth: 0, // Important: allows text to truncate properly
  },
  patientName: {
    fontSize: 18,
    marginBottom: 4,
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0, // Important: allows text to truncate
  },
  doctorName: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
    flexShrink: 0, // Prevent badge from shrinking
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginBottom: 16,
    opacity: 0.1,
  },
  detailsSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
  },
  dayName: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 2,
  },
  observationsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  observationsIcon: {
    marginTop: 2,
  },
  observations: {
    flex: 1,
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  deleteButtonFull: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
