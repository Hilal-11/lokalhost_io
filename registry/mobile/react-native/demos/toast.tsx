import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/toast";

function Actions() {
  const toast = useToast();
  return (
    <View style={{ gap: 12, padding: 24, paddingTop: 120 }}>
      {/* usage-start */}
      <Button onPress={() => toast.show({ title: "Payment sent", description: "$24.00 to Amelia Hart", variant: "success" })}>
        Show success
      </Button>
      <Button variant="secondary" onPress={() => toast.show({ title: "Upload failed", variant: "error" })}>
        Show error
      </Button>
      {/* usage-end */}
      <Button variant="outline" onPress={() => toast.show({ title: "New message", description: "Jonas: Are we still on for 6?" })}>
        Show default
      </Button>
    </View>
  );
}

export default function ToastDemo() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <Actions />
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
