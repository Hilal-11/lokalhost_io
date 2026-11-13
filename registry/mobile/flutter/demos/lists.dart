import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_list.dart';

class ListsDemo extends StatefulWidget {
  const ListsDemo({super.key});

  @override
  State<ListsDemo> createState() => _ListsDemoState();
}

class _ListsDemoState extends State<ListsDemo> {
  bool _dark = true;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 24),
      children: [
        // usage-start
        LkListGroup(
          header: 'General',
          children: [
            LkListTile(title: 'Notifications', icon: Icons.notifications, iconColor: Colors.red, value: 'On', onTap: () {}),
            LkListTile(title: 'Language', icon: Icons.language, iconColor: Colors.blue, value: 'English', onTap: () {}),
            LkListTile(
              title: 'Dark mode',
              icon: Icons.dark_mode,
              iconColor: Colors.indigo,
              trailing: Switch.adaptive(value: _dark, onChanged: (v) => setState(() => _dark = v)),
            ),
          ],
        ),
        // usage-end
        const SizedBox(height: 24),
        LkListGroup(children: [LkListTile(title: 'Sign out', destructive: true, onTap: () {})]),
      ],
    );
  }
}
