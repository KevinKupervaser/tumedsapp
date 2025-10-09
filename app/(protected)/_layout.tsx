import { Stack } from "expo-router";
import { useAppSelector } from "../../hooks/reduxHooks";

export default function ProtectedLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="appointment-form" />
      </Stack.Protected>
    </Stack>
  );
}