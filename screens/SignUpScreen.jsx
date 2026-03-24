import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../utils/theme';
import { sendOTP, checkEmail } from "../utils/api";


// ─── Logo (swoosh) ───────────────────────────────────────────────────────────
const SwooshLogo = () => (
  <Svg width={80} height={31} viewBox="0 0 165 64" fill="none">
    <Path
      d="M86.4556 21.7231C87.5927 21.4019 88.7783 22.018 89.2551 23.1783L93.754 34.1263C94.2985 35.452 93.7288 37.0024 92.4908 37.5644L59.9081 52.352C47.0894 58.226 34.6345 62.1571 30.0022 63.3899L29.9902 63.3933L29.9777 63.3949C19.9867 64.9901 13.0882 63.2648 8.4511 60.1659C7.24858 59.3622 7.1433 57.6098 8.05868 56.5107L28.0734 32.4794C28.766 31.6479 29.8595 31.4104 30.8167 31.765C38.3837 34.569 48.3376 32.8235 54.0452 30.882L54.0514 30.8797L54.0582 30.8781L86.4556 21.7231Z"
      fill="#FED702"
    />
    <Path
      d="M18.537 2.43787C19.1171 2.40297 19.7059 2.60741 20.2098 2.9606C21.2096 3.66154 21.9535 5.01241 21.6051 6.45387C19.6173 14.6775 20.5701 20.3019 21.7186 22.7269L21.8305 22.9517L21.8388 22.9686L21.8456 22.986C22.6629 25.1895 23.846 26.9578 25.29 28.3634C26.3651 29.4102 26.6486 31.2657 25.6335 32.4721L6.64772 55.0313C5.71528 56.1391 4.05746 56.1879 3.21947 54.9268C1.11318 51.756 0.217258 48.3377 0.0842425 45.7128C-0.446505 38.7107 1.57798 31.0946 4.82144 23.7544C8.06786 16.4076 12.5471 9.31112 16.9528 3.34112C17.3859 2.75426 17.9499 2.47326 18.537 2.43787Z"
      fill="#FED702"
    />
    <Path
      d="M161.978 0.100225C164.857 -0.72087 166.268 3.73598 163.525 4.98967L98.1164 34.8879C96.9103 35.4391 95.5175 34.8432 94.988 33.5496L90.8665 23.4807C90.2704 22.0238 91.0221 20.3362 92.4481 19.9295L161.978 0.100225Z"
      fill="#FED702"
    />
  </Svg>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function SignUpScreen({ onLogin, onOTPSent }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (value) => {
    if (!value || value.trim().length === 0) return "Email is required.";
    if (!value.includes("@")) return 'Email must include an @ symbol.';
    const [local, domain] = value.split("@");
    if (!local || local.length === 0) return "Invalid email: missing username before @.";
    if (!domain || !domain.includes(".")) return "Invalid email: missing domain (e.g. gmail.com).";
    if (/[^a-zA-Z0-9._%+\-]/.test(local)) return "Email contains invalid special characters.";
    if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
    return "";
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (error) setError("");
  };

  
  const handleContinue = async () => {
    const trimmed = email.trim();
    const validationError = validateEmail(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const check = await checkEmail(trimmed);
      if (!check.success) {
        setError(check.message);
        return;
      }
      const res = await sendOTP(trimmed);
      if (res.success) {
        onOTPSent?.(trimmed);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <SwooshLogo />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Create your free account</Text>

          {/* Subheading */}
          <Text style={styles.subheading}>
            Start organising your life in seconds – it's fast, free, and built
            for you.
          </Text>

          
          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
          >
            <View style={styles.googleBtnContent}>
              <Svg width={18} height={18} viewBox="0 0 48 48">
                <Path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                <Path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                <Path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                <Path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
              </Svg>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Or Divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* Email Input Group */}
          <View style={styles.inputGroup}>
            <View style={[
              styles.inputWrap,
              focused && !error && styles.inputFocused,
              error ? styles.inputError : null,
            ]}>
              <MaterialIcons
                name="email"
                size={20}
                color={error ? colors.error : focused ? colors.textSecondary : colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={error ? colors.error : colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  setFocused(false);
                  if (email) setError(validateEmail(email.trim()));
                }}
              />
            </View>
            {!!error && (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={styles.continueBtnText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Legal Text */}
          <Text style={styles.legalText}>
            By continuing, you agree to Tsk Manager's{" "}
            <Text style={styles.legalLink}>Terms of service</Text>
            {" and "}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>

          {/* Login CTA */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.s3,
    paddingTop: spacing.s8,
    paddingBottom: spacing.s5,
    alignItems: "center",
  },

  // Logo
  logoWrap: {
    marginBottom: spacing.s4,
  },

  // Heading
  heading: {
    ...typography.displayMd,
    textAlign: "center",
    marginBottom: spacing.s1,
  },

  // Subheading
  subheading: {
    ...typography.bodyMd,
    textAlign: "center",
    marginBottom: spacing.s5,
    paddingHorizontal: spacing.s2,
  },

  // Email Input Group
  inputGroup: {
    width: "100%",
    marginBottom: spacing.s2,
  },
  inputWrap: {
    width: "100%",
    height: 58,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s3,
  },
  inputIcon: {
    marginRight: spacing.s1,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    color: colors.textPrimary,
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    fontWeight: typography.bodyLg.fontWeight,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  inputFocused: {
    borderColor: colors.textSecondary,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSurface,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.s3,
    marginTop: spacing.s1,
  },
  errorText: {
    ...typography.bodySm,
    color: colors.error,
  },

  // Continue Button
  continueBtn: {
    width: "100%",
    height: spacing.s6,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s2,
  },
  continueBtnText: {
    ...typography.labelLg,
    color: colors.primaryText,
  },

  // Google Button
  googleBtn: {
    width: "100%",
    height: spacing.s6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.s1,
  },
  googleBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s1 + 4,
  },
  googleBtnText: {
    ...typography.labelLg,
    color: colors.textPrimary,
  },

  // Or Divider
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: spacing.s2,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
  orText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginHorizontal: spacing.s2,
  },

  // Legal
  legalText: {
    ...typography.bodySm,
    textAlign: "center",
    marginBottom: spacing.s3,
    paddingHorizontal: spacing.s2,
  },
  legalLink: {
    ...typography.bodySm,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },

  // Login CTA
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    ...typography.bodyMd,
  },
  loginLink: {
    ...typography.link,
  },
});
