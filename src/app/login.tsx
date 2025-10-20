import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput, useLogin } from "@features/auth";
import { LoginFormData } from "@shared";


export default function LoginScreen() {
  // Define the success callback - navigates to protected routes
  const handleLoginSuccess = () => {
    // The Stack.Protected will automatically handle the navigation
    // because isAuthenticated becomes true in Redux
  };

  const { isLoading, loginWithCredentials, loginAsGuestUser } =
    useLogin(handleLoginSuccess);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="medical-services" size={80} color="#007AFF" />
          <Text style={styles.title}>Turnos Médicos</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <FormInput
            name="email"
            control={control}
            label="Email"
            icon="email"
            placeholder="ejemplo@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            rules={{
              required: "El email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            }}
          />

          {/* Password Input */}
          <FormInput
            name="password"
            control={control}
            label="Contraseña"
            icon="lock"
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#999"
            autoCapitalize="none"
            isPassword
            error={errors.password}
            rules={{
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            }}
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit(loginWithCredentials)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialIcons
                  name="login"
                  size={20}
                  color="#FFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Guest Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={loginAsGuestUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <>
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color="#007AFF"
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>
                  Continuar como Invitado
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Helper Text */}
          <View style={styles.helperContainer}>
            <MaterialIcons name="info-outline" size={16} color="#666" />
            <Text style={styles.helperText}>
              Demo: cualquier email + contraseña: 123456
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  form: {
    width: "100%",
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
    borderColor: "#CCCCCC",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  helperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#E8F4FF",
    borderRadius: 8,
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
});
