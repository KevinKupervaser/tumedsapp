import { ThemedView } from "@shared";
import { DoctorCard, DOCTORS } from "@features/doctors";
import { ClinicLocationMap } from "@features/location";
import { ScrollView, StyleSheet } from "react-native";

export default function ProfesionalesScreen() {
  return (
    <ThemedView style={styles.container}>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
