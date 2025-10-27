import AsyncStorage from "@react-native-async-storage/async-storage";
import { OfflineAppointment, OfflineOperationType } from "../types";
import { AppointmentFormData } from "@features/appointments/types";

/**
 * Claves de AsyncStorage para datos offline
 */
const STORAGE_KEYS = {
  OFFLINE_APPOINTMENTS: "@turnosapp/offline_appointments",
  SYNC_STATE: "@turnosapp/sync_state",
  LAST_SYNC: "@turnosapp/last_sync",
};

/**
 * Servicio para gestionar datos offline usando AsyncStorage
 */
export class OfflineService {
  /**
   * Genera un ID único local para citas offline
   */
  private static generateLocalId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene todas las citas guardadas offline
   */
  static async getAllOfflineAppointments(): Promise<OfflineAppointment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error al obtener citas offline:", error);
      return [];
    }
  }

  /**
   * Guarda una nueva cita offline (borrador)
   */
  static async saveOfflineAppointment(
    appointmentData: AppointmentFormData,
    operation: OfflineOperationType = "create"
  ): Promise<OfflineAppointment> {
    try {
      const appointments = await this.getAllOfflineAppointments();

      const offlineAppointment: OfflineAppointment = {
        ...appointmentData,
        localId: this.generateLocalId(),
        syncStatus: "pending",
        operation,
        createdAt: Date.now(),
      };

      appointments.push(offlineAppointment);
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_APPOINTMENTS,
        JSON.stringify(appointments)
      );

      return offlineAppointment;
    } catch (error) {
      console.error("Error al guardar cita offline:", error);
      throw error;
    }
  }

  /**
   * Actualiza una cita offline existente
   */
  static async updateOfflineAppointment(
    localId: string,
    updates: Partial<OfflineAppointment>
  ): Promise<void> {
    try {
      const appointments = await this.getAllOfflineAppointments();
      const index = appointments.findIndex((apt) => apt.localId === localId);

      if (index !== -1) {
        appointments[index] = { ...appointments[index], ...updates };
        await AsyncStorage.setItem(
          STORAGE_KEYS.OFFLINE_APPOINTMENTS,
          JSON.stringify(appointments)
        );
      }
    } catch (error) {
      console.error("Error al actualizar cita offline:", error);
      throw error;
    }
  }

  /**
   * Elimina una cita offline
   */
  static async deleteOfflineAppointment(localId: string): Promise<void> {
    try {
      const appointments = await this.getAllOfflineAppointments();
      const filtered = appointments.filter((apt) => apt.localId !== localId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_APPOINTMENTS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error("Error al eliminar cita offline:", error);
      throw error;
    }
  }

  /**
   * Obtiene citas pendientes de sincronización
   */
  static async getPendingAppointments(): Promise<OfflineAppointment[]> {
    try {
      const appointments = await this.getAllOfflineAppointments();
      return appointments.filter((apt) => apt.syncStatus === "pending");
    } catch (error) {
      console.error("Error al obtener citas pendientes:", error);
      return [];
    }
  }

  /**
   * Obtiene citas con error de sincronización
   */
  static async getErrorAppointments(): Promise<OfflineAppointment[]> {
    try {
      const appointments = await this.getAllOfflineAppointments();
      return appointments.filter((apt) => apt.syncStatus === "error");
    } catch (error) {
      console.error("Error al obtener citas con error:", error);
      return [];
    }
  }

  /**
   * Marca una cita como sincronizada exitosamente
   */
  static async markAsSynced(localId: string, serverId: string): Promise<void> {
    await this.updateOfflineAppointment(localId, {
      syncStatus: "synced",
      serverId,
    });
  }

  /**
   * Marca una cita con error de sincronización
   */
  static async markAsError(localId: string, error: string): Promise<void> {
    await this.updateOfflineAppointment(localId, {
      syncStatus: "error",
      error,
    });
  }

  /**
   * Marca una cita como en proceso de sincronización
   */
  static async markAsSyncing(localId: string): Promise<void> {
    await this.updateOfflineAppointment(localId, {
      syncStatus: "syncing",
    });
  }

  /**
   * Limpia todas las citas ya sincronizadas
   */
  static async clearSyncedAppointments(): Promise<void> {
    try {
      const appointments = await this.getAllOfflineAppointments();
      const unsynced = appointments.filter((apt) => apt.syncStatus !== "synced");
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_APPOINTMENTS,
        JSON.stringify(unsynced)
      );
    } catch (error) {
      console.error("Error al limpiar citas sincronizadas:", error);
      throw error;
    }
  }

  /**
   * Guarda la fecha de última sincronización
   */
  static async saveLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        Date.now().toString()
      );
    } catch (error) {
      console.error("Error al guardar fecha de sincronización:", error);
    }
  }

  /**
   * Obtiene la fecha de última sincronización
   */
  static async getLastSyncTime(): Promise<number | null> {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return time ? parseInt(time, 10) : null;
    } catch (error) {
      console.error("Error al obtener fecha de sincronización:", error);
      return null;
    }
  }

  /**
   * Limpia todos los datos offline (usar con precaución)
   */
  static async clearAllOfflineData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.OFFLINE_APPOINTMENTS,
        STORAGE_KEYS.SYNC_STATE,
        STORAGE_KEYS.LAST_SYNC,
      ]);
    } catch (error) {
      console.error("Error al limpiar datos offline:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de datos offline
   */
  static async getOfflineStats(): Promise<{
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    error: number;
  }> {
    try {
      const appointments = await this.getAllOfflineAppointments();

      return {
        total: appointments.length,
        pending: appointments.filter((apt) => apt.syncStatus === "pending").length,
        syncing: appointments.filter((apt) => apt.syncStatus === "syncing").length,
        synced: appointments.filter((apt) => apt.syncStatus === "synced").length,
        error: appointments.filter((apt) => apt.syncStatus === "error").length,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas offline:", error);
      return { total: 0, pending: 0, syncing: 0, synced: 0, error: 0 };
    }
  }
}

export default OfflineService;
