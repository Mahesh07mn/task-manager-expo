import { Platform } from "react-native";

// ─── Spacing — 8px Grid ───────────────────────────────────────────────────────
export const spacing = {
  s1: 8,
  s2: 16,
  s3: 24,
  s4: 32,
  s5: 40,
  s6: 48,
  s7: 56,
  s8: 64,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 100,
};

// ─── Colors ───────────────────────────────────────────────────────────────────
export const colors = {
  // Backgrounds
  bg:          "#000000",
  surface:     "#1C1C1E",
  surfaceAlt:  "#2C2C2E",

  // Brand
  primary:     "#FED702",
  primaryText: "#000000",

  // Text
  textPrimary:   "#FFFFFF",
  textSecondary: "#888888",
  textMuted:     "#555555",

  // UI
  divider:     "#2C2C2E",
  border:      "#2C2C2E",
  error:       "#FF453A",
  errorSurface:"#2A1010",
};

// ─── Font ─────────────────────────────────────────────────────────────────────
export const font = Platform.select({
  ios:     "System",   // SF Pro on iOS
  android: "Roboto",
  default: "System",
});

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  // Display
  displayLg: {
    fontFamily: font,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    color: colors.textPrimary,
  },
  displayMd: {
    fontFamily: font,
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
    color: colors.textPrimary,
  },

  // Headings
  headingLg: {
    fontFamily: font,
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
    color: colors.textPrimary,
  },
  headingMd: {
    fontFamily: font,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.textPrimary,
  },
  headingSm: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.textPrimary,
  },

  // Body
  bodyLg: {
    fontFamily: font,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: colors.textPrimary,
  },
  bodyMd: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
  },
  bodySm: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
  },

  // Labels
  labelLg: {
    fontFamily: font,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    color: colors.textPrimary,
  },
  labelMd: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.textPrimary,
  },
  labelSm: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
  },

  // Tagline (used in splash)
  tagline: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: "300",
    letterSpacing: 0.4,
    color: "#D1D1D1",
  },

  // Link
  link: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: "400",
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
};
