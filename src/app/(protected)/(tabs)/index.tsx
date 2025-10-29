import { SERVICES, ServiceCard, Service } from "@features/doctors";
import { ThemedView } from "@shared";
import { FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function HomeScreen() {
  const router = useRouter();

  const handleBookService = useCallback((service: Service) => {
    // Navigate to appointment form with pre-filled doctor
    router.push({
      pathname: "/(protected)/appointment-form",
      params: {
        doctorName: service.doctorName,
        serviceName: service.title,
      },
    });
  }, [router]);

  const renderServiceItem = useCallback(
    ({ item }: { item: Service }) => (
      <ServiceCard service={item} onBook={handleBookService} />
    ),
    [handleBookService]
  );

  const keyExtractor = useCallback((item: Service) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      {/* Services List */}
      <FlatList
        data={SERVICES}
        keyExtractor={keyExtractor}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
    paddingBottom: 20,
  },
});
