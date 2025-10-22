import { ThemedText, ThemedView } from "@shared";
import { DoctorCard, DOCTORS } from "@features/doctors";
import { ClinicLocationMap } from "@features/location";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfesionalesScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profesionales</ThemedText>
        <ThemedText style={styles.subtitle}>
          Conoce a nuestro equipo médico
        </ThemedText>
      </ThemedView>

      {/* Doctors List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DOCTORS.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}

        {/* Location Map */}
        <ClinicLocationMap />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
});
