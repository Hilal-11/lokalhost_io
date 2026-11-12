import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:your_app/screens/onboarding_screen.dart';

class OnboardingRoute extends StatelessWidget {
  const OnboardingRoute({super.key});

  @override
  Widget build(BuildContext context) {
    // usage-start
    return OnboardingScreen(
      onDone: () async {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool('onboarded', true);
        if (context.mounted) Navigator.of(context).pushReplacementNamed('/home');
      },
    );
    // usage-end
  }
}
