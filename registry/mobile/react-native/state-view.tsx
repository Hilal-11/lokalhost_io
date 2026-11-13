import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

type Variant = "empty" | "error" | "offline";

const DEFAULTS: Record<Variant, { icon: keyof typeof Ionicons.glyphMap; title: string; description: string }> = {
  empty: { icon: "file-tray-outline", title: "Nothing here yet", description: "When there’s something to show, it’ll appear here." },
  error: { icon: "warning-outline", title: "Something went wrong", description: "We couldn’t load this. It’s not you — it’s us." },
  offline: { icon: "cloud-offline-outline", title: "You’re offline", description: "Check your connection. We’ll sync when you’re back." },
};

export interface StateViewProps {
  variant?: Variant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function StateView({ variant = "empty", title, description, actionLabel, onAction }: StateViewProps) {
  const { colors } = useTheme();
  const d = DEFAULTS[variant];

  return (
    <View style={styles.root} accessibilityRole={variant === "error" ? "alert" : undefined}>
      <View style={[styles.icon, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Ionicons name={d.icon} size={34} color={colors.fgMuted} />
      </View>
      <Text style={[styles.title, { color: colors.fg }]}>{title ?? d.title}</Text>
      <Text style={[styles.description, { color: colors.fgMuted }]}>{description ?? d.description}</Text>
      {actionLabel && onAction ? (
        <Button onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  icon: { width: 80, height: 80, borderRadius: 26, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 21, fontWeight: "600", marginTop: 20, textAlign: "center" },
  description: { fontSize: 15.5, lineHeight: 22, marginTop: 6, textAlign: "center" },
  action: { marginTop: 24 },
});
