import { useState, useEffect, useCallback } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { OfflineService, SyncService } from "../services";
import { SyncState, OfflineAppointment, SyncResult } from "../types";
import { AppointmentFormData } from "@features/appointments/types";

interface UseOfflineSyncResult {
  // Estado de red
  isOnline: boolean;

  // Estado de sincronización
  syncState: SyncState;

  // Citas offline
  offlineAppointments: OfflineAppointment[];

  // Acciones
  saveOfflineAppointment: (data: AppointmentFormData) => Promise<OfflineAppointment>;
  syncNow: () => Promise<SyncResult>;
  retrySync: () => Promise<SyncResult>;
  deleteOfflineAppointment: (localId: string) => Promise<void>;
  clearSyncedData: () => Promise<void>;

  // Utilidades
  refreshOfflineData: () => Promise<void>;
}

/**
 * Hook principal para gestionar sincronización offline
 *
 * Proporciona acceso completo al sistema de offline/sync:
 * - Detección automática de conexión
 * - Sincronización automática cuando vuelve conexión
 * - Gestión de borradores offline
 * - Estado de sincronización en tiempo real
 *
 * @param autoSync - Si debe sincronizar automáticamente al recuperar conexión (default: true)
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const {
 *     isOnline,
 *     syncState,
 *     offlineAppointments,
 *     saveOfflineAppointment,
 *     syncNow,
 *   } = useOfflineSync();
 *
 *   if (!isOnline && syncState.pendingCount > 0) {
 *     return <Text>Tienes {syncState.pendingCount} citas sin sincronizar</Text>;
 *   }
 * }
 * ```
 */
export function useOfflineSync(autoSync: boolean = true): UseOfflineSyncResult {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOnline = isConnected && (isInternetReachable === true || isInternetReachable === null);

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncAt: null,
    pendingCount: 0,
    errorCount: 0,
  });

  const [offlineAppointments, setOfflineAppointments] = useState<OfflineAppointment[]>([]);

  /**
   * Actualiza el estado de sincronización
   */
  const updateSyncState = useCallback(async () => {
    const stats = await OfflineService.getOfflineStats();
    const lastSync = await OfflineService.getLastSyncTime();

    setSyncState({
      isSyncing: false,
      lastSyncAt: lastSync,
      pendingCount: stats.pending,
      errorCount: stats.error,
    });
  }, []);

  /**
   * Recarga datos offline desde AsyncStorage
   */
  const refreshOfflineData = useCallback(async () => {
    const appointments = await OfflineService.getAllOfflineAppointments();
    setOfflineAppointments(appointments);
    await updateSyncState();
  }, [updateSyncState]);

  /**
   * Guarda una nueva cita offline
   */
  const saveOfflineAppointment = useCallback(
    async (data: AppointmentFormData): Promise<OfflineAppointment> => {
      const offlineAppointment = await OfflineService.saveOfflineAppointment(data);
      await refreshOfflineData();
      return offlineAppointment;
    },
    [refreshOfflineData]
  );

  /**
   * Sincroniza ahora manualmente
   */
  const syncNow = useCallback(async (): Promise<SyncResult> => {
    if (!isOnline) {
      return {
        success: false,
        syncedCount: 0,
        errorCount: 0,
        errors: [{ localId: "", error: "Sin conexión a internet" }],
      };
    }

    setSyncState((prev) => ({ ...prev, isSyncing: true }));

    try {
      const result = await SyncService.syncAll();
      await refreshOfflineData();
      return result;
    } finally {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [isOnline, refreshOfflineData]);

  /**
   * Reintenta sincronización de items con error
   */
  const retrySync = useCallback(async (): Promise<SyncResult> => {
    if (!isOnline) {
      return {
        success: false,
        syncedCount: 0,
        errorCount: 0,
        errors: [{ localId: "", error: "Sin conexión a internet" }],
      };
    }

    setSyncState((prev) => ({ ...prev, isSyncing: true }));

    try {
      const result = await SyncService.retryFailedSync();
      await refreshOfflineData();
      return result;
    } finally {
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [isOnline, refreshOfflineData]);

  /**
   * Elimina una cita offline
   */
  const deleteOfflineAppointment = useCallback(
    async (localId: string): Promise<void> => {
      await OfflineService.deleteOfflineAppointment(localId);
      await refreshOfflineData();
    },
    [refreshOfflineData]
  );

  /**
   * Limpia datos ya sincronizados
   */
  const clearSyncedData = useCallback(async (): Promise<void> => {
    await OfflineService.clearSyncedAppointments();
    await refreshOfflineData();
  }, [refreshOfflineData]);

  // Cargar datos offline al montar el componente
  useEffect(() => {
    refreshOfflineData();
  }, [refreshOfflineData]);

  // Sincronización automática cuando vuelve la conexión
  useEffect(() => {
    if (autoSync && isOnline && syncState.pendingCount > 0 && !syncState.isSyncing) {
      console.log("🔄 Conexión restaurada. Sincronizando datos...");
      syncNow();
    }
  }, [autoSync, isOnline, syncState.pendingCount, syncState.isSyncing, syncNow]);

  return {
    isOnline,
    syncState,
    offlineAppointments,
    saveOfflineAppointment,
    syncNow,
    retrySync,
    deleteOfflineAppointment,
    clearSyncedData,
    refreshOfflineData,
  };
}
