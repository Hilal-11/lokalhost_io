import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { radius, useTheme } from "@/lib/theme";

export interface ProfileUser {
  name: string;
  handle: string;
  bio?: string;
  avatar?: string;
}

export interface ProfileScreenProps {
  user: ProfileUser;
  stats: { label: string; value: string }[];
  /** One image list per tab: Posts, Saved, Tagged. */
  media?: string[][];
  onEdit?: () => void;
  onShare?: () => void;
}

const TABS = ["Posts", "Saved", "Tagged"];

export function ProfileScreen({ user, stats, media = [[], [], []], onEdit, onShare }: ProfileScreenProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState(0);
  const tile = (width - 4) / 3;

  return (
    <SafeAreaView edges={["top"]} style={[styles.root, { backgroundColor: colors.bg }]}>
      <FlatList
        data={media[tab] ?? []}
        numColumns={3}
        keyExtractor={(uri, i) => `${tab}-${i}-${uri}`}
        columnWrapperStyle={{ gap: 2 }}
        contentContainerStyle={{ gap: 2 }}
        renderItem={({ item }) => <Image source={{ uri: item }} style={{ width: tile, height: tile }} />}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.fgMuted }]}>Nothing here yet.</Text>}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Avatar name={user.name} src={user.avatar} size={88} />
              <Text style={[styles.name, { color: colors.fg }]}>{user.name}</Text>
              <Text style={{ color: colors.fgMuted }}>@{user.handle}</Text>
              {user.bio ? <Text style={[styles.bio, { color: colors.fg }]}>{user.bio}</Text> : null}

              <View style={[styles.stats, { backgroundColor: colors.muted }]}>
                {stats.map((s) => (
                  <View key={s.label} style={styles.stat} accessible accessibilityLabel={`${s.value} ${s.label}`}>
                    <Text style={[styles.statValue, { color: colors.fg }]}>{s.value}</Text>
                    <Text style={{ color: colors.fgMuted, fontSize: 12.5 }}>{s.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actions}>
                <Button style={{ flex: 1 }} onPress={onEdit} icon={<Ionicons name="pencil" size={16} color={colors.onPrimary} />}>
                  Edit profile
                </Button>
                <Button variant="secondary" onPress={onShare} accessibilityLabel="Share profile">
                  <Ionicons name="share-outline" size={18} color={colors.fg} />
                </Button>
              </View>
            </View>
            <Tabs variant="underline" tabs={TABS} value={tab} onChange={setTab} />
            <View style={{ height: 2 }} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, gap: 2 },
  name: { fontSize: 22, fontWeight: "700", marginTop: 10 },
  bio: { fontSize: 15, textAlign: "center", marginTop: 8, lineHeight: 21 },
  stats: { flexDirection: "row", alignSelf: "stretch", marginTop: 16, paddingVertical: 12, borderRadius: radius.lg },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 8, alignSelf: "stretch", marginTop: 16 },
  empty: { textAlign: "center", padding: 40 },
});
