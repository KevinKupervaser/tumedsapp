import { useTheme } from "@features/settings";
import {
  ThemedText,
  ThemedView,
  MapView,
  MapInfoRow,
  NavigationButtons,
  useMapNavigation,
} from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { CLINIC_LOCATION, MAP_INITIAL_DELTA } from "../constants";

/**
 * despliega la ubicacion
 * usa el mapa dentro de shared
 */
export function ClinicLocationMap() {
  const { theme } = useTheme();
  const { makePhoneCall } = useMapNavigation();

  const handleCallClinic = () => {
    if (CLINIC_LOCATION.phone) {
      makePhoneCall(CLINIC_LOCATION.phone);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Título de sección */}
      <ThemedView style={styles.header}>
        <MaterialIcons name="location-on" size={24} color={theme.primary} />
        <ThemedText type="subtitle" style={styles.title}>
          Ubicación del Consultorio
        </ThemedText>
      </ThemedView>

      {/* Mapa - usando el componente compartido */}
      <MapView
        initialRegion={{
          ...CLINIC_LOCATION.coordinates,
          ...MAP_INITIAL_DELTA,
        }}
        markers={[
          {
            coordinate: CLINIC_LOCATION.coordinates,
            title: CLINIC_LOCATION.name,
            description: CLINIC_LOCATION.address,
            pinColor: theme.primary,
          },
        ]}
        showsUserLocation
        showsMyLocationButton
        height={250}
        borderRadius={16}
        containerStyle={styles.mapContainer}
      />

      {/* Información de dirección */}
      <ThemedView style={[styles.infoCard, { backgroundColor: theme.card }]}>
        <MapInfoRow icon="place" text={CLINIC_LOCATION.address} />

        {CLINIC_LOCATION.phone && (
          <MapInfoRow
            icon="phone"
            text={CLINIC_LOCATION.phone}
            onPress={handleCallClinic}
            isLink
          />
        )}

        {CLINIC_LOCATION.workingHours && (
          <MapInfoRow icon="schedule" text={CLINIC_LOCATION.workingHours} />
        )}
      </ThemedView>

      {/* Botones de navegación - usando el componente compartido */}
      <NavigationButtons
        destination={CLINIC_LOCATION.coordinates}
        destinationLabel={CLINIC_LOCATION.name}
        primaryColor={theme.primary}
        showWaze
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
  },
  mapContainer: {
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
});
