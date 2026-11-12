import 'dart:math' as math;

import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

class Stat {
  const Stat({required this.label, required this.value, this.delta, this.series = const []});

  final String label;
  final String value;

  /// Percentage change, e.g. 8.2 or -2.4
  final double? delta;

  /// Recent values for the sparkline (oldest first).
  final List<double> series;
}

class StatsGrid extends StatelessWidget {
  const StatsGrid({super.key, required this.stats});

  final List<Stat> stats;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.15,
      children: [
        for (final s in stats)
          Builder(builder: (context) {
            final up = (s.delta ?? 0) >= 0;
            final tone = up ? c.success : c.danger;
            return Semantics(
              label: '${s.label} ${s.value}${s.delta == null ? '' : ', ${up ? 'up' : 'down'} ${s.delta!.abs()} percent'}',
              excludeSemantics: true,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: c.card, borderRadius: BorderRadius.circular(LkRadius.lg)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(s.label, style: TextStyle(color: c.fgMuted, fontSize: 13)),
                    const SizedBox(height: 2),
                    Text(s.value, style: TextStyle(color: c.fg, fontSize: 24, fontWeight: FontWeight.w700)),
                    if (s.delta != null)
                      Text('${up ? '▲' : '▼'} ${s.delta!.abs()}%', style: TextStyle(color: tone, fontSize: 13, fontWeight: FontWeight.w500)),
                    const Spacer(),
                    if (s.series.length > 1) SizedBox(height: 28, width: double.infinity, child: CustomPaint(painter: _SparkPainter(s.series, tone))),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }
}

class _SparkPainter extends CustomPainter {
  _SparkPainter(this.values, this.color);

  final List<double> values;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final maxV = values.reduce(math.max);
    final minV = values.reduce(math.min);
    final range = (maxV - minV) == 0 ? 1 : maxV - minV;
    final path = Path();
    for (var i = 0; i < values.length; i++) {
      final x = size.width * i / (values.length - 1);
      final y = size.height - (values[i] - minV) / range * size.height;
      i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(_SparkPainter old) => old.values != values || old.color != color;
}
