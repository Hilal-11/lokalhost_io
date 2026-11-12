import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { radius, useTheme } from "@/lib/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PADDING: Record<Size, number> = { sm: 14, md: 18, lg: 22 };

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = !!disabled || loading;

  const background: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.muted,
    outline: "transparent",
    ghost: "transparent",
    destructive: colors.danger,
  };
  const foreground: Record<Variant, string> = {
    primary: colors.onPrimary,
    secondary: colors.fg,
    outline: colors.fg,
    ghost: colors.fg,
    destructive: "#ffffff",
  };
  const fg = foreground[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PADDING[size],
          backgroundColor: background[variant],
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        variant === "outline" && { borderWidth: 1, borderColor: colors.border },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : icon ? <View>{icon}</View> : null}
      {typeof children === "string" ? (
        <Text style={[styles.label, { color: fg, fontSize: size === "sm" ? 14 : 16 }]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius.md,
  },
  fullWidth: { alignSelf: "stretch" },
  label: { fontWeight: "600" },
});
