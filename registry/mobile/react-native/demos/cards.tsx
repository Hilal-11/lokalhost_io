import { Image, ScrollView } from "react-native";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CardsDemo() {
  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
      {/* usage-start */}
      <Card
        variant="elevated"
        title="Lake Bled, Slovenia"
        subtitle="4 nights · from $420"
        media={
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800" }}
            style={{ height: 160 }}
            accessibilityIgnoresInvertColors
          />
        }
        footer={
          <>
            <Button size="sm" style={{ flex: 1 }}>Book</Button>
            <Button size="sm" variant="outline">Save</Button>
          </>
        }
      />
      {/* usage-end */}
      <Card title="Ceramic pour-over" subtitle="Outline · $38" onPress={() => {}} />
      <Card variant="filled" title="$2,481.20" subtitle="+12.4% this month" />
    </ScrollView>
  );
}
