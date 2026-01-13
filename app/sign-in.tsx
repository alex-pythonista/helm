import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme, sharedStyles } from "@/utils/theme";
import { authClient } from "@/auth-client";
import { useRouter } from "expo-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        Alert.alert("Login Failed", result.error.message || "Please try again");
        return;
      }

      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[sharedStyles.input, styles.textInput]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.colors.text.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[sharedStyles.input, styles.textInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={theme.colors.text.secondary}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signUpPrompt}>
          <Text style={styles.promptText}>Don't have an account?</Text>
          <Text
            style={styles.signUpLink}
            onPress={() => router.push("/sign-up")}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.white,
  },
  formSection: {
    rowGap: 8,
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginLeft: 4,
    marginBottom: 4,
  },
  textInput: {
    height: 46,
  },
  buttonRow: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  signUpPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  promptText: {
    color: theme.colors.text.secondary,
    fontSize: 15,
  },
  signUpLink: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
