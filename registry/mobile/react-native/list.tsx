import { Children, Fragment, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, useTheme } from "@/lib/theme";

/* ------------------------------ ListGroup ----------------------------- */

export function ListGroup({ header, footer, children }: { header?: string; footer?: string; children: ReactNode }) {
  const { colors } = useTheme();
  const rows = Children.toArray(children);
  return (
    <View style={styles.group}>
      {header ? <Text style={[styles.header, { color: colors.fgMuted }]}>{header.toUpperCase()}</Text> : null}
      <View style={[styles.inset, { backgroundColor: colors.card }]}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={[styles.separator, { backgroundColor: colors.border }]} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
      {footer ? <Text style={[styles.footer, { color: colors.fgMuted }]}>{footer}</Text> : null}
    </View>
  );
}

/* ------------------------------ ListItem ------------------------------ */

export interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  onPress?: () => void;
}

export function ListItem({
  title,
  subtitle,
  icon,
  iconColor,
  value,
  trailing,
  leading,
  chevron,
  destructive = false,
  onPress,
}: ListItemProps) {
  const { colors } = useTheme();
  const showChevron = chevron ?? (!!onPress && !trailing);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.muted }]}
    >
      {leading}
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: iconColor ?? colors.fgMuted }]}>
          <Ionicons name={icon} size={17} color="#fff" />
        </View>
      ) : null}
      <View style={styles.text}>
        <Text numberOfLines={1} style={[styles.title, { color: destructive ? colors.danger : colors.fg }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.fgMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? <Text style={[styles.value, { color: colors.fgMuted }]}>{value}</Text> : null}
      {trailing}
      {showChevron ? <Ionicons name="chevron-forward" size={18} color={colors.fgMuted} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: { paddingHorizontal: 16, gap: 6 },
  header: { fontSize: 13, paddingHorizontal: 16, letterSpacing: 0.4 },
  footer: { fontSize: 13, paddingHorizontal: 16 },
  inset: { borderRadius: radius.lg, overflow: "hidden" },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  row: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 8 },
  iconBox: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  text: { flex: 1 },
  title: { fontSize: 16 },
  subtitle: { fontSize: 13, marginTop: 1 },
  value: { fontSize: 15 },
});
