import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingScreen } from "@/screens/onboarding-screen";

// app/onboarding.tsx (Expo Router)
export default function Onboarding() {
  const router = useRouter();

  // usage-start
  return (
    <OnboardingScreen
      onDone={async () => {
        await AsyncStorage.setItem("onboarded", "1");
        router.replace("/(tabs)");
      }}
    />
  );
  // usage-end
}
