import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button variant="destructive" onPress={() => setOpen(true)}>
        Delete account
      </Button>
      {/* usage-start */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete account?"
        description="This permanently removes your profile, posts and messages. This can’t be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => console.log("deleted")}
      />
      {/* usage-end */}
    </View>
  );
}
