import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

/// A placeholder with a light band sweeping across it.
class LkSkeleton extends StatefulWidget {
  const LkSkeleton({super.key, this.width = double.infinity, this.height = 16, this.radius = 8});

  final double? width;
  final double height;
  final double radius;

  @override
  State<LkSkeleton> createState() => _LkSkeletonState();
}

class _LkSkeletonState extends State<LkSkeleton> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final dark = Theme.of(context).brightness == Brightness.dark;
    final highlight = dark ? Colors.white.withValues(alpha: 0.06) : Colors.white.withValues(alpha: 0.55);

    return ExcludeSemantics(
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          final t = Curves.easeInOut.transform(_c.value);
          return Container(
            width: widget.width,
            height: widget.height,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(widget.radius),
              gradient: LinearGradient(
                begin: Alignment(-1 - 2 + 4 * t, 0),
                end: Alignment(1 - 2 + 4 * t, 0),
                colors: [c.muted, Color.alphaBlend(highlight, c.muted), c.muted],
                stops: const [0.25, 0.5, 0.75],
              ),
            ),
          );
        },
      ),
    );
  }
}
