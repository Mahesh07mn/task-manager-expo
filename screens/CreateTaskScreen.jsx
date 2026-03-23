import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, typography, spacing, radius } from "../utils/theme";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (date) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// ─── Create Task Screen ──────────────────────────────────────────────────────
export default function CreateTaskScreen({ onBack, onCreate }) {
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [pickerMode, setPickerMode] = useState("time"); // "date" | "time"

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDateTime(selectedDate);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate?.({
      id: `task_${Date.now()}`,
      name: name.trim(),
      date: dateTime.toISOString().split("T")[0],
      dateTime,
      subtitle: `Expires at ${formatTime(dateTime)}`,
      items: [],
    });
  };

  const canCreate = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <MaterialIcons name="chevron-left" size={32} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Create new task</Text>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Name Row */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={name}
                onChangeText={setName}
                placeholder="Office task"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
              />
            </View>

            <View style={styles.divider} />

            {/* Date & Time Row */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Date & Time</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={[styles.chip, pickerMode === "date" && styles.chipActive]}
                  onPress={() => setPickerMode("date")}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, pickerMode === "date" && styles.chipTextActive]}>
                    {formatDate(dateTime)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chip, pickerMode === "time" && styles.chipActive]}
                  onPress={() => setPickerMode("time")}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, pickerMode === "time" && styles.chipTextActive]}>
                    {formatTime(dateTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Native Picker */}
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={dateTime}
                mode={pickerMode}
                display="spinner"
                onChange={handleDateChange}
                themeVariant="dark"
                textColor={colors.textPrimary}
                accentColor={colors.primary}
                style={styles.picker}
              />
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleCreate}
            disabled={!canCreate}
          >
            <Text style={styles.createBtnText}>Create task</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.s2,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s5,
  },

  // Back
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.s3,
    marginLeft: -4,
  },
  backText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.primary,
  },

  // Title
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 40,
    marginBottom: spacing.s3,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.s4,
  },

  // Form rows
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s2,
    minHeight: 52,
  },
  formLabel: {
    ...typography.bodyLg,
    color: colors.textSecondary,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
    textAlign: "right",
    padding: 0,
    margin: 0,
  },

  // Chips
  chipRow: {
    flexDirection: "row",
    gap: spacing.s1,
  },
  chip: {
    paddingHorizontal: spacing.s1 + 4,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    borderColor: colors.textMuted,
  },
  chipText: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  chipTextActive: {
    color: colors.textPrimary,
  },

  // Picker
  pickerWrap: {
    alignItems: "center",
    paddingBottom: spacing.s1,
  },
  picker: {
    width: "100%",
    height: 200,
  },

  // Divider
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.s2,
  },

  // Create Button
  createBtn: {
    width: "100%",
    height: spacing.s7,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  createBtnDisabled: {
    opacity: 0.4,
  },
  createBtnText: {
    ...typography.labelLg,
    color: colors.primaryText,
  },
});
