import { useState } from "react";
import { ScrollView, Switch } from "react-native";
import { ListGroup, ListItem } from "@/components/ui/list";

export default function ListsDemo() {
  const [dark, setDark] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ gap: 24, paddingVertical: 24 }}>
      {/* usage-start */}
      <ListGroup header="General">
        <ListItem title="Notifications" icon="notifications" iconColor="#ef4444" value="On" onPress={() => {}} />
        <ListItem title="Language" icon="globe-outline" iconColor="#3b82f6" value="English" onPress={() => {}} />
        <ListItem
          title="Dark mode"
          icon="moon"
          iconColor="#6366f1"
          trailing={<Switch value={dark} onValueChange={setDark} />}
        />
      </ListGroup>
      {/* usage-end */}
      <ListGroup>
        <ListItem title="Sign out" destructive onPress={() => {}} chevron={false} />
      </ListGroup>
    </ScrollView>
  );
}
