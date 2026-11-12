import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { radius, useTheme } from "@/lib/theme";

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
}

export interface PricingPlansProps {
  plans: Plan[];
  value: string;
  onChange: (id: string) => void;
  onContinue: () => void;
  onRestore?: () => void;
  features?: string[];
  loading?: boolean;
}

export function PricingPlans({ plans, value, onChange, onContinue, onRestore, features = [], loading }: PricingPlansProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.badgeIcon}>
            <Ionicons name="star" size={26} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.fg }]}>Unlock Pro</Text>
        </View>

        {features.map((f) => (
          <View key={f} style={styles.feature}>
            <Ionicons name="checkmark" size={18} color={colors.success} />
            <Text style={{ color: colors.fg, fontSize: 15 }}>{f}</Text>
          </View>
        ))}

        <View accessibilityRole="radiogroup" style={styles.plans}>
          {plans.map((p) => {
            const selected = p.id === value;
            return (
              <Pressable
                key={p.id}
                onPress={() => onChange(p.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${p.name}, ${p.price}, ${p.period}`}
                style={[styles.plan, { borderColor: selected ? colors.fg : colors.border }]}
              >
                <View style={[styles.radio, { borderColor: selected ? colors.fg : colors.border }]}>
                  {selected ? <View style={[styles.radioDot, { backgroundColor: colors.fg }]} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, { color: colors.fg }]}>{p.name}</Text>
                  <Text style={{ color: colors.fgMuted, fontSize: 13 }}>{p.period}</Text>
                </View>
                <Text style={[styles.planPrice, { color: colors.fg }]}>{p.price}</Text>
                {p.badge ? (
                  <View style={[styles.planBadge, { backgroundColor: colors.success }]}>
                    <Text style={styles.planBadgeText}>{p.badge}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button size="lg" fullWidth loading={loading} onPress={onContinue}>
          Continue
        </Button>
        {onRestore ? (
          <Text onPress={onRestore} accessibilityRole="link" style={[styles.restore, { color: colors.fgMuted }]}>
            Restore purchases
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 24, gap: 10 },
  hero: { alignItems: "center", marginBottom: 12 },
  badgeIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#f59e0b", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 27, fontWeight: "700", marginTop: 16 },
  feature: { flexDirection: "row", alignItems: "center", gap: 10 },
  plans: { gap: 10, marginTop: 14 },
  plan: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderWidth: 2, borderRadius: radius.lg },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  planName: { fontSize: 16, fontWeight: "600" },
  planPrice: { fontSize: 17, fontWeight: "700" },
  planBadge: { position: "absolute", top: -10, right: 16, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  planBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  footer: { padding: 24, paddingTop: 12, gap: 12, alignItems: "center" },
  restore: { fontSize: 13 },
});
