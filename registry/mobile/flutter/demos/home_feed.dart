import 'package:flutter/material.dart';
import 'package:your_app/blocks/story_rail.dart';
import 'package:your_app/screens/feed_screen.dart';

class HomeFeedRoute extends StatefulWidget {
  const HomeFeedRoute({super.key});

  @override
  State<HomeFeedRoute> createState() => _HomeFeedRouteState();
}

class _HomeFeedRouteState extends State<HomeFeedRoute> {
  List<Post> _posts = const [
    Post(id: '1', author: 'Amelia Hart', time: '12 min ago', body: 'Shipped the new onboarding flow today.', likes: 128, comments: 24),
    Post(id: '2', author: 'Jonas Berg', time: '1 h ago', body: 'Weekend build: an offline-first notes app.', likes: 64, comments: 9),
  ];

  @override
  Widget build(BuildContext context) {
    // usage-start
    return FeedScreen(
      posts: _posts,
      header: StoryRail(
        stories: const [Story(id: 'a', name: 'Amelia Hart'), Story(id: 'j', name: 'Jonas Berg', seen: true)],
        onTap: (id) => debugPrint('open story $id'),
      ),
      onRefresh: () async {
        await Future.delayed(const Duration(seconds: 1));
        setState(() => _posts = [..._posts]);
      },
      onPostTap: (post) => debugPrint('open ${post.id}'),
    );
    // usage-end
  }
}
