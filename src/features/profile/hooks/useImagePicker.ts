import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

interface UseImagePickerResult {
  isLoading: boolean;
  pickImage: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
}

export function useImagePicker(): UseImagePickerResult {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la cámara para tomar fotos"
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a la galería para seleccionar fotos"
      );
      return false;
    }
    return true;
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return null;

      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return null;

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    pickImage,
    takePhoto,
  };
}

// Manejo de la seleccion de imagen (camara, galeria y permisos)