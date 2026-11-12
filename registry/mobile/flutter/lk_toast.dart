import 'dart:async';

import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

enum LkToastVariant { normal, success, error }

/// Top-of-screen toast. `LkToast.show(context, title: 'Saved')`.
/// A new toast replaces the visible one; swipe sideways to dismiss.
abstract final class LkToast {
  static OverlayEntry? _current;

  static void show(
    BuildContext context, {
    required String title,
    String? description,
    LkToastVariant variant = LkToastVariant.normal,
    Duration duration = const Duration(milliseconds: 3500),
  }) {
    _remove(_current);
    final overlay = Overlay.of(context, rootOverlay: true);
    late final OverlayEntry entry;
    entry = OverlayEntry(
      builder: (_) => _ToastView(
        title: title,
        description: description,
        variant: variant,
        duration: duration,
        onDone: () => _remove(entry),
      ),
    );
    _current = entry;
    overlay.insert(entry);
  }

  static void _remove(OverlayEntry? entry) {
    if (entry == null) return;
    if (entry.mounted) entry.remove();
    if (identical(_current, entry)) _current = null;
  }
}

class _ToastView extends StatefulWidget {
  const _ToastView({
    required this.title,
    required this.description,
    required this.variant,
    required this.duration,
    required this.onDone,
  });

  final String title;
  final String? description;
  final LkToastVariant variant;
  final Duration duration;
  final VoidCallback onDone;

  @override
  State<_ToastView> createState() => _ToastViewState();
}

class _ToastViewState extends State<_ToastView> with SingleTickerProviderStateMixin {
  late final AnimationController _anim = AnimationController(vsync: this, duration: const Duration(milliseconds: 280))..forward();
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer(widget.duration, _close);
  }

  Future<void> _close() async {
    _timer?.cancel();
    if (!mounted) return;
    await _anim.reverse();
    widget.onDone();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final (icon, color) = switch (widget.variant) {
      LkToastVariant.success => (Icons.check_circle, c.success),
      LkToastVariant.error => (Icons.error, c.danger),
      LkToastVariant.normal => (Icons.info, c.accent),
    };
    final curve = CurvedAnimation(parent: _anim, curve: Curves.easeOutCubic);

    return Positioned(
      top: MediaQuery.paddingOf(context).top + 8,
      left: 12,
      right: 12,
      child: SlideTransition(
        position: Tween(begin: const Offset(0, -1.2), end: Offset.zero).animate(curve),
        child: FadeTransition(
          opacity: curve,
          child: Dismissible(
            key: UniqueKey(),
            direction: DismissDirection.horizontal,
            onDismissed: (_) {
              _timer?.cancel();
              widget.onDone();
            },
            child: Semantics(
              liveRegion: true,
              child: Material(
                color: c.card,
                elevation: 8,
                shadowColor: Colors.black38,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(LkRadius.lg),
                  side: BorderSide(color: c.border, width: 0.5),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(icon, color: color, size: 22),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(widget.title, style: TextStyle(color: c.fg, fontSize: 15, fontWeight: FontWeight.w600)),
                            if (widget.description != null)
                              Text(widget.description!, style: TextStyle(color: c.fgMuted, fontSize: 14)),
                          ],
                        ),
                      ),
                      InkResponse(
                        onTap: _close,
                        radius: 18,
                        child: Icon(Icons.close, size: 18, color: c.fgMuted, semanticLabel: 'Dismiss'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
