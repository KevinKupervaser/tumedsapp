import { StyleSheet, View } from "react-native";
import RNMapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapViewProps } from "./types";

/**
 * Generic reusable map component
 * Can be used across different features for displaying maps
 */
export function MapView({
  initialRegion,
  markers = [],
  showsUserLocation = false,
  showsMyLocationButton = false,
  containerStyle,
  height = 250,
  borderRadius = 16,
  children,
}: MapViewProps) {
  return (
    <View style={[styles.mapContainer, { height, borderRadius }, containerStyle]}>
      <RNMapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={showsMyLocationButton}
      >
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor}
          />
        ))}
        {children}
      </RNMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
