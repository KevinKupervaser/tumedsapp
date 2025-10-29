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
import { ActivityIndicator, StyleSheet } from "react-native";
import { useCallback } from "react";
import type { Appointment } from "@shared/types/common.types";
import { FlashList } from "@shopify/flash-list";

export default function AppointmentsScreen() {
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

  // Memoized callbacks for FlashList performance
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
      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        getFilterLabel={getFilterLabel}
        getFilterIcon={getFilterIcon}
      />

      {/* flashlist from shopify to render list */}

      {/* Appointments List */}
      {isLoading ? (
        <ThemedView style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} />
        </ThemedView>
      ) : (
        <FlashList
          data={filteredAppointments}
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
