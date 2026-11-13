import type { ReactNode } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, useTheme } from "@/lib/theme";

export interface AppHeaderProps {
  title: string;
  eyebrow?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  right?: ReactNode;
}

/** Large-title header with an optional inline search field. */
export function AppHeader({ title, eyebrow, onSearch, searchPlaceholder = "Search", right }: AppHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {eyebrow ? <Text style={[styles.eyebrow, { color: colors.fgMuted }]}>{eyebrow}</Text> : null}
          <Text accessibilityRole="header" style={[styles.title, { color: colors.fg }]}>
            {title}
          </Text>
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {onSearch ? (
        <View style={[styles.search, { backgroundColor: colors.muted }]}>
          <Ionicons name="search" size={17} color={colors.fgMuted} />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.fgMuted}
            onChangeText={onSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel={searchPlaceholder}
            style={[styles.input, { color: colors.fg }]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 12 },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  eyebrow: { fontSize: 14, fontWeight: "500" },
  title: { fontSize: 32, fontWeight: "700", letterSpacing: -0.5 },
  right: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 4 },
  search: { height: 40, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, borderRadius: radius.md },
  input: { flex: 1, fontSize: 16, height: "100%" },
});
