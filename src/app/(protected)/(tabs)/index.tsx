import { useAppSelector } from "@core";
import { AppointmentCard, FilterChips, useAppointmentActions, useAppointments, useAppointmentsFilter } from "@features/appointments";
import { useTheme } from "@features/settings";
import { LogoutButton, ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const { appointments, isLoading, deleteAppointment } = useAppointments();
  const { theme } = useTheme();

  const {
    selectedFilter,
    setSelectedFilter,
    filteredAppointments,
    getFilterLabel,
    getFilterIcon,
    filters,
  } = useAppointmentsFilter(appointments);

  const { handleEdit, handleDelete, handleCreate } = useAppointmentActions();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView>
            <ThemedText type="title">Turnos Médicos</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </ThemedView>
          <LogoutButton />
        </ThemedView>
      </ThemedView>

      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        getFilterLabel={getFilterLabel}
        getFilterIcon={getFilterIcon}
      />

      {/* Appointments List */}
      {isLoading ? (
        <ThemedView style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} />
        </ThemedView>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete(id, deleteAppointment)}
            />
          )}
          ListEmptyComponent={
            <ThemedView style={styles.empty}>
              <MaterialIcons name="event-busy" size={64} color="#8E8E93" />
              <ThemedText style={styles.emptyText}>
                {selectedFilter === "all"
                  ? "No hay citas aún"
                  : `No hay citas ${getFilterLabel(
                      selectedFilter
                    ).toLowerCase()}`}
              </ThemedText>
            </ThemedView>
          }
          contentContainerStyle={styles.list}
        />
      )}

      {/* Create Appointment Button */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={handleCreate}
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
          <ThemedText style={styles.createButtonText}>Agendar Turno</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    opacity: 0.5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    gap: 8,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
