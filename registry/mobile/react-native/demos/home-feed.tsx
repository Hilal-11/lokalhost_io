import { useState } from "react";
import { FeedScreen, type Post } from "@/screens/feed-screen";

const INITIAL: Post[] = [
  {
    id: "1",
    author: "Amelia Hart",
    time: "12 min ago",
    body: "Shipped the new onboarding flow today — three screens, zero layout jank.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    likes: 128,
    comments: 24,
  },
  { id: "2", author: "Jonas Berg", time: "1 h ago", body: "Weekend build: an offline-first notes app in Expo.", likes: 64, comments: 9 },
];

export default function HomeFeed() {
  const [posts, setPosts] = useState(INITIAL);

  // usage-start
  return (
    <FeedScreen
      posts={posts}
      stories={[
        { id: "me", name: "Your story" },
        { id: "a", name: "Amelia Hart" },
        { id: "j", name: "Jonas Berg", seen: true },
      ]}
      onRefresh={async () => {
        const res = await fetch("https://api.example.com/feed");
        setPosts(await res.json());
      }}
      onPostPress={(post) => console.log("open", post.id)}
    />
  );
  // usage-end
}
