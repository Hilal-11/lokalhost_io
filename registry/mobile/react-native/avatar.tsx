import { Children, useState, type ReactElement, type ReactNode } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/lib/theme";

type Status = "online" | "away" | "offline";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  status?: Status;
}

const HUES = [12, 32, 145, 190, 220, 265, 300, 340];

function hueFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return HUES[h % HUES.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size = 40, status }: AvatarProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const dot = status === "online" ? colors.success : status === "away" ? colors.warning : colors.fgMuted;
  const showImage = !!src && !failed;

  return (
    <View accessibilityRole="image" accessibilityLabel={status ? `${name}, ${status}` : name} style={{ width: size, height: size }}>
      {showImage ? (
        <Image source={{ uri: src }} onError={() => setFailed(true)} style={[styles.fill, { borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.fill, styles.center, { borderRadius: size / 2, backgroundColor: `hsl(${hueFor(name)}, 55%, 50%)` }]}>
          <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
        </View>
      )}
      {status ? (
        <View
          style={[
            styles.dot,
            { width: size * 0.28, height: size * 0.28, borderRadius: size, backgroundColor: dot, borderColor: colors.bg },
          ]}
        />
      ) : null}
    </View>
  );
}

export function AvatarGroup({ children, max = 4, size = 40 }: { children: ReactNode; max?: number; size?: number }) {
  const { colors } = useTheme();
  const items = Children.toArray(children) as ReactElement<AvatarProps>[];
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  const overlap = -size * 0.28;

  return (
    <View style={styles.group}>
      {shown.map((child, i) => (
        <View key={i} style={[styles.ring, { marginLeft: i ? overlap : 0, borderRadius: size, borderColor: colors.bg }]}>
          {child}
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={[
            styles.ring,
            styles.center,
            { marginLeft: overlap, width: size + 4, height: size + 4, borderRadius: size, borderColor: colors.bg, backgroundColor: colors.muted },
          ]}
        >
          <Text style={{ color: colors.fg, fontWeight: "600", fontSize: size * 0.32 }}>+{rest}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { width: "100%", height: "100%" },
  center: { alignItems: "center", justifyContent: "center" },
  initials: { color: "#fff", fontWeight: "600" },
  dot: { position: "absolute", right: 0, bottom: 0, borderWidth: 2 },
  group: { flexDirection: "row", alignItems: "center" },
  ring: { borderWidth: 2 },
});
