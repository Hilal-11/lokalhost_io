import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_tabs.dart';

class TabsDemo extends StatefulWidget {
  const TabsDemo({super.key});

  @override
  State<TabsDemo> createState() => _TabsDemoState();
}

class _TabsDemoState extends State<TabsDemo> {
  static const _steps = ['6,240', '41,382', '172,904'];
  int _range = 0;
  int _type = 1;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // usage-start
          LkTabs(tabs: const ['Day', 'Week', 'Month'], index: _range, onChanged: (i) => setState(() => _range = i)),
          const SizedBox(height: 16),
          Text('${_steps[_range]} steps', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
          // usage-end
          const SizedBox(height: 32),
          LkTabs(
            variant: LkTabsVariant.underline,
            tabs: const ['Runs', 'Walks', 'Rides'],
            index: _type,
            onChanged: (i) => setState(() => _type = i),
          ),
        ],
      ),
    );
  }
}
