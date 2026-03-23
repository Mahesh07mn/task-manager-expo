import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors, typography, spacing } from "../utils/theme";

const { width } = Dimensions.get("window");
const LOGO_WIDTH = width * 0.55;
const LOGO_HEIGHT = LOGO_WIDTH * (64 / 165);

const Logo = () => (
  <Svg
    width={LOGO_WIDTH}
    height={LOGO_HEIGHT}
    viewBox="0 0 165 64"
    fill="none"
  >
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

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 900,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
        <Logo />
        <Text style={styles.tagline}>Organize your day, effortlessly.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: spacing.s3,
  },
  tagline: {
    ...typography.tagline,
    textAlign: "center",
    marginTop: spacing.s1,
  },
});
