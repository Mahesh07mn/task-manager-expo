import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  KeyboardAvoidingView,
  Platform,
  UIManager,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { colors, typography, spacing, radius } from "../utils/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Pending count helper ─────────────────────────────────────────────────────
const pendingLabel = (items) => {
  const total   = items.length;
  const done    = items.filter((i) => i.done).length;
  const pending = total - done;
  if (pending === 0) return "Completed";
  return `${done}/${total} Pending`;
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const Checkbox = ({ checked, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.checkbox}>
    <MaterialIcons
      name={checked ? "check-box" : "check-box-outline-blank"}
      size={22}
      color={checked ? colors.primary : colors.textSecondary}
    />
  </TouchableOpacity>
);

// ─── Swipeable delete action ──────────────────────────────────────────────────
const DeleteAction = ({ onDelete }) => (
  <TouchableOpacity style={styles.deleteAction} onPress={onDelete} activeOpacity={0.8}>
    <View style={styles.deleteIconCircle}>
      <MaterialIcons name="delete" size={20} color="#fff" />
    </View>
  </TouchableOpacity>
);

// ─── Animated swipeable item ─────────────────────────────────────────────────
const AnimatedItem = ({ item, groupId, onToggle, onDelete }) => {
  const heightAnim  = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const swipeRef    = useRef(null);
  const [swiping, setSwiping] = useState(false);

  const triggerDelete = useCallback(() => {
    swipeRef.current?.close();
    Animated.spring(opacityAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => onDelete(groupId, item.id));
  }, [groupId, item.id, onDelete]);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp',
    });
    
    const opacity = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteAction, { transform: [{ scale }], opacity }]}>
        <TouchableOpacity 
          onPress={triggerDelete} 
          activeOpacity={0.8}
          style={styles.deleteButtonInner}
        >
          <View style={styles.deleteIconCircle}>
            <MaterialIcons name="delete" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <Swipeable
        ref={swipeRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        enableTrackpadTwoFingerGesture={false}
        overshootRight={false}
        overshootLeft={false}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={() => setSwiping(true)}
        onSwipeableWillClose={() => setSwiping(false)}
        onSwipeableClose={() => setSwiping(false)}
      >
        <View style={[styles.itemRow, swiping && styles.itemRowSwiping]}>
          <Checkbox
            checked={item.done}
            onPress={() => onToggle(groupId, item.id)}
          />
          <Text style={[styles.itemText, item.done && styles.itemDone]}>
            {item.name}
          </Text>
        </View>
      </Swipeable>
    </Animated.View>
  );
};

