import { AppointmentCard } from "@/components/AppointmentCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useAppointments } from "@/hooks/useAppointments";
import { useTheme } from "@/hooks/useTheme";
import { logout } from "@/store/slices/authSlice";
import { Appointment, AppointmentStatus } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type FilterType = AppointmentStatus | "all";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { appointments, isLoading, deleteAppointment } = useAppointments();
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  // Filter appointments based on selected filter
  const filteredAppointments =
    selectedFilter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === selectedFilter);

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  const handleEdit = (appointment: Appointment) => {
    router.push({
      pathname: "/(protected)/appointment-form",
      params: {
        id: appointment.id,
        patient: appointment.patient,
        doctor: appointment.doctor,
        date: appointment.date,
        status: appointment.status,
      },
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Eliminar", "¿Estás seguro que deseas eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteAppointment(id);
        },
      },
    ]);
  };

  const handleCreate = () => {
    router.push("/(protected)/appointment-form");
  };

  const getFilterLabel = (filter: FilterType): string => {
    switch (filter) {
      case "all":
        return "Todas";
      case "scheduled":
        return "Programadas";
      case "completed":
        return "Completadas";
      case "cancelled":
        return "Canceladas";
    }
  };

  const getFilterIcon = (filter: FilterType): string => {
    switch (filter) {
      case "all":
        return "list";
      case "scheduled":
        return "schedule";
      case "completed":
        return "check-circle";
      case "cancelled":
        return "cancel";
    }
  };

  const filters: FilterType[] = ["all", "scheduled", "completed", "cancelled"];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Turnos Médicos</ThemedText>
        <ThemedText style={styles.email}>{user?.email}</ThemedText>
      </ThemedView>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === filter ? theme.primary : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={getFilterIcon(filter) as any}
              size={18}
              color={selectedFilter === filter ? "#FFF" : theme.text}
            />
            <ThemedText
              style={[
                styles.filterText,
                { color: selectedFilter === filter ? "#FFF" : theme.text },
              ]}
            >
              {getFilterLabel(filter)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
              onDelete={handleDelete}
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

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={handleCreate}
      >
        <MaterialIcons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={20} color="#FFF" />
        <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  filterScrollView: {
    flexGrow: 0,
    flexShrink: 0, // Prevent shrinking
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    flexShrink: 0, // Prevent chips from shrinking
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    flexShrink: 0, // Prevent text from shrinking
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutButton: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 12,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
