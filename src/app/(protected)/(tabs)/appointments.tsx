import { useAppSelector } from "@core";
import {
  AppointmentCard,
  FilterChips,
  useAppointmentActions,
  useAppointments,
  useAppointmentsFilter,
} from "@features/appointments";
import { useTheme } from "@features/settings";
import { ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useCallback } from "react";
import type { Appointment } from "@shared/types/common.types";

export default function AppointmentsScreen() {
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

  const { handleEdit, handleDelete } = useAppointmentActions();

  // Memoized callbacks for FlatList performance
  const keyExtractor = useCallback((item: Appointment) => item.id, []);

  const renderAppointmentItem = useCallback(
    ({ item }: { item: Appointment }) => (
      <AppointmentCard
        appointment={item}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id, deleteAppointment)}
      />
    ),
    [handleEdit, handleDelete, deleteAppointment]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <ThemedView style={styles.empty}>
        <MaterialIcons name="event-busy" size={64} color="#8E8E93" />
        <ThemedText style={styles.emptyText}>
          {selectedFilter === "all"
            ? "No hay citas aún"
            : `No hay citas ${getFilterLabel(selectedFilter).toLowerCase()}`}
        </ThemedText>
      </ThemedView>
    ),
    [selectedFilter, getFilterLabel]
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView>
            <ThemedText type="title">Mis Turnos</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </ThemedView>
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
          keyExtractor={keyExtractor}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
});