// ─── Task Group Card ──────────────────────────────────────────────────────────
const TaskGroupCard = ({ group, onToggle, onDelete, onAddNew }) => {
  const [newText, setNewText] = useState("");
  const [adding, setAdding]   = useState(false);

  const handleAdd = () => {
    if (newText.trim()) {
      onAddNew(group.id, newText.trim());
      setNewText("");
    }
    setAdding(false);
  };

  // checked first (top), unchecked below
  const sortedItems = [
    ...group.items.filter((i) => i.done),
    ...group.items.filter((i) => !i.done),
  ];

  return (
    <View style={styles.groupSection}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupPending}>{pendingLabel(group.items)}</Text>
      </View>

      <View style={styles.card}>
        {sortedItems.map((item, index) => (
          <View key={item.id}>
            <AnimatedItem
              item={item}
              groupId={group.id}
              onToggle={onToggle}
              onDelete={onDelete}
            />
            {index < sortedItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        <View style={styles.divider} />

        {adding ? (
          <View style={styles.addInputRow}>
            <MaterialIcons name="add" size={20} color={colors.primary} style={styles.addIcon} />
            <TextInput
              style={styles.addInput}
              value={newText}
              onChangeText={setNewText}
              placeholder="New task name"
              placeholderTextColor={colors.textMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              onBlur={handleAdd}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.addRow} onPress={() => setAdding(true)} activeOpacity={0.7}>
            <MaterialIcons name="add" size={20} color={colors.primary} style={styles.addIcon} />
            <Text style={styles.addText}>Add new</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── Task Screen ──────────────────────────────────────────────────────────────
export default function TaskScreen({ dateGroup, onBack, onUpdateTasks }) {
  const [groups, setGroups] = useState(
    dateGroup.tasks.map((t) => ({ ...t, items: t.items ? [...t.items] : [] }))
  );
  const [editing, setEditing] = useState(false);

  // Sync local changes back to parent
  useEffect(() => {
    onUpdateTasks?.(groups);
  }, [groups]);

  // Extract current task data
  const currentTask = dateGroup.tasks[0] || {};
  const currentDate = currentTask.date ? new Date(currentTask.date + "T00:00:00") : new Date();
  
  // Parse time from subtitle (e.g., "Expires at 8:52 AM")
  const parseTimeFromSubtitle = (subtitle) => {
    if (!subtitle) return { hours: 12, minutes: 0 };
    const match = subtitle.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return { hours: 12, minutes: 0 };
    let [, hour, minute, period] = match;
    hour = parseInt(hour);
    minute = parseInt(minute);
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    return { hours: hour, minutes: minute };
  };
  
  const timeData = parseTimeFromSubtitle(currentTask.subtitle);
  currentDate.setHours(timeData.hours);
  currentDate.setMinutes(timeData.minutes);
  
  const [editName, setEditName] = useState(currentTask.name || "");
  const [editDateTime, setEditDateTime] = useState(currentDate);
  const [pickerMode, setPickerMode] = useState("time");

  const title = dateGroup.label === "Today" || dateGroup.label === "Yesterday"
    ? `${dateGroup.label}'s task`
    : `${dateGroup.label} task`;

  const subtitle = dateGroup.tasks[0]?.subtitle ?? "";

  const handleToggle = (groupId, itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          items: g.items.map((i) =>
            i.id !== itemId ? i : { ...i, done: !i.done }
          ),
        }
      )
    );
  };

  const handleDelete = (groupId, itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          items: g.items.filter((i) => i.id !== itemId),
        }
      )
    );
  };

  const handleAddNew = (groupId, name) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          items: [...g.items, { id: `new_${Date.now()}`, name, done: false }],
        }
      )
    );
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    // Update all groups with new name and time
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        name: editName,
        dateTime: editDateTime,
        subtitle: `Expires at ${formatTime(editDateTime)}`,
      }))
    );
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(currentTask.name || "");
    setEditDateTime(currentDate);
    setEditing(false);
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

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

        {/* Page title row */}
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity onPress={handleEdit} activeOpacity={0.7} style={styles.editBtn}>
            <MaterialIcons name="edit" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Edit Modal */}
        <Modal
          visible={editing}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Name Row */}
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Task name"
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
                      {formatDate(editDateTime)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, pickerMode === "time" && styles.chipActive]}
                    onPress={() => setPickerMode("time")}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, pickerMode === "time" && styles.chipTextActive]}>
                      {formatTime(editDateTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Native Picker */}
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={editDateTime}
                  mode={pickerMode}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setEditDateTime(selectedDate);
                  }}
                  themeVariant="dark"
                  textColor={colors.textPrimary}
                  accentColor={colors.primary}
                  style={styles.picker}
                />
              </View>

              {/* Save/Cancel Actions */}
              <View style={styles.formActions}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn} activeOpacity={0.85}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn} activeOpacity={0.85}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Task groups */}
        {groups.map((group) => (
          <TaskGroupCard
            key={group.id}
            group={group}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
          />
        ))}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.s4,
    paddingHorizontal: spacing.s1,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: typography.displayLg.fontFamily,
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 40,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    marginTop: 6,
    paddingLeft: spacing.s2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.s3,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    width: "100%",
    maxWidth: 400,
  },
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
  pickerWrap: {
    alignItems: "center",
    paddingBottom: spacing.s1,
  },
  picker: {
    width: "100%",
    height: 200,
  },
  formActions: {
    flexDirection: "row",
    gap: spacing.s2,
    paddingHorizontal: spacing.s2,
    paddingBottom: spacing.s2,
  },
  cancelBtn: {
    flex: 1,
    height: spacing.s6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    ...typography.labelLg,
    color: colors.textPrimary,
  },
  saveBtn: {
    flex: 1,
    height: spacing.s6,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    ...typography.labelLg,
    color: colors.primaryText,
  },

  // Group section
  groupSection: {
    marginBottom: spacing.s3,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s1,
    paddingHorizontal: spacing.s1,
    marginBottom: spacing.s1,
  },
  groupName: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  groupPending: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },

  // Item row
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s1 + 4,
    paddingHorizontal: spacing.s2,
  },
  checkbox: {
    marginRight: spacing.s1 + 4,
  },
  itemText: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  itemRowSwiping: {
    backgroundColor: "#2C2C2F",
  },
  itemDone: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.s2,
  },

  // Swipe delete action
  deleteAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    overflow: 'hidden',
  },
  deleteButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  deleteIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },

  // Add new row
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s1 + 4,
    paddingHorizontal: spacing.s2,
  },
  addIcon: {
    marginRight: spacing.s1 + 4,
  },
  addText: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  addInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s1,
    paddingHorizontal: spacing.s2,
  },
  addInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.textPrimary,
    paddingVertical: spacing.s1,
    includeFontPadding: false,
  },
});
