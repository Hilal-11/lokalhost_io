import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_nav_bar.dart';

class NavigationBarDemo extends StatefulWidget {
  const NavigationBarDemo({super.key});

  @override
  State<NavigationBarDemo> createState() => _NavigationBarDemoState();
}

class _NavigationBarDemoState extends State<NavigationBarDemo> {
  static const _items = [
    LkNavItem(label: 'Home', icon: Icons.home_outlined, activeIcon: Icons.home),
    LkNavItem(label: 'Search', icon: Icons.search),
    LkNavItem(label: 'Inbox', icon: Icons.mail_outline, activeIcon: Icons.mail, badge: 3),
    LkNavItem(label: 'Profile', icon: Icons.person_outline, activeIcon: Icons.person),
  ];
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text(_items[_index].label, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700))),
      // usage-start
      bottomNavigationBar: LkNavBar(
        items: _items,
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
      ),
      // usage-end
    );
  }
}
