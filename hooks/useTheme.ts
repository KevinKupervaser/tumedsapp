import { useAppSelector, useAppDispatch } from "./reduxHooks";
import { setThemeMode } from "../store/slices/themeSlice";
import { Colors } from "../constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const useTheme = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const systemColorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  // Determine if dark based on mode
  const isDark =
    mode === "system" ? systemColorScheme === "dark" : mode === "dark";

  const theme = isDark ? Colors.dark : Colors.light;

  const setMode = (newMode: "system" | "light" | "dark") => {
    dispatch(setThemeMode(newMode));
  };

  return {
    theme,
    isDark,
    mode,
    setMode,
  };
};
