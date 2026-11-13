import { forwardRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, useTheme } from "@/lib/theme";

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, helperText, error, icon, secure = false, onFocus, onBlur, style, ...props },
  ref
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  const borderColor = error ? colors.danger : focused ? colors.fg : colors.border;

  return (
    <View style={styles.root}>
      {label ? <Text style={[styles.label, { color: colors.fg }]}>{label}</Text> : null}
      <View style={[styles.field, { borderColor, backgroundColor: colors.card }]}>
        {icon ? <Ionicons name={icon} size={18} color={colors.fgMuted} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.fgMuted}
          secureTextEntry={hidden}
          accessibilityLabel={label}
          accessibilityHint={error ?? helperText}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: colors.fg }, style]}
          {...props}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons name={hidden ? "eye-outline" : "eye-off-outline"} size={18} color={colors.fgMuted} />
          </Pressable>
        ) : null}
      </View>
      {error || helperText ? (
        <Text style={[styles.helper, { color: error ? colors.danger : colors.fgMuted }]}>{error ?? helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { gap: 6 },
  label: { fontSize: 14, fontWeight: "500" },
  field: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  input: { flex: 1, fontSize: 16, height: "100%" },
  helper: { fontSize: 13 },
});
