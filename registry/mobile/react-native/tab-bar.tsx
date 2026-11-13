import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface TabBarItem {
  key: string;
  label: string;
  icon: IoniconName;
  /** Filled glyph for the active state; defaults to `icon` without "-outline". */
  activeIcon?: IoniconName;
  badge?: number;
}

export interface TabBarProps {
  items: TabBarItem[];
  active: string;
  onChange: (key: string) => void;
}

/**
 * Bottom navigation. Works standalone, or as a React Navigation tab bar:
 * `tabBar={({ state, navigation }) => <TabBar active={state.routes[state.index].name} … />}`
 */
export function TabBar({ items, active, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const android = Platform.OS === "android";

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8), backgroundColor: colors.bg, borderTopColor: colors.border }]}
    >
      {items.map((item) => {
        const selected = item.key === active;
        const glyph = selected ? (item.activeIcon ?? (item.icon.replace("-outline", "") as IoniconName)) : item.icon;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.badge ? `${item.label}, ${item.badge} new` : item.label}
            onPress={() => onChange(item.key)}
            style={styles.item}
          >
            <View style={[styles.iconWrap, android && selected && { backgroundColor: colors.muted }]}>
              <Ionicons name={glyph} size={24} color={selected ? colors.fg : colors.fgMuted} />
              {item.badge ? (
                <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.bg }]}>
                  <Text style={styles.badgeText}>{item.badge > 99 ? "99+" : item.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color: selected ? colors.fg : colors.fgMuted, fontWeight: selected ? "600" : "400" }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", paddingTop: 6, borderTopWidth: StyleSheet.hairlineWidth },
  item: { flex: 1, alignItems: "center", gap: 2 },
  iconWrap: { height: 32, width: 64, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11 },
  badge: {
    position: "absolute",
    top: 0,
    right: 12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
