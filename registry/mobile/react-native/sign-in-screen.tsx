import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme";

export interface SignInScreenProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSocial?: (provider: "apple" | "google") => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInScreen({ onSubmit, onSocial, onForgotPassword, onSignUp }: SignInScreenProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = touched && !EMAIL.test(email) ? "Enter a valid email address." : undefined;
  const passwordError = touched && password.length < 8 ? "At least 8 characters." : undefined;

  const submit = async () => {
    setTouched(true);
    if (!EMAIL.test(email) || password.length < 8) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={22} color={colors.onPrimary} />
          </View>
          <View style={styles.heading}>
            <Text style={[styles.title, { color: colors.fg }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: colors.fgMuted }]}>Sign in to continue.</Text>
          </View>

          <Input
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            error={emailError}
          />
          <Input
            label="Password"
            icon="lock-closed-outline"
            secure
            autoComplete="current-password"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            onSubmitEditing={submit}
          />
          {onForgotPassword ? (
            <Pressable onPress={onForgotPassword} style={styles.forgot} accessibilityRole="link">
              <Text style={{ color: colors.fg, fontWeight: "500" }}>Forgot password?</Text>
            </Pressable>
          ) : null}

          {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
          <Button size="lg" fullWidth loading={loading} onPress={submit}>
            Sign in
          </Button>

          {onSocial ? (
            <>
              <View style={styles.divider}>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
                <Text style={{ color: colors.fgMuted, fontSize: 13 }}>or</Text>
                <View style={[styles.line, { backgroundColor: colors.border }]} />
              </View>
              <Button variant="outline" fullWidth icon={<Ionicons name="logo-apple" size={18} color={colors.fg} />} onPress={() => onSocial("apple")}>
                Continue with Apple
              </Button>
              <Button variant="outline" fullWidth icon={<Ionicons name="logo-google" size={16} color={colors.fg} />} onPress={() => onSocial("google")}>
                Continue with Google
              </Button>
            </>
          ) : null}

          {onSignUp ? (
            <Text style={[styles.footer, { color: colors.fgMuted }]}>
              New here?{" "}
              <Text onPress={onSignUp} style={{ color: colors.fg, fontWeight: "600" }} accessibilityRole="link">
                Create an account
              </Text>
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 24, paddingTop: 40, gap: 16 },
  logo: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  heading: { marginTop: 8, marginBottom: 8, gap: 4 },
  title: { fontSize: 30, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { fontSize: 16 },
  forgot: { alignSelf: "flex-end" },
  error: { fontSize: 14 },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 4 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  footer: { textAlign: "center", fontSize: 15, marginTop: 8 },
});
