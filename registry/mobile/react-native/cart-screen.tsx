import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { radius, useTheme } from "@/lib/theme";

export interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
  image?: string;
}

export interface CartScreenProps {
  items: CartItem[];
  onQuantityChange: (id: string, qty: number) => void;
  onCheckout: () => void;
  shipping?: number;
  taxRate?: number;
}

const money = (n: number) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stepper, { borderColor: colors.border }]} accessibilityLabel={`${label} quantity ${value}`}>
      <Pressable
        onPress={() => onChange(value - 1)}
        style={[styles.stepBtn, { backgroundColor: colors.muted }]}
        accessibilityRole="button"
        accessibilityLabel={value === 1 ? `Remove ${label}` : `Decrease ${label}`}
      >
        <Ionicons name={value === 1 ? "trash-outline" : "remove"} size={14} color={colors.fg} />
      </Pressable>
      <Text style={[styles.qty, { color: colors.fg }]}>{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        style={[styles.stepBtn, { backgroundColor: colors.muted }]}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
      >
        <Ionicons name="add" size={14} color={colors.fg} />
      </Pressable>
    </View>
  );
}

export function CartScreen({ items, onQuantityChange, onCheckout, shipping = 0, taxRate = 0.08 }: CartScreenProps) {
  const { colors } = useTheme();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;

  const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
    <View style={styles.summaryRow}>
      <Text style={{ color: strong ? colors.fg : colors.fgMuted, fontWeight: strong ? "600" : "400", fontSize: 15 }}>{label}</Text>
      <Text style={{ color: colors.fg, fontWeight: strong ? "600" : "400", fontSize: 15 }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.fg }]}>Bag</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ color: colors.fgMuted, textAlign: "center", marginTop: 40 }}>Your bag is empty.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.thumb} />
            ) : (
              <View style={[styles.thumb, { backgroundColor: colors.muted }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[styles.name, { color: colors.fg }]}>{item.name}</Text>
              <Text style={{ color: colors.fgMuted, fontSize: 13.5 }}>{item.variant}</Text>
              <Text style={[styles.price, { color: colors.fg }]}>{money(item.price)}</Text>
            </View>
            <Stepper value={item.qty} label={item.name} onChange={(q) => onQuantityChange(item.id, Math.max(0, q))} />
          </View>
        )}
        ListFooterComponent={
          items.length ? (
            <View style={[styles.summary, { backgroundColor: colors.muted }]}>
              <Row label="Subtotal" value={money(subtotal)} />
              <Row label="Shipping" value={shipping ? money(shipping) : "Free"} />
              <Row label="Tax" value={money(tax)} />
              <View style={[styles.hr, { backgroundColor: colors.border }]} />
              <Row label="Total" value={money(total)} strong />
            </View>
          ) : null
        }
      />
      <View style={styles.footer}>
        <Button size="lg" fullWidth disabled={!items.length} onPress={onCheckout}>
          {`Checkout · ${money(total)}`}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 32, fontWeight: "700", paddingHorizontal: 20, paddingTop: 8, letterSpacing: -0.5 },
  list: { padding: 20, gap: 16 },
  item: { flexDirection: "row", alignItems: "center", gap: 12 },
  thumb: { width: 76, height: 76, borderRadius: radius.lg },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 15, fontWeight: "600", marginTop: 4 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderRadius: 999, padding: 4 },
  stepBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  qty: { minWidth: 14, textAlign: "center", fontWeight: "600", fontVariant: ["tabular-nums"] },
  summary: { marginTop: 8, padding: 16, borderRadius: radius.lg, gap: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  hr: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
});
