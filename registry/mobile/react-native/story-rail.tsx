import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";

export interface Story {
  id: string;
  name: string;
  avatar?: string;
  seen?: boolean;
}

export interface StoryRailProps {
  stories: Story[];
  onPress: (id: string) => void;
  /** Adds a "Your story" tile first. */
  onAdd?: () => void;
  me?: { name: string; avatar?: string };
}

const SIZE = 60;

export function StoryRail({ stories, onPress, onAdd, me }: StoryRailProps) {
  const { colors } = useTheme();

  const tile = (story: Story, own = false) => (
    <Pressable
      key={story.id}
      onPress={() => (own ? onAdd?.() : onPress(story.id))}
      accessibilityRole="button"
      accessibilityLabel={own ? "Add to your story" : `${story.name}'s story${story.seen ? ", seen" : ""}`}
      style={styles.tile}
    >
      <View
        style={[
          styles.ring,
          { borderColor: own ? "transparent" : story.seen ? colors.border : "#f43f5e", borderWidth: story.seen ? 1.5 : 2.5 },
        ]}
      >
        <View style={[styles.inner, { borderColor: colors.bg }]}>
          <Avatar name={story.name} src={story.avatar} size={SIZE - 8} />
        </View>
        {own ? (
          <View style={[styles.plus, { backgroundColor: colors.accent, borderColor: colors.bg }]}>
            <Ionicons name="add" size={14} color="#fff" />
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={[styles.name, { color: colors.fg }]}>
        {own ? "Your story" : story.name.split(" ")[0]}
      </Text>
    </Pressable>
  );

  const data = onAdd ? [{ id: "__me", name: me?.name ?? "You", avatar: me?.avatar }, ...stories] : stories;

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(s) => s.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => tile(item, item.id === "__me")}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingVertical: 8, gap: 14 },
  tile: { width: 68, alignItems: "center", gap: 6 },
  ring: { width: SIZE + 6, height: SIZE + 6, borderRadius: SIZE, alignItems: "center", justifyContent: "center" },
  inner: { borderWidth: 2, borderRadius: SIZE },
  plus: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 12 },
});
