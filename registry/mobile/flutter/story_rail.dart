import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_avatar.dart';

class Story {
  const Story({required this.id, required this.name, this.imageUrl, this.seen = false});

  final String id;
  final String name;
  final String? imageUrl;
  final bool seen;
}

class StoryRail extends StatelessWidget {
  const StoryRail({super.key, required this.stories, required this.onTap, this.onAdd, this.myName = 'You'});

  final List<Story> stories;
  final ValueChanged<String> onTap;

  /// Adds a "Your story" tile first.
  final VoidCallback? onAdd;
  final String myName;

  static const _size = 60.0;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;

    Widget tile(Story s, {bool own = false}) {
      final ring = own
          ? null
          : s.seen
              ? Border.all(color: c.border, width: 1.5)
              : null;
      return Semantics(
        button: true,
        label: own ? 'Add to your story' : '${s.name}\'s story${s.seen ? ', seen' : ''}',
        child: GestureDetector(
          onTap: own ? onAdd : () => onTap(s.id),
          child: SizedBox(
            width: 68,
            child: Column(
              children: [
                Stack(
                  children: [
                    Container(
                      width: _size + 6,
                      height: _size + 6,
                      padding: const EdgeInsets.all(2.5),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: ring,
                        gradient: own || s.seen
                            ? null
                            : const LinearGradient(
                                colors: [Color(0xFFFBBF24), Color(0xFFF43F5E), Color(0xFFC026D3)],
                                begin: Alignment.bottomLeft,
                                end: Alignment.topRight,
                              ),
                      ),
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(color: c.bg, shape: BoxShape.circle),
                        child: LkAvatar(name: s.name, imageUrl: s.imageUrl, size: _size - 8),
                      ),
                    ),
                    if (own)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(color: c.accent, shape: BoxShape.circle, border: Border.all(color: c.bg, width: 2)),
                          child: const Icon(Icons.add, size: 14, color: Colors.white),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(own ? 'Your story' : s.name.split(' ').first,
                    maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: c.fg, fontSize: 12)),
              ],
            ),
          ),
        ),
      );
    }

    final items = [
      if (onAdd != null) tile(Story(id: '__me', name: myName), own: true),
      for (final s in stories) tile(s),
    ];

    return SizedBox(
      height: 104,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        itemCount: items.length,
        separatorBuilder: (_, __) => const SizedBox(width: 14),
        itemBuilder: (_, i) => items[i],
      ),
    );
  }
}
