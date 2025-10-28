import { ThemedText, ThemedView } from "@shared";
import { useTheme } from "@features/settings";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { getDoctorAvatar } from "../utils/doctorAvatarMap";

interface Doctor {
  id: string;
  name: string;
}

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor: string;
  onSelect: (doctorName: string) => void;
}

export function DoctorSelector({
  doctors,
  selectedDoctor,
  onSelect,
}: DoctorSelectorProps) {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Profesional Disponible</ThemedText>
      {doctors.map((doctor) => {
        const isSelected = selectedDoctor === doctor.name;
        const avatarSource = getDoctorAvatar(doctor.name);

        return (
          <TouchableOpacity
            key={doctor.id}
            style={[
              styles.doctorCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              isSelected && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => onSelect(doctor.name)}
          >
            {/* Doctor Avatar */}
            <View style={styles.avatarContainer}>
              {avatarSource ? (
                <Image
                  source={avatarSource}
                  style={styles.avatar}
                  contentFit="cover"
                />
              ) : (
                <MaterialIcons
                  name="local-hospital"
                  size={32}
                  color={isSelected ? "#FFF" : theme.primary}
                />
              )}
            </View>

            <View style={styles.doctorInfo}>
              {/* Fixed: Use inline style for selected text color */}
              <ThemedText
                style={[styles.doctorName, isSelected && { color: "#FFF" }]}
              >
                {doctor.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.doctorSpecialty,
                  {
                    color: isSelected
                      ? "rgba(255, 255, 255, 0.8)"
                      : theme.textSecondary,
                  },
                ]}
              >
                Médico General
              </ThemedText>
            </View>
            {isSelected && (
              <MaterialIcons name="check-circle" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
  },
});
