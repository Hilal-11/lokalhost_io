import { useState } from "react";
import { Text, View } from "react-native";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { ListGroup, ListItem } from "@/components/ui/list";

export default function BottomSheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button onPress={() => setOpen(true)} fullWidth>
        Open sheet
      </Button>

      {/* usage-start */}
      <BottomSheet open={open} onClose={() => setOpen(false)} snapPoints={[0.42, 0.88]} title="Share">
        <Text style={{ marginBottom: 16, opacity: 0.6 }}>Drag the handle to expand, or flick down to close.</Text>
        <ListGroup>
          <ListItem title="Copy link" icon="link" iconColor="#3b82f6" onPress={() => setOpen(false)} />
          <ListItem title="Add to favourites" icon="heart" iconColor="#ef4444" onPress={() => setOpen(false)} />
          <ListItem title="Report" destructive onPress={() => setOpen(false)} />
        </ListGroup>
      </BottomSheet>
      {/* usage-end */}
    </View>
  );
}
