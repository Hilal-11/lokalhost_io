import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

enum LkTabsVariant { segmented, underline }

class LkTabs extends StatelessWidget {
  const LkTabs({
    super.key,
    required this.tabs,
    required this.index,
    required this.onChanged,
    this.variant = LkTabsVariant.segmented,
  });

  final List<String> tabs;
  final int index;
  final ValueChanged<int> onChanged;
  final LkTabsVariant variant;

  static const _duration = Duration(milliseconds: 220);

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final segmented = variant == LkTabsVariant.segmented;
    // -1 … 1 alignment for the indicator
    final x = tabs.length == 1 ? 0.0 : -1 + 2 * index / (tabs.length - 1);

    final labels = Row(
      children: [
        for (var i = 0; i < tabs.length; i++)
          Expanded(
            child: Semantics(
              selected: i == index,
              button: true,
              child: InkWell(
                onTap: () => onChanged(i),
                borderRadius: BorderRadius.circular(8),
                child: Center(
                  child: AnimatedDefaultTextStyle(
                    duration: _duration,
                    style: TextStyle(
                      color: i == index ? c.fg : c.fgMuted,
                      fontSize: segmented ? 13.5 : 15,
                      fontWeight: segmented ? FontWeight.w600 : FontWeight.w500,
                    ),
                    child: Text(tabs[i]),
                  ),
                ),
              ),
            ),
          ),
      ],
    );

    if (segmented) {
      return Container(
        height: 36,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(10)),
        child: Stack(
          children: [
            AnimatedAlign(
              duration: _duration,
              curve: Curves.easeOut,
              alignment: Alignment(x, 0),
              child: FractionallySizedBox(
                widthFactor: 1 / tabs.length,
                heightFactor: 1,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: c.card,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 3, offset: const Offset(0, 1))],
                  ),
                ),
              ),
            ),
            labels,
          ],
        ),
      );
    }

    return Container(
      height: 44,
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: c.border, width: 0.5))),
      child: Stack(
        children: [
          labels,
          AnimatedAlign(
            duration: _duration,
            curve: Curves.easeOut,
            alignment: Alignment(x, 1),
            child: FractionallySizedBox(
              widthFactor: 1 / tabs.length,
              child: Container(height: 2, decoration: BoxDecoration(color: c.fg, borderRadius: BorderRadius.circular(1))),
            ),
          ),
        ],
      ),
    );
  }
}
