import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface CollapsibleProps {
  isExpanded: boolean;
  children: ReactNode;
  duration?: number;
}

/**
 * Animated collapsible component that smoothly expands and collapses content
 * Uses native Animated API for smooth 60fps animations
 */
export function Collapsible({
  isExpanded,
  children,
  duration = 300,
}: CollapsibleProps) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const contentHeight = useRef(0);
  const [measuredHeight, setMeasuredHeight] = React.useState(0);

  useEffect(() => {
    if (isExpanded) {
      // Expand animation
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: measuredHeight,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: duration * 0.8, // Slightly faster opacity
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Collapse animation
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: duration * 0.5, // Faster fade out
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isExpanded, measuredHeight, animatedHeight, animatedOpacity, duration]);

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
      contentHeight.current = height;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
          opacity: animatedOpacity,
        },
      ]}
    >
      <View
        style={styles.contentWrapper}
        onLayout={onLayout}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  contentWrapper: {
    position: "absolute",
    width: "100%",
  },
});
