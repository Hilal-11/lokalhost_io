import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:your_app/screens/sign_in_screen.dart';

class SignInRoute extends StatelessWidget {
  const SignInRoute({super.key});

  @override
  Widget build(BuildContext context) {
    // usage-start
    return SignInScreen(
      onSubmit: (email, password) async {
        final res = await http.post(
          Uri.parse('https://api.example.com/auth/sign-in'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'email': email, 'password': password}),
        );
        if (res.statusCode != 200) throw Exception('Wrong email or password.');
        if (context.mounted) Navigator.of(context).pushReplacementNamed('/home');
      },
      onSocial: (provider) => debugPrint('sign in with $provider'),
      onForgotPassword: () => Navigator.of(context).pushNamed('/forgot-password'),
      onSignUp: () => Navigator.of(context).pushNamed('/sign-up'),
    );
    // usage-end
  }
}
