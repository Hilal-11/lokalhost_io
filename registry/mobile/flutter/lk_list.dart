import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

/// Inset grouped section, iOS-settings style.
class LkListGroup extends StatelessWidget {
  const LkListGroup({super.key, this.header, this.footer, required this.children});

  final String? header;
  final String? footer;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (header != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 6),
              child: Text(header!.toUpperCase(), style: TextStyle(color: c.fgMuted, fontSize: 13, letterSpacing: 0.4)),
            ),
          ClipRRect(
            borderRadius: BorderRadius.circular(LkRadius.lg),
            child: ColoredBox(
              color: c.card,
              child: Column(
                children: [
                  for (var i = 0; i < children.length; i++) ...[
                    if (i > 0) Divider(height: 0.5, thickness: 0.5, indent: 16, color: c.border),
                    children[i],
                  ],
                ],
              ),
            ),
          ),
          if (footer != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 0),
              child: Text(footer!, style: TextStyle(color: c.fgMuted, fontSize: 13)),
            ),
        ],
      ),
    );
  }
}

class LkListTile extends StatelessWidget {
  const LkListTile({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.iconColor,
    this.value,
    this.trailing,
    this.leading,
    this.destructive = false,
    this.onTap,
  });

  final String title;
  final String? subtitle;
  final IconData? icon;
  final Color? iconColor;
  final String? value;
  final Widget? trailing;
  final Widget? leading;
  final bool destructive;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return InkWell(
      onTap: onTap,
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              if (leading != null) ...[leading!, const SizedBox(width: 12)],
              if (icon != null) ...[
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(color: iconColor ?? c.fgMuted, borderRadius: BorderRadius.circular(8)),
                  child: Icon(icon, size: 17, color: Colors.white),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: destructive ? c.danger : c.fg, fontSize: 16)),
                    if (subtitle != null)
                      Text(subtitle!, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.fgMuted, fontSize: 13)),
                  ],
                ),
              ),
              if (value != null) Text(value!, style: TextStyle(color: c.fgMuted, fontSize: 15)),
              if (trailing != null) trailing!,
              if (onTap != null && trailing == null) ...[
                const SizedBox(width: 6),
                Icon(Icons.chevron_right, size: 20, color: c.fgMuted),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
