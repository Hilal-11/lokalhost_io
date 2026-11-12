import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, useTheme } from "@/lib/theme";

type Variant = "elevated" | "outline" | "filled";

export interface CardProps {
  title: string;
  subtitle?: string;
  media?: ReactNode;
  footer?: ReactNode;
  variant?: Variant;
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ title, subtitle, media, footer, variant = "outline", onPress, children, style }: CardProps) {
  const { colors, dark } = useTheme();

  const surface: Record<Variant, ViewStyle> = {
    elevated: {
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOpacity: dark ? 0.4 : 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    outline: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    filled: { backgroundColor: colors.muted },
  };

  const body = (
    <>
      {media ? <View style={styles.media}>{media}</View> : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.fg }]} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.fgMuted }]}>{subtitle}</Text> : null}
        {children}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </>
  );

  if (!onPress) return <View style={[styles.base, surface[variant], style]}>{body}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.base, surface[variant], { opacity: pressed ? 0.9 : 1 }, style]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, overflow: "hidden" },
  media: { overflow: "hidden" },
  content: { padding: 16, gap: 4 },
  title: { fontSize: 17, fontWeight: "600" },
  subtitle: { fontSize: 14 },
  footer: { flexDirection: "row", gap: 8, marginTop: 12 },
});
