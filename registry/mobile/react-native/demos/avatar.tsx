import { View } from "react-native";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";

export default function AvatarDemo() {
  return (
    <View style={{ gap: 24, padding: 24 }}>
      {/* usage-start */}
      <Avatar name="Amelia Hart" src="https://i.pravatar.cc/200?img=47" size={56} status="online" />
      <AvatarGroup max={4} size={44}>
        <Avatar name="Amelia Hart" />
        <Avatar name="Jonas Berg" />
        <Avatar name="Maya Lin" />
        <Avatar name="Leo Park" />
        <Avatar name="Sara Ali" />
        <Avatar name="Omar Diaz" />
      </AvatarGroup>
      {/* usage-end */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Avatar name="Jonas Berg" status="away" size={48} />
        <Avatar name="Maya Lin" status="offline" size={48} />
      </View>
    </View>
  );
}
