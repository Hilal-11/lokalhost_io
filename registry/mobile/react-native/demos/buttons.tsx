import { useState } from "react";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

export default function ButtonsDemo() {
  const [loading, setLoading] = useState(false);

  const addToBag = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 12, padding: 24 }}>
      {/* usage-start */}
      <Button onPress={addToBag} loading={loading} fullWidth>
        Add to bag
      </Button>
      <Button variant="outline">Outline</Button>
      <Button
        variant="destructive"
        icon={<Ionicons name="trash-outline" size={18} color="#fff" />}
      >
        Delete account
      </Button>
      {/* usage-end */}
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost" size="sm">
        Ghost
      </Button>
      <Button size="lg" disabled>
        Disabled
      </Button>
    </ScrollView>
  );
}
