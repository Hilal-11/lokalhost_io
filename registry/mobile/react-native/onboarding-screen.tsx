import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { radius, useTheme } from "@/lib/theme";

export interface OnboardingSlide {
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const DEFAULT_SLIDES: OnboardingSlide[] = [
  { title: "Design that ships", body: "Production-ready screens, themed in minutes.", icon: "sparkles", color: "#6366f1" },
  { title: "Fast by default", body: "Native drivers and 60fps gestures on every component.", icon: "flash", color: "#10b981" },
  { title: "Yours to own", body: "Copy the source into your app. No lock-in.", icon: "shield-checkmark", color: "#f97316" },
];

export function OnboardingScreen({ slides = DEFAULT_SLIDES, onDone }: { slides?: OnboardingSlide[]; onDone: () => void }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList<OnboardingSlide>>(null);
  const last = index === slides.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const next = () => {
    if (last) return onDone();
    list.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.top}>
        {!last ? (
          <Pressable onPress={onDone} hitSlop={12} accessibilityRole="button">
            <Text style={[styles.skip, { color: colors.fgMuted }]}>Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={list}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(s) => s.title}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.art, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={72} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={[styles.title, { color: colors.fg }]}>{item.title}</Text>
            <Text style={[styles.body, { color: colors.fgMuted }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Step ${index + 1} of ${slides.length}`}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, { backgroundColor: i === index ? colors.fg : colors.border, width: i === index ? 24 : 8 }]}
            />
          ))}
        </View>
        <Button size="lg" fullWidth onPress={next}>
          {last ? "Get started" : "Next"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  top: { height: 44, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 20 },
  skip: { fontSize: 16, fontWeight: "500" },
  slide: { paddingHorizontal: 24, paddingTop: 16 },
  art: { aspectRatio: 1, borderRadius: radius.xl + 8, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 30, fontWeight: "700", marginTop: 40, letterSpacing: -0.5 },
  body: { fontSize: 17, lineHeight: 25, marginTop: 12 },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 24 },
  dots: { flexDirection: "row", gap: 6 },
  dot: { height: 8, borderRadius: 4 },
});
