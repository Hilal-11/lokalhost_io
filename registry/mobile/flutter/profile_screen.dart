import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_avatar.dart';
import '../widgets/lk_button.dart';
import '../widgets/lk_tabs.dart';

class ProfileUser {
  const ProfileUser({required this.name, required this.handle, this.bio, this.avatarUrl});

  final String name;
  final String handle;
  final String? bio;
  final String? avatarUrl;
}

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key, required this.user, required this.stats, this.media = const [[], [], []], this.onEdit});

  final ProfileUser user;
  final List<(String label, String value)> stats;

  /// One image list per tab: Posts, Saved, Tagged.
  final List<List<String>> media;
  final VoidCallback? onEdit;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final u = widget.user;
    final images = widget.media.length > _tab ? widget.media[_tab] : const <String>[];

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 20),
                child: Column(
                  children: [
                    LkAvatar(name: u.name, imageUrl: u.avatarUrl, size: 88),
                    const SizedBox(height: 10),
                    Text(u.name, style: TextStyle(color: c.fg, fontSize: 22, fontWeight: FontWeight.w700)),
                    Text('@${u.handle}', style: TextStyle(color: c.fgMuted)),
                    if (u.bio != null) ...[
                      const SizedBox(height: 8),
                      Text(u.bio!, textAlign: TextAlign.center, style: TextStyle(color: c.fg, fontSize: 15, height: 1.4)),
                    ],
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(color: c.muted, borderRadius: BorderRadius.circular(LkRadius.lg)),
                      child: Row(
                        children: [
                          for (final (label, value) in widget.stats)
                            Expanded(
                              child: Semantics(
                                label: '$value $label',
                                excludeSemantics: true,
                                child: Column(
                                  children: [
                                    Text(value, style: TextStyle(color: c.fg, fontSize: 18, fontWeight: FontWeight.w700)),
                                    Text(label, style: TextStyle(color: c.fgMuted, fontSize: 12.5)),
                                  ],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    LkButton(label: 'Edit profile', icon: Icons.edit, expand: true, onPressed: widget.onEdit),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: LkTabs(
                variant: LkTabsVariant.underline,
                tabs: const ['Posts', 'Saved', 'Tagged'],
                index: _tab,
                onChanged: (i) => setState(() => _tab = i),
              ),
            ),
            if (images.isEmpty)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Center(child: Text('Nothing here yet.', style: TextStyle(color: c.fgMuted))),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.only(top: 2),
                sliver: SliverGrid.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, mainAxisSpacing: 2, crossAxisSpacing: 2),
                  itemCount: images.length,
                  itemBuilder: (_, i) => Image.network(images[i], fit: BoxFit.cover),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
