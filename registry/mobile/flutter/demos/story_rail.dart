import 'package:flutter/material.dart';
import 'package:your_app/blocks/story_rail.dart';

class StoriesDemo extends StatelessWidget {
  const StoriesDemo({super.key});

  @override
  Widget build(BuildContext context) {
    // usage-start
    return StoryRail(
      myName: 'Hilal Ahmad',
      onAdd: () => Navigator.of(context).pushNamed('/story/new'),
      onTap: (id) => Navigator.of(context).pushNamed('/story/$id'),
      stories: const [
        Story(id: 'a', name: 'Amelia Hart'),
        Story(id: 'j', name: 'Jonas Berg'),
        Story(id: 'm', name: 'Maya Lin', seen: true),
      ],
    );
    // usage-end
  }
}
