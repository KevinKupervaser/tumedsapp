import { useTheme } from "@/src/features/settings";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { theme, isDark } = useTheme();

  const backgroundColor = isDark
    ? darkColor || theme.background
    : lightColor || theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
