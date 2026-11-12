import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useTheme } from "@/lib/theme";

export interface TabsProps {
  tabs: string[];
  value: number;
  onChange: (index: number) => void;
  variant?: "segmented" | "underline";
}

export function Tabs({ tabs, value, onChange, variant = "segmented" }: TabsProps) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const inset = variant === "segmented" ? 3 : 0;
  const tabWidth = width > 0 ? (width - inset * 2) / tabs.length : 0;
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withTiming(value * tabWidth, { duration: 220 });
  }, [value, tabWidth, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const segmented = variant === "segmented";

  return (
    <View
      accessibilityRole="tablist"
      onLayout={onLayout}
      style={segmented ? [styles.track, { backgroundColor: colors.muted }] : [styles.underlineTrack, { borderColor: colors.border }]}
    >
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            segmented
              ? [styles.pill, { width: tabWidth, backgroundColor: colors.card }]
              : [styles.underline, { width: tabWidth, backgroundColor: colors.fg }],
            indicator,
          ]}
        />
      ) : null}
      {tabs.map((label, i) => {
        const selected = i === value;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(i)}
            style={segmented ? styles.segment : styles.tab}
          >
            <Text
              style={[
                segmented ? styles.segmentLabel : styles.tabLabel,
                { color: selected ? colors.fg : colors.fgMuted },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", height: 36, borderRadius: 10, padding: 3 },
  pill: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segment: { flex: 1, alignItems: "center", justifyContent: "center" },
  segmentLabel: { fontSize: 13.5, fontWeight: "600" },
  underlineTrack: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  underline: { position: "absolute", bottom: -1, left: 0, height: 2, borderRadius: 1 },
  tab: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
  tabLabel: { fontSize: 15, fontWeight: "500" },
});
