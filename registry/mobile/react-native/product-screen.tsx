import { useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { radius, useTheme } from "@/lib/theme";

export interface Product {
  name: string;
  price: number;
  currency?: string;
  rating: number;
  reviews: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
}

export interface ProductScreenProps {
  product: Product;
  onAddToCart: (selection: { color: string; size: string }) => void;
  onBack?: () => void;
}

export function ProductScreen({ product, onAddToCart, onBack }: ProductScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [image, setImage] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const price = new Intl.NumberFormat(undefined, { style: "currency", currency: product.currency ?? "USD" }).format(product.price);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri) => uri}
            onMomentumScrollEnd={(e) => setImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => <Image source={{ uri: item }} style={{ width, height: 400 }} accessibilityIgnoresInvertColors />}
          />
          <View style={[styles.overlay, { top: insets.top + 4 }]}>
            <Pressable onPress={onBack} style={styles.round} accessibilityRole="button" accessibilityLabel="Back">
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </Pressable>
            <Pressable style={styles.round} accessibilityRole="button" accessibilityLabel="Save">
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.pager}>
            {product.images.map((_, i) => (
              <View key={i} style={[styles.pagerDot, { width: i === image ? 20 : 6, opacity: i === image ? 1 : 0.5 }]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={[styles.name, { color: colors.fg }]}>{product.name}</Text>
            <Text style={[styles.price, { color: colors.fg }]}>{price}</Text>
          </View>
          <View style={styles.rating}>
            <Ionicons name="star" size={15} color="#f59e0b" />
            <Text style={{ color: colors.fgMuted }}>
              {product.rating} · {product.reviews.toLocaleString()} reviews
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.fg }]}>
            Color <Text style={{ color: colors.fgMuted }}>· {product.colors[color]?.name}</Text>
          </Text>
          <View style={styles.swatches}>
            {product.colors.map((c, i) => (
              <Pressable
                key={c.name}
                onPress={() => setColor(i)}
                accessibilityRole="radio"
                accessibilityLabel={c.name}
                accessibilityState={{ checked: i === color }}
                style={[styles.swatchRing, { borderColor: i === color ? colors.fg : "transparent" }]}
              >
                <View style={[styles.swatch, { backgroundColor: c.hex }]} />
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.fg }]}>Size</Text>
          <View style={styles.sizes}>
            {product.sizes.map((s) => {
              const on = s === size;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSize(s)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={[styles.size, { borderColor: on ? colors.fg : colors.border, backgroundColor: on ? colors.fg : "transparent" }]}
                >
                  <Text style={{ color: on ? colors.bg : colors.fg, fontWeight: "600" }}>{s}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.description, { color: colors.fgMuted }]}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 8, borderTopColor: colors.border, backgroundColor: colors.bg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save for later"
          style={({ pressed }) => [styles.save, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="bookmark-outline" size={20} color={colors.fg} />
        </Pressable>
        <Button
          size="lg"
          style={{ flex: 1 }}
          icon={<Ionicons name="bag-handle-outline" size={18} color={colors.onPrimary} />}
          onPress={() => onAddToCart({ color: product.colors[color]!.name, size })}
        >
          Add to bag
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: { position: "absolute", left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  pager: { position: "absolute", bottom: 16, alignSelf: "center", flexDirection: "row", gap: 6 },
  pagerDot: { height: 6, borderRadius: 3, backgroundColor: "#fff" },
  content: { padding: 20, gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  name: { flex: 1, fontSize: 24, fontWeight: "700", letterSpacing: -0.3 },
  price: { fontSize: 22, fontWeight: "700" },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 16 },
  swatches: { flexDirection: "row", gap: 10 },
  swatchRing: { padding: 2, borderRadius: 22, borderWidth: 2 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  sizes: { flexDirection: "row", gap: 8 },
  size: { flex: 1, height: 44, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  description: { fontSize: 15, lineHeight: 22, marginTop: 16 },
  save: { width: 52, height: 52, borderRadius: radius.md, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  bar: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
});
