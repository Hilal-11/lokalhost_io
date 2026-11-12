import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { SettingsScreen } from "@/screens/settings-screen";

export default function SettingsRoute() {
  const router = useRouter();

  // usage-start
  return (
    <SettingsScreen
      user={{ name: "Hilal Ahmad", email: "hilal@lokalhost.io" }}
      version={Application.nativeApplicationVersion ?? "dev"}
      onNavigate={(route) => router.push(`/settings/${route}`)}
      onSignOut={() =>
        Alert.alert("Sign out?", undefined, [
          { text: "Cancel", style: "cancel" },
          { text: "Sign out", style: "destructive", onPress: () => router.replace("/sign-in") },
        ])
      }
    />
  );
  // usage-end
}
