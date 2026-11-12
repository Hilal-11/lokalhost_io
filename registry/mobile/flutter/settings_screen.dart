import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_avatar.dart';
import '../widgets/lk_list.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({
    super.key,
    required this.name,
    required this.email,
    required this.onNavigate,
    required this.onSignOut,
    this.version = '1.0.0',
  });

  final String name;
  final String email;
  final void Function(String route) onNavigate;
  final VoidCallback onSignOut;
  final String version;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _dark = true;
  bool _haptics = true;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    return Scaffold(
      backgroundColor: c.bgSubtle,
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.only(bottom: 32),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: Text('Settings', style: TextStyle(color: c.fg, fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Material(
                color: c.card,
                borderRadius: BorderRadius.circular(LkRadius.lg),
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: () => widget.onNavigate('account'),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      children: [
                        LkAvatar(name: widget.name, size: 56),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(widget.name, style: TextStyle(color: c.fg, fontSize: 18, fontWeight: FontWeight.w600)),
                              Text(widget.email, style: TextStyle(color: c.fgMuted)),
                            ],
                          ),
                        ),
                        Icon(Icons.chevron_right, color: c.fgMuted),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            LkListGroup(children: [
              LkListTile(title: 'Notifications', icon: Icons.notifications, iconColor: Colors.red, onTap: () => widget.onNavigate('notifications')),
              LkListTile(title: 'Privacy & security', icon: Icons.shield, iconColor: Colors.blue, onTap: () => widget.onNavigate('privacy')),
              LkListTile(title: 'Language', icon: Icons.language, iconColor: Colors.teal, value: 'English', onTap: () => widget.onNavigate('language')),
            ]),
            const SizedBox(height: 24),
            LkListGroup(header: 'Appearance', children: [
              LkListTile(
                title: 'Dark mode',
                icon: Icons.dark_mode,
                iconColor: Colors.indigo,
                trailing: Switch.adaptive(value: _dark, onChanged: (v) => setState(() => _dark = v)),
              ),
              LkListTile(
                title: 'Haptics',
                icon: Icons.vibration,
                iconColor: Colors.amber,
                trailing: Switch.adaptive(value: _haptics, onChanged: (v) => setState(() => _haptics = v)),
              ),
            ]),
            const SizedBox(height: 24),
            LkListGroup(children: [
              LkListTile(title: 'Help & support', icon: Icons.help, iconColor: Colors.blueGrey, onTap: () => widget.onNavigate('help')),
              LkListTile(title: 'Sign out', icon: Icons.logout, iconColor: Colors.red, destructive: true, onTap: widget.onSignOut),
            ]),
            const SizedBox(height: 16),
            Center(child: Text('Version ${widget.version}', style: TextStyle(color: c.fgMuted, fontSize: 12.5))),
          ],
        ),
      ),
    );
  }
}
