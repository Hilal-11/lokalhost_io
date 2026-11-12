import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";

export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

export interface ChatScreenProps {
  title: string;
  status?: string;
  messages: Message[];
  onSend: (text: string) => void;
  onBack?: () => void;
}

export function ChatScreen({ title, status = "Online", messages, onSend, onBack }: ChatScreenProps) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState("");
  // Inverted list: newest message sits at the bottom and stays there as the keyboard opens.
  const data = [...messages].reverse();

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={26} color={colors.fg} />
        </Pressable>
        <Avatar name={title} size={36} status="online" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.fg }]}>{title}</Text>
          <Text style={{ color: colors.success, fontSize: 12.5 }}>{status}</Text>
        </View>
        <Ionicons name="call-outline" size={21} color={colors.fg} />
        <Ionicons name="videocam-outline" size={23} color={colors.fg} />
      </View>

      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <FlatList
          inverted
          data={data}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubbleRow, { justifyContent: item.fromMe ? "flex-end" : "flex-start" }]}>
              <View
                style={[
                  styles.bubble,
                  item.fromMe
                    ? { backgroundColor: colors.accent, borderBottomRightRadius: 6 }
                    : { backgroundColor: colors.muted, borderBottomLeftRadius: 6 },
                ]}
              >
                <Text style={{ color: item.fromMe ? "#fff" : colors.fg, fontSize: 15.5, lineHeight: 21 }}>{item.text}</Text>
                <Text style={[styles.time, { color: item.fromMe ? "rgba(255,255,255,0.7)" : colors.fgMuted }]}>{item.time}</Text>
              </View>
            </View>
          )}
        />

        <View style={[styles.composer, { borderTopColor: colors.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message"
            placeholderTextColor={colors.fgMuted}
            multiline
            accessibilityLabel="Message"
            style={[styles.input, { color: colors.fg, borderColor: colors.border }]}
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send"
            style={[styles.send, { backgroundColor: colors.accent, opacity: draft.trim() ? 1 : 0.4 }]}
          >
            <Ionicons name="arrow-up" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, height: 56, borderBottomWidth: StyleSheet.hairlineWidth },
  name: { fontSize: 16, fontWeight: "600" },
  list: { padding: 12, gap: 6 },
  bubbleRow: { flexDirection: "row" },
  bubble: { maxWidth: "78%", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  time: { fontSize: 11, alignSelf: "flex-end", marginTop: 2 },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 8, padding: 8, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, minHeight: 40, maxHeight: 120, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontSize: 16 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
});
