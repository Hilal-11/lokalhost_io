import { Share } from "react-native";
import { useRouter } from "expo-router";
import { ProfileScreen } from "@/screens/profile-screen";

const photos = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/lk${i}/400`);

export default function ProfileRoute() {
  const router = useRouter();

  // usage-start
  return (
    <ProfileScreen
      user={{ name: "Hilal Ahmad", handle: "hilal", bio: "Building lokalhost.io — UI for the web and mobile." }}
      stats={[
        { label: "Posts", value: "248" },
        { label: "Followers", value: "12.4k" },
        { label: "Following", value: "180" },
      ]}
      media={[photos, photos.slice(0, 4), []]}
      onEdit={() => router.push("/edit-profile")}
      onShare={() => Share.share({ message: "https://lokalhost.io/@hilal" })}
    />
  );
  // usage-end
}
