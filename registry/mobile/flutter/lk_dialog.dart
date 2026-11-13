import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import 'lk_button.dart';

/// Shows a confirm dialog. Resolves `true` when the user confirms.
Future<bool> showLkDialog({
  required BuildContext context,
  required String title,
  String? description,
  String confirmLabel = 'Confirm',
  String cancelLabel = 'Cancel',
  bool destructive = false,
}) async {
  final result = await showDialog<bool>(
    context: context,
    barrierColor: Colors.black.withValues(alpha: 0.4),
    builder: (context) {
      final c = context.lk;
      final ios = Theme.of(context).platform == TargetPlatform.iOS;
      final align = ios ? TextAlign.center : TextAlign.start;
      return Dialog(
        backgroundColor: c.card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(ios ? 18 : 28)),
        insetPadding: const EdgeInsets.symmetric(horizontal: 32),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: ios ? CrossAxisAlignment.center : CrossAxisAlignment.start,
            children: [
              Text(title, textAlign: align, style: TextStyle(color: c.fg, fontSize: 19, fontWeight: FontWeight.w600)),
              if (description != null) ...[
                const SizedBox(height: 8),
                Text(description, textAlign: align, style: TextStyle(color: c.fgMuted, fontSize: 15, height: 1.4)),
              ],
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: LkButton(
                      label: cancelLabel,
                      variant: LkButtonVariant.secondary,
                      onPressed: () => Navigator.pop(context, false),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: LkButton(
                      label: confirmLabel,
                      variant: destructive ? LkButtonVariant.destructive : LkButtonVariant.primary,
                      onPressed: () => Navigator.pop(context, true),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    },
  );
  return result ?? false;
}
