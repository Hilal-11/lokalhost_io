import { useState } from "react";
import { useRouter } from "expo-router";
import { ChatScreen, type Message } from "@/screens/chat-screen";

const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function ChatRoute() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Did you get a chance to look at the new onboarding?", fromMe: false, time: "9:30" },
    { id: "2", text: "Yes — the pager feels great.", fromMe: true, time: "9:31" },
  ]);

  // usage-start
  return (
    <ChatScreen
      title="Amelia Hart"
      messages={messages}
      onBack={() => router.back()}
      onSend={(text) => setMessages((m) => [...m, { id: String(Date.now()), text, fromMe: true, time: now() }])}
    />
  );
  // usage-end
}
