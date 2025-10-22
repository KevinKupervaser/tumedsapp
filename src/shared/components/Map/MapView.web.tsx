import { StyleSheet, Text, View } from "react-native";
import { MapViewProps } from "./types";

/**
 * Web fallback for MapView component
 * react-native-maps no tiene suporte para web 
 */
export function MapView({
  initialRegion,
  markers = [],
  containerStyle,
  height = 250,
  borderRadius = 16,
  children,
}: MapViewProps) {
  return (
    <View
      style={[
        styles.mapContainer,
        { height, borderRadius },
        containerStyle,
      ]}
    >
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>📍</Text>
        <Text style={styles.text}>Mapa no disponible en web</Text>
        {initialRegion && (
          <Text style={styles.subtext}>
            Lat: {initialRegion.latitude.toFixed(4)}, Lng:{" "}
            {initialRegion.longitude.toFixed(4)}
          </Text>
        )}
        {markers.length > 0 && (
          <Text style={styles.subtext}>{markers.length} marcadores</Text>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    overflow: "hidden",
    backgroundColor: "#E8F4F8",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  subtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
