import { useCallback, useMemo } from "react";
import { useImageOptions } from "../hooks/useImageOptions";
import { useImagePicker } from "../hooks/useImagePicker";
import { useProfilePicture } from "../hooks/useProfilePicture";

interface UseProfilePictureManagementResult {
  profilePicture: string | null;
  isLoading: boolean;
  handleShowOptions: () => void;
}

/**
 * Hook that manages all profile picture operations
 * Coordinates image picking, camera, deletion, and options menu
 *
 * @returns Profile picture state and handlers
 *
 * @example
 * ```typescript
 * function ProfileScreen() {
 *   const { profilePicture, isLoading, handleShowOptions } = useProfilePictureManagement();
 *
 *   return (
 *     <TouchableOpacity onPress={handleShowOptions} disabled={isLoading}>
 *       {profilePicture ? (
 *         <Image source={{ uri: profilePicture }} />
 *       ) : (
 *         <Icon name="person" />
 *       )}
 *     </TouchableOpacity>
 *   );
 * }
 * ```
 */
export function useProfilePictureManagement(): UseProfilePictureManagementResult {
  const { pickImage, takePhoto, isLoading: isPickerLoading } = useImagePicker();
  const { profilePicture, updateProfilePicture, isUpdating } = useProfilePicture();
  const { showImageOptions } = useImageOptions();

  // Combined loading state from picker and update operations
  const isLoading = useMemo(
    () => isPickerLoading || isUpdating,
    [isPickerLoading, isUpdating]
  );

  // Handle taking a photo from camera
  const handleTakePhoto = useCallback(async () => {
    const uri = await takePhoto();
    if (uri) {
      updateProfilePicture(uri);
    }
  }, [takePhoto, updateProfilePicture]);

  // Handle picking an image from gallery
  const handlePickImage = useCallback(async () => {
    const uri = await pickImage();
    if (uri) {
      updateProfilePicture(uri);
    }
  }, [pickImage, updateProfilePicture]);

  // Handle deleting the profile picture
  const handleDeletePhoto = useCallback(() => {
    updateProfilePicture(null);
  }, [updateProfilePicture]);

  // Show options menu with all available actions
  const handleShowOptions = useCallback(() => {
    showImageOptions(
      {
        onTakePhoto: handleTakePhoto,
        onPickImage: handlePickImage,
        onDeletePhoto: handleDeletePhoto,
      },
      !!profilePicture // Show delete option only if picture exists
    );
  }, [showImageOptions, handleTakePhoto, handlePickImage, handleDeletePhoto, profilePicture]);

  return {
    profilePicture,
    isLoading,
    handleShowOptions,
  };
}
