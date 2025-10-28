import { useAppSelector } from "@core";
import { SERVICES, ServiceCard, Service } from "@features/doctors";
import { LogoutButton, ThemedText, ThemedView } from "@shared";
import { FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import Animated, { ZoomIn } from "react-native-reanimated";

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
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
    ({ item, index }: { item: Service; index: number }) => (
      <Animated.View
        entering={ZoomIn.delay(index * 150)
          .duration(500)
          .springify()
          .damping(14)
          .stiffness(100)}
      >
        <ServiceCard service={item} onBook={handleBookService} />
      </Animated.View>
    ),
    [handleBookService]
  );

  const keyExtractor = useCallback((item: Service) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerContent}>
          <ThemedView>
            <ThemedText type="title">Servicios Médicos</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
          </ThemedView>
          <LogoutButton />
        </ThemedView>
      </ThemedView>

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
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
  },
});
