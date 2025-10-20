import { useAppDispatch } from "@core/store/hooks";
import { login, loginAsGuest } from "@features/auth/store/authSlice";
import { LoginFormData } from "@shared/types/common.types";
import { useState } from "react";
import { Alert } from "react-native";

interface UseLoginResult {
  isLoading: boolean;
  loginWithCredentials: (data: LoginFormData) => Promise<void>;
  loginAsGuestUser: () => Promise<void>;
}

export function useLogin(onSuccess: () => void): UseLoginResult {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithCredentials = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - any email with password "123456"
        if (data.password === "123456") {
          const user = {
            email: data.email,
            token: "mock-jwt-token-" + Date.now(),
          };

          dispatch(login(user));
          setIsLoading(false);

          // Show success alert first, THEN navigate
          Alert.alert("Inicio de Sesión", "Bienvenido a Turnos Médicos", [
            {
              text: "OK",
              onPress: () => {
                onSuccess(); // Call after user dismisses alert
                resolve();
              },
            },
          ]);
        } else {
          setIsLoading(false);
          Alert.alert(
            "Error de Inicio de Sesión",
            "Credenciales inválidas. Usa cualquier email con contraseña: 123456",
            [{ text: "OK", onPress: () => resolve() }]
          );
        }
      }, 1000);
    });
  };

  const loginAsGuestUser = async (): Promise<void> => {
    setIsLoading(true);

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(loginAsGuest());
        setIsLoading(false);

        Alert.alert("Sesión de Invitado", "Has iniciado sesión como invitado", [
          {
            text: "OK",
            onPress: () => {
              onSuccess();
              resolve();
            },
          },
        ]);
      }, 500);
    });
  };

  return {
    isLoading,
    loginWithCredentials,
    loginAsGuestUser,
  };
}
