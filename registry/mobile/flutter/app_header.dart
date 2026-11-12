import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

/// Large-title header with an optional inline search field.
class AppHeader extends StatelessWidget {
  const AppHeader({
    super.key,
    required this.title,
    this.eyebrow,
    this.onSearch,
    this.searchHint = 'Search',
    this.actions = const [],
  });

  final String title;
  final String? eyebrow;
  final ValueChanged<String>? onSearch;
  final String searchHint;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Container(
      color: c.bg,
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (eyebrow != null) Text(eyebrow!, style: TextStyle(color: c.fgMuted, fontSize: 14, fontWeight: FontWeight.w500)),
                    Semantics(
                      header: true,
                      child: Text(title, style: TextStyle(color: c.fg, fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
                    ),
                  ],
                ),
              ),
              ...actions,
            ],
          ),
          if (onSearch != null) ...[
            const SizedBox(height: 12),
            TextField(
              onChanged: onSearch,
              textInputAction: TextInputAction.search,
              style: TextStyle(color: c.fg, fontSize: 16),
              decoration: InputDecoration(
                hintText: searchHint,
                hintStyle: TextStyle(color: c.fgMuted),
                prefixIcon: Icon(Icons.search, color: c.fgMuted, size: 20),
                filled: true,
                fillColor: c.muted,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(LkRadius.md), borderSide: BorderSide.none),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
