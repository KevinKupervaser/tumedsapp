import { useAppDispatch } from "@core";
import { logout } from "@features/auth";
import { useTheme } from "@features/settings";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[styles.logoutIconButton, { backgroundColor: theme.card }]}
    >
      <MaterialIcons name="logout" size={24} color={theme.error} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
