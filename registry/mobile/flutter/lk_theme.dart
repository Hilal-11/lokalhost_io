import 'package:flutter/material.dart';

/// lokalhost mobile tokens, exposed as a ThemeExtension.
/// Read them anywhere with `context.lk`.
@immutable
class LkColors extends ThemeExtension<LkColors> {
  const LkColors({
    required this.bg,
    required this.bgSubtle,
    required this.card,
    required this.muted,
    required this.border,
    required this.fg,
    required this.fgMuted,
    required this.primary,
    required this.onPrimary,
    required this.accent,
    required this.success,
    required this.danger,
    required this.warning,
  });

  final Color bg, bgSubtle, card, muted, border, fg, fgMuted;
  final Color primary, onPrimary, accent, success, danger, warning;

  static const light = LkColors(
    bg: Color(0xFFFFFFFF),
    bgSubtle: Color(0xFFF5F5F5),
    card: Color(0xFFFFFFFF),
    muted: Color(0xFFF4F4F5),
    border: Color(0xFFE5E5E5),
    fg: Color(0xFF0A0A0A),
    fgMuted: Color(0xFF737373),
    primary: Color(0xFF0A0A0A),
    onPrimary: Color(0xFFFFFFFF),
    accent: Color(0xFF2563EB),
    success: Color(0xFF16A34A),
    danger: Color(0xFFDC2626),
    warning: Color(0xFFD97706),
  );

  static const dark = LkColors(
    bg: Color(0xFF000000),
    bgSubtle: Color(0xFF0A0A0A),
    card: Color(0xFF141414),
    muted: Color(0xFF1F1F1F),
    border: Color(0xFF262626),
    fg: Color(0xFFFAFAFA),
    fgMuted: Color(0xFFA3A3A3),
    primary: Color(0xFFFAFAFA),
    onPrimary: Color(0xFF0A0A0A),
    accent: Color(0xFF3B82F6),
    success: Color(0xFF22C55E),
    danger: Color(0xFFEF4444),
    warning: Color(0xFFF59E0B),
  );

  @override
  LkColors copyWith({
    Color? bg,
    Color? bgSubtle,
    Color? card,
    Color? muted,
    Color? border,
    Color? fg,
    Color? fgMuted,
    Color? primary,
    Color? onPrimary,
    Color? accent,
    Color? success,
    Color? danger,
    Color? warning,
  }) {
    return LkColors(
      bg: bg ?? this.bg,
      bgSubtle: bgSubtle ?? this.bgSubtle,
      card: card ?? this.card,
      muted: muted ?? this.muted,
      border: border ?? this.border,
      fg: fg ?? this.fg,
      fgMuted: fgMuted ?? this.fgMuted,
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      accent: accent ?? this.accent,
      success: success ?? this.success,
      danger: danger ?? this.danger,
      warning: warning ?? this.warning,
    );
  }

  @override
  LkColors lerp(ThemeExtension<LkColors>? other, double t) {
    if (other is! LkColors) return this;
    Color l(Color a, Color b) => Color.lerp(a, b, t)!;
    return LkColors(
      bg: l(bg, other.bg),
      bgSubtle: l(bgSubtle, other.bgSubtle),
      card: l(card, other.card),
      muted: l(muted, other.muted),
      border: l(border, other.border),
      fg: l(fg, other.fg),
      fgMuted: l(fgMuted, other.fgMuted),
      primary: l(primary, other.primary),
      onPrimary: l(onPrimary, other.onPrimary),
      accent: l(accent, other.accent),
      success: l(success, other.success),
      danger: l(danger, other.danger),
      warning: l(warning, other.warning),
    );
  }
}

abstract final class LkRadius {
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 24.0;
}

/// Material 3 theme wired to the tokens. Use in MaterialApp:
/// `theme: lkTheme(Brightness.light), darkTheme: lkTheme(Brightness.dark)`.
ThemeData lkTheme(Brightness brightness) {
  final c = brightness == Brightness.dark ? LkColors.dark : LkColors.light;
  final scheme = ColorScheme.fromSeed(seedColor: c.primary, brightness: brightness).copyWith(
    primary: c.primary,
    onPrimary: c.onPrimary,
    surface: c.bg,
    onSurface: c.fg,
    error: c.danger,
    outline: c.border,
  );
  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    scaffoldBackgroundColor: c.bg,
    dividerColor: c.border,
    extensions: [c],
  );
}

extension LkContext on BuildContext {
  LkColors get lk => Theme.of(this).extension<LkColors>() ?? LkColors.light;
}
