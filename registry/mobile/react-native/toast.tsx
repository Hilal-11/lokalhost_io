import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { radius, useTheme } from "@/lib/theme";

type Variant = "default" | "success" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: Variant;
  /** ms before auto-dismiss */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

interface ToastApi {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Wrap your app once (inside GestureHandlerRootView and SafeAreaProvider). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((list) => [{ ...options, id }, ...list].slice(0, 3));
      timers.current.set(id, setTimeout(() => dismiss(id), options.duration ?? 3500));
      return id;
    },
    [dismiss]
  );

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 8, paddingHorizontal: 12, gap: 8 }]}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const { colors } = useTheme();
  const x = useSharedValue(0);

  const swipe = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      x.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 80 || Math.abs(e.velocityX) > 800) {
        x.value = withTiming(Math.sign(e.translationX) * 500, { duration: 160 }, () => runOnJS(onDismiss)(toast.id));
      } else {
        x.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
    opacity: 1 - Math.min(Math.abs(x.value) / 300, 0.6),
  }));

  const icon =
    toast.variant === "success"
      ? { name: "checkmark-circle" as const, color: colors.success }
      : toast.variant === "error"
        ? { name: "alert-circle" as const, color: colors.danger }
        : { name: "information-circle" as const, color: colors.accent };

  return (
    <GestureDetector gesture={swipe}>
      <Animated.View
        entering={FadeInUp.springify().damping(18)}
        exiting={FadeOutUp.duration(160)}
        layout={LinearTransition}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[styles.toast, { backgroundColor: colors.card, borderColor: colors.border }, style]}
      >
        <Ionicons name={icon.name} size={22} color={icon.color} />
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.fg }]}>{toast.title}</Text>
          {toast.description ? <Text style={[styles.description, { color: colors.fgMuted }]}>{toast.description}</Text> : null}
        </View>
        <Pressable onPress={() => onDismiss(toast.id)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Dismiss">
          <Ionicons name="close" size={18} color={colors.fgMuted} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "600" },
  description: { fontSize: 14 },
});
