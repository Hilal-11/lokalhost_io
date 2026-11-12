import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';

class LkInput extends StatefulWidget {
  const LkInput({
    super.key,
    this.label,
    this.hint,
    this.helperText,
    this.errorText,
    this.icon,
    this.secure = false,
    this.controller,
    this.onChanged,
    this.keyboardType,
  });

  final String? label;
  final String? hint;
  final String? helperText;
  final String? errorText;
  final IconData? icon;
  final bool secure;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;

  @override
  State<LkInput> createState() => _LkInputState();
}

class _LkInputState extends State<LkInput> {
  late bool _hidden = widget.secure;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    OutlineInputBorder border(Color color, [double width = 1]) => OutlineInputBorder(
          borderRadius: BorderRadius.circular(LkRadius.md),
          borderSide: BorderSide(color: color, width: width),
        );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(widget.label!, style: TextStyle(color: c.fg, fontSize: 14, fontWeight: FontWeight.w500)),
          const SizedBox(height: 6),
        ],
        TextField(
          controller: widget.controller,
          onChanged: widget.onChanged,
          obscureText: _hidden,
          keyboardType: widget.keyboardType,
          style: TextStyle(color: c.fg, fontSize: 16),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: TextStyle(color: c.fgMuted),
            helperText: widget.errorText == null ? widget.helperText : null,
            helperStyle: TextStyle(color: c.fgMuted, fontSize: 13),
            errorText: widget.errorText,
            errorStyle: TextStyle(color: c.danger, fontSize: 13),
            filled: true,
            fillColor: c.card,
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            prefixIcon: widget.icon == null ? null : Icon(widget.icon, size: 18, color: c.fgMuted),
            suffixIcon: widget.secure
                ? IconButton(
                    tooltip: _hidden ? 'Show password' : 'Hide password',
                    icon: Icon(
                      _hidden ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                      size: 18,
                      color: c.fgMuted,
                    ),
                    onPressed: () => setState(() => _hidden = !_hidden),
                  )
                : null,
            enabledBorder: border(c.border),
            focusedBorder: border(c.fg, 1.5),
            errorBorder: border(c.danger),
            focusedErrorBorder: border(c.danger, 1.5),
          ),
        ),
      ],
    );
  }
}
