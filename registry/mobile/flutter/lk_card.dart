import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

enum LkCardVariant { elevated, outline, filled }

class LkCard extends StatelessWidget {
  const LkCard({
    super.key,
    required this.title,
    this.subtitle,
    this.media,
    this.footer,
    this.variant = LkCardVariant.outline,
    this.onTap,
    this.child,
  });

  final String title;
  final String? subtitle;
  final Widget? media;
  final Widget? footer;
  final LkCardVariant variant;
  final VoidCallback? onTap;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final decoration = BoxDecoration(
      color: variant == LkCardVariant.filled ? c.muted : c.card,
      borderRadius: BorderRadius.circular(LkRadius.lg),
      border: variant == LkCardVariant.outline ? Border.all(color: c.border) : null,
      boxShadow: variant == LkCardVariant.elevated
          ? [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.4 : 0.12), blurRadius: 16, offset: const Offset(0, 8))]
          : null,
    );

    return Container(
      decoration: decoration,
      clipBehavior: Clip.antiAlias,
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          onTap: onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (media != null) media!,
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: c.fg, fontSize: 17, fontWeight: FontWeight.w600)),
                    if (subtitle != null) ...[
                      const SizedBox(height: 4),
                      Text(subtitle!, style: TextStyle(color: c.fgMuted, fontSize: 14)),
                    ],
                    if (child != null) ...[const SizedBox(height: 8), child!],
                    if (footer != null) ...[const SizedBox(height: 12), footer!],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
