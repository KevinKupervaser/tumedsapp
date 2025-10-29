import { HapticTab, IconSymbol, LogoutButton } from "@shared";
import { Tabs } from "expo-router";
import { useAppSelector } from "@core";
import { useTheme } from "@features/settings";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const isGuest = useAppSelector((state) => state.auth.isGuest);
  const { theme } = useTheme();

  // Create welcome message for home screen
  const homeHeaderTitle = isGuest
    ? "Bienvenido, Invitado"
    : `Bienvenido, ${user?.email || ""}`;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        },
        headerShown: true,
        tabBarButton: HapticTab,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerRight: () => (
          <View style={styles.headerRight}>
            <LogoutButton />
          </View>
        ),
        headerTitleStyle: {
          fontSize: 14,
          fontWeight: "400",
          color: theme.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: homeHeaderTitle,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Turnos",
          headerTitle: "Mis Turnos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerTitle: "Mi Perfil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: "Profesionales",
          headerTitle: "Profesionales",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          headerTitle: "Ajustes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="offline-test"
        options={{
          title: "Offline Test",
          headerTitle: "Prueba Offline/Sync",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cloud.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 16,
  },
});
