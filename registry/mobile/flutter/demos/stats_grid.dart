import 'package:flutter/material.dart';
import 'package:your_app/blocks/stats_grid.dart';

class OverviewScreen extends StatelessWidget {
  const OverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        // usage-start
        StatsGrid(stats: [
          Stat(label: 'Revenue', value: '\$12.4k', delta: 8.2, series: [4, 6, 5, 8, 7, 9, 11]),
          Stat(label: 'Orders', value: '318', delta: 3.1, series: [3, 4, 4, 5, 4, 6, 6]),
          Stat(label: 'Refunds', value: '12', delta: -2.4, series: [6, 5, 6, 4, 5, 3, 3]),
          Stat(label: 'Visitors', value: '9,842', delta: 14.6, series: [2, 3, 5, 4, 7, 8, 10]),
        ]),
        // usage-end
      ],
    );
  }
}
