import { useEffect, useState, type ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { radius, useTheme } from "@/lib/theme";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Visible heights as fractions of the window, smallest first. */
  snapPoints?: number[];
  initialSnap?: number;
  dismissible?: boolean;
  title?: string;
  children: ReactNode;
}

const SPRING = { damping: 28, stiffness: 260, mass: 0.9 };

export function BottomSheet({
  open,
  onClose,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
  dismissible = true,
  title,
  children,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(open);

  const heights = snapPoints.map((p) => p * windowHeight);
  const maxHeight = Math.max(...heights);
  // translateY = 0 shows the tallest snap point; maxHeight hides the sheet.
  const offsets = heights.map((h) => maxHeight - h);
  const lowest = Math.max(...offsets);

  const translateY = useSharedValue(maxHeight);
  const startY = useSharedValue(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.value = withSpring(offsets[initialSnap] ?? lowest, SPRING);
    } else if (mounted) {
      translateY.value = withTiming(maxHeight, { duration: 220 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pan = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      const projected = translateY.value + e.velocityY * 0.12;
      if (dismissible && projected > lowest + heights[0] * 0.35) {
        translateY.value = withTiming(maxHeight, { duration: 200 }, () => runOnJS(onClose)());
        return;
      }
      let target = offsets[0];
      for (const o of offsets) if (Math.abs(o - projected) < Math.abs(target - projected)) target = o;
      translateY.value = withSpring(target, SPRING);
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [lowest, maxHeight], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={() => dismissible && onClose()}>
      <GestureHandlerRootView style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => dismissible && onClose()}
            accessibilityRole="button"
            accessibilityLabel="Close sheet"
          />
        </Animated.View>

        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { height: maxHeight, backgroundColor: colors.card }, sheetStyle]}
        >
          <GestureDetector gesture={pan}>
            <View style={styles.grabber} accessibilityRole="adjustable" accessibilityLabel="Drag to resize">
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
              {title ? <Text style={[styles.title, { color: colors.fg }]}>{title}</Text> : null}
            </View>
          </GestureDetector>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  grabber: { paddingTop: 10, paddingBottom: 12, paddingHorizontal: 20 },
  handle: { alignSelf: "center", width: 40, height: 5, borderRadius: 3 },
  title: { fontSize: 18, fontWeight: "600", marginTop: 14 },
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 32 },
});
