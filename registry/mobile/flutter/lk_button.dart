import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

enum LkButtonVariant { primary, secondary, outline, ghost, destructive }

enum LkButtonSize { sm, md, lg }

class LkButton extends StatelessWidget {
  const LkButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = LkButtonVariant.primary,
    this.size = LkButtonSize.md,
    this.loading = false,
    this.icon,
    this.expand = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final LkButtonVariant variant;
  final LkButtonSize size;
  final bool loading;
  final IconData? icon;
  final bool expand;

  double get _height => switch (size) {
        LkButtonSize.sm => 36,
        LkButtonSize.md => 44,
        LkButtonSize.lg => 52,
      };

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final (bg, fg) = switch (variant) {
      LkButtonVariant.primary => (c.primary, c.onPrimary),
      LkButtonVariant.secondary => (c.muted, c.fg),
      LkButtonVariant.outline => (Colors.transparent, c.fg),
      LkButtonVariant.ghost => (Colors.transparent, c.fg),
      LkButtonVariant.destructive => (c.danger, Colors.white),
    };
    final enabled = onPressed != null && !loading;

    final content = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (loading)
          SizedBox.square(dimension: 18, child: CircularProgressIndicator(strokeWidth: 2, color: fg))
        else if (icon != null)
          Icon(icon, size: 18, color: fg),
        if (loading || icon != null) const SizedBox(width: 8),
        Text(
          label,
          style: TextStyle(color: fg, fontWeight: FontWeight.w600, fontSize: size == LkButtonSize.sm ? 14 : 16),
        ),
      ],
    );

    return Semantics(
      button: true,
      enabled: enabled,
      child: AnimatedOpacity(
        duration: const Duration(milliseconds: 150),
        opacity: enabled || loading ? 1 : 0.5,
        child: Material(
          color: bg,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(LkRadius.md),
            side: variant == LkButtonVariant.outline ? BorderSide(color: c.border) : BorderSide.none,
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: enabled ? onPressed : null,
            child: Container(
              height: _height,
              padding: EdgeInsets.symmetric(horizontal: size == LkButtonSize.sm ? 14 : 18),
              alignment: Alignment.center,
              child: content,
            ),
          ),
        ),
      ),
    );
  }
}
