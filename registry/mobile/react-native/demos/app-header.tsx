import { useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/components/blocks/app-header";
import { Avatar } from "@/components/ui/avatar";

export default function TodayScreen() {
  const [query, setQuery] = useState("");
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* usage-start */}
      <AppHeader
        eyebrow={today}
        title="Today"
        onSearch={setQuery}
        searchPlaceholder="Search tasks, notes, people"
        right={
          <>
            <Pressable accessibilityLabel="Notifications" hitSlop={8}>
              <Ionicons name="notifications-outline" size={22} />
            </Pressable>
            <Avatar name="Hilal Ahmad" size={36} />
          </>
        }
      />
      {/* usage-end */}
    </SafeAreaView>
  );
}
