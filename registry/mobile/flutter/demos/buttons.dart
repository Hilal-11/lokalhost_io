import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_button.dart';

class ButtonsDemo extends StatefulWidget {
  const ButtonsDemo({super.key});

  @override
  State<ButtonsDemo> createState() => _ButtonsDemoState();
}

class _ButtonsDemoState extends State<ButtonsDemo> {
  bool _loading = false;

  Future<void> _addToBag() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1400));
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        // usage-start
        LkButton(label: 'Add to bag', onPressed: _addToBag, loading: _loading, expand: true),
        const SizedBox(height: 12),
        LkButton(label: 'Outline', variant: LkButtonVariant.outline, onPressed: () {}),
        const SizedBox(height: 12),
        LkButton(
          label: 'Delete account',
          icon: Icons.delete_outline,
          variant: LkButtonVariant.destructive,
          onPressed: () {},
        ),
        // usage-end
        const SizedBox(height: 12),
        LkButton(label: 'Secondary', variant: LkButtonVariant.secondary, onPressed: () {}),
        const SizedBox(height: 12),
        const LkButton(label: 'Disabled', size: LkButtonSize.lg),
      ],
    );
  }
}
