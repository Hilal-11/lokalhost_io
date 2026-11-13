import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_button.dart';
import 'package:your_app/widgets/lk_dialog.dart';

class ModalDemo extends StatelessWidget {
  const ModalDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: LkButton(
        label: 'Delete account',
        variant: LkButtonVariant.destructive,
        onPressed: () async {
          // usage-start
          final confirmed = await showLkDialog(
            context: context,
            title: 'Delete account?',
            description: 'This permanently removes your profile, posts and messages. This can’t be undone.',
            confirmLabel: 'Delete',
            destructive: true,
          );
          if (confirmed) debugPrint('deleted');
          // usage-end
        },
      ),
    );
  }
}
