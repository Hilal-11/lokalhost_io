import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

class LkNavItem {
  const LkNavItem({required this.label, required this.icon, IconData? activeIcon, this.badge}) : activeIcon = activeIcon ?? icon;

  final String label;
  final IconData icon;
  final IconData activeIcon;
  final int? badge;
}

/// Material 3 NavigationBar themed with lokalhost tokens.
class LkNavBar extends StatelessWidget {
  const LkNavBar({super.key, required this.items, required this.currentIndex, required this.onTap});

  final List<LkNavItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;

    Widget icon(LkNavItem item, bool selected) {
      final glyph = Icon(selected ? item.activeIcon : item.icon, color: selected ? c.fg : c.fgMuted);
      final count = item.badge ?? 0;
      if (count == 0) return glyph;
      return Badge(
        label: Text(count > 99 ? '99+' : '$count'),
        backgroundColor: c.danger,
        child: glyph,
      );
    }

    return DecoratedBox(
      decoration: BoxDecoration(border: Border(top: BorderSide(color: c.border, width: 0.5))),
      child: NavigationBarTheme(
        data: NavigationBarThemeData(
          backgroundColor: c.bg,
          indicatorColor: c.muted,
          surfaceTintColor: Colors.transparent,
          height: 68,
          labelTextStyle: WidgetStateProperty.resolveWith(
            (states) => TextStyle(
              fontSize: 12,
              color: states.contains(WidgetState.selected) ? c.fg : c.fgMuted,
              fontWeight: states.contains(WidgetState.selected) ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ),
        child: NavigationBar(
          selectedIndex: currentIndex,
          onDestinationSelected: onTap,
          destinations: [
            for (final item in items)
              NavigationDestination(
                icon: icon(item, false),
                selectedIcon: icon(item, true),
                label: item.label,
              ),
          ],
        ),
      ),
    );
  }
}
