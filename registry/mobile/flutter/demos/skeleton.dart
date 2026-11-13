import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_skeleton.dart';

class SkeletonDemo extends StatelessWidget {
  const SkeletonDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // usage-start
          const Row(
            children: [
              LkSkeleton(width: 44, height: 44, radius: 22),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LkSkeleton(width: 140, height: 14),
                    SizedBox(height: 8),
                    LkSkeleton(width: 90, height: 12),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const LkSkeleton(height: 176, radius: 16),
          // usage-end
        ],
      ),
    );
  }
}
