import 'package:flutter/material.dart';
import '../theme/lk_theme.dart';
import '../widgets/lk_avatar.dart';

class Post {
  const Post({
    required this.id,
    required this.author,
    required this.time,
    required this.body,
    this.imageUrl,
    this.likes = 0,
    this.comments = 0,
  });

  final String id;
  final String author;
  final String time;
  final String body;
  final String? imageUrl;
  final int likes;
  final int comments;
}

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key, required this.posts, this.onRefresh, this.onPostTap, this.header});

  final List<Post> posts;
  final Future<void> Function()? onRefresh;
  final void Function(Post)? onPostTap;

  /// Optional widget under the title, e.g. a StoryRail.
  final Widget? header;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final list = CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Good morning', style: TextStyle(color: c.fgMuted, fontSize: 13, fontWeight: FontWeight.w500)),
                      Text('Feed', style: TextStyle(color: c.fg, fontSize: 32, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
                    ],
                  ),
                ),
                IconButton(onPressed: () {}, icon: const Icon(Icons.search), tooltip: 'Search'),
                IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_none), tooltip: 'Notifications'),
              ],
            ),
          ),
        ),
        if (header != null) SliverToBoxAdapter(child: header),
        SliverList.builder(
          itemCount: posts.length,
          itemBuilder: (context, i) => _PostCard(post: posts[i], onTap: onPostTap),
        ),
      ],
    );

    return Scaffold(
      backgroundColor: c.bg,
      body: SafeArea(
        bottom: false,
        child: onRefresh == null ? list : RefreshIndicator(onRefresh: onRefresh!, child: list),
      ),
    );
  }
}

class _PostCard extends StatefulWidget {
  const _PostCard({required this.post, this.onTap});

  final Post post;
  final void Function(Post)? onTap;

  @override
  State<_PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<_PostCard> {
  bool _liked = false;

  @override
  Widget build(BuildContext context) {
    final c = context.lk;
    final p = widget.post;
    return InkWell(
      onTap: widget.onTap == null ? null : () => widget.onTap!(p),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(border: Border(top: BorderSide(color: c.border, width: 0.5))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  LkAvatar(name: p.author, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p.author, style: TextStyle(color: c.fg, fontSize: 15, fontWeight: FontWeight.w600)),
                        Text(p.time, style: TextStyle(color: c.fgMuted, fontSize: 12.5)),
                      ],
                    ),
                  ),
                  Icon(Icons.more_horiz, color: c.fgMuted),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 10),
              child: Text(p.body, style: TextStyle(color: c.fg, fontSize: 15, height: 1.4)),
            ),
            if (p.imageUrl != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(LkRadius.lg),
                  child: Image.network(p.imageUrl!, height: 208, width: double.infinity, fit: BoxFit.cover),
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 4, 12, 0),
              child: Row(
                children: [
                  TextButton.icon(
                    onPressed: () => setState(() => _liked = !_liked),
                    icon: Icon(_liked ? Icons.favorite : Icons.favorite_border, color: _liked ? c.danger : c.fgMuted, size: 21),
                    label: Text('${p.likes + (_liked ? 1 : 0)}', style: TextStyle(color: c.fgMuted)),
                  ),
                  TextButton.icon(
                    onPressed: () {},
                    icon: Icon(Icons.chat_bubble_outline, color: c.fgMuted, size: 20),
                    label: Text('${p.comments}', style: TextStyle(color: c.fgMuted)),
                  ),
                  const Spacer(),
                  Icon(Icons.bookmark_border, color: c.fgMuted, size: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
