import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_dialog.dart';
import 'package:your_app/screens/settings_screen.dart';

class SettingsRoute extends StatelessWidget {
  const SettingsRoute({super.key});

  @override
  Widget build(BuildContext context) {
    // usage-start
    return SettingsScreen(
      name: 'Hilal Ahmad',
      email: 'hilal@lokalhost.io',
      onNavigate: (route) => Navigator.of(context).pushNamed('/settings/$route'),
      onSignOut: () async {
        final ok = await showLkDialog(context: context, title: 'Sign out?', confirmLabel: 'Sign out', destructive: true);
        if (ok && context.mounted) Navigator.of(context).pushReplacementNamed('/sign-in');
      },
    );
    // usage-end
  }
}
