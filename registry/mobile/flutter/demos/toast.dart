import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_button.dart';
import 'package:your_app/widgets/lk_toast.dart';

class ToastDemo extends StatelessWidget {
  const ToastDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 120, 24, 24),
      children: [
        // usage-start
        LkButton(
          label: 'Show success',
          onPressed: () => LkToast.show(
            context,
            title: 'Payment sent',
            description: '\$24.00 to Amelia Hart',
            variant: LkToastVariant.success,
          ),
        ),
        // usage-end
        const SizedBox(height: 12),
        LkButton(
          label: 'Show error',
          variant: LkButtonVariant.secondary,
          onPressed: () => LkToast.show(context, title: 'Upload failed', variant: LkToastVariant.error),
        ),
      ],
    );
  }
}
