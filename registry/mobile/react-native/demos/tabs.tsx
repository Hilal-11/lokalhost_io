import { useState } from "react";
import { Text, View } from "react-native";
import { Tabs } from "@/components/ui/tabs";

const STEPS = ["6,240", "41,382", "172,904"];

export default function TabsDemo() {
  const [range, setRange] = useState(0);
  const [type, setType] = useState(1);

  return (
    <View style={{ gap: 32, padding: 20 }}>
      {/* usage-start */}
      <Tabs tabs={["Day", "Week", "Month"]} value={range} onChange={setRange} />
      <Text style={{ fontSize: 28, fontWeight: "700" }}>{STEPS[range]} steps</Text>
      {/* usage-end */}
      <Tabs variant="underline" tabs={["Runs", "Walks", "Rides"]} value={type} onChange={setType} />
    </View>
  );
}
