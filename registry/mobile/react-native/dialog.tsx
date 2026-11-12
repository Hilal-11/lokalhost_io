import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { radius, useTheme } from "@/lib/theme";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: DialogProps) {
  const { colors } = useTheme();
  const ios = Platform.OS === "ios";

  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: colors.scrim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss dialog" />
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.card, borderRadius: ios ? 18 : 28 }]}
        >
          <Text style={[styles.title, { color: colors.fg, textAlign: ios ? "center" : "left" }]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, { color: colors.fgMuted, textAlign: ios ? "center" : "left" }]}>{description}</Text>
          ) : null}
          <View style={styles.actions}>
            <Button variant="secondary" onPress={onClose} style={styles.action}>
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? "destructive" : "primary"}
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
              style={styles.action}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  card: { width: "100%", maxWidth: 360, padding: 24, gap: 8 },
  title: { fontSize: 19, fontWeight: "600" },
  description: { fontSize: 15, lineHeight: 21 },
  actions: { flexDirection: "row", gap: 8, marginTop: 16 },
  action: { flex: 1, borderRadius: radius.md },
});
