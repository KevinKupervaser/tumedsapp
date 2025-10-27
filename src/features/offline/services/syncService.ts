import { appointmentsAPI } from "@features/appointments/services";
import { OfflineService } from "./offlineService";
import { SyncResult, OfflineAppointment } from "../types";

/**
 * Servicio para sincronizar datos offline con el servidor
 */
export class SyncService {
  /**
   * Sincroniza todas las citas offline pendientes con el servidor
   */
  static async syncAll(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      errors: [],
    };

    try {
      // Obtener citas pendientes de sincronización
      const pendingAppointments = await OfflineService.getPendingAppointments();

      if (pendingAppointments.length === 0) {
        return result;
      }

      // Procesar cada cita pendiente
      for (const appointment of pendingAppointments) {
        try {
          await this.syncAppointment(appointment);
          result.syncedCount++;
        } catch (error) {
          result.errorCount++;
          result.errors.push({
            localId: appointment.localId,
            error: error instanceof Error ? error.message : "Error desconocido",
          });
          result.success = false;
        }
      }

      // Guardar timestamp de última sincronización
      if (result.syncedCount > 0) {
        await OfflineService.saveLastSyncTime();
      }

      // Limpiar citas sincronizadas exitosamente
      await OfflineService.clearSyncedAppointments();

      return result;
    } catch (error) {
      console.error("Error durante la sincronización:", error);
      result.success = false;
      return result;
    }
  }

  /**
   * Sincroniza una cita individual con el servidor
   */
  private static async syncAppointment(
    appointment: OfflineAppointment
  ): Promise<void> {
    // Marcar como "en sincronización"
    await OfflineService.markAsSyncing(appointment.localId);

    try {
      switch (appointment.operation) {
        case "create":
          await this.syncCreateOperation(appointment);
          break;
        case "update":
          await this.syncUpdateOperation(appointment);
          break;
        case "delete":
          await this.syncDeleteOperation(appointment);
          break;
      }
    } catch (error) {
      // Marcar como error
      const errorMessage =
        error instanceof Error ? error.message : "Error al sincronizar";
      await OfflineService.markAsError(appointment.localId, errorMessage);
      throw error;
    }
  }

  /**
   * Sincroniza una operación de creación
   */
  private static async syncCreateOperation(
    appointment: OfflineAppointment
  ): Promise<void> {
    const { localId, syncStatus, operation, createdAt, serverId, error, ...appointmentData } =
      appointment;

    // Crear la cita en el servidor
    const createdAppointment = await appointmentsAPI.create(appointmentData);

    // Marcar como sincronizada
    await OfflineService.markAsSynced(localId, createdAppointment.id);
  }

  /**
   * Sincroniza una operación de actualización
   */
  private static async syncUpdateOperation(
    appointment: OfflineAppointment
  ): Promise<void> {
    if (!appointment.serverId) {
      throw new Error("No se puede actualizar: falta ID del servidor");
    }

    const { localId, syncStatus, operation, createdAt, serverId, error, ...appointmentData } =
      appointment;

    // Actualizar la cita en el servidor
    await appointmentsAPI.update(serverId, appointmentData);

    // Marcar como sincronizada
    await OfflineService.markAsSynced(localId, serverId);
  }

  /**
   * Sincroniza una operación de eliminación
   */
  private static async syncDeleteOperation(
    appointment: OfflineAppointment
  ): Promise<void> {
    if (!appointment.serverId) {
      // Si no tiene serverId, solo la eliminamos localmente
      await OfflineService.deleteOfflineAppointment(appointment.localId);
      return;
    }

    // Eliminar la cita del servidor
    await appointmentsAPI.delete(appointment.serverId);

    // Eliminar de datos offline
    await OfflineService.deleteOfflineAppointment(appointment.localId);
  }

  /**
   * Reintenta sincronizar citas con error
   */
  static async retryFailedSync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      errors: [],
    };

    try {
      const errorAppointments = await OfflineService.getErrorAppointments();

      // Marcar todas como pendientes de nuevo
      for (const appointment of errorAppointments) {
        await OfflineService.updateOfflineAppointment(appointment.localId, {
          syncStatus: "pending",
          error: undefined,
        });
      }

      // Ejecutar sincronización completa
      return await this.syncAll();
    } catch (error) {
      console.error("Error al reintentar sincronización:", error);
      result.success = false;
      return result;
    }
  }

  /**
   * Verifica si hay datos pendientes de sincronizar
   */
  static async hasPendingData(): Promise<boolean> {
    const pending = await OfflineService.getPendingAppointments();
    return pending.length > 0;
  }

  /**
   * Obtiene el conteo de items pendientes
   */
  static async getPendingCount(): Promise<number> {
    const pending = await OfflineService.getPendingAppointments();
    return pending.length;
  }
}

export default SyncService;
