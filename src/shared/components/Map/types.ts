/**
 * Shared Map component types
 */

import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { Region } from "react-native-maps";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarkerData {
  coordinate: Coordinates;
  title?: string;
  description?: string;
  pinColor?: string;
}

export interface MapViewProps {
  /**
   * Initial region to display on the map
   */
  initialRegion: Region;

  /**
   * Array of markers to display on the map
   */
  markers?: MapMarkerData[];

  /**
   * Show user's current location
   */
  showsUserLocation?: boolean;

  /**
   * Show button to center map on user location
   */
  showsMyLocationButton?: boolean;

  /**
   * Container style
   */
  containerStyle?: ViewStyle;

  /**
   * Height of the map container
   */
  height?: number;

  /**
   * Border radius for the map container
   */
  borderRadius?: number;

  /**
   * Additional children to render on top of the map
   */
  children?: ReactNode;
}

export interface MapInfoRowProps {
  icon: string;
  text: string;
  onPress?: () => void;
  isLink?: boolean;
}

export interface NavigationButtonsProps {
  /**
   * Coordinates to navigate to
   */
  destination: Coordinates;

  /**
   * Label for the destination (used in maps apps)
   */
  destinationLabel?: string;

  /**
   * Primary color for buttons (from theme)
   */
  primaryColor?: string;

  /**
   * Show Waze button
   */
  showWaze?: boolean;
}
