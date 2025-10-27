/**
 * Doctor Avatar Mapping Utility
 *
 * Maps doctor names to their corresponding avatar images from the assets folder.
 * This utility provides a centralized way to manage doctor profile pictures.
 */

type DoctorAvatarSource = ReturnType<typeof require> | null;

/**
 * Configuration for doctor avatars
 * Add new doctors here to automatically map them to their images
 */
const DOCTOR_AVATAR_MAP: Record<string, any> = {
  medina: require("@/assets/doctors/medina.jpg"),
  hookerman: require("@/assets/doctors/hookerman.jpg"),
};

/**
 * Gets the avatar image source for a given doctor name
 *
 * @param doctorName - The full name of the doctor (e.g., "Dr. Álvaro Medina")
 * @returns The image source for the avatar, or null if no match is found
 *
 * @example
 * ```typescript
 * const avatar = getDoctorAvatar("Dr. Álvaro Medina");
 * // Returns: require("@/assets/doctors/medina.jpg")
 *
 * const avatar = getDoctorAvatar("Dra. María Hookerman");
 * // Returns: require("@/assets/doctors/hookerman.jpg")
 *
 * const avatar = getDoctorAvatar("Dr. Unknown");
 * // Returns: null
 * ```
 */
export function getDoctorAvatar(doctorName: string): DoctorAvatarSource {
  const normalizedName = doctorName.toLowerCase();

  // Search for matching doctor in the map
  for (const [key, avatar] of Object.entries(DOCTOR_AVATAR_MAP)) {
    if (normalizedName.includes(key)) {
      return avatar;
    }
  }

  // Return null if no match found (allows fallback to default icon)
  return null;
}

/**
 * Checks if a doctor has an avatar image available
 *
 * @param doctorName - The full name of the doctor
 * @returns true if an avatar exists, false otherwise
 */
export function hasDoctorAvatar(doctorName: string): boolean {
  return getDoctorAvatar(doctorName) !== null;
}
