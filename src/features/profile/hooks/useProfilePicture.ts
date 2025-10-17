import { useAppDispatch, useAppSelector } from "@/src/core/store/hooks";
import { setProfilePicture as setProfilePictureAction } from "@/src/features/auth/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

interface UseProfilePictureResult {
  profilePicture: string | null;
  updateProfilePicture: (uri: string | null) => void;
  isUpdating: boolean;
}

export function useProfilePicture(): UseProfilePictureResult {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const profilePicture = useAppSelector((state) => state.auth.profilePicture);

  const updateMutation = useMutation({
    mutationFn: async (uri: string | null) => {
      // Simulacion (subida al servidor en una app real)
      await new Promise((resolve) => setTimeout(resolve, 500));
      return uri;
    },
    onSuccess: (uri) => {
      dispatch(setProfilePictureAction(uri));
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (uri) {
        Alert.alert("Éxito", "Foto de perfil actualizada");
      } else {
        Alert.alert("Éxito", "Foto de perfil eliminada");
      }
    },
    onError: (error) => {
      console.error("Error updating profile picture:", error);
      Alert.alert("Error", "No se pudo actualizar la foto de perfil");
    },
  });

  return {
    profilePicture,
    updateProfilePicture: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}

// Manejo del estado de la foto de perfil con tanstack (manejo de cargas y errores) + redux
