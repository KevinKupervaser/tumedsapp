import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "../themed/ThemedText";
import { useTheme } from "@features/settings";
import { MapInfoRowProps } from "./types";

/**
 * Generic info row component for displaying map-related information
 * Can be used for address, phone, hours, etc.
 */
export function MapInfoRow({ icon, text, onPress, isLink = false }: MapInfoRowProps) {
  const { theme } = useTheme();

  const content = (
    <>
      <MaterialIcons name={icon as any} size={20} color={theme.primary} />
      <ThemedText style={[styles.infoText, isLink && styles.linkText]}>
        {text}
      </ThemedText>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.infoRow}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.infoRow}>{content}</View>;
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
