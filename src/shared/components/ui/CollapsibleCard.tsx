import React, { ReactNode, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@features/settings";
import { ThemedView } from "../themed/ThemedView";
import { Collapsible } from "../animations/Collapsible";

interface CollapsibleCardProps {
  header: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function CollapsibleCard({
  header,
  children,
  defaultExpanded = false,
}: CollapsibleCardProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.card }]}>
      {/* Header - Always Visible */}
      <TouchableOpacity
        onPress={toggleExpand}
        style={styles.cardHeader}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>{header}</View>

          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={28}
              color={theme.textSecondary}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Collapsible Content with Animation */}
      <Collapsible isExpanded={isExpanded}>
        <View style={styles.expandedContent}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          {children}
        </View>
      </Collapsible>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
});
