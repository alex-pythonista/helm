/**
 * Image Picker Utilities
 *
 * Reusable functions for camera and gallery image selection with built-in
 * permission handling and camera availability checks (iOS Simulator support).
 *
 * Usage:
 * ```typescript
 * import { launchCamera, launchImageLibrary } from "@/utils/imagePicker";
 *
 * // Pick from gallery
 * const result = await launchImageLibrary();
 * if (result.success) {
 *   console.log(result.asset.uri);
 * }
 *
 * // Capture with camera
 * const result = await launchCamera();
 * if (result.success) {
 *   setImage(result.asset);
 * }
 * ```
 *
 * Note: Camera is not available on iOS Simulator. The `launchCamera` function
 * will show an alert and return `{ success: false }` in that case.
 */

import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type ImagePickerResult = {
  success: true;
  asset: ImagePicker.ImagePickerAsset;
} | {
  success: false;
};

/**
 * Check if camera is available and show alert if not.
 * Returns true if camera is available, false otherwise.
 */
export async function checkCameraAvailability(): Promise<boolean> {
  const cameraStatus = await ImagePicker.getCameraPermissionsAsync();

  if (!cameraStatus.canAskAgain && !cameraStatus.granted) {
    Alert.alert(
      "Camera Not Available",
      "Camera is not available on this device. Please use the gallery option instead, or test on a physical device.",
      [{ text: "OK" }]
    );
    return false;
  }

  return true;
}

/**
 * Launch camera to capture an image.
 * Handles permission requests and camera availability checks.
 */
export async function launchCamera(): Promise<ImagePickerResult> {
  const isAvailable = await checkCameraAvailability();
  if (!isAvailable) {
    return { success: false };
  }

  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Permission to access camera is required!");
    return { success: false };
  }

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: false,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, asset: result.assets[0] };
    }

    return { success: false };
  } catch (error) {
    // Camera hardware not available (e.g., iOS Simulator)
    Alert.alert(
      "Camera Not Available",
      "Camera is not available on this device. Please use the gallery option instead, or test on a physical device.",
      [{ text: "OK" }]
    );
    return { success: false };
  }
}

/**
 * Launch image library to pick an image.
 * Handles permission requests.
 */
export async function launchImageLibrary(): Promise<ImagePickerResult> {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert("Permission to access camera roll is required!");
    return { success: false };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
    allowsEditing: false,
    aspect: [16, 9],
  });

  if (!result.canceled && result.assets[0]) {
    return { success: true, asset: result.assets[0] };
  }

  return { success: false };
}
