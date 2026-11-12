import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { ListGroup, ListItem } from "@/components/ui/list";
import { radius, useTheme } from "@/lib/theme";

type Route = "account" | "notifications" | "privacy" | "language" | "help";

export interface SettingsScreenProps {
  user: { name: string; email: string; avatar?: string };
  onNavigate: (route: Route) => void;
  onSignOut: () => void;
  version?: string;
}

export function SettingsScreen({ user, onNavigate, onSignOut, version = "1.0.0" }: SettingsScreenProps) {
  const { colors } = useTheme();
  const [darkMode, setDarkMode] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <SafeAreaView edges={["top"]} style={[styles.root, { backgroundColor: colors.bgSubtle }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.fg }]}>Settings</Text>

        <Pressable
          onPress={() => onNavigate("account")}
          accessibilityRole="button"
          style={({ pressed }) => [styles.account, { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }]}
        >
          <Avatar name={user.name} src={user.avatar} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.accountName, { color: colors.fg }]}>{user.name}</Text>
            <Text style={{ color: colors.fgMuted }}>{user.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.fgMuted} />
        </Pressable>

        <ListGroup>
          <ListItem title="Notifications" icon="notifications" iconColor="#ef4444" onPress={() => onNavigate("notifications")} />
          <ListItem title="Privacy & security" icon="shield-checkmark" iconColor="#3b82f6" onPress={() => onNavigate("privacy")} />
          <ListItem title="Language" icon="globe-outline" iconColor="#14b8a6" value="English" onPress={() => onNavigate("language")} />
        </ListGroup>

        <ListGroup header="Appearance">
          <ListItem title="Dark mode" icon="moon" iconColor="#6366f1" trailing={<Switch value={darkMode} onValueChange={setDarkMode} />} />
          <ListItem title="Haptics" icon="pulse" iconColor="#f59e0b" trailing={<Switch value={haptics} onValueChange={setHaptics} />} />
        </ListGroup>

        <ListGroup>
          <ListItem title="Help & support" icon="help-circle" iconColor="#64748b" onPress={() => onNavigate("help")} />
          <ListItem title="Sign out" icon="log-out-outline" iconColor="#ef4444" destructive chevron={false} onPress={onSignOut} />
        </ListGroup>

        <Text style={[styles.version, { color: colors.fgMuted }]}>Version {version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { gap: 24, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: "700", paddingHorizontal: 20, paddingTop: 8, letterSpacing: -0.5 },
  account: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 16, padding: 14, borderRadius: radius.lg },
  accountName: { fontSize: 18, fontWeight: "600" },
  version: { textAlign: "center", fontSize: 12.5 },
});
