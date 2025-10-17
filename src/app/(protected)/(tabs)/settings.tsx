import { useTheme } from "@/src/features/settings";
import { LogoutButton, ThemedText, ThemedView } from "@/src/shared";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const { mode, setMode, theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Configuración</ThemedText>
        <LogoutButton />
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: theme.card }]}>
        <ThemedText style={styles.sectionTitle}>
          Tema de la Aplicación
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.option,
            mode === "system" && { backgroundColor: theme.primary },
          ]}
          onPress={() => setMode("system")}
        >
          <MaterialIcons
            name="brightness-auto"
            size={24}
            color={mode === "system" ? "#FFF" : theme.text}
          />
          <ThemedText
            style={[styles.optionText, mode === "system" && { color: "#FFF" }]}
          >
            Sistema
          </ThemedText>
          {mode === "system" && (
            <MaterialIcons name="check" size={24} color="#FFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            mode === "light" && { backgroundColor: theme.primary },
          ]}
          onPress={() => setMode("light")}
        >
          <MaterialIcons
            name="light-mode"
            size={24}
            color={mode === "light" ? "#FFF" : theme.text}
          />
          <ThemedText
            style={[styles.optionText, mode === "light" && { color: "#FFF" }]}
          >
            Claro
          </ThemedText>
          {mode === "light" && (
            <MaterialIcons name="check" size={24} color="#FFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            mode === "dark" && { backgroundColor: theme.primary },
          ]}
          onPress={() => setMode("dark")}
        >
          <MaterialIcons
            name="dark-mode"
            size={24}
            color={mode === "dark" ? "#FFF" : theme.text}
          />
          <ThemedText
            style={[styles.optionText, mode === "dark" && { color: "#FFF" }]}
          >
            Oscuro
          </ThemedText>
          {mode === "dark" && (
            <MaterialIcons name="check" size={24} color="#FFF" />
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  section: {
    margin: 20,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
});
