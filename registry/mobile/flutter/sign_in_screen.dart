import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_button.dart';
import '../widgets/lk_input.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key, required this.onSubmit, this.onSocial, this.onForgotPassword, this.onSignUp});

  final Future<void> Function(String email, String password) onSubmit;
  final void Function(String provider)? onSocial;
  final VoidCallback? onForgotPassword;
  final VoidCallback? onSignUp;

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  static final _emailPattern = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _touched = false;
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  bool get _emailOk => _emailPattern.hasMatch(_email.text.trim());
  bool get _passwordOk => _password.text.length >= 8;

  Future<void> _submit() async {
    setState(() => _touched = true);
    if (!_emailOk || !_passwordOk) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await widget.onSubmit(_email.text.trim(), _password.text);
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 40, 24, 24),
          children: [
            Align(
              alignment: Alignment.centerLeft,
              child: Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(color: c.primary, borderRadius: BorderRadius.circular(16)),
                child: Icon(Icons.auto_awesome, color: c.onPrimary, size: 22),
              ),
            ),
            const SizedBox(height: 24),
            Text('Welcome back', style: TextStyle(color: c.fg, fontSize: 30, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
            const SizedBox(height: 4),
            Text('Sign in to continue.', style: TextStyle(color: c.fgMuted, fontSize: 16)),
            const SizedBox(height: 24),
            LkInput(
              label: 'Email',
              hint: 'you@example.com',
              icon: Icons.mail_outline,
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              onChanged: (_) => setState(() {}),
              errorText: _touched && !_emailOk ? 'Enter a valid email address.' : null,
            ),
            const SizedBox(height: 16),
            LkInput(
              label: 'Password',
              icon: Icons.lock_outline,
              secure: true,
              controller: _password,
              onChanged: (_) => setState(() {}),
              errorText: _touched && !_passwordOk ? 'At least 8 characters.' : null,
            ),
            if (widget.onForgotPassword != null)
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: widget.onForgotPassword,
                  child: Text('Forgot password?', style: TextStyle(color: c.fg, fontWeight: FontWeight.w500)),
                ),
              ),
            if (_error != null) Padding(padding: const EdgeInsets.only(bottom: 12), child: Text(_error!, style: TextStyle(color: c.danger))),
            LkButton(label: 'Sign in', size: LkButtonSize.lg, expand: true, loading: _loading, onPressed: _submit),
            if (widget.onSocial != null) ...[
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Row(
                  children: [
                    Expanded(child: Divider(color: c.border)),
                    Padding(padding: const EdgeInsets.symmetric(horizontal: 12), child: Text('or', style: TextStyle(color: c.fgMuted))),
                    Expanded(child: Divider(color: c.border)),
                  ],
                ),
              ),
              LkButton(label: 'Continue with Apple', icon: Icons.apple, variant: LkButtonVariant.outline, expand: true, onPressed: () => widget.onSocial!('apple')),
              const SizedBox(height: 10),
              LkButton(label: 'Continue with Google', icon: Icons.g_mobiledata, variant: LkButtonVariant.outline, expand: true, onPressed: () => widget.onSocial!('google')),
            ],
            if (widget.onSignUp != null)
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('New here? ', style: TextStyle(color: c.fgMuted, fontSize: 15)),
                    GestureDetector(
                      onTap: widget.onSignUp,
                      child: Text('Create an account', style: TextStyle(color: c.fg, fontSize: 15, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
