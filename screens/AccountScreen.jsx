import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from "../utils/theme";

export default function AccountScreen({ user, onSignOut, onBack }) {
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onSignOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <MaterialIcons name="chevron-left" size={32} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarImage} />
            ) : (
              <MaterialIcons name="person" size={48} color={colors.textSecondary} />
            )}
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="email" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || ''}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="person" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Name</Text>
            </View>
            <Text style={styles.infoValue}>{user?.name || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons name="google" size={20} color={colors.textSecondary} />
              <Text style={styles.infoLabel}>Account Type</Text>
            </View>
            <Text style={styles.infoValue}>Google Account</Text>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="palette" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <Text style={styles.settingValue}>Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="backup" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Backup</Text>
            </View>
            <Text style={styles.settingValue}>Auto</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="description" size={20} color={colors.textSecondary} />
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={20} color="#fff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>TaskMaster v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s2,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s1,
  },
  backText: {
    ...typography.bodyLg,
    color: colors.primary,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.s4,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    ...typography.displayLg,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.s1,
  },
  userEmail: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  section: {
    paddingVertical: spacing.s3,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: '600',
    paddingHorizontal: spacing.s2,
    marginBottom: spacing.s2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s2,
    paddingVertical: spacing.s2,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  infoLabel: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  infoValue: {
    ...typography.bodyLg,
    color: colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s2,
    paddingVertical: spacing.s3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  settingLabel: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  settingValue: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  signOutSection: {
    paddingVertical: spacing.s4,
    paddingHorizontal: spacing.s2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s2,
    backgroundColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: spacing.s3,
  },
  signOutButtonText: {
    ...typography.bodyLg,
    color: '#fff',
    fontWeight: '600',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: spacing.s4,
  },
  versionText: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginBottom: spacing.s1,
  },
  versionSubtext: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
});
