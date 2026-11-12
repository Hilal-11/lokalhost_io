import 'package:flutter/material.dart';
import 'package:your_app/widgets/lk_avatar.dart';

class AvatarDemo extends StatelessWidget {
  const AvatarDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // usage-start
          const LkAvatar(
            name: 'Amelia Hart',
            imageUrl: 'https://i.pravatar.cc/200?img=47',
            size: 56,
            status: LkPresence.online,
          ),
          const SizedBox(height: 24),
          const LkAvatarGroup(
            names: ['Amelia Hart', 'Jonas Berg', 'Maya Lin', 'Leo Park', 'Sara Ali', 'Omar Diaz'],
            size: 44,
          ),
          // usage-end
        ],
      ),
    );
  }
}
