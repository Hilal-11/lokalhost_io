import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

/// Shows a draggable sheet with snap points.
///
/// [snapSizes] are fractions of the screen height, smallest first. The
/// smallest is the resting height; dragging below it dismisses the sheet.
Future<T?> showLkBottomSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  List<double> snapSizes = const [0.5, 0.9],
  double? initialSize,
  String? title,
  bool isDismissible = true,
}) {
  assert(snapSizes.isNotEmpty, 'Provide at least one snap size');
  final sizes = [...snapSizes]..sort();
  final min = sizes.first;
  final max = sizes.last;

  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    isDismissible: isDismissible,
    enableDrag: isDismissible,
    useSafeArea: true,
    backgroundColor: Colors.transparent,
    barrierColor: Colors.black.withValues(alpha: 0.4),
    builder: (context) {
      final c = context.lk;
      return DraggableScrollableSheet(
        expand: false,
        snap: true,
        minChildSize: min,
        maxChildSize: max,
        initialChildSize: (initialSize ?? min).clamp(min, max),
        // min and max are implicit snap points; pass only the ones in between.
        snapSizes: sizes.length > 2 ? sizes.sublist(1, sizes.length - 1) : null,
        shouldCloseOnMinExtent: isDismissible,
        builder: (context, controller) => DecoratedBox(
          decoration: BoxDecoration(
            color: c.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(LkRadius.xl)),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 24, offset: const Offset(0, -8))],
          ),
          child: SingleChildScrollView(
            controller: controller,
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Semantics(
                    label: 'Drag to resize',
                    child: Container(
                      width: 40,
                      height: 5,
                      decoration: BoxDecoration(color: c.border, borderRadius: BorderRadius.circular(3)),
                    ),
                  ),
                ),
                if (title != null) ...[
                  const SizedBox(height: 14),
                  Text(title, style: TextStyle(color: c.fg, fontSize: 18, fontWeight: FontWeight.w600)),
                ],
                const SizedBox(height: 12),
                builder(context),
              ],
            ),
          ),
        ),
      );
    },
  );
}
