import { memo, useCallback, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { StoryRail, type Story } from "@/components/blocks/story-rail";
import { radius, useTheme } from "@/lib/theme";

export interface Post {
  id: string;
  author: string;
  avatar?: string;
  time: string;
  body: string;
  image?: string;
  likes: number;
  comments: number;
}

export interface FeedScreenProps {
  posts: Post[];
  stories?: Story[];
  onRefresh?: () => Promise<void>;
  onPostPress?: (post: Post) => void;
}

const PostCard = memo(function PostCard({ post, onPress }: { post: Post; onPress?: (p: Post) => void }) {
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);

  return (
    <Pressable onPress={() => onPress?.(post)} style={[styles.post, { borderTopColor: colors.border }]}>
      <View style={styles.postHeader}>
        <Avatar name={post.author} src={post.avatar} size={36} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.author, { color: colors.fg }]}>{post.author}</Text>
          <Text style={[styles.time, { color: colors.fgMuted }]}>{post.time}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.fgMuted} />
      </View>
      <Text style={[styles.body, { color: colors.fg }]}>{post.body}</Text>
      {post.image ? <Image source={{ uri: post.image }} style={styles.image} accessibilityIgnoresInvertColors /> : null}
      <View style={styles.actions}>
        <Pressable
          onPress={() => setLiked((v) => !v)}
          style={styles.action}
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike" : "Like"}
          accessibilityState={{ selected: liked }}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={21} color={liked ? colors.danger : colors.fgMuted} />
          <Text style={{ color: colors.fgMuted }}>{post.likes + (liked ? 1 : 0)}</Text>
        </Pressable>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.fgMuted} />
          <Text style={{ color: colors.fgMuted }}>{post.comments}</Text>
        </View>
        <Ionicons name="share-outline" size={20} color={colors.fgMuted} />
        <Ionicons name="bookmark-outline" size={20} color={colors.fgMuted} style={{ marginLeft: "auto" }} />
      </View>
    </Pressable>
  );
});

export function FeedScreen({ posts, stories = [], onRefresh, onPostPress }: FeedScreenProps) {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <SafeAreaView edges={["top"]} style={[styles.root, { backgroundColor: colors.bg }]}>
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} onPress={onPostPress} />}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.fgMuted} /> : undefined}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={[styles.greeting, { color: colors.fgMuted }]}>Good morning</Text>
                <Text style={[styles.title, { color: colors.fg }]}>Feed</Text>
              </View>
              <View style={styles.headerIcons}>
                <Ionicons name="search" size={22} color={colors.fg} />
                <Ionicons name="notifications-outline" size={22} color={colors.fg} />
              </View>
            </View>
            {stories.length ? <StoryRail stories={stories} onPress={() => {}} /> : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  greeting: { fontSize: 13, fontWeight: "500" },
  title: { fontSize: 32, fontWeight: "700", letterSpacing: -0.5 },
  headerIcons: { flexDirection: "row", gap: 16, paddingBottom: 6 },
  post: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 12 },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20 },
  author: { fontSize: 15, fontWeight: "600" },
  time: { fontSize: 12.5 },
  body: { fontSize: 15, lineHeight: 21, paddingHorizontal: 20, paddingVertical: 10 },
  image: { height: 208, marginHorizontal: 20, borderRadius: radius.lg },
  actions: { flexDirection: "row", alignItems: "center", gap: 20, paddingHorizontal: 20, paddingTop: 12 },
  action: { flexDirection: "row", alignItems: "center", gap: 6 },
});
