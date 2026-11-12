import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabBar, type TabBarItem } from "@/components/ui/tab-bar";

const ITEMS: TabBarItem[] = [
  { key: "home", label: "Home", icon: "home-outline" },
  { key: "search", label: "Search", icon: "search-outline" },
  { key: "inbox", label: "Inbox", icon: "mail-outline", badge: 3 },
  { key: "profile", label: "Profile", icon: "person-outline" },
];

export default function NavigationBarDemo() {
  const [active, setActive] = useState("home");

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>{active}</Text>
      </View>
      {/* usage-start */}
      <TabBar items={ITEMS} active={active} onChange={setActive} />
      {/* usage-end */}
    </SafeAreaProvider>
  );
}
