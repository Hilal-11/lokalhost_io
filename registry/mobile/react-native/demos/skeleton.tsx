import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <View style={{ gap: 12, padding: 20 }}>
      {/* usage-start */}
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Skeleton width={44} height={44} radius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="40%" height={14} />
          <Skeleton width="25%" height={12} />
        </View>
      </View>
      <Skeleton height={176} radius={16} />
      {/* usage-end */}
      <Skeleton width="90%" />
      <Skeleton width="60%" />
    </View>
  );
}
