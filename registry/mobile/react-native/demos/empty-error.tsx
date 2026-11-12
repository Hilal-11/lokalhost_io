import { ActivityIndicator, FlatList, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { StateView } from "@/components/ui/state-view";

export default function Inbox() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["inbox"],
    queryFn: () => fetch("https://api.example.com/inbox").then((r) => r.json() as Promise<{ id: string; subject: string }[]>),
  });

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  // usage-start
  if (isError) return <StateView variant="error" actionLabel="Try again" onAction={refetch} />;

  if (!data?.length)
    return (
      <StateView
        title="No messages yet"
        description="When people message you, conversations will show up here."
        actionLabel="Start a conversation"
        onAction={() => {}}
      />
    );
  // usage-end

  return <FlatList data={data} keyExtractor={(m) => m.id} renderItem={({ item }) => <Text>{item.subject}</Text>} />;
}
