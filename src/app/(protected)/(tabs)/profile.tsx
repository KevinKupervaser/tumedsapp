import { useAppSelector } from "@core";
import { useImageOptions, useImagePicker, useProfilePicture } from "@features/profile";
import { useTheme } from "@features/settings";
import { LogoutButton, ThemedText, ThemedView } from "@shared";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const isGuest = useAppSelector((state) => state.auth.isGuest);

  const { pickImage, takePhoto, isLoading: isPickerLoading } = useImagePicker();
  const { profilePicture, updateProfilePicture, isUpdating } =
    useProfilePicture();
  const { showImageOptions } = useImageOptions();

  const isLoading = isPickerLoading || isUpdating;

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      updateProfilePicture(uri);
    }
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      updateProfilePicture(uri);
    }
  };

  const handleDeletePhoto = () => {
    updateProfilePicture(null);
  };

  const handleShowOptions = () => {
    showImageOptions(
      {
        onTakePhoto: handleTakePhoto,
        onPickImage: handlePickImage,
        onDeletePhoto: handleDeletePhoto,
      },
      !!profilePicture
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Perfil</ThemedText>
        <LogoutButton />
      </ThemedView>

      <ThemedView style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={handleShowOptions}
            disabled={isLoading}
            style={[
              styles.avatarWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatar} />
            ) : (
              <MaterialIcons
                name="person"
                size={80}
                color={theme.textSecondary}
              />
            )}
            <View
              style={[styles.cameraButton, { backgroundColor: theme.primary }]}
            >
              <MaterialIcons name="camera-alt" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          <ThemedText style={styles.avatarHint}>
            Toca para cambiar la foto
          </ThemedText>
        </View>

        {/* Guest Banner */}
        {isGuest && (
          <View style={[styles.guestBanner, { backgroundColor: "#FF9500" }]}>
            <MaterialIcons name="info" size={20} color="#FFF" />
            <ThemedText style={styles.guestBannerText}>
              Estás usando una cuenta de invitado
            </ThemedText>
          </View>
        )}

        <ThemedView style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color={theme.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Email</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email}</ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={24} color={theme.primary} />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Rol</ThemedText>
              <ThemedText style={styles.infoValue}>
                {isGuest ? "Invitado" : "Administrador"}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedView
            style={[styles.statCard, { backgroundColor: theme.card }]}
          >
            <MaterialIcons name="event" size={32} color={theme.primary} />
            <ThemedText style={styles.statNumber}>--</ThemedText>
            <ThemedText style={styles.statLabel}>Turnos Totales</ThemedText>
          </ThemedView>

          <ThemedView
            style={[styles.statCard, { backgroundColor: theme.card }]}
          >
            <MaterialIcons
              name="check-circle"
              size={32}
              color={theme.success}
            />
            <ThemedText style={styles.statNumber}>--</ThemedText>
            <ThemedText style={styles.statLabel}>Completados</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    overflow: "hidden",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarHint: {
    marginTop: 12,
    opacity: 0.6,
    fontSize: 14,
  },
  guestBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  guestBannerText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
    textAlign: "center",
  },
});
