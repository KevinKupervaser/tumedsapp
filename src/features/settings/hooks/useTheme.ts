import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@core/store/hooks";
import { Colors } from "@shared/constants/theme";
import { setThemeMode } from "../store/themeSlice";

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
