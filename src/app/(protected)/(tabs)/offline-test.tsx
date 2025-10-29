import { useOfflineSync, SyncIndicator } from "@features/offline";
import { useTheme } from "@features/settings";
import { ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

export default function OfflineTestScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    isOnline,
    syncState,
    offlineAppointments,
    saveOfflineAppointment,
    syncNow,
    retrySync,
    deleteOfflineAppointment,
    clearSyncedData,
    refreshOfflineData,
  } = useOfflineSync();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOfflineData();
    setRefreshing(false);
  };

  const handleCreateTestAppointment = async () => {
    try {
      const testData = {
        patient: `Paciente Test ${Date.now()}`,
        doctor: "Dr. Álvaro Medina",
        date: new Date().toLocaleDateString("es-AR"),
        time: new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        phone: "+54 11 1234-5678",
        email: "test@example.com",
        observations: "Turno creado para prueba offline",
        status: "scheduled" as const,
      };

      await saveOfflineAppointment(testData);
      Alert.alert(
        "✅ Guardado Offline",
        "El turno se guardó localmente y se sincronizará cuando haya conexión"
      );
    } catch (error) {
      Alert.alert("❌ Error", "No se pudo guardar el turno offline");
    }
  };

  const handleSyncNow = async () => {
    if (!isOnline) {
      Alert.alert(
        "Sin conexión",
        "Necesitas estar conectado a internet para sincronizar"
      );
      return;
    }

    const result = await syncNow();

    if (result.success) {
      Alert.alert(
        "✅ Sincronización exitosa",
        `${result.syncedCount} turnos sincronizados`
      );
    } else {
      Alert.alert(
        "⚠️ Sincronización parcial",
        `Sincronizados: ${result.syncedCount}\nErrores: ${result.errorCount}`
      );
    }
  };

  const handleRetry = async () => {
    if (!isOnline) {
      Alert.alert("Sin conexión", "Necesitas estar conectado para reintentar");
      return;
    }

    const result = await retrySync();
    Alert.alert(
      "Reintento completado",
      `Sincronizados: ${result.syncedCount}, Errores: ${result.errorCount}`
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirmar",
      "¿Eliminar todos los turnos offline?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            for (const apt of offlineAppointments) {
              await deleteOfflineAppointment(apt.localId);
            }
            Alert.alert("✅ Eliminados", "Todos los turnos offline fueron eliminados");
          },
        },
      ]
    );
  };

  const pendingAppts = offlineAppointments.filter((a) => a.syncStatus === "pending");
  const errorAppts = offlineAppointments.filter((a) => a.syncStatus === "error");
  const syncedAppts = offlineAppointments.filter((a) => a.syncStatus === "synced");
  const syncingAppts = offlineAppointments.filter((a) => a.syncStatus === "syncing");

  return (
    <ThemedView style={styles.container}>
      {/* Sync Indicator Banner */}
      <SyncIndicator variant="banner" />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Network Status Card */}
        <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name={isOnline ? "wifi" : "wifi-off"}
              size={24}
              color={isOnline ? theme.success : theme.error}
            />
            <ThemedText type="subtitle">Estado de Red</ThemedText>
          </View>
          <View style={styles.statusRow}>
            <ThemedText>Conexión:</ThemedText>
            <ThemedText
              style={[
                styles.statusValue,
                { color: isOnline ? theme.success : theme.error },
              ]}
            >
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Sync State Card */}
        <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="sync" size={24} color={theme.primary} />
            <ThemedText type="subtitle">Estado de Sincronización</ThemedText>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {syncState.pendingCount}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Pendientes</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {syncState.errorCount}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Errores</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {offlineAppointments.length}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total</ThemedText>
            </View>
          </View>
          {syncState.lastSyncAt && (
            <ThemedText style={styles.lastSync}>
              Última sync: {new Date(syncState.lastSyncAt).toLocaleString("es-AR")}
            </ThemedText>
          )}
          {syncState.isSyncing && (
            <View style={styles.syncingIndicator}>
              <ActivityIndicator size="small" color={theme.primary} />
              <ThemedText style={{ color: theme.primary, marginLeft: 8 }}>
                Sincronizando...
              </ThemedText>
            </View>
          )}
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={styles.actionsCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Acciones de Prueba
          </ThemedText>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleCreateTestAppointment}
          >
            <MaterialIcons name="add" size={20} color="#FFF" />
            <ThemedText style={styles.actionButtonText}>
              Crear Turno de Prueba
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.success },
              (!isOnline || syncState.pendingCount === 0) && styles.buttonDisabled,
            ]}
            onPress={handleSyncNow}
            disabled={!isOnline || syncState.pendingCount === 0}
          >
            <MaterialIcons name="sync" size={20} color="#FFF" />
            <ThemedText style={styles.actionButtonText}>
              Sincronizar Ahora ({syncState.pendingCount})
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: "#FF9500" },
              (!isOnline || syncState.errorCount === 0) && styles.buttonDisabled,
            ]}
            onPress={handleRetry}
            disabled={!isOnline || syncState.errorCount === 0}
          >
            <MaterialIcons name="refresh" size={20} color="#FFF" />
            <ThemedText style={styles.actionButtonText}>
              Reintentar Errores ({syncState.errorCount})
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.error },
              offlineAppointments.length === 0 && styles.buttonDisabled,
            ]}
            onPress={handleDeleteAll}
            disabled={offlineAppointments.length === 0}
          >
            <MaterialIcons name="delete-sweep" size={20} color="#FFF" />
            <ThemedText style={styles.actionButtonText}>
              Eliminar Todos ({offlineAppointments.length})
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: "#6C757D" },
              syncedAppts.length === 0 && styles.buttonDisabled,
            ]}
            onPress={clearSyncedData}
            disabled={syncedAppts.length === 0}
          >
            <MaterialIcons name="cleaning-services" size={20} color="#FFF" />
            <ThemedText style={styles.actionButtonText}>
              Limpiar Sincronizados ({syncedAppts.length})
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Offline Appointments List */}
        {offlineAppointments.length > 0 && (
          <ThemedView style={styles.listCard}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Turnos Offline ({offlineAppointments.length})
            </ThemedText>

            {/* Pending */}
            {pendingAppts.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionHeader, { color: theme.primary }]}>
                  ⏳ Pendientes ({pendingAppts.length})
                </ThemedText>
                {pendingAppts.map((apt) => (
                  <OfflineAppointmentItem
                    key={apt.localId}
                    appointment={apt}
                    theme={theme}
                    onDelete={() => deleteOfflineAppointment(apt.localId)}
                  />
                ))}
              </View>
            )}

            {/* Syncing */}
            {syncingAppts.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionHeader, { color: "#007AFF" }]}>
                  🔄 Sincronizando ({syncingAppts.length})
                </ThemedText>
                {syncingAppts.map((apt) => (
                  <OfflineAppointmentItem
                    key={apt.localId}
                    appointment={apt}
                    theme={theme}
                  />
                ))}
              </View>
            )}

            {/* Errors */}
            {errorAppts.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionHeader, { color: theme.error }]}>
                  ❌ Errores ({errorAppts.length})
                </ThemedText>
                {errorAppts.map((apt) => (
                  <OfflineAppointmentItem
                    key={apt.localId}
                    appointment={apt}
                    theme={theme}
                    onDelete={() => deleteOfflineAppointment(apt.localId)}
                  />
                ))}
              </View>
            )}

            {/* Synced */}
            {syncedAppts.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={[styles.sectionHeader, { color: theme.success }]}>
                  ✅ Sincronizados ({syncedAppts.length})
                </ThemedText>
                {syncedAppts.map((apt) => (
                  <OfflineAppointmentItem
                    key={apt.localId}
                    appointment={apt}
                    theme={theme}
                    onDelete={() => deleteOfflineAppointment(apt.localId)}
                  />
                ))}
              </View>
            )}
          </ThemedView>
        )}

        {/* Instructions */}
        <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📱 Instrucciones de Prueba
          </ThemedText>
          <ThemedText style={styles.instruction}>
            1. Presiona &quot;Crear Turno de Prueba&quot; para guardar un turno offline
          </ThemedText>
          <ThemedText style={styles.instruction}>
            2. Activa el modo avión en tu dispositivo
          </ThemedText>
          <ThemedText style={styles.instruction}>
            3. Observa el indicador cambiar a &quot;Sin conexión&quot;
          </ThemedText>
          <ThemedText style={styles.instruction}>
            4. Crea más turnos mientras estás offline
          </ThemedText>
          <ThemedText style={styles.instruction}>
            5. Desactiva el modo avión
          </ThemedText>
          <ThemedText style={styles.instruction}>
            6. La sincronización automática debería iniciarse
          </ThemedText>
          <ThemedText style={styles.instruction}>
            7. O presiona &quot;Sincronizar Ahora&quot; manualmente
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

// Componente para mostrar cada turno offline
function OfflineAppointmentItem({
  appointment,
  theme,
  onDelete,
}: {
  appointment: any;
  theme: any;
  onDelete?: () => void;
}) {
  return (
    <View style={[styles.appointmentItem, { backgroundColor: theme.background }]}>
      <View style={styles.appointmentInfo}>
        <ThemedText style={styles.appointmentPatient}>
          {appointment.patient}
        </ThemedText>
        <ThemedText style={styles.appointmentDetails}>
          {appointment.date} - {appointment.time}
        </ThemedText>
        <ThemedText style={styles.appointmentDoctor}>
          {appointment.doctor}
        </ThemedText>
        {appointment.error && (
          <ThemedText style={[styles.errorText, { color: theme.error }]}>
            Error: {appointment.error}
          </ThemedText>
        )}
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={20} color={theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  statusValue: {
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  lastSync: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 8,
    textAlign: "center",
  },
  syncingIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
  },
  actionsCard: {
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  listCard: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentPatient: {
    fontSize: 16,
    fontWeight: "600",
  },
  appointmentDetails: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  appointmentDoctor: {
    fontSize: 13,
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  instruction: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
    opacity: 0.8,
  },
});
