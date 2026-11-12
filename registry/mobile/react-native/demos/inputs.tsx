import { useState } from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";

export default function InputsDemo() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !email.includes("@");

  return (
    <View style={{ gap: 20, padding: 24 }}>
      {/* usage-start */}
      <Input
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        error={invalid ? "Enter a valid email address." : undefined}
        helperText="We’ll never share your email."
      />
      <Input label="Password" icon="lock-closed-outline" secure />
      {/* usage-end */}
      <Input icon="search" placeholder="Search" returnKeyType="search" />
    </View>
  );
}
