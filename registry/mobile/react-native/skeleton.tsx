import { useEffect, useState } from "react";
import { StyleSheet, View, type DimensionValue, type LayoutChangeEvent, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useTheme } from "@/lib/theme";

export interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** A placeholder with a light band sweeping across it. */
export function Skeleton({ width = "100%", height = 16, radius = 8, style }: SkeletonProps) {
  const { colors, dark } = useTheme();
  const [w, setW] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, [progress]);

  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: -w + progress.value * w * 2 }],
  }));

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={onLayout}
      style={[styles.base, { width, height, borderRadius: radius, backgroundColor: colors.muted }, style]}
    >
      {w > 0 ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { width: w * 0.5, backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)" },
            band,
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: "hidden" },
});
