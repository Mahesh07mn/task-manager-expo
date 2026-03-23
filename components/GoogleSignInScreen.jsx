import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from './theme';
// Mock Google Sign-in for development
// In production, uncomment the import below:
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function GoogleSignInScreen({ onSignIn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock configuration - not needed for pure mock implementation

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Mock Google Sign-In for development
      // In production, this would be:
      // await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const userData = {
        id: 'mock-user-123',
        email: 'demo.user@gmail.com',
        name: 'Demo User',
        photo: null,
        idToken: 'mock-token',
      };
      
      onSignIn(userData);
    } catch (error) {
      setIsLoading(false);
      setError('Something went wrong. Please try again.');
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <MaterialIcons name="checklist" size={48} color={colors.primary} />
            </View>
            <Text style={styles.appName}>TaskMaster</Text>
            <Text style={styles.tagline}>Organize your day, effortlessly</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.illustration}>
            <MaterialIcons name="assignment" size={120} color={colors.primary} />
          </View>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <MaterialIcons name="check-circle" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Create and manage tasks</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="schedule" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Set reminders and deadlines</Text>
            </View>
            <View style={styles.feature}>
              <MaterialIcons name="sync" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Sync across all devices</Text>
            </View>
          </View>
        </View>

        {/* Sign In Section */}
        <View style={styles.signInSection}>
          <Text style={styles.signInTitle}>Get Started</Text>
          <Text style={styles.signInSubtitle}>Sign in with your Google account to sync your tasks</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size={20} />
            ) : (
              <>
                <Image
                  source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
                <Text style={styles.signInButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.privacyText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.s3,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.s6,
    paddingBottom: spacing.s4,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s2,
  },
  appName: {
    ...typography.displayLg,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.s1,
  },
  tagline: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.s4,
  },
  illustration: {
    marginBottom: spacing.s6,
  },
  features: {
    gap: spacing.s3,
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s2,
  },
  featureText: {
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  signInSection: {
    paddingBottom: spacing.s6,
    alignItems: 'center',
  },
  signInTitle: {
    ...typography.displayLg,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.s1,
  },
  signInSubtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.s4,
  },
  errorText: {
    ...typography.bodySm,
    color: '#FF3B30',
    marginBottom: spacing.s3,
    textAlign: 'center',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s2,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s4,
    marginBottom: spacing.s3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  signInButtonText: {
    ...typography.bodyLg,
    color: '#000',
    fontWeight: '600',
  },
  privacyText: {
    ...typography.bodySm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.s4,
  },
});
