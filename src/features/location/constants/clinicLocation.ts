import { ClinicLocation } from "../types";

/**
 * Ubicación del consultorio médico
 * Coordenadas para Rosario, Argentina (área céntrica)
 *
 * Nota: Actualiza estas coordenadas con la ubicación real del consultorio
 */
export const CLINIC_LOCATION: ClinicLocation = {
  name: "Consultorio Médico",
  address: "Av. Pellegrini 1234, Rosario, Santa Fe, Argentina",
  coordinates: {
    latitude: -32.9442426,  // Rosario centro
    longitude: -60.6505388,
  },
  phone: "+54 341 123 4567",
  email: "contacto@consultorio.com",
  workingHours: "Lunes a Viernes: 9:00 - 13:00 y 17:00 - 21:00",
};

/**
 * Delta para el zoom inicial del mapa
 * Valores más pequeños = más zoom
 */
export const MAP_INITIAL_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};
