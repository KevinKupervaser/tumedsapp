import { AppointmentFormData } from "@features/appointments/types";

/**
 * Estado de sincronización de un elemento offline
 */
export type SyncStatus = "pending" | "syncing" | "synced" | "error";

/**
 * Operación que se puede realizar offline
 */
export type OfflineOperationType = "create" | "update" | "delete";

/**
 * Cita guardada offline (borrador)
 */
export interface OfflineAppointment extends AppointmentFormData {
  localId: string;           // ID temporal local
  syncStatus: SyncStatus;    // Estado de sincronización
  operation: OfflineOperationType;  // Tipo de operación
  createdAt: number;         // Timestamp de creación
  serverId?: string;         // ID del servidor (si ya fue sincronizado)
  error?: string;            // Mensaje de error si falló
}

/**
 * Estado de la sincronización general
 */
export interface SyncState {
  isSyncing: boolean;        // Si hay sincronización en progreso
  lastSyncAt: number | null; // Timestamp de última sincronización
  pendingCount: number;      // Cantidad de items pendientes
  errorCount: number;        // Cantidad de items con error
}

/**
 * Resultado de una operación de sincronización
 */
export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  errors: Array<{
    localId: string;
    error: string;
  }>;
}
