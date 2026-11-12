import { StyleSheet, Text, View } from "react-native";
import { radius, useTheme } from "@/lib/theme";

export interface Stat {
  label: string;
  value: string;
  /** Percentage change, e.g. 8.2 or -2.4 */
  delta?: number;
  /** Recent values for the sparkline (oldest first). */
  series?: number[];
}

/** Bar sparkline built from Views — no SVG dependency. */
function Sparkline({ series, color }: { series: number[]; color: string }) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  return (
    <View style={styles.spark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {series.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: `${20 + ((v - min) / (max - min || 1)) * 80}%`,
            backgroundColor: color,
            opacity: 0.35 + (i / series.length) * 0.65,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}

export function StatsGrid({ stats }: { stats: Stat[] }) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {stats.map((s) => {
        const up = (s.delta ?? 0) >= 0;
        const tone = up ? colors.success : colors.danger;
        return (
          <View
            key={s.label}
            accessible
            accessibilityLabel={`${s.label} ${s.value}${s.delta != null ? `, ${up ? "up" : "down"} ${Math.abs(s.delta)} percent` : ""}`}
            style={[styles.tile, { backgroundColor: colors.card }]}
          >
            <Text style={{ color: colors.fgMuted, fontSize: 13 }}>{s.label}</Text>
            <Text style={[styles.value, { color: colors.fg }]}>{s.value}</Text>
            {s.delta != null ? (
              <Text style={{ color: tone, fontSize: 13, fontWeight: "500" }}>
                {up ? "▲" : "▼"} {Math.abs(s.delta)}%
              </Text>
            ) : null}
            {s.series?.length ? <Sparkline series={s.series} color={tone} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, padding: 16 },
  tile: { flexBasis: "47%", flexGrow: 1, padding: 16, borderRadius: radius.lg, gap: 4 },
  value: { fontSize: 24, fontWeight: "700", letterSpacing: -0.3 },
  spark: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 28, marginTop: 8 },
});
