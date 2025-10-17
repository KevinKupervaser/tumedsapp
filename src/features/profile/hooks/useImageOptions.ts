import { ActionSheetIOS, Alert, Platform } from "react-native";

interface ImageOptionsCallbacks {
  onTakePhoto: () => void;
  onPickImage: () => void;
  onDeletePhoto: () => void;
}

export function useImageOptions() {
  const showImageOptions = (
    callbacks: ImageOptionsCallbacks,
    hasProfilePicture: boolean
  ) => {
    const { onTakePhoto, onPickImage, onDeletePhoto } = callbacks;

    if (Platform.OS === "ios") {
      const options = hasProfilePicture
        ? ["Cancelar", "Tomar Foto", "Elegir de Galería", "Eliminar Foto"]
        : ["Cancelar", "Tomar Foto", "Elegir de Galería"];

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          destructiveButtonIndex: hasProfilePicture ? 3 : undefined,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onTakePhoto();
          } else if (buttonIndex === 2) {
            onPickImage();
          } else if (buttonIndex === 3 && hasProfilePicture) {
            onDeletePhoto();
          }
        }
      );
    } else {
      Alert.alert(
        "Foto de Perfil",
        "Elige una opción",
        [
          { text: "Tomar Foto", onPress: onTakePhoto },
          { text: "Elegir de Galería", onPress: onPickImage },
          ...(hasProfilePicture
            ? [
                {
                  text: "Eliminar Foto",
                  onPress: onDeletePhoto,
                  style: "destructive" as const,
                },
              ]
            : []),
          { text: "Cancelar", style: "cancel" as const },
        ],
        { cancelable: true }
      );
    }
  };

  return { showImageOptions };
}

// Dialogo especifico para los dispositivos IOS y android
