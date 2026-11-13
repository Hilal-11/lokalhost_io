import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

enum LkPresence { online, away, offline }

class LkAvatar extends StatelessWidget {
  const LkAvatar({super.key, required this.name, this.imageUrl, this.size = 40, this.status});

  final String name;
  final String? imageUrl;
  final double size;
  final LkPresence? status;

  static const _hues = [12, 32, 145, 190, 220, 265, 300, 340];

  String get _initials =>
      name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).take(2).map((p) => p[0].toUpperCase()).join();

  Color get _color {
    var h = 0;
    for (final unit in name.codeUnits) {
      h = (h * 31 + unit) & 0x7fffffff;
    }
    return HSLColor.fromAHSL(1, _hues[h % _hues.length].toDouble(), 0.55, 0.5).toColor();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final dot = switch (status) {
      LkPresence.online => c.success,
      LkPresence.away => c.warning,
      _ => c.fgMuted,
    };

    return Semantics(
      label: status == null ? name : '$name, ${status!.name}',
      image: true,
      child: SizedBox.square(
        dimension: size,
        child: Stack(
          children: [
            CircleAvatar(
              radius: size / 2,
              backgroundColor: _color,
              foregroundImage: imageUrl == null ? null : NetworkImage(imageUrl!),
              onForegroundImageError: imageUrl == null ? null : (_, __) {},
              child: Text(
                _initials,
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: size * 0.38),
              ),
            ),
            if (status != null)
              Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  width: size * 0.28,
                  height: size * 0.28,
                  decoration: BoxDecoration(color: dot, shape: BoxShape.circle, border: Border.all(color: c.bg, width: 2)),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class LkAvatarGroup extends StatelessWidget {
  const LkAvatarGroup({super.key, required this.names, this.max = 4, this.size = 40});

  final List<String> names;
  final int max;
  final double size;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final shown = names.take(max).toList();
    final rest = names.length - shown.length;
    final step = size * 0.72;
    final count = shown.length + (rest > 0 ? 1 : 0);

    Widget ring(Widget child) => Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(color: c.bg, shape: BoxShape.circle),
          child: child,
        );

    return SizedBox(
      height: size + 4,
      width: step * (count - 1) + size + 4,
      child: Stack(
        children: [
          for (var i = 0; i < shown.length; i++) Positioned(left: step * i, child: ring(LkAvatar(name: shown[i], size: size))),
          if (rest > 0)
            Positioned(
              left: step * shown.length,
              child: ring(
                CircleAvatar(
                  radius: size / 2,
                  backgroundColor: c.muted,
                  child: Text('+$rest', style: TextStyle(color: c.fg, fontWeight: FontWeight.w600, fontSize: size * 0.32)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
