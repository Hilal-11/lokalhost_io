import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import 'lk_button.dart';

enum StateVariant { empty, error, offline }

class StateView extends StatelessWidget {
  const StateView({super.key, this.variant = StateVariant.empty, this.title, this.description, this.actionLabel, this.onAction});

  final StateVariant variant;
  final String? title;
  final String? description;
  final String? actionLabel;
  final VoidCallback? onAction;

  static const _defaults = {
    StateVariant.empty: (Icons.inbox_outlined, 'Nothing here yet', 'When there’s something to show, it’ll appear here.'),
    StateVariant.error: (Icons.warning_amber_rounded, 'Something went wrong', 'We couldn’t load this. It’s not you — it’s us.'),
    StateVariant.offline: (Icons.cloud_off_outlined, 'You’re offline', 'Check your connection. We’ll sync when you’re back.'),
  };

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final (icon, defaultTitle, defaultDescription) = _defaults[variant]!;

    return Semantics(
      liveRegion: variant != StateVariant.empty,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: c.muted,
                  borderRadius: BorderRadius.circular(26),
                  border: Border.all(color: c.border, width: 0.5),
                ),
                child: Icon(icon, size: 34, color: c.fgMuted),
              ),
              const SizedBox(height: 20),
              Text(title ?? defaultTitle, textAlign: TextAlign.center, style: TextStyle(color: c.fg, fontSize: 21, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              Text(description ?? defaultDescription,
                  textAlign: TextAlign.center, style: TextStyle(color: c.fgMuted, fontSize: 15.5, height: 1.4)),
              if (actionLabel != null && onAction != null) ...[
                const SizedBox(height: 24),
                LkButton(label: actionLabel!, onPressed: onAction),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
