/**
 * Tipos para gestión de ubicación del consultorio
 */

import { Coordinates } from "@shared";

export type { Coordinates };

export interface ClinicLocation {
  name: string;
  address: string;
  coordinates: Coordinates;
  phone?: string;
  email?: string;
  workingHours?: string;
}
