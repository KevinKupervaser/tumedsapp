import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";
import { useTheme } from "@features/settings";
import { useMapNavigation } from "./hooks/useMapNavigation";
import { NavigationButtonsProps } from "./types";

/**
 * Generic navigation buttons for maps
 * Opens native maps app (Apple Maps/Google Maps) and Waze
 */
export function NavigationButtons({
  destination,
  destinationLabel = "",
  primaryColor,
  showWaze = true,
}: NavigationButtonsProps) {
  const { theme } = useTheme();
  const { openInMaps, openInWaze } = useMapNavigation();

  const buttonColor = primaryColor || theme.primary;

  return (
    <ThemedView style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: buttonColor }]}
        onPress={() => openInMaps(destination, destinationLabel)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="navigation" size={20} color="#FFF" />
        <ThemedText style={styles.navButtonText}>
          {Platform.OS === 'ios' ? 'Apple Maps' : 'Google Maps'}
        </ThemedText>
      </TouchableOpacity>

      {showWaze && (
        <TouchableOpacity
          style={[styles.navButton, styles.wazeButton]}
          onPress={() => openInWaze(destination)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="directions-car" size={20} color="#FFF" />
          <ThemedText style={styles.navButtonText}>
            Waze
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  wazeButton: {
    backgroundColor: "#33CCFF",
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
