import 'package:flutter/material.dart';
import 'package:your_app/blocks/app_header.dart';
import 'package:your_app/widgets/lk_avatar.dart';

class TodayScreen extends StatelessWidget {
  const TodayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // usage-start
            AppHeader(
              eyebrow: 'Thursday, 13 November',
              title: 'Today',
              onSearch: (q) => debugPrint('search $q'),
              searchHint: 'Search tasks, notes, people',
              actions: [
                IconButton(onPressed: () {}, tooltip: 'Notifications', icon: const Icon(Icons.notifications_none)),
                const LkAvatar(name: 'Hilal Ahmad', size: 36),
              ],
            ),
            // usage-end
          ],
        ),
      ),
    );
  }
}
