import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, radius } from '../utils/theme';
import { verifyOTP, sendOTP } from "../utils/api";

// ─── Swoosh Logo ──────────────────────────────────────────────────────────────
const SwooshLogo = () => (
  <Svg width={80} height={31} viewBox="0 0 165 64" fill="none">
    <Path
      d="M86.4556 21.7231C87.5927 21.4019 88.7783 22.018 89.2551 23.1783L93.754 34.1263C94.2985 35.452 93.7288 37.0024 92.4908 37.5644L59.9081 52.352C47.0894 58.226 34.6345 62.1571 30.0022 63.3899L29.9902 63.3933L29.9777 63.3949C19.9867 64.9901 13.0882 63.2648 8.4511 60.1659C7.24858 59.3622 7.1433 57.6098 8.05868 56.5107L28.0734 32.4794C28.766 31.6479 29.8595 31.4104 30.8167 31.765C38.3837 34.569 48.3376 32.8235 54.0452 30.882L54.0514 30.8797L54.0582 30.8781L86.4556 21.7231Z"
      fill={colors.primary}
    />
    <Path
      d="M18.537 2.43787C19.1171 2.40297 19.7059 2.60741 20.2098 2.9606C21.2096 3.66154 21.9535 5.01241 21.6051 6.45387C19.6173 14.6775 20.5701 20.3019 21.7186 22.7269L21.8305 22.9517L21.8388 22.9686L21.8456 22.986C22.6629 25.1895 23.846 26.9578 25.29 28.3634C26.3651 29.4102 26.6486 31.2657 25.6335 32.4721L6.64772 55.0313C5.71528 56.1391 4.05746 56.1879 3.21947 54.9268C1.11318 51.756 0.217258 48.3377 0.0842425 45.7128C-0.446505 38.7107 1.57798 31.0946 4.82144 23.7544C8.06786 16.4076 12.5471 9.31112 16.9528 3.34112C17.3859 2.75426 17.9499 2.47326 18.537 2.43787Z"
      fill={colors.primary}
    />
    <Path
      d="M161.978 0.100225C164.857 -0.72087 166.268 3.73598 163.525 4.98967L98.1164 34.8879C96.9103 35.4391 95.5175 34.8432 94.988 33.5496L90.8665 23.4807C90.2704 22.0238 91.0221 20.3362 92.4481 19.9295L161.978 0.100225Z"
      fill={colors.primary}
    />
  </Svg>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function OTPScreen({ email, onBack, onVerified, onLogin }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const timerRef = useRef(null);

  const startCountdown = () => {
    setCountdown(15);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);

    if (cleaned && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < 4) {
      Alert.alert("Enter Code", "Please enter all 4 digits of your login code.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOTP(email, otp);
      if (res.success) {
        onVerified?.();
      } else {
        Alert.alert("Invalid Code", res.message);
        setDigits(["", "", "", ""]);
        inputs[0].current?.focus();
      }
    } catch {
      Alert.alert("Error", "Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setDigits(["", "", "", ""]);
    inputs[0].current?.focus();
    try {
      const res = await sendOTP(email);
      if (res.success) {
        startCountdown();
        Alert.alert("Code Sent", `A new login code has been sent to ${email}`);
      } else {
        Alert.alert("Error", res.message);
      }
    } catch {
      Alert.alert("Error", "Could not reach the server. Check your connection.");
    } finally {
      setResending(false);
    }
  };

  const allFilled = digits.every((d) => d !== "");

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
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={32} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <SwooshLogo />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Create your free account</Text>

          {/* Subheading */}
          <Text style={styles.subheading}>
            We sent a temporary login code to{"\n"}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>

          {/* 4-Digit OTP Boxes */}
          <View style={styles.otpRow}>
            {digits.map((digit, i) => (
              <TextInput
                key={i}
                ref={inputs[i]}
                style={[
                  styles.otpBox,
                  focusedIndex === i && styles.otpBoxFocused,
                  digit ? styles.otpBoxFilled : null,
                ]}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                selectionColor={colors.primary}
                caretHidden
              />
            ))}
          </View>

          {/* Resend */}
          <View style={styles.resendWrap}>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending || countdown > 0}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.resendText,
                countdown > 0 && !resending && styles.resendDisabled,
                countdown === 0 && !resending && styles.resendReady,
              ]}>
                {resending
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyBtn, !allFilled && styles.verifyBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={styles.verifyBtnText}>Verify</Text>
            )}
          </TouchableOpacity>

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
  flex: { flex: 1 },
  container: {
    paddingHorizontal: spacing.s3,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s5,
    alignItems: "center",
  },

  // Back
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: spacing.s4,
    marginLeft: -4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.primary,
  },

  // Logo
  logoWrap: {
    marginBottom: spacing.s3,
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
  },
  emailHighlight: {
    ...typography.bodyMd,
    color: colors.textPrimary,
  },

  // OTP Boxes
  otpRow: {
    flexDirection: "row",
    gap: spacing.s2,
    marginBottom: spacing.s1,
  },
  otpBox: {
    width: 58,
    height: 58,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  otpBoxFocused: {
    borderColor: colors.textSecondary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
  },

  // Verify Button
  verifyBtn: {
    width: "100%",
    height: spacing.s6,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s2,
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    ...typography.labelLg,
    color: colors.primaryText,
  },

  // Legal
  legalText: {
    ...typography.bodySm,
    textAlign: "center",
    marginBottom: spacing.s2,
    paddingHorizontal: spacing.s2,
  },
  legalLink: {
    ...typography.bodySm,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },

  // Resend
  resendWrap: {
    width: 280,
    alignItems: "flex-end",
    marginBottom: spacing.s3,
  },
  resendText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textDecorationLine: "underline",
  },
  resendDisabled: {
    textDecorationLine: "none",
    color: colors.textMuted,
  },
  resendReady: {
    color: colors.textPrimary,
    textDecorationLine: "none",
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
