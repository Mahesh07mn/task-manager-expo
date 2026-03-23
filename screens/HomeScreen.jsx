import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Animated,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius } from '../utils/theme';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const toMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatGroupLabel = (dateStr) => {
  const today     = toMidnight(new Date());
  const yesterday = today - 86400000;
  const target    = toMidnight(new Date(dateStr));

  if (target === today)     return "Today";
  if (target === yesterday) return "Yesterday";

  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

// ─── Group tasks by date ──────────────────────────────────────────────────────
const groupByDate = (tasks) => {
  const map = {};
  tasks.forEach((task) => {
    if (!map[task.date]) map[task.date] = [];
    map[task.date].push(task);
  });

  return Object.keys(map)
    .sort((a, b) => new Date(b) - new Date(a))
    .map((date) => ({
      id:    date,
      label: formatGroupLabel(date),
      tasks: map[date],
    }));
};

// ─── Task Card ────────────────────────────────────────────────────────────────
// ─── Swipeable delete action ──────────────────────────────────────────────────
const DeleteAction = ({ onDelete }) => (
  <TouchableOpacity style={styles.deleteAction} onPress={onDelete} activeOpacity={0.8}>
    <MaterialIcons name="delete" size={22} color="#fff" />
  </TouchableOpacity>
);

// ─── Individual swipeable task row ───────────────────────────────────────────────
const SwipeableTaskRow = ({ task, onDelete, isLast }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const swipeRef    = useRef(null);

  const triggerDelete = useCallback(() => {
    // iOS-style immediate delete with spring animation
    swipeRef.current?.close();
    Animated.spring(opacityAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      onDelete(task.id);
    });
  }, [task.id, onDelete]);

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
        onSwipeableOpen={() => {
          // Haptic feedback on iOS
          if (Platform.OS === 'ios') {
            // Note: Would need expo-haptics for actual haptic feedback
          }
        }}
      >
        <View style={styles.taskRow}>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
        </View>
      </Swipeable>
      {!isLast && <View style={styles.divider} />}
    </Animated.View>
  );
};

