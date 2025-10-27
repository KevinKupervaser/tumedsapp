import { useTheme } from "@features/settings";
import { ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { useOfflineSync } from "../hooks";

interface SyncIndicatorProps {
  /**
   * Si debe mostrarse en la parte superior (banner) o como badge
   */
  variant?: "banner" | "badge";
  /**
   * Callback cuando se presiona el indicador
   */
  onPress?: () => void;
}

/**
 * Componente que muestra el estado de sincronización offline
 *
 * @example
 * ```typescript
 * // Banner en la parte superior
 * <SyncIndicator variant="banner" />
 *
 * // Badge pequeño
 * <SyncIndicator variant="badge" onPress={() => console.log('Sync!')} />
 * ```
 */
export function SyncIndicator({ variant = "banner", onPress }: SyncIndicatorProps) {
  const { theme } = useTheme();
  const { isOnline, syncState, syncNow } = useOfflineSync();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!syncState.isSyncing && isOnline && syncState.pendingCount > 0) {
      syncNow();
    }
  };

  // No mostrar si está todo sincronizado y estamos online
  if (isOnline && syncState.pendingCount === 0 && syncState.errorCount === 0) {
    return null;
  }

  if (variant === "badge") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.badge, { backgroundColor: getStatusColor(isOnline, syncState, theme) }]}
        activeOpacity={0.7}
      >
        {syncState.isSyncing ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <MaterialIcons
              name={getStatusIcon(isOnline, syncState)}
              size={16}
              color="#FFF"
            />
            {syncState.pendingCount > 0 && (
              <View style={[styles.countBadge, { backgroundColor: theme.error }]}>
                <ThemedText style={styles.countText}>
                  {syncState.pendingCount}
                </ThemedText>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Banner variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.banner,
        { backgroundColor: getStatusColor(isOnline, syncState, theme) },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.bannerContent}>
        {syncState.isSyncing ? (
          <>
            <ActivityIndicator size="small" color="#FFF" />
            <ThemedText style={styles.bannerText}>Sincronizando...</ThemedText>
          </>
        ) : (
          <>
            <MaterialIcons
              name={getStatusIcon(isOnline, syncState)}
              size={20}
              color="#FFF"
            />
            <View style={styles.bannerTextContainer}>
              <ThemedText style={styles.bannerText}>
                {getStatusMessage(isOnline, syncState)}
              </ThemedText>
              {syncState.pendingCount > 0 && (
                <ThemedText style={styles.bannerSubtext}>
                  {syncState.pendingCount} {syncState.pendingCount === 1 ? "turno pendiente" : "turnos pendientes"}
                </ThemedText>
              )}
            </View>
            {!isOnline ? (
              <MaterialIcons name="wifi-off" size={20} color="#FFF" />
            ) : syncState.pendingCount > 0 ? (
              <MaterialIcons name="refresh" size={20} color="#FFF" />
            ) : null}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getStatusColor(isOnline: boolean, syncState: any, theme: any): string {
  if (syncState.isSyncing) return theme.primary;
  if (!isOnline) return "#FF9500"; // Warning orange
  if (syncState.errorCount > 0) return theme.error;
  if (syncState.pendingCount > 0) return "#007AFF"; // Info blue
  return theme.success;
}

function getStatusIcon(isOnline: boolean, syncState: any): any {
  if (syncState.errorCount > 0) return "error";
  if (!isOnline) return "cloud-off";
  if (syncState.pendingCount > 0) return "cloud-upload";
  return "cloud-done";
}

function getStatusMessage(isOnline: boolean, syncState: any): string {
  if (!isOnline) return "Sin conexión - Trabajando offline";
  if (syncState.errorCount > 0)
    return `Error en ${syncState.errorCount} ${syncState.errorCount === 1 ? "turno" : "turnos"}`;
  if (syncState.pendingCount > 0) return "Toca para sincronizar";
  return "Todo sincronizado";
}

const styles = StyleSheet.create({
  banner: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  bannerSubtext: {
    color: "#FFF",
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  countBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  countText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
