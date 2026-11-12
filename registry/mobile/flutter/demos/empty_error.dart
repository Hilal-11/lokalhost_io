import 'package:flutter/material.dart';
import 'package:your_app/widgets/state_view.dart';

class InboxRoute extends StatefulWidget {
  const InboxRoute({super.key, required this.load});

  final Future<List<String>> Function() load;

  @override
  State<InboxRoute> createState() => _InboxRouteState();
}

class _InboxRouteState extends State<InboxRoute> {
  late Future<List<String>> _future = widget.load();

  void _retry() => setState(() => _future = widget.load());

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _future,
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done) return const Center(child: CircularProgressIndicator());
        // usage-start
        if (snap.hasError) {
          return StateView(variant: StateVariant.error, actionLabel: 'Try again', onAction: _retry);
        }
        if (snap.data!.isEmpty) {
          return StateView(
            title: 'No messages yet',
            description: 'When people message you, conversations will show up here.',
            actionLabel: 'Start a conversation',
            onAction: () {},
          );
        }
        // usage-end
        return ListView(children: [for (final s in snap.data!) ListTile(title: Text(s))]);
      },
    );
  }
}
