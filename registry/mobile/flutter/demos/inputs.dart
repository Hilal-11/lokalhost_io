import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_input.dart';

class InputsDemo extends StatefulWidget {
  const InputsDemo({super.key});

  @override
  State<InputsDemo> createState() => _InputsDemoState();
}

class _InputsDemoState extends State<InputsDemo> {
  String _email = '';

  @override
  Widget build(BuildContext context) {
    final invalid = _email.isNotEmpty && !_email.contains('@');
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        // usage-start
        LkInput(
          label: 'Email',
          hint: 'you@example.com',
          icon: Icons.mail_outline,
          keyboardType: TextInputType.emailAddress,
          onChanged: (v) => setState(() => _email = v),
          errorText: invalid ? 'Enter a valid email address.' : null,
          helperText: 'We’ll never share your email.',
        ),
        const SizedBox(height: 20),
        const LkInput(label: 'Password', icon: Icons.lock_outline, secure: true),
        // usage-end
        const SizedBox(height: 20),
        const LkInput(hint: 'Search', icon: Icons.search),
      ],
    );
  }
}
