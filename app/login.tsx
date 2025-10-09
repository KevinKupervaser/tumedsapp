import { useRouter } from "expo-router";
import LoginScreen from "../screens/LoginScreen";

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace("/(protected)/(tabs)");
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