// ─── Task Card with individual swipeable rows ───────────────────────────────────────
const AnimatedTaskCard = ({ tasks, onPress, onDelete }) => {
  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.card}>
      {tasks.map((task, index) => (
        <SwipeableTaskRow
          key={task.id}
          task={task}
          onDelete={onDelete}
          isLast={index === tasks.length - 1}
        />
      ))}
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ userEmail, onCreateTask, onOpenGroup, tasks, onDeleteTask, onNavigateToAccount }) {
  const [search, setSearch] = useState("");
  const insets = useSafeAreaInsets();
  const barHeight = 64;
  const defaultBottom = insets.bottom + spacing.s2;
  const barAnim = useRef(new Animated.Value(defaultBottom)).current;

  const handleDeleteTask = useCallback((taskId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onDeleteTask?.(taskId);
  }, [onDeleteTask]);

  const handleAccountPress = () => {
    onNavigateToAccount?.();
  };

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const duration = Platform.OS === "ios" ? 250 : 150;

    const onShow = (e) => {
      Animated.timing(barAnim, {
        toValue: e.endCoordinates.height + spacing.s1,
        duration,
        useNativeDriver: false,
      }).start();
    };
    const onHide = () => {
      Animated.timing(barAnim, {
        toValue: defaultBottom,
        duration,
        useNativeDriver: false,
      }).start();
    };

    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);
    return () => { sub1.remove(); sub2.remove(); };
  }, [defaultBottom]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groupByDate(tasks);
    const filtered = tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query)
    );
    return groupByDate(filtered);
  }, [search, tasks]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: defaultBottom + barHeight + spacing.s2 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.heading}>Your task</Text>
            {userEmail && <Text style={styles.userEmail}>{userEmail}</Text>}
          </View>
          <TouchableOpacity style={styles.accountBtn} onPress={handleAccountPress} activeOpacity={0.7}>
            <MaterialIcons name="account-circle" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Task Groups */}
        {filteredGroups.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found.</Text>
        ) : (
          filteredGroups.map((group) => (
            <View key={group.id} style={styles.group}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              <AnimatedTaskCard 
                tasks={group.tasks} 
                onPress={() => onOpenGroup?.(group)} 
                onDelete={handleDeleteTask}
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* Horizontal Floating Bar */}
      <Animated.View style={[styles.floatingBar, { bottom: barAnim }]}>
        {/* Search Glass Pill */}
        <View style={styles.searchShadowWrap}>
          <BlurView intensity={72} tint="dark" style={styles.searchGlass}>
            <View style={styles.searchGlassOverlay} pointerEvents="none" />
            <View style={styles.searchGlassHighlight} pointerEvents="none" />
            <MaterialIcons name="search" size={24} color={colors.textSecondary} style={styles.searchIcon} />
            <View style={styles.searchInputWrap}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor={colors.textMuted}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
          </BlurView>
        </View>

        {/* Add Glass Button */}
        <View style={styles.addShadowWrap}>
          <BlurView intensity={80} tint="dark" style={styles.addGlass}>
            <View style={styles.addGlassOverlay} pointerEvents="none" />
            <View style={styles.addGlassHighlight} pointerEvents="none" />
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.75} onPress={onCreateTask}>
              <MaterialIcons name="add" size={32} color="#000" />
            </TouchableOpacity>
          </BlurView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.s2,
    paddingTop: spacing.s3,
    paddingBottom: 96 + spacing.s3,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.s3,
  },
  headerLeft: {
    flex: 1,
  },
  heading: {
    ...typography.displayLg,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  userEmail: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  accountBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },  

  // Group
  group: {
    marginBottom: spacing.s3,
  },
  groupLabel: {
    ...typography.bodyMd,
    color: colors.textPrimary,
    paddingHorizontal: spacing.s1,
    marginBottom: spacing.s1,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  taskRow: {
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s2,
  },
  taskName: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 2,
  },
  taskSubtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.s2,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.s5,
  },

  gradientMask: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 80,
  },

  // Floating Bar
  floatingBar: {
    position: "absolute",
    left: spacing.s2,
    right: spacing.s2,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s1,
  },

  // Search shadow wrapper (shadow lives here, not on BlurView)
  searchShadowWrap: {
    flex: 1,
    height: 56,
    borderRadius: radius.pill,
  },
  searchGlass: {
    flex: 1,
    height: 56,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.s2,
    gap: spacing.s1,
    overflow: "hidden",
  },
  searchIcon: {
    marginLeft: 4,
  },
  searchInputWrap: {
    flex: 1,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  searchGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  searchGlassHighlight: {
    position: "absolute",
    top: 0,
    left: spacing.s2,
    right: spacing.s2,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 1,
  },

  // Add shadow wrapper
  addShadowWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
  // Add glass button
  addGlass: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(254,215,2,0.45)",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: { backgroundColor: "rgba(254,215,2,0.25)" },
    }),
  },
  addGlassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(254,215,2,0.38)",
  },
  addGlassHighlight: {
    position: "absolute",
    top: 0,
    left: spacing.s1,
    right: spacing.s1,
    height: 1.5,
    backgroundColor: "rgba(254,215,2,0.85)",
    borderRadius: 1,
  },
  addBtn: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  // Gradient below tab
  gradientBelow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,
    pointerEvents: "none",
  },
  gradient: {
    flex: 1,
  },

  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  glassHighlight: {
    position: "absolute",
    top: 0,
    left: spacing.s2,
    right: spacing.s2,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderRadius: 1,
  },
  addGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254,215,2,0.38)",
  },
  addGlassHighlight: {
    position: "absolute",
    top: 0,
    left: spacing.s1,
    right: spacing.s1,
    height: 1.5,
    backgroundColor: "rgba(254,215,2,0.85)",
    borderRadius: 1,
  },
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
    backgroundColor: colors.error, // Red like iOS
    justifyContent: "center",
    alignItems: "center",
  },
});
