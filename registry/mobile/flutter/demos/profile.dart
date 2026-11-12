import 'package:flutter/material.dart';
import 'package:your_app/screens/profile_screen.dart';

class ProfileRoute extends StatelessWidget {
  const ProfileRoute({super.key});

  @override
  Widget build(BuildContext context) {
    final photos = List.generate(12, (i) => 'https://picsum.photos/seed/lk$i/400');
    // usage-start
    return ProfileScreen(
      user: const ProfileUser(name: 'Hilal Ahmad', handle: 'hilal', bio: 'Building lokalhost.io — UI for the web and mobile.'),
      stats: const [('Posts', '248'), ('Followers', '12.4k'), ('Following', '180')],
      media: [photos, photos.take(4).toList(), []],
      onEdit: () => Navigator.of(context).pushNamed('/edit-profile'),
    );
    // usage-end
  }
}
