import { Linking, Platform } from "react-native";
import { Coordinates } from "../types";

/**
 * Hook for map navigation utilities
 * Provides functions to open maps in different apps
 */
export function useMapNavigation() {
  /**
   * Opens the address in the device's native maps app
   * - iOS: Apple Maps
   * - Android: Google Maps
   */
  const openInMaps = (coordinates: Coordinates, label: string = "") => {
    const { latitude, longitude } = coordinates;
    const encodedLabel = encodeURIComponent(label);

    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${encodedLabel}`,
      android: `geo:${latitude},${longitude}?q=${encodedLabel}`,
    });

    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error("Error opening maps:", err)
      );
    }
  };

  /**
   * Opens Waze with the given coordinates
   */
  const openInWaze = (coordinates: Coordinates) => {
    const { latitude, longitude } = coordinates;
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening Waze:", err)
    );
  };

  /**
   * Makes a phone call
   */
  const makePhoneCall = (phoneNumber: string) => {
    const sanitizedNumber = phoneNumber.replace(/\s/g, "");
    Linking.openURL(`tel:${sanitizedNumber}`).catch((err) =>
      console.error("Error making phone call:", err)
    );
  };

  return {
    openInMaps,
    openInWaze,
    makePhoneCall,
  };
}
