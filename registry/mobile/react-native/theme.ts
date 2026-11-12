import { useColorScheme } from "react-native";

/**
 * lokalhost mobile tokens. Every component reads colours through useTheme(),
 * so light / dark follow the system automatically.
 */
export const palette = {
  light: {
    bg: "#ffffff",
    bgSubtle: "#f5f5f5",
    card: "#ffffff",
    muted: "#f4f4f5",
    border: "#e5e5e5",
    fg: "#0a0a0a",
    fgMuted: "#737373",
    primary: "#0a0a0a",
    onPrimary: "#ffffff",
    accent: "#2563eb",
    success: "#16a34a",
    danger: "#dc2626",
    warning: "#d97706",
    scrim: "rgba(0,0,0,0.4)",
  },
  dark: {
    bg: "#000000",
    bgSubtle: "#0a0a0a",
    card: "#141414",
    muted: "#1f1f1f",
    border: "#262626",
    fg: "#fafafa",
    fgMuted: "#a3a3a3",
    primary: "#fafafa",
    onPrimary: "#0a0a0a",
    accent: "#3b82f6",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    scrim: "rgba(0,0,0,0.6)",
  },
};

export type Colors = typeof palette.light;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 } as const;

/** 4pt spacing grid: space(4) === 16 */
export const space = (n: number) => n * 4;

export const fontSize = {
  caption: 12,
  footnote: 13,
  subhead: 15,
  body: 16,
  headline: 17,
  title3: 20,
  title2: 22,
  title1: 28,
  largeTitle: 34,
} as const;

export function useTheme() {
  const dark = useColorScheme() === "dark";
  const colors: Colors = dark ? palette.dark : palette.light;
  return { colors, dark, radius, space, fontSize };
}
