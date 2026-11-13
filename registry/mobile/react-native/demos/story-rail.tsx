import { useRouter } from "expo-router";
import { StoryRail } from "@/components/blocks/story-rail";

export default function Stories() {
  const router = useRouter();

  // usage-start
  return (
    <StoryRail
      me={{ name: "Hilal Ahmad" }}
      onAdd={() => router.push("/story/new")}
      onPress={(id) => router.push(`/story/${id}`)}
      stories={[
        { id: "a", name: "Amelia Hart" },
        { id: "j", name: "Jonas Berg" },
        { id: "m", name: "Maya Lin", seen: true },
      ]}
    />
  );
  // usage-end
}
