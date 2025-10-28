import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CollapsibleCard, ThemedText } from "@shared";
import { useTheme } from "@features/settings";
import { Doctor } from "../types";
import { Image } from "expo-image";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const { theme } = useTheme();

  const header = (
    <View style={styles.headerContent}>
      <View style={styles.avatarContainer}>
        <Image source={doctor.photo} style={styles.avatar} contentFit="cover" />
      </View>

      <View style={styles.headerText}>
        <ThemedText type="subtitle" style={styles.doctorName}>
          {doctor.name}
        </ThemedText>
        <ThemedText style={styles.specialty}>{doctor.specialty}</ThemedText>
        <ThemedText style={styles.experience}>{doctor.experience}</ThemedText>
      </View>
    </View>
  );

  return (
    <CollapsibleCard header={header}>
      {/* Bio */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="info"
            size={20}
            color={theme.primary}
            style={styles.sectionIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Sobre el profesional
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionContent}>{doctor.bio}</ThemedText>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="school"
            size={20}
            color={theme.primary}
            style={styles.sectionIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Formación
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionContent}>
          {doctor.education}
        </ThemedText>
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="language"
            size={20}
            color={theme.primary}
            style={styles.sectionIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Idiomas
          </ThemedText>
        </View>
        <View style={styles.languagesContainer}>
          {doctor.languages.map((lang, index) => (
            <View
              key={index}
              style={[
                styles.languageTag,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <ThemedText
                style={[styles.languageText, { color: theme.primary }]}
              >
                {lang}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Schedule */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="schedule"
            size={20}
            color={theme.primary}
            style={styles.sectionIcon}
          />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Horarios de atención
          </ThemedText>
        </View>
        <ThemedText style={styles.sectionContent}>{doctor.schedule}</ThemedText>
      </View>
    </CollapsibleCard>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  headerText: {
    flex: 1,
  },
  doctorName: {
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  experience: {
    fontSize: 12,
    opacity: 0.6,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginLeft: 28,
  },
  languagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginLeft: 28,
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
