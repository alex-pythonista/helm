import { theme } from "@/utils/theme";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTransactionExtraction } from "@/hooks/useTransactionExtraction";
import { useRouter } from "expo-router";
import { useTransactionStore } from "@/store/transactionStore";
import { launchCamera, launchImageLibrary } from "@/utils/imagePicker";

export default function ReceiptForm() {
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const { mutate: extractReceipt, isPending } = useTransactionExtraction();
  const router = useRouter();
  const { addBulkTransactions } = useTransactionStore();

  const handleImagePick = async () => {
    const result = await launchImageLibrary();
    if (result.success) {
      setSelectedImage(result.asset);
    }
  };

  const handleCameraButtonPress = async () => {
    const result = await launchCamera();
    if (result.success) {
      setSelectedImage(result.asset);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      console.error("Please select a receipt image first");
      return;
    }

    extractReceipt(
      { imageUri: selectedImage.uri },
      {
        onSuccess: (data) => {
          if (data.transactions) {
            addBulkTransactions(data.transactions);
            router.replace("/confirm-transactions?type=receipt");
          } else {
            console.error("No transactions found in the receipt");
          }
        },
        onError: (error) => {
          console.error(error.message);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.formWrapper}>
          <View style={styles.formSection}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                selectedImage && styles.uploadButtonWithImage,
              ]}
              onPress={handleImagePick}
              activeOpacity={0.8}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={40}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.uploadButtonText}>
                    Tap to Upload Receipt
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity
              style={styles.fabCameraButton}
              onPress={handleCameraButtonPress}
              activeOpacity={0.85}
              accessibilityLabel="Take a picture of your receipt"
            >
              <MaterialCommunityIcons
                name="camera"
                size={32}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Extract</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.input.border,
    opacity: 0.6,
  },
  orText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text.secondary,
    marginHorizontal: 8,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: theme.spacing.lg,
  },
  cameraButtonWrapper: {
    alignItems: "center",
  },
  fabCameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  formWrapper: {
    rowGap: theme.spacing.md,
  },
  formSection: {
    rowGap: theme.spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginLeft: 4,
  },
  uploadButton: {
    borderRadius: theme.borderRadius.md,
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.input.border,
    borderStyle: "dashed",
    backgroundColor: "#efefef60",
  },
  uploadButtonWithImage: {
    borderStyle: "solid",
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.borderRadius.md,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
