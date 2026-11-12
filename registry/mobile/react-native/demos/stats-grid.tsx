import { ScrollView } from "react-native";
import { StatsGrid } from "@/components/blocks/stats-grid";

export default function Overview() {
  return (
    <ScrollView>
      {/* usage-start */}
      <StatsGrid
        stats={[
          { label: "Revenue", value: "$12.4k", delta: 8.2, series: [4, 6, 5, 8, 7, 9, 11] },
          { label: "Orders", value: "318", delta: 3.1, series: [3, 4, 4, 5, 4, 6, 6] },
          { label: "Refunds", value: "12", delta: -2.4, series: [6, 5, 6, 4, 5, 3, 3] },
          { label: "Visitors", value: "9,842", delta: 14.6, series: [2, 3, 5, 4, 7, 8, 10] },
        ]}
      />
      {/* usage-end */}
    </ScrollView>
  );
}
